import mongoose from 'mongoose';

/**
 * Action labels — a fixed vocabulary of events that can appear on a timeline.
 * Exported so issueService and any future services use the same strings
 * without risk of typos.
 */
export const HISTORY_ACTIONS = Object.freeze({
  ISSUE_REPORTED:       'ISSUE_REPORTED',
  ISSUE_VERIFIED:       'ISSUE_VERIFIED',
  ISSUE_REJECTED:       'ISSUE_REJECTED',
  WORKER_ASSIGNED:      'WORKER_ASSIGNED',
  TASK_ACCEPTED:        'TASK_ACCEPTED',
  TASK_STARTED:         'TASK_STARTED',
  PROOF_UPLOADED:       'PROOF_UPLOADED',
  TASK_COMPLETED:       'TASK_COMPLETED',
  CITIZEN_VERIFIED:     'CITIZEN_VERIFIED',
  ISSUE_REOPENED:       'ISSUE_REOPENED',
  ISSUE_RESOLVED:       'ISSUE_RESOLVED',
  STATUS_CHANGED:       'STATUS_CHANGED',   // generic fallback
});

const issueHistorySchema = new mongoose.Schema(
  {
    // Which issue this record belongs to
    issue: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Issue',
      required: true,
      index:    true,
    },

    // Semantic label of the event (from HISTORY_ACTIONS)
    action: {
      type:     String,
      enum:     Object.values(HISTORY_ACTIONS),
      required: true,
    },

    // Status before the change (null for the first REPORTED entry)
    oldStatus: {
      type:    String,
      default: null,
    },

    // Status after the change
    newStatus: {
      type:    String,
      default: null,
    },

    // Who triggered this event
    performedBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    // Optional free-text note (e.g. rejection reason, repair note, citizen comment)
    note: {
      type:    String,
      trim:    true,
      default: '',
      maxlength: 1000,
    },
  },
  {
    // createdAt is all we need — history records are immutable, never updated
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Optimise the most common query: "give me all history for issue X, oldest first"
issueHistorySchema.index({ issue: 1, createdAt: 1 });

const IssueHistory = mongoose.model('IssueHistory', issueHistorySchema);

export default IssueHistory;

