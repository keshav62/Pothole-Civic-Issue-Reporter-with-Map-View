import { Router } from 'express';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = Router();

// All notification routes require an authenticated user.
// Recipient scoping is enforced inside each controller — req.user._id is used
// as the filter, never a user-supplied ID from the request body or params.
router.use(protect);

// GET /api/notifications
// Returns paginated notifications for the current user.
// Supports ?isRead=true|false, ?page, ?limit
router.get('/', getNotifications);

// PATCH /api/notifications/read-all
// Bulk-mark all unread notifications as read for the current user.
//
// IMPORTANT: This route MUST be declared before /:id/read.
// If /:id/read were first, Express would match "read-all" as the :id segment.
router.patch('/read-all', markAllNotificationsRead);

// PATCH /api/notifications/:id/read
// Mark a single notification as read.
// Returns 403 if the notification belongs to a different user.
router.patch('/:id/read', validateObjectId, markNotificationRead);

export default router;
