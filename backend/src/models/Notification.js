import mongoose from 'mongoose';

// ─── Notification type constants ──────────────────────────────────────────────
// Exported so notificationService and any frontend enum can share the same values.

export const NOTIFICATION_TYPES = Object.freeze({
  // Admin verified the issue is legitimate
  ISSUE_VERIFIED:                 'ISSUE_VERIFIED',
  // A field worker has been assigned to the issue
  WORKER_ASSIGNED:                'WORKER_ASSIGNED',
  // The assigned field worker accepted the task
  TASK_ACCEPTED:                  'TASK_ACCEPTED',
  // The field worker started on-site work
  TASK_STARTED:                   'TASK_STARTED',
  // Worker marked done; citizen must now confirm the fix
  CITIZEN_VERIFICATION_REQUIRED:  'CITIZEN_VERIFICATION_REQUIRED',
  // Citizen rejected the resolution; issue needs rework
  ISSUE_REOPENED:                 'ISSUE_REOPENED',
  // Issue has been officially resolved and closed
  ISSUE_RESOLVED:                 'ISSUE_RESOLVED',
});

// ─── Schema ───────────────────────────────────────────────────────────────────

const notificationSchema = new mongoose.Schema(
  {
    // The user who should see this notification
    recipient: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },

    // Semantic event label — drives icon / colour on the frontend
    type: {
      type:     String,
      enum:     Object.values(NOTIFICATION_TYPES),
      required: true,
    },

    // Short headline displayed in the notification bell / list
    title: {
      type:      String,
      required:  true,
      trim:      true,
      maxlength: 200,
    },

    // One-sentence human-readable description of the event
    message: {
      type:      String,
      required:  true,
      trim:      true,
      maxlength: 1000,
    },

    // The issue that triggered this notification (may be null for system notices)
    issue: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'Issue',
      default: null,
    },

    // Whether the recipient has seen / dismissed this notification
    isRead: {
      type:    Boolean,
      default: false,
      index:   true,
    },
  },
  {
    // Only createdAt — notifications are immutable once created
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Primary query: "give me all unread notifications for user X, newest first"
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

// Secondary query: "give me all notifications for user X regardless of read state"
notificationSchema.index({ recipient: 1, createdAt: -1 });

// ─── Model ────────────────────────────────────────────────────────────────────

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
