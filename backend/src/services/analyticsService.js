/**
 * analyticsService.js
 *
 * All heavy MongoDB aggregation pipelines live here.
 * Controllers call these functions and return the results directly.
 *
 * Role-scoping rules (enforced here, never in the router):
 *   SUPER_ADMIN      → global (no filter)
 *   DEPARTMENT_ADMIN → scoped to their department ObjectId
 *   WARD_OFFICER     → scoped to their ward string
 *   FIELD_WORKER     → scoped to their own assignedWorker ObjectId
 *   CITIZEN          → scoped to their own reportedBy ObjectId
 *
 * Recharts shape conventions
 * ──────────────────────────
 * Bar/Line charts expect:  [{ name, value }]  or  [{ name, ...series }]
 * Pie charts expect:       [{ name, value }]
 * Area charts expect:      [{ date, count }]  (ISO date string as x-axis)
 */

import mongoose from 'mongoose';
import Issue from '../models/Issue.js';
import User  from '../models/User.js';

// ─── Shared helpers ───────────────────────────────────────────────────────────

/**
 * buildScopeFilter
 *
 * Returns a MongoDB match object that restricts which issues are included
 * in every aggregation based on the requesting user's role.
 *
 * @param {Object} user - req.user (MongoDB User document)
 * @returns {Object}    - Mongoose query filter object
 */
export const buildScopeFilter = (user) => {
  switch (user.role) {
    case 'SUPER_ADMIN':
      return {};                                          // all issues


    case 'DEPARTMENT_ADMIN': {
      // VULN-08 fix: guard ObjectId construction — user.department may be a plain
      // string code (e.g. "ROAD") rather than a valid ObjectId if the data model
      // was seeded inconsistently. Throwing BSONError here causes a 500.
      const deptId = user.department;
      if (!deptId || !mongoose.Types.ObjectId.isValid(deptId)) {
        return { _id: null }; // no valid dept — guaranteed no-match filter
      }
      return { department: new mongoose.Types.ObjectId(deptId) };
    }

    case 'WARD_OFFICER':
      return { ward: user.ward || '__no_ward__' };       // ward string

    case 'FIELD_WORKER':
      return { assignedWorker: user._id };               // own tasks

    case 'CITIZEN':
      return { reportedBy: user._id };                   // own reports

    default:
      // Unknown role — return nothing
      return { _id: null };
  }
};

/**
 * last12Months
 *
 * Returns a JS Date set to midnight 12 calendar months ago.
 * Used to limit time-series queries to a rolling year.
 */
const last12Months = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 12);
  d.setHours(0, 0, 0, 0);
  return d;
};

// ─── Overview analytics ───────────────────────────────────────────────────────

/**
 * getOverviewStats
 *
 * Returns top-level KPI cards for the requesting user's scope.
 *
 * Shape:
 * {
 *   total:          number,   // All issues in scope
 *   open:           number,   // Non-terminal, non-rejected
 *   resolved:       number,   // RESOLVED
 *   rejected:       number,   // REJECTED
 *   resolutionRate: number,   // % resolved out of (resolved + rejected + total open)
 *   avgResolutionDays: number,// Mean days from createdAt → resolvedAt
 *   byStatus:  [{ name, value }],    // Recharts pie data
 *   byPriority:[{ name, value }],    // Recharts bar data
 *   byCategory:[{ name, value }],    // Recharts bar data
 * }
 */
export const getOverviewStats = async (user) => {
  const scope = buildScopeFilter(user);

  // ── 1. Counts by status (single aggregation pass) ──────────────────────────
  const statusAgg = await Issue.aggregate([
    { $match: scope },
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort:  { _id: 1 } },
  ]);

  const statusMap = {};
  let total = 0;
  for (const { _id, count } of statusAgg) {
    statusMap[_id] = count;
    total += count;
  }

  const resolved = statusMap['RESOLVED'] ?? 0;
  const rejected = statusMap['REJECTED'] ?? 0;
  const open = total - resolved - rejected - (statusMap['CITIZEN_VERIFIED'] ?? 0);
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Recharts-ready status array (human-friendly labels)
  const STATUS_LABELS = {
    REPORTED:                   'Reported',
    VERIFIED:                   'Verified',
    REJECTED:                   'Rejected',
    ASSIGNED:                   'Assigned',
    ACCEPTED:                   'Accepted',
    IN_PROGRESS:                'In Progress',
    PENDING_CITIZEN_VERIFICATION: 'Pending Verification',
    CITIZEN_VERIFIED:           'Citizen Verified',
    REOPENED:                   'Reopened',
    RESOLVED:                   'Resolved',
  };

  const byStatus = statusAgg.map(({ _id, count }) => ({
    name:  STATUS_LABELS[_id] ?? _id,
    value: count,
  }));

  // ── 2. Counts by priority ──────────────────────────────────────────────────
  const priorityAgg = await Issue.aggregate([
    { $match: scope },
    { $group: { _id: '$priority', count: { $sum: 1 } } },
  ]);

  // Keep canonical order: LOW → MEDIUM → HIGH → CRITICAL
  const PRIORITY_ORDER = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const priorityMap = {};
  for (const { _id, count } of priorityAgg) priorityMap[_id] = count;
  const byPriority = PRIORITY_ORDER.map((p) => ({
    name:  p.charAt(0) + p.slice(1).toLowerCase(),
    value: priorityMap[p] ?? 0,
  }));

  // ── 3. Counts by category ──────────────────────────────────────────────────
  const categoryAgg = await Issue.aggregate([
    { $match: scope },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort:  { count: -1 } },
  ]);

  const CATEGORY_LABELS = {
    POTHOLE:     'Pothole',
    GARBAGE:     'Garbage',
    STREETLIGHT: 'Streetlight',
    DRAINAGE:    'Drainage',
    ROAD_DAMAGE: 'Road Damage',
    WATER_LEAK:  'Water Leak',
    OTHER:       'Other',
  };

  const byCategory = categoryAgg.map(({ _id, count }) => ({
    name:  CATEGORY_LABELS[_id] ?? _id,
    value: count,
  }));

  // ── 4. Average resolution time (days) ─────────────────────────────────────
  const resolutionAgg = await Issue.aggregate([
    {
      $match: {
        ...scope,
        status:     'RESOLVED',
        resolvedAt: { $exists: true, $ne: null },
      },
    },
    {
      $project: {
        diffMs: { $subtract: ['$resolvedAt', '$createdAt'] },
      },
    },
    {
      $group: {
        _id: null,
        avgMs: { $avg: '$diffMs' },
      },
    },
  ]);

  const avgResolutionDays = resolutionAgg.length > 0
    ? parseFloat((resolutionAgg[0].avgMs / (1000 * 60 * 60 * 24)).toFixed(1))
    : 0;

  return {
    total,
    open,
    resolved,
    rejected,
    resolutionRate,
    avgResolutionDays,
    byStatus,
    byPriority,
    byCategory,
  };
};

// ─── Issue trend analytics ─────────────────────────────────────────────────────

/**
 * getIssueTrends
 *
 * Monthly time-series data for the last 12 months.
 *
 * Shape:
 * {
 *   monthly: [{ month: "Aug 2025", reported, resolved, rejected }],
 *   // Recharts <AreaChart> / <LineChart> — use `month` as X-axis dataKey
 *
 *   topWards: [{ name, value }],
 *   // Top 10 wards by issue count — Recharts <BarChart>
 *
 *   statusTransitions: [{ name, value }],
 *   // How issues flow through the pipeline — Recharts <FunnelChart> or <BarChart>
 *
 *   recentActivity: [{ date, count }],
 *   // Daily issue count for the last 30 days — Recharts <AreaChart>
 * }
 */
export const getIssueTrends = async (user) => {
  const scope = buildScopeFilter(user);
  const twelveMonthsAgo = last12Months();

  // ── Monthly breakdown — reported, resolved, rejected per calendar month ────
  const monthlyAgg = await Issue.aggregate([
    {
      $match: {
        ...scope,
        createdAt: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year:  { $year:  '$createdAt' },
          month: { $month: '$createdAt' },
        },
        reported: { $sum: 1 },
        resolved: {
          $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] },
        },
        rejected: {
          $sum: { $cond: [{ $eq: ['$status', 'REJECTED'] }, 1, 0] },
        },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const MONTH_NAMES = [
    '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const monthly = monthlyAgg.map(({ _id, reported, resolved, rejected }) => ({
    month:    `${MONTH_NAMES[_id.month]} ${_id.year}`,
    reported,
    resolved,
    rejected,
    // Recharts can plot all three series on one chart using these keys
  }));

  // ── Top 10 wards by issue volume ──────────────────────────────────────────
  const wardAgg = await Issue.aggregate([
    { $match: { ...scope, ward: { $exists: true, $ne: '' } } },
    { $group: { _id: '$ward', count: { $sum: 1 } } },
    { $sort:  { count: -1 } },
    { $limit: 10 },
  ]);

  const topWards = wardAgg.map(({ _id, count }) => ({
    name:  _id,
    value: count,
  }));

  // ── Pipeline funnel — counts at each status stage ────────────────────────
  // Shows how many issues "survive" each step of the workflow
  const FUNNEL_STATUSES = [
    { key: 'REPORTED',                   label: 'Reported' },
    { key: 'VERIFIED',                   label: 'Verified' },
    { key: 'ASSIGNED',                   label: 'Assigned' },
    { key: 'IN_PROGRESS',                label: 'In Progress' },
    { key: 'PENDING_CITIZEN_VERIFICATION', label: 'Pending Verification' },
    { key: 'RESOLVED',                   label: 'Resolved' },
  ];

  const funnelAgg = await Issue.aggregate([
    { $match: scope },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const funnelMap = {};
  for (const { _id, count } of funnelAgg) funnelMap[_id] = count;

  const statusTransitions = FUNNEL_STATUSES.map(({ key, label }) => ({
    name:  label,
    value: funnelMap[key] ?? 0,
  }));

  // ── Daily activity for the last 30 days ───────────────────────────────────
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const dailyAgg = await Issue.aggregate([
    {
      $match: {
        ...scope,
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          year:  { $year:  '$createdAt' },
          month: { $month: '$createdAt' },
          day:   { $dayOfMonth: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  const recentActivity = dailyAgg.map(({ _id, count }) => ({
    // ISO-style date string: "2026-08-15"  — Recharts formats it via tickFormatter
    date:  `${_id.year}-${String(_id.month).padStart(2, '0')}-${String(_id.day).padStart(2, '0')}`,
    count,
  }));

  return { monthly, topWards, statusTransitions, recentActivity };
};

// ─── Worker performance analytics ─────────────────────────────────────────────

/**
 * getWorkerStats
 *
 * Returns worker performance data.
 *
 * - SUPER_ADMIN / DEPARTMENT_ADMIN: leaderboard of all workers in scope
 * - FIELD_WORKER: their own personal task stats
 * - Other roles: empty leaderboard (controlled in controller)
 *
 * Shape:
 * {
 *   leaderboard: [
 *     {
 *       workerId, name, photoURL,
 *       total, completed, inProgress, avgResolutionDays,
 *       completionRate   // %
 *     }
 *   ],
 *
 *   // For FIELD_WORKER personal view — same shape, single-element array
 *   personal: { ... } | null,
 *
 *   taskStatusBreakdown: [{ name, value }],  // own tasks — Recharts pie
 * }
 */
export const getWorkerStats = async (user) => {
  const isAdmin   = ['SUPER_ADMIN', 'DEPARTMENT_ADMIN'].includes(user.role);
  const isWorker  = user.role === 'FIELD_WORKER';

  // ── Leaderboard (admin view) ──────────────────────────────────────────────
  if (isAdmin) {
    const scopeFilter = buildScopeFilter(user);

    const leaderboardAgg = await Issue.aggregate([
      {
        $match: {
          ...scopeFilter,
          assignedWorker: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id:       '$assignedWorker',
          total:     { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $in: ['$status', ['RESOLVED', 'CITIZEN_VERIFIED']] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0] },
          },
          // Average resolution time in ms for completed tasks
          avgResMs: {
            $avg: {
              $cond: [
                {
                  $and: [
                    { $in: ['$status', ['RESOLVED', 'CITIZEN_VERIFIED']] },
                    { $ifNull: ['$resolvedAt', false] },
                  ],
                },
                { $subtract: ['$resolvedAt', '$createdAt'] },
                null,
              ],
            },
          },
        },
      },
      { $sort: { completed: -1 } },
      { $limit: 20 },
      // Join with User to get name / photoURL
      {
        $lookup: {
          from:         'users',
          localField:   '_id',
          foreignField: '_id',
          as:           'workerDoc',
        },
      },
      { $unwind: { path: '$workerDoc', preserveNullAndEmpty: false } },
    ]);

    const leaderboard = leaderboardAgg.map((w) => ({
      workerId:          w._id,
      name:              w.workerDoc.name,
      photoURL:          w.workerDoc.photoURL || null,
      total:             w.total,
      completed:         w.completed,
      inProgress:        w.inProgress,
      avgResolutionDays: w.avgResMs != null
        ? parseFloat((w.avgResMs / (1000 * 60 * 60 * 24)).toFixed(1))
        : null,
      completionRate: w.total > 0
        ? Math.round((w.completed / w.total) * 100)
        : 0,
    }));

    return { leaderboard, personal: null, taskStatusBreakdown: [] };
  }

  // ── Personal stats (FIELD_WORKER view) ───────────────────────────────────
  if (isWorker) {
    const workerScope = { assignedWorker: user._id };

    const [taskAgg, statusAgg] = await Promise.all([
      Issue.aggregate([
        { $match: workerScope },
        {
          $group: {
            _id:       null,
            total:     { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $in: ['$status', ['RESOLVED', 'CITIZEN_VERIFIED']] }, 1, 0] },
            },
            inProgress: {
              $sum: { $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0] },
            },
            reopened: {
              $sum: { $cond: [{ $eq: ['$status', 'REOPENED'] }, 1, 0] },
            },
            avgResMs: {
              $avg: {
                $cond: [
                  {
                    $and: [
                      { $in: ['$status', ['RESOLVED', 'CITIZEN_VERIFIED']] },
                      { $ifNull: ['$resolvedAt', false] },
                    ],
                  },
                  { $subtract: ['$resolvedAt', '$createdAt'] },
                  null,
                ],
              },
            },
          },
        },
      ]),
      Issue.aggregate([
        { $match: workerScope },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const stats = taskAgg[0] ?? {
      total: 0, completed: 0, inProgress: 0, reopened: 0, avgResMs: null,
    };

    const STATUS_LABELS = {
      ASSIGNED:    'Assigned', ACCEPTED: 'Accepted',
      IN_PROGRESS: 'In Progress',
      PENDING_CITIZEN_VERIFICATION: 'Pending Verification',
      CITIZEN_VERIFIED: 'Citizen Verified',
      RESOLVED:    'Resolved', REOPENED: 'Reopened',
    };

    const taskStatusBreakdown = statusAgg.map(({ _id, count }) => ({
      name:  STATUS_LABELS[_id] ?? _id,
      value: count,
    }));

    const personal = {
      total:             stats.total,
      completed:         stats.completed,
      inProgress:        stats.inProgress,
      reopened:          stats.reopened,
      avgResolutionDays: stats.avgResMs != null
        ? parseFloat((stats.avgResMs / (1000 * 60 * 60 * 24)).toFixed(1))
        : null,
      completionRate: stats.total > 0
        ? Math.round((stats.completed / stats.total) * 100)
        : 0,
    };

    return { leaderboard: [], personal, taskStatusBreakdown };
  }

  // Other roles (CITIZEN, WARD_OFFICER) — no worker stats
  return { leaderboard: [], personal: null, taskStatusBreakdown: [] };
};
