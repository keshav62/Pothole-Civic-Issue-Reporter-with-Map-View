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
import {
  validateCreateIssue,
  validateUpdateIssue,
} from '../validators/issueValidator.js';

const router = Router();

// All issue routes require authentication
router.use(protect);

// POST /api/issues — validate first, then create
// validateCreateIssue runs before the controller; bad input never reaches the DB
router.post('/', validateCreateIssue, createIssue);

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

export default router;
