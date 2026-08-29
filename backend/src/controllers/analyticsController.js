/**
 * analyticsController.js
 *
 * Three lean controllers that delegate all DB work to analyticsService.
 * Role-based data scoping is handled entirely in the service layer —
 * controllers only validate, call the service, and shape the HTTP response.
 *
 * Endpoints:
 *   GET /api/analytics/overview  — KPI cards
 *   GET /api/analytics/issues    — trends, time-series, ward breakdown
 *   GET /api/analytics/workers   — leaderboard or personal task stats
 *
 * Access matrix (enforced by role middleware in the router):
 *   SUPER_ADMIN      → all three endpoints, global scope
 *   DEPARTMENT_ADMIN → all three endpoints, department scope
 *   WARD_OFFICER     → overview + issues, ward scope
 *   FIELD_WORKER     → overview + workers (personal), own-task scope
 *   CITIZEN          → overview only, own-reports scope
 */

import {
  getOverviewStats,
  getIssueTrends,
  getWorkerStats,
} from '../services/analyticsService.js';

// ─── GET /api/analytics/overview ─────────────────────────────────────────────

/**
 * getOverview
 *
 * Returns top-level KPI cards scoped to the requesting user's role.
 *
 * All roles can call this endpoint; the service returns data proportionate
 * to their access level (global / dept / ward / own issues / own tasks).
 */
export const getOverview = async (req, res, next) => {
  try {
    const data = await getOverviewStats(req.user);

    return res.status(200).json({
      success: true,
      message: 'Overview analytics fetched successfully',
      meta: {
        role:        req.user.role,
        scope:       getScopeLabel(req.user),
        generatedAt: new Date().toISOString(),
      },
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/analytics/issues ───────────────────────────────────────────────

/**
 * getIssueAnalytics
 *
 * Returns time-series trends and ward breakdown.
 * Not available to CITIZEN (they only have a few reports — trends are meaningless).
 * Not available to FIELD_WORKER (they see tasks, not issue trends).
 */
export const getIssueAnalytics = async (req, res, next) => {
  try {
    const data = await getIssueTrends(req.user);

    return res.status(200).json({
      success: true,
      message: 'Issue analytics fetched successfully',
      meta: {
        role:        req.user.role,
        scope:       getScopeLabel(req.user),
        generatedAt: new Date().toISOString(),
      },
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/analytics/workers ──────────────────────────────────────────────

/**
 * getWorkerAnalytics
 *
 * - SUPER_ADMIN / DEPARTMENT_ADMIN: full worker leaderboard
 * - FIELD_WORKER: their own personal performance stats
 * - Other roles: not accessible (403 from router middleware)
 */
export const getWorkerAnalytics = async (req, res, next) => {
  try {
    const data = await getWorkerStats(req.user);

    return res.status(200).json({
      success: true,
      message: 'Worker analytics fetched successfully',
      meta: {
        role:        req.user.role,
        scope:       getScopeLabel(req.user),
        generatedAt: new Date().toISOString(),
      },
      data,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Internal helper ──────────────────────────────────────────────────────────

/**
 * getScopeLabel
 *
 * Returns a human-readable string describing the data scope for this request.
 * Included in the `meta` block so the frontend can render "Showing: Ward 8"
 * or "Showing: Road Maintenance dept" under a chart title.
 */
const getScopeLabel = (user) => {
  switch (user.role) {
    case 'SUPER_ADMIN':      return 'Global';
    case 'DEPARTMENT_ADMIN': return `Department: ${user.department ?? 'unknown'}`;
    case 'WARD_OFFICER':     return `Ward: ${user.ward ?? 'unknown'}`;
    case 'FIELD_WORKER':     return `Personal tasks — ${user.name}`;
    case 'CITIZEN':          return `Personal reports — ${user.name}`;
    default:                 return 'Unknown scope';
  }
};
