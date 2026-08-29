import { Router } from 'express';
import {
  getWorkerProfile,
  getWorkerTasks,
  getWorkerTaskById,
  acceptTask,
  startTask,
  completeTask,
  submitProof,
} from '../controllers/workerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import multer from 'multer';

const router = Router();

// multer fields() for the proof endpoint — accepts both image sets in one request.
// Files are kept in memory (no disk writes) and streamed to Cloudinary by imageService.
const proofUpload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024, files: 10 }, // 5 MB each, up to 10 total
  fileFilter: (_req, file, cb) => {
    const allowed = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
    allowed.has(file.mimetype)
      ? cb(null, true)
      : cb(new Error(`Invalid type '${file.mimetype}'`), false);
  },
}).fields([
  { name: 'beforeImages', maxCount: 5 },
  { name: 'afterImages',  maxCount: 5 },
]);

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

// POST /api/workers/tasks/:id/proof
// Upload before/after images and repair note as resolution evidence.
// Triggers: IN_PROGRESS → PENDING_CITIZEN_VERIFICATION
// multer fields() parses multipart/form-data with both image arrays in one request.
router.post(
  '/tasks/:id/proof',
  (req, res, next) => {
    proofUpload(req, res, (err) => {
      if (!err) return next();
      // Normalise multer errors to consistent JSON
      const msg = err.code === 'LIMIT_FILE_SIZE'
        ? 'File too large. Maximum 5 MB per image.'
        : err.message || 'File upload error';
      return res.status(400).json({ success: false, message: msg });
    });
  },
  submitProof
);

export default router;
