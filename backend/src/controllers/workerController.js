import Issue from '../models/Issue.js';
import { transitionIssueStatus, getIssueTimeline } from '../services/issueService.js';
import { STATUS } from '../utils/constants.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * workerTaskFilter
 *
 * Builds the base Mongoose filter that scopes every query to only the tasks
 * assigned to the currently authenticated worker.
 * The worker's identity always comes from req.user — never from the request body or URL.
 */
const workerTaskFilter = (user) => ({ assignedWorker: user._id });

// ─── GET /api/workers/me ──────────────────────────────────────────────────────

/**
 * Returns the authenticated field worker's own profile.
 * Adds a live count of active and completed tasks to the profile response.
 */
export const getWorkerProfile = async (req, res, next) => {
  try {
    const [activeCount, completedCount] = await Promise.all([
      Issue.countDocuments({
        assignedWorker: req.user._id,
        status: { $in: [STATUS.ASSIGNED, STATUS.ACCEPTED, STATUS.IN_PROGRESS] },
      }),
      Issue.countDocuments({
        assignedWorker: req.user._id,
        status: { $in: [STATUS.PENDING_CITIZEN_VERIFICATION, STATUS.CITIZEN_VERIFIED, STATUS.RESOLVED] },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Worker profile fetched',
      data: {
        user: {
          id:          req.user._id,
          name:        req.user.name,
          email:       req.user.email,
          phone:       req.user.phone  || null,
          photoURL:    req.user.photoURL,
          role:        req.user.role,
          department:  req.user.department || null,
          ward:        req.user.ward       || null,
          isActive:    req.user.isActive,
          createdAt:   req.user.createdAt,
        },
        stats: {
          activeTasks:    activeCount,
          completedTasks: completedCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/workers/me/tasks ────────────────────────────────────────────────

/**
 * Returns all tasks assigned to the authenticated field worker.
 * Supports optional filtering by status and pagination.
 */
export const getWorkerTasks = async (req, res, next) => {
  try {
    const {
      status,
      page  = 1,
      limit = 20,
    } = req.query;

    const filter = workerTaskFilter(req.user);

    // Optional status filter — worker may want to see only their active tasks
    if (status) {
      filter.status = status;
    }

    const pageNum  = Math.max(1, parseInt(page,  10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip     = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      Issue.find(filter)
        .populate('reportedBy', 'name email photoURL')
        .populate('department', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Issue.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Tasks fetched successfully',
      data: {
        tasks,
        pagination: {
          total,
          page:       pageNum,
          limit:      limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/workers/me/tasks/:id ───────────────────────────────────────────

/**
 * Returns full details for a single task — but only if it is assigned to the
 * authenticated worker. Includes the complete history timeline.
 */
export const getWorkerTaskById = async (req, res, next) => {
  try {
    const task = await Issue.findOne({
      _id:            req.params.id,
      assignedWorker: req.user._id,   // ownership enforced at DB level
    })
      .populate('reportedBy',    'name email photoURL')
      .populate('assignedWorker','name email phone photoURL')
      .populate('department',    'name code contactEmail contactPhone');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not assigned to you',
      });
    }

    // Fetch the full history timeline for this task
    const timeline = await getIssueTimeline(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Task fetched successfully',
      data: { task, timeline },
    });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/workers/tasks/:id/accept ─────────────────────────────────────

/**
 * Worker accepts an assigned task.
 * Transition: ASSIGNED → ACCEPTED
 */
export const acceptTask = async (req, res, next) => {
  try {
    const updated = await transitionIssueStatus(
      req.params.id,
      STATUS.ACCEPTED,
      req.user,
      { note: req.body.note || '' }
    );

    return res.status(200).json({
      success: true,
      message: 'Task accepted successfully',
      data: { task: updated },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── PATCH /api/workers/tasks/:id/start ──────────────────────────────────────

/**
 * Worker starts work on-site.
 * Transition: ACCEPTED → IN_PROGRESS
 */
export const startTask = async (req, res, next) => {
  try {
    const updated = await transitionIssueStatus(
      req.params.id,
      STATUS.IN_PROGRESS,
      req.user,
      { note: req.body.note || '' }
    );

    return res.status(200).json({
      success: true,
      message: 'Task started successfully',
      data: { task: updated },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── PATCH /api/workers/tasks/:id/complete ───────────────────────────────────

/**
 * Worker marks the task as done, pending citizen verification.
 * Transition: IN_PROGRESS → PENDING_CITIZEN_VERIFICATION
 *
 * Image proof upload will be added in a separate step.
 * The history note can include a repair description from the worker.
 */
export const completeTask = async (req, res, next) => {
  try {
    const updated = await transitionIssueStatus(
      req.params.id,
      STATUS.PENDING_CITIZEN_VERIFICATION,
      req.user,
      { note: req.body.note || '' }
    );

    return res.status(200).json({
      success: true,
      message: 'Task marked as completed. Awaiting citizen verification.',
      data: { task: updated },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
