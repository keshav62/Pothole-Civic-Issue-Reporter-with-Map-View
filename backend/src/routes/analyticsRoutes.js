import { Router } from 'express';
import {
  getOverview,
  getIssueAnalytics,
  getWorkerAnalytics,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

// All analytics endpoints require a valid Firebase session
router.use(protect);

// ─── GET /api/analytics/overview ─────────────────────────────────────────────
// Available to every role.
// Data is scoped server-side by the service — each role sees only their slice.
//
//   SUPER_ADMIN      → global totals
//   DEPARTMENT_ADMIN → department totals
//   WARD_OFFICER     → ward totals
//   FIELD_WORKER     → own assigned task totals
//   CITIZEN          → own reported issue totals
router.get(
  '/overview',
  authorizeRoles(
    'SUPER_ADMIN',
    'DEPARTMENT_ADMIN',
    'WARD_OFFICER',
    'FIELD_WORKER',
    'CITIZEN'
  ),
  getOverview
);

// ─── GET /api/analytics/issues ───────────────────────────────────────────────
// Monthly trends, daily activity, ward breakdown, pipeline funnel.
// Restricted to roles that manage or monitor many issues.
// CITIZEN and FIELD_WORKER are excluded (their personal data is in /overview).
router.get(
  '/issues',
  authorizeRoles(
    'SUPER_ADMIN',
    'DEPARTMENT_ADMIN',
    'WARD_OFFICER'
  ),
  getIssueAnalytics
);

// ─── GET /api/analytics/workers ──────────────────────────────────────────────
// Worker leaderboard (admins) or personal performance summary (field workers).
// CITIZEN and WARD_OFFICER cannot see worker performance data.
router.get(
  '/workers',
  authorizeRoles(
    'SUPER_ADMIN',
    'DEPARTMENT_ADMIN',
    'FIELD_WORKER'
  ),
  getWorkerAnalytics
);

export default router;
