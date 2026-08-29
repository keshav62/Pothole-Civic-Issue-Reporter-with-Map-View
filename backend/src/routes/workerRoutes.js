import { Router } from 'express';
import {
  getWorkerProfile,
  getWorkerTasks,
  getWorkerTaskById,
  acceptTask,
  startTask,
  completeTask,
} from '../controllers/workerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

// All worker routes require:
//   1. A valid Firebase ID token (protect)
//   2. The user's role to be FIELD_WORKER (authorizeRoles)
//
// SUPER_ADMIN is intentionally excluded — admins manage workers via
// /api/issues and /api/admin routes, not the worker-facing endpoints.
router.use(protect);
router.use(authorizeRoles('FIELD_WORKER'));

// ── Profile ───────────────────────────────────────────────────────────────────

// GET /api/workers/me
// Returns the authenticated worker's profile + live task stats.
router.get('/me', getWorkerProfile);

// ── Task list & detail ────────────────────────────────────────────────────────

// GET /api/workers/me/tasks[?status=&page=&limit=]
// Lists only tasks assigned to the authenticated worker.
router.get('/me/tasks', getWorkerTasks);

// GET /api/workers/me/tasks/:id
// Returns full task detail + timeline. Returns 404 if not assigned to this worker.
router.get('/me/tasks/:id', getWorkerTaskById);

// ── Workflow transitions ──────────────────────────────────────────────────────
// All three PATCH handlers delegate to transitionIssueStatus in issueService.
// The FSM in issueStatus.js enforces that:
//   - Only FIELD_WORKER can perform these transitions
//   - The task must be assigned to THIS worker
//   - The current status must allow the requested transition

// PATCH /api/workers/tasks/:id/accept
// ASSIGNED → ACCEPTED
router.patch('/tasks/:id/accept', acceptTask);

// PATCH /api/workers/tasks/:id/start
// ACCEPTED → IN_PROGRESS
router.patch('/tasks/:id/start', startTask);

// PATCH /api/workers/tasks/:id/complete
// IN_PROGRESS → PENDING_CITIZEN_VERIFICATION
router.patch('/tasks/:id/complete', completeTask);

export default router;
