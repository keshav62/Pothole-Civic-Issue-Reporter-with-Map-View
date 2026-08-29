import Issue from '../models/Issue.js';
import { canTransition, getAvailableTransitions } from '../utils/issueStatus.js';
import { STATUS } from '../utils/constants.js';

/**
 * transitionIssueStatus
 *
 * The single authoritative function for changing an issue's status.
 * All routes and controllers must go through this function — never write
 * directly to issue.status anywhere else.
 *
 * @param {string}   issueId       - MongoDB ObjectId of the issue
 * @param {string}   targetStatus  - The desired new status
 * @param {Object}   user          - The authenticated req.user from MongoDB
 * @param {Object}   [extra]       - Optional extra fields to apply alongside the status change
 *                                   e.g. { assignedWorker, department, dueDate }
 *
 * @returns {Object} { success, issue } on success
 * @throws  {Object} { statusCode, message }  on failure (caller catches and responds)
 */
export const transitionIssueStatus = async (issueId, targetStatus, user, extra = {}) => {

  // 1. Load the issue
  const issue = await Issue.findById(issueId);
  if (!issue) {
    const err = new Error('Issue not found');
    err.statusCode = 404;
    throw err;
  }

  // 2. Ownership check for field workers — they can only act on their own tasks
  if (user.role === 'FIELD_WORKER') {
    if (!issue.assignedWorker || issue.assignedWorker.toString() !== user._id.toString()) {
      const err = new Error('Forbidden: This task is not assigned to you');
      err.statusCode = 403;
      throw err;
    }
  }

  // 3. Ownership check for citizens — they can only act on issues they reported
  if (user.role === 'CITIZEN') {
    if (issue.reportedBy.toString() !== user._id.toString()) {
      const err = new Error('Forbidden: You can only update issues you reported');
      err.statusCode = 403;
      throw err;
    }
  }

  // 4. Check the transition is permitted via the finite-state machine
  const { allowed, reason } = canTransition(issue.status, targetStatus, user.role);
  if (!allowed) {
    const err = new Error(reason);
    err.statusCode = 422;
    throw err;
  }

  // 5. Business-rule guards for specific transitions
  if (targetStatus === STATUS.ASSIGNED) {
    if (!extra.assignedWorker && !issue.assignedWorker) {
      const err = new Error('assignedWorker is required when transitioning to ASSIGNED');
      err.statusCode = 400;
      throw err;
    }
  }

  // 6. Build the update payload — only apply known safe fields from extra
  const ALLOWED_EXTRA = ['assignedWorker', 'department', 'dueDate'];
  const safeExtra = ALLOWED_EXTRA.reduce((acc, key) => {
    if (extra[key] !== undefined) acc[key] = extra[key];
    return acc;
  }, {});

  const update = {
    status: targetStatus,
    ...safeExtra,
  };

  // 7. Automatically stamp resolvedAt on terminal transitions
  if (
    targetStatus === STATUS.RESOLVED ||
    targetStatus === STATUS.CITIZEN_VERIFIED
  ) {
    update.resolvedAt = new Date();
  }

  // 8. Apply and return the updated issue with populated references
  const updated = await Issue.findByIdAndUpdate(
    issueId,
    { $set: update },
    { new: true, runValidators: true }
  )
    .populate('reportedBy',    'name email photoURL')
    .populate('assignedWorker','name email phone photoURL')
    .populate('department',    'name code');

  return updated;
};

/**
 * getIssueWithTransitions
 *
 * Fetches a single issue and attaches the list of transitions available
 * to the requesting user. Used by the detail view to decide which action
 * buttons to render.
 *
 * @param {string} issueId  - MongoDB ObjectId
 * @param {Object} user     - The authenticated req.user
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
