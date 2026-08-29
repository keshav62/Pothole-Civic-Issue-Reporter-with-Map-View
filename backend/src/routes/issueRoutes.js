import { Router } from 'express';
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
} from '../controllers/issueController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

// All issue routes require authentication
router.use(protect);

// POST /api/issues — any authenticated user can report
// (controller enforces that reportedBy = req.user, never from body)
router.post('/', createIssue);

// GET /api/issues — all authenticated roles can list
// (controller scopes results by role automatically)
router.get('/', getIssues);

// GET /api/issues/:id — all authenticated roles can view a single issue
router.get('/:id', getIssueById);

// PATCH /api/issues/:id — role-gated field whitelists enforced in controller
router.patch('/:id', updateIssue);

// DELETE /api/issues/:id — SUPER_ADMIN or the reporting CITIZEN (REPORTED only)
// Coarse role guard here; fine-grained ownership check is inside the controller
router.delete('/:id', authorizeRoles('SUPER_ADMIN', 'CITIZEN'), deleteIssue);

export default router;
