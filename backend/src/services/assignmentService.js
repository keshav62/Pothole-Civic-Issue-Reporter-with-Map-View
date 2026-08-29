import User from '../models/User.js';
import Issue from '../models/Issue.js';
import { transitionIssueStatus } from './issueService.js';
import { STATUS } from '../utils/constants.js';

/**
 * assignWorkerToIssue
 *
 * Validates all business rules for worker assignment, then uses the FSM
 * in transitionIssueStatus to apply the VERIFIED→ASSIGNED or REOPENED→ASSIGNED
 * transition and record the history entry.
 *
 * All verification happens server-side. The frontend only supplies workerId;
 * everything else — dept match, role check, active status — comes from MongoDB.
 *
 * @param {string} issueId    - MongoDB ObjectId of the issue to assign
 * @param {string} workerId   - MongoDB ObjectId of the worker to assign
 * @param {Object} adminUser  - The authenticated req.user (SUPER_ADMIN or DEPARTMENT_ADMIN)
 * @param {string} [note]     - Optional admin note to attach to the history record
 *
 * @returns {Object} The updated, populated Issue document
 * @throws  {Error}  With .statusCode set (400 | 403 | 404 | 422)
 */
export const assignWorkerToIssue = async (issueId, workerId, adminUser, note = '') => {

  // ── 1. Load and validate the issue ─────────────────────────────────────────
  const issue = await Issue.findById(issueId);
  if (!issue) {
    const err = new Error('Issue not found');
    err.statusCode = 404;
    throw err;
  }

  // Only VERIFIED or REOPENED issues can be assigned
  const assignableStatuses = [STATUS.VERIFIED, STATUS.REOPENED];
  if (!assignableStatuses.includes(issue.status)) {
    const err = new Error(
      `Cannot assign a worker to an issue with status '${issue.status}'. ` +
      `Issue must be VERIFIED or REOPENED first.`
    );
    err.statusCode = 422;
    throw err;
  }

  // ── 2. Load and validate the worker ────────────────────────────────────────
  if (!workerId) {
    const err = new Error('workerId is required');
    err.statusCode = 400;
    throw err;
  }

  const worker = await User.findById(workerId);
  if (!worker) {
    const err = new Error('Worker not found');
    err.statusCode = 404;
    throw err;
  }

  // Confirm the user being assigned is actually a FIELD_WORKER
  if (worker.role !== 'FIELD_WORKER') {
    const err = new Error(
      `User '${worker.name}' has role '${worker.role}'. Only FIELD_WORKER users can be assigned to issues.`
    );
    err.statusCode = 400;
    throw err;
  }

  // Confirm the worker's account is active
  if (!worker.isActive) {
    const err = new Error(
      `Worker '${worker.name}' is deactivated and cannot be assigned tasks.`
    );
    err.statusCode = 400;
    throw err;
  }

  // ── 3. Department match — never trusted from the frontend ──────────────────
  // DEPARTMENT_ADMIN can only assign workers from their own department.
  // SUPER_ADMIN may assign any worker to any issue.
  if (adminUser.role === 'DEPARTMENT_ADMIN') {
    const adminDeptId  = adminUser.department?.toString();
    const workerDeptId = worker.department?.toString();
    const issueDeptId  = issue.department?.toString();

    if (!adminDeptId) {
      const err = new Error('Your account is not linked to a department. Contact Super Admin.');
      err.statusCode = 403;
      throw err;
    }

    // The worker must belong to the same department as the admin
    if (workerDeptId !== adminDeptId) {
      const err = new Error(
        `Worker '${worker.name}' does not belong to your department and cannot be assigned by you.`
      );
      err.statusCode = 403;
      throw err;
    }

    // If the issue is already linked to a department, it must match the admin's dept
    if (issueDeptId && issueDeptId !== adminDeptId) {
      const err = new Error(
        `This issue is assigned to a different department. You do not have permission to reassign it.`
      );
      err.statusCode = 403;
      throw err;
    }
  }

  // ── 4. Delegate the status transition to the FSM ───────────────────────────
  // transitionIssueStatus enforces the TRANSITION_MAP, writes to the DB,
  // and records the WORKER_ASSIGNED history entry atomically.
  const updated = await transitionIssueStatus(
    issueId,
    STATUS.ASSIGNED,
    adminUser,
    {
      assignedWorker: worker._id,
      department:     worker.department ?? issue.department,
      note,
    }
  );

  return updated;
};
