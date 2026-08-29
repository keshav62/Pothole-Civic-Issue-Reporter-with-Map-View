import { Router } from 'express';
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  assignIssue,
  verifyIssue,
  getNearbyIssues,
} from '../controllers/issueController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import { uploadImages } from '../middleware/uploadMiddleware.js';
import {
  validateCreateIssue,
  validateUpdateIssue,
  validateNearbyQuery,
} from '../validators/issueValidator.js';

const router = Router();

// ─── Public routes (no authentication required) ───────────────────────────────
// These are mounted BEFORE router.use(protect) so unauthenticated callers
// (e.g. the public Leaflet map) can reach them without a Firebase ID token.
//
// Security note: getNearbyIssues returns a stripped public projection only.
// No PII fields (reportedBy, assignedWorker, department) are included.

// GET /api/issues/nearby?lat=&lng=&radius=
// Public map endpoint — returns active issues within the requested radius.
router.get('/nearby', validateNearbyQuery, getNearbyIssues);

// ─── Authenticated routes (Firebase token required for all below) ─────────────
router.use(protect);

// POST /api/issues — upload middleware parses multipart form data first, then validates and creates
router.post('/', uploadImages('images'), validateCreateIssue, createIssue);

// GET /api/issues — all authenticated roles can list
// (controller scopes results by role automatically)
router.get('/', getIssues);

// GET /api/issues/:id — all authenticated roles can view a single issue
router.get('/:id', getIssueById);

// PATCH /api/issues/:id — validate present fields, then apply role whitelists in controller
router.patch('/:id', validateUpdateIssue, updateIssue);

// DELETE /api/issues/:id — SUPER_ADMIN or the reporting CITIZEN (REPORTED only)
// Coarse role guard here; fine-grained ownership check is inside the controller
router.delete('/:id', authorizeRoles('SUPER_ADMIN', 'CITIZEN'), deleteIssue);

// PATCH /api/issues/:id/assign
// Assigns a verified FIELD_WORKER to the issue and transitions status to ASSIGNED.
// Only SUPER_ADMIN and DEPARTMENT_ADMIN may call this.
// Department-match enforcement is inside assignmentService — not here.
router.patch(
  '/:id/assign',
  validateObjectId,
  authorizeRoles('SUPER_ADMIN', 'DEPARTMENT_ADMIN'),
  assignIssue
);

// POST /api/issues/:id/verify
// Citizen confirms or rejects the completed repair.
//   verified=true  → CITIZEN_VERIFIED → RESOLVED  (auto-closed)
//   verified=false → REOPENED         (note required)
// SUPER_ADMIN is also allowed so admins can unblock stuck issues.
// Ownership check (reportedBy === req.user._id) is enforced inside the controller.
router.post(
  '/:id/verify',
  validateObjectId,
  authorizeRoles('CITIZEN', 'SUPER_ADMIN'),
  verifyIssue
);

export default router;

