import Issue from '../models/Issue.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import IssueHistory, { HISTORY_ACTIONS } from '../models/IssueHistory.js';
import { canTransition, getAvailableTransitions } from '../utils/issueStatus.js';
import { STATUS } from '../utils/constants.js';
import { dispatchNotification } from './notificationService.js';

// ─── Internal helper ──────────────────────────────────────────────────────────

/**
 * ACTION_FOR_STATUS
 *
 * Maps a target status → the correct HISTORY_ACTIONS label.
 * Keeps the semantically meaningful label (e.g. "WORKER_ASSIGNED") rather
 * than the raw status string ("ASSIGNED") in the timeline.
 */
const ACTION_FOR_STATUS = {
  [STATUS.VERIFIED]:                    HISTORY_ACTIONS.ISSUE_VERIFIED,
  [STATUS.REJECTED]:                    HISTORY_ACTIONS.ISSUE_REJECTED,
  [STATUS.ASSIGNED]:                    HISTORY_ACTIONS.WORKER_ASSIGNED,
  [STATUS.ACCEPTED]:                    HISTORY_ACTIONS.TASK_ACCEPTED,
  [STATUS.IN_PROGRESS]:                 HISTORY_ACTIONS.TASK_STARTED,
  [STATUS.PENDING_CITIZEN_VERIFICATION]:HISTORY_ACTIONS.TASK_COMPLETED,
  [STATUS.CITIZEN_VERIFIED]:            HISTORY_ACTIONS.CITIZEN_VERIFIED,
  [STATUS.REOPENED]:                    HISTORY_ACTIONS.ISSUE_REOPENED,
  [STATUS.RESOLVED]:                    HISTORY_ACTIONS.ISSUE_RESOLVED,
};

/**
 * recordHistory
 *
 * Creates a single immutable IssueHistory document.
 * Called internally after every successful status change — never by controllers.
 */
const recordHistory = async ({ issueId, action, oldStatus, newStatus, performedBy, note = '' }) => {
  await IssueHistory.create({
    issue:       issueId,
    action,
    oldStatus,
    newStatus,
    performedBy: performedBy._id ?? performedBy,
    note,
  });
};

// ─── Exported service functions ───────────────────────────────────────────────

/**
 * recordIssueCreated
 *
 * Called by the issue controller immediately after Issue.create().
 * Records the initial ISSUE_REPORTED history entry.
 *
 * @param {Object} issue - The newly created Mongoose Issue document
 * @param {Object} user  - req.user (the citizen)
 */
export const recordIssueCreated = async (issue, user) => {
  await recordHistory({
    issueId:     issue._id,
    action:      HISTORY_ACTIONS.ISSUE_REPORTED,
    oldStatus:   null,
    newStatus:   STATUS.REPORTED,
    performedBy: user,
    note:        '',
  });
};

/**
 * transitionIssueStatus
 *
 * The single authoritative function for changing an issue's status.
 * All routes and controllers must call this — never write to issue.status directly.
 *
 * @param {string} issueId      - MongoDB ObjectId of the issue
 * @param {string} targetStatus - The desired new status
 * @param {Object} user         - The authenticated req.user from MongoDB
 * @param {Object} [extra]      - Optional safe fields: { assignedWorker, department, dueDate, note }
 *
 * @returns {Object} The updated, populated Issue document
 * @throws  {Error}  With .statusCode set (404 | 403 | 422 | 400)
 */
export const transitionIssueStatus = async (issueId, targetStatus, user, extra = {}) => {

  // 1. Load the issue
  const issue = await Issue.findById(issueId);
  if (!issue) {
    const err = new Error('Issue not found');
    err.statusCode = 404;
    throw err;
  }

  // 2. Ownership check — field workers auto-claim unassigned tasks upon accept/start
  if (user.role === 'FIELD_WORKER') {
    if (!issue.assignedWorker) {
      issue.assignedWorker = user._id;
    }
  }

  // 3. Ownership check — citizens can only act on issues they reported
  if (user.role === 'CITIZEN') {
    if (issue.reportedBy.toString() !== user._id.toString()) {
      const err = new Error('Forbidden: You can only update issues you reported');
      err.statusCode = 403;
      throw err;
    }
  }

  // 4. FSM gate — reject any transition not in TRANSITION_MAP
  const { allowed, reason } = canTransition(issue.status, targetStatus, user.role);
  if (!allowed) {
    const err = new Error(reason);
    err.statusCode = 422;
    throw err;
  }

  // 5. Business-rule guards for specific target statuses
  if (targetStatus === STATUS.ASSIGNED) {
    if (!extra.assignedWorker && !issue.assignedWorker) {
      const err = new Error('assignedWorker is required when transitioning to ASSIGNED');
      err.statusCode = 400;
      throw err;
    }
  }

  // 6. Build the update payload — whitelist extra fields the caller may provide
  const ALLOWED_EXTRA = ['assignedWorker', 'department', 'dueDate'];
  const safeExtra = ALLOWED_EXTRA.reduce((acc, key) => {
    if (extra[key] !== undefined) acc[key] = extra[key];
    return acc;
  }, {});

  const update = { status: targetStatus, ...safeExtra };

  // 7. Auto-stamp resolvedAt on resolution transitions
  if (targetStatus === STATUS.RESOLVED || targetStatus === STATUS.CITIZEN_VERIFIED) {
    update.resolvedAt = new Date();
  }

  // 8. Persist the status change
  const updated = await Issue.findByIdAndUpdate(
    issueId,
    { $set: update },
    { new: true, runValidators: true }
  )
    .populate('reportedBy',    'name email photoURL')
    .populate('assignedWorker','name email phone photoURL')
    .populate('department',    'name code');

  // 9. Record the history entry — after the DB write succeeds
  //    Use the semantic action label; fall back to STATUS_CHANGED for any unlisted status.
  await recordHistory({
    issueId:     issue._id,
    action:      ACTION_FOR_STATUS[targetStatus] ?? HISTORY_ACTIONS.STATUS_CHANGED,
    oldStatus:   issue.status,
    newStatus:   targetStatus,
    performedBy: user,
    note:        extra.note ?? '',
  });

  // 10. Dispatch in-app notification — fire-and-forget, never throws.
  //     `updated` is the populated document; its reportedBy / assignedWorker
  //     fields are already resolved objects, so notificationService needs
  //     no extra DB queries.
  await dispatchNotification(targetStatus, updated, user);

  return updated;
};

/**
 * getIssueWithTransitions
 *
 * Returns a single issue plus the list of workflow transitions available to
 * the requesting user. Used by the detail page to decide which action buttons
 * to show — without a separate API call.
 *
 * @param {string} issueId - MongoDB ObjectId
 * @param {Object} user    - req.user
 */
export const getIssueWithTransitions = async (issueId, user) => {
  const issue = await Issue.findById(issueId)
    .populate('reportedBy',    'name email photoURL')
    .populate('assignedWorker','name email phone photoURL')
    .populate('department',    'name code contactEmail');

  if (!issue) {
    const err = new Error('Issue not found');
    err.statusCode = 404;
    throw err;
  }

  const availableTransitions = getAvailableTransitions(issue.status, user.role);

  return {
    issue,
    availableTransitions: availableTransitions.map((t) => ({
      to:          t.to,
      description: t.description,
    })),
  };
};

/**
 * getIssueTimeline
 *
 * Returns all history records for a given issue, sorted oldest → newest.
 * Powers the timeline component on the issue detail page.
 *
 * @param {string} issueId - MongoDB ObjectId
 */
export const getIssueTimeline = async (issueId) => {
  const exists = await Issue.exists({ _id: issueId });
  if (!exists) {
    const err = new Error('Issue not found');
    err.statusCode = 404;
    throw err;
  }

  const timeline = await IssueHistory.find({ issue: issueId })
    .populate('performedBy', 'name email role photoURL')
    .sort({ createdAt: 1 });   // oldest first — natural chronological order

  return timeline;
};
