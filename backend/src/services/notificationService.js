/**
 * notificationService.js
 *
 * Creates Notification documents for each key workflow event.
 *
 * Design rules
 * ────────────
 * 1. Every exported function is fire-and-forget: errors are caught and logged,
 *    never re-thrown.  A broken notification must NEVER block a status
 *    transition, API response, or any other business logic.
 *
 * 2. The `issue` argument passed in by issueService is the fully-populated
 *    document returned by Issue.findByIdAndUpdate().populate(…).  This means
 *    reportedBy, assignedWorker, and department are already resolved objects —
 *    no extra DB queries are needed here.
 *
 * 3. All functions return the created Notification document (or null on error)
 *    so unit tests can assert on the result without a separate DB query.
 *
 * Caller: issueService.transitionIssueStatus → dispatchNotification (exported
 * below) which maps each targetStatus to the right notification function(s).
 */

import Notification, { NOTIFICATION_TYPES } from '../models/Notification.js';

// ─── Internal helper ──────────────────────────────────────────────────────────

/**
 * create
 *
 * Thin wrapper that calls Notification.create() and swallows errors so the
 * caller never needs a try/catch.
 *
 * @param {Object} data - Fields for the Notification document
 * @returns {Promise<Object|null>}
 */
const create = async (data) => {
  try {
    return await Notification.create(data);
  } catch (err) {
    // Log but do not propagate — notification failures must be invisible to end users
    console.error('[notificationService] Failed to create notification:', err.message, data);
    return null;
  }
};

// ─── Event handlers ───────────────────────────────────────────────────────────

/**
 * notifyIssueVerified
 *
 * Triggered when: REPORTED → VERIFIED
 * Recipient:      The citizen who reported the issue
 *
 * @param {Object} issue     - Populated Issue document (reportedBy is an object)
 * @param {Object} adminUser - req.user of the admin who verified
 */
export const notifyIssueVerified = async (issue, adminUser) => {
  const recipientId = issue.reportedBy?._id ?? issue.reportedBy;
  if (!recipientId) return null;

  return create({
    recipient: recipientId,
    type:      NOTIFICATION_TYPES.ISSUE_VERIFIED,
    title:     'Your issue has been verified ✅',
    message:   `Your report "${issue.title}" (${issue.issueId}) has been verified by ` +
               `${adminUser.name ?? 'an admin'} and will be assigned to a field worker shortly.`,
    issue:     issue._id,
  });
};

/**
 * notifyWorkerAssigned
 *
 * Triggered when: VERIFIED / REOPENED → ASSIGNED
 * Recipient:      The field worker who was assigned
 *
 * @param {Object} issue      - Populated Issue document (assignedWorker is an object)
 * @param {Object} adminUser  - req.user of the admin who performed the assignment
 */
export const notifyWorkerAssigned = async (issue, adminUser) => {
  const recipientId = issue.assignedWorker?._id ?? issue.assignedWorker;
  if (!recipientId) return null;

  return create({
    recipient: recipientId,
    type:      NOTIFICATION_TYPES.WORKER_ASSIGNED,
    title:     'New task assigned to you 🔧',
    message:   `You have been assigned to resolve "${issue.title}" (${issue.issueId}). ` +
               `Category: ${issue.category}. Address: ${issue.address || 'see map'}. ` +
               `Assigned by ${adminUser.name ?? 'an admin'}.`,
    issue:     issue._id,
  });
};

/**
 * notifyTaskAccepted
 *
 * Triggered when: ASSIGNED → ACCEPTED
 * Recipient:      The citizen who reported the issue
 *                 (admin/dept admin is informed via the issue timeline, not a notification)
 *
 * @param {Object} issue      - Populated Issue document
 * @param {Object} workerUser - req.user of the field worker who accepted
 */
export const notifyTaskAccepted = async (issue, workerUser) => {
  const recipientId = issue.reportedBy?._id ?? issue.reportedBy;
  if (!recipientId) return null;

  return create({
    recipient: recipientId,
    type:      NOTIFICATION_TYPES.TASK_ACCEPTED,
    title:     'A worker has accepted your issue 👷',
    message:   `${workerUser.name ?? 'A field worker'} has accepted the task for ` +
               `"${issue.title}" (${issue.issueId}) and will begin work soon.`,
    issue:     issue._id,
  });
};

/**
 * notifyTaskStarted
 *
 * Triggered when: ACCEPTED → IN_PROGRESS
 * Recipient:      The citizen who reported the issue
 *
 * @param {Object} issue      - Populated Issue document
 * @param {Object} workerUser - req.user of the field worker who started
 */
export const notifyTaskStarted = async (issue, workerUser) => {
  const recipientId = issue.reportedBy?._id ?? issue.reportedBy;
  if (!recipientId) return null;

  return create({
    recipient: recipientId,
    type:      NOTIFICATION_TYPES.TASK_STARTED,
    title:     'Work has started on your issue 🚧',
    message:   `${workerUser.name ?? 'A field worker'} has started on-site work for ` +
               `"${issue.title}" (${issue.issueId}). You will be notified when the ` +
               `repair is complete.`,
    issue:     issue._id,
  });
};

/**
 * notifyCitizenVerificationRequired
 *
 * Triggered when: IN_PROGRESS → PENDING_CITIZEN_VERIFICATION
 * Recipient:      The citizen who reported the issue
 *
 * @param {Object} issue      - Populated Issue document
 * @param {Object} workerUser - req.user of the field worker who completed the task
 */
export const notifyCitizenVerificationRequired = async (issue, workerUser) => {
  const recipientId = issue.reportedBy?._id ?? issue.reportedBy;
  if (!recipientId) return null;

  return create({
    recipient: recipientId,
    type:      NOTIFICATION_TYPES.CITIZEN_VERIFICATION_REQUIRED,
    title:     'Please verify the repair at your location 🔍',
    message:   `${workerUser.name ?? 'The field worker'} has marked "${issue.title}" ` +
               `(${issue.issueId}) as completed. Please visit the location and confirm ` +
               `whether the issue has been resolved satisfactorily.`,
    issue:     issue._id,
  });
};

/**
 * notifyIssueReopened
 *
 * Triggered when: PENDING_CITIZEN_VERIFICATION → REOPENED
 * Recipients:     (1) The assigned field worker  — must redo the work
 *                 (2) The citizen reporter        — acknowledgement that it was reopened
 *
 * We create both notifications in parallel. Either may be null if the
 * referenced user is missing — the other still fires.
 *
 * @param {Object} issue       - Populated Issue document
 * @param {Object} citizenUser - req.user of the citizen who rejected the resolution
 */
export const notifyIssueReopened = async (issue, citizenUser) => {
  const workerRecipientId  = issue.assignedWorker?._id ?? issue.assignedWorker;
  const citizenRecipientId = issue.reportedBy?._id     ?? issue.reportedBy;

  const promises = [];

  // Notify the worker that rework is needed
  if (workerRecipientId) {
    promises.push(
      create({
        recipient: workerRecipientId,
        type:      NOTIFICATION_TYPES.ISSUE_REOPENED,
        title:     'Issue reopened — rework required ↩️',
        message:   `"${issue.title}" (${issue.issueId}) was not accepted by the reporting citizen. ` +
                   `The issue has been reopened and you may be reassigned. ` +
                   `Rejection reason is in the issue timeline.`,
        issue:     issue._id,
      })
    );
  }

  // Notify the citizen that their rejection was registered
  if (citizenRecipientId) {
    promises.push(
      create({
        recipient: citizenRecipientId,
        type:      NOTIFICATION_TYPES.ISSUE_REOPENED,
        title:     'Issue reopened — rework has been requested 🔄',
        message:   `Your rejection of the resolution for "${issue.title}" (${issue.issueId}) ` +
                   `has been recorded. The issue has been reopened and an admin will ` +
                   `reassign it to address your concerns.`,
        issue:     issue._id,
      })
    );
  }

  return Promise.all(promises);
};

/**
 * notifyIssueResolved
 *
 * Triggered when: CITIZEN_VERIFIED → RESOLVED
 * Recipient:      The citizen who reported the issue
 *
 * @param {Object} issue - Populated Issue document
 */
export const notifyIssueResolved = async (issue) => {
  const recipientId = issue.reportedBy?._id ?? issue.reportedBy;
  if (!recipientId) return null;

  return create({
    recipient: recipientId,
    type:      NOTIFICATION_TYPES.ISSUE_RESOLVED,
    title:     'Issue officially resolved 🎉',
    message:   `"${issue.title}" (${issue.issueId}) has been officially closed. ` +
               `Thank you for helping improve your community by reporting this issue.`,
    issue:     issue._id,
  });
};

// ─── Dispatch map ─────────────────────────────────────────────────────────────

/**
 * dispatchNotification
 *
 * Maps a target status to the correct notification function(s).
 * Called from issueService.transitionIssueStatus after every successful
 * status transition and history record write.
 *
 * @param {string} targetStatus - The status just applied
 * @param {Object} issue        - The fully-populated updated Issue document
 * @param {Object} actor        - The user who performed the transition (req.user)
 */
export const dispatchNotification = async (targetStatus, issue, actor) => {
  try {
    switch (targetStatus) {
      case 'VERIFIED':
        await notifyIssueVerified(issue, actor);
        break;

      case 'ASSIGNED':
        await notifyWorkerAssigned(issue, actor);
        break;

      case 'ACCEPTED':
        await notifyTaskAccepted(issue, actor);
        break;

      case 'IN_PROGRESS':
        await notifyTaskStarted(issue, actor);
        break;

      case 'PENDING_CITIZEN_VERIFICATION':
        await notifyCitizenVerificationRequired(issue, actor);
        break;

      case 'REOPENED':
        await notifyIssueReopened(issue, actor);
        break;

      case 'RESOLVED':
        await notifyIssueResolved(issue);
        break;

      // REJECTED, CITIZEN_VERIFIED — no notification defined for these transitions
      default:
        break;
    }
  } catch (err) {
    // Belt-and-suspenders: individual create() calls already swallow errors,
    // but guard the whole switch in case of unexpected runtime issues.
    console.error('[notificationService] dispatchNotification error:', err.message);
  }
};
