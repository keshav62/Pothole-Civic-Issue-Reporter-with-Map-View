import Notification from '../models/Notification.js';

// ─── GET /api/notifications ───────────────────────────────────────────────────

/**
 * getNotifications
 *
 * Returns paginated notifications for the authenticated user, newest first.
 *
 * Scoping:  recipient === req.user._id  (enforced here, not in the router)
 * Ordering: createdAt DESC — latest events appear first
 *
 * Query params:
 *   isRead  {boolean string}  "true" | "false" — filter by read state (omit for all)
 *   page    {integer}         default 1
 *   limit   {integer}         default 20, max 100
 */
export const getNotifications = async (req, res, next) => {
  try {
    const { isRead, page = 1, limit = 20 } = req.query;

    const filter = { recipient: req.user._id };

    // Optional read-state filter
    if (isRead === 'true')  filter.isRead = true;
    if (isRead === 'false') filter.isRead = false;

    const pageNum  = Math.max(1, parseInt(page,  10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip     = (pageNum - 1) * limitNum;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        // Populate the linked issue with just enough for the frontend to render
        // a title, issueId, and category — nothing sensitive
        .populate('issue', 'issueId title category priority status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),

      Notification.countDocuments(filter),

      // Always return the total unread count so the notification bell badge
      // stays accurate regardless of the current isRead filter
      Notification.countDocuments({ recipient: req.user._id, isRead: false }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Notifications fetched successfully',
      data: {
        notifications,
        unreadCount,
        pagination: {
          total,
          page:       pageNum,
          limit:      limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/notifications/:id/read ───────────────────────────────────────

/**
 * markNotificationRead
 *
 * Sets isRead = true on a single notification.
 *
 * Ownership check:  notification.recipient must equal req.user._id
 *   - 404 if the notification does not exist
 *   - 403 if it belongs to a different user
 *   - 200 with the updated document on success
 *
 * Idempotent: marking an already-read notification returns 200 without error.
 */
export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    // Only the recipient may mark their own notification as read
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only mark your own notifications as read',
      });
    }

    // Idempotent update — no-op if already read, avoids a dirty write
    if (!notification.isRead) {
      notification.isRead = true;
      await notification.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/notifications/read-all ───────────────────────────────────────

/**
 * markAllNotificationsRead
 *
 * Bulk-sets isRead = true for all unread notifications belonging to req.user.
 *
 * Returns { modifiedCount } so the frontend can update its badge immediately.
 * Safe to call when there are no unread notifications (modifiedCount = 0).
 */
export const markAllNotificationsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      message: result.modifiedCount > 0
        ? `${result.modifiedCount} notification(s) marked as read`
        : 'No unread notifications to update',
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    next(error);
  }
};
