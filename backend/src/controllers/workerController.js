import Issue from '../models/Issue.js';
import { transitionIssueStatus, getIssueTimeline } from '../services/issueService.js';
import { uploadBeforeImages, uploadAfterImages } from '../services/imageService.js';
import { STATUS } from '../utils/constants.js';
import { ISSUE_STATUSES } from '../models/Issue.js';

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
    const workerId = req.user._id;
    const now = new Date();

    const [
      totalTasks,
      assignedTasks,
      acceptedTasks,
      inProgressTasks,
      pendingVerificationTasks,
      resolvedTasks,
      overdueTasks
    ] = await Promise.all([
      Issue.countDocuments({ assignedWorker: workerId }),
      Issue.countDocuments({ assignedWorker: workerId, status: STATUS.ASSIGNED }),
      Issue.countDocuments({ assignedWorker: workerId, status: STATUS.ACCEPTED }),
      Issue.countDocuments({ assignedWorker: workerId, status: STATUS.IN_PROGRESS }),
      Issue.countDocuments({ assignedWorker: workerId, status: STATUS.PENDING_CITIZEN_VERIFICATION }),
      Issue.countDocuments({ assignedWorker: workerId, status: { $in: [STATUS.CITIZEN_VERIFIED, STATUS.RESOLVED] } }),
      Issue.countDocuments({ 
        assignedWorker: workerId, 
        status: { $in: [STATUS.ASSIGNED, STATUS.ACCEPTED, STATUS.IN_PROGRESS] },
        dueDate: { $lt: now } 
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
          total: totalTasks,
          assigned: assignedTasks,
          accepted: acceptedTasks,
          inProgress: inProgressTasks,
          pendingVerification: pendingVerificationTasks,
          resolved: resolvedTasks,
          overdue: overdueTasks,
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

    // VULN-06 fix: only accept a status value that exists in ISSUE_STATUSES.
    // Raw req.query strings must never be used directly as MongoDB field values.
    if (status) {
      if (!ISSUE_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status '${status}'. Valid values: ${ISSUE_STATUSES.join(', ')}`,
        });
      }
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
      { note: req.body?.note || '' }
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
      { note: req.body?.note || '' }
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
      { note: req.body?.note || '' }
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

// ─── POST /api/workers/tasks/:id/proof ──────────────────────────────────────────

/**
 * submitProof
 *
 * Accepts before/after repair images and a repair note from a field worker.
 * Uploads images to Cloudinary, persists URLs to issue.beforeImages / afterImages,
 * records a history entry, then transitions the issue status to
 * PENDING_CITIZEN_VERIFICATION.
 *
 * The issue is NOT marked resolved here — the citizen must verify first.
 *
 * Request:  multipart/form-data
 *   beforeImages  — up to 5 image files
 *   afterImages   — up to 5 image files
 *   repairNote    — plain text field
 *
 * Requires:  issue.status === IN_PROGRESS
 *            issue.assignedWorker === req.user._id
 */
export const submitProof = async (req, res, next) => {
  try {
    const issueId    = req.params.id;
    const repairNote = req.body.repairNote?.trim() || '';

    // VULN-07 fix: validate repairNote length before any DB/upload work.
    // IssueHistory.note has maxlength: 1000; hitting that limit would throw a
    // Mongoose ValidationError which surfaces as an ugly 500 instead of a 400.
    if (repairNote.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'repairNote must be 1000 characters or fewer',
      });
    }

    // req.files is populated by multer's fields() middleware in the route.
    // Each field is an array; default to empty array when not provided.
    const beforeFiles = req.files?.beforeImages || [];
    const afterFiles  = req.files?.afterImages  || [];

    // At least one image set must be provided
    if (beforeFiles.length === 0 && afterFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one before or after image is required as proof',
      });
    }

    // 1. Verify the issue exists, is IN_PROGRESS, and belongs to this worker.
    //    This is a read-only check before any expensive uploads.
    const issue = await Issue.findOne({
      _id:            issueId,
      assignedWorker: req.user._id,
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not assigned to you',
      });
    }

    if (issue.status !== STATUS.IN_PROGRESS) {
      return res.status(422).json({
        success: false,
        message: `Cannot submit proof for a task with status '${issue.status}'. Task must be IN_PROGRESS.`,
      });
    }

    // 2. Upload images to Cloudinary sequentially to avoid Mongoose VersionError race conditions.
    //    imageService functions handle ownership checks internally as well.
    if (beforeFiles.length > 0) {
      await uploadBeforeImages(issueId, beforeFiles, req.user);
    }
    if (afterFiles.length > 0) {
      await uploadAfterImages(issueId, afterFiles, req.user);
    }

    // 3. Transition status: IN_PROGRESS → PENDING_CITIZEN_VERIFICATION.
    //    transitionIssueStatus enforces the FSM, writes to DB, and
    //    records TASK_COMPLETED in IssueHistory.
    const updated = await transitionIssueStatus(
      issueId,
      STATUS.PENDING_CITIZEN_VERIFICATION,
      req.user,
      {
        // Repair note is stored in the history record, not on the Issue document
        note: repairNote || `Proof submitted: ${beforeFiles.length} before, ${afterFiles.length} after image(s)`,
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Proof submitted successfully. Awaiting citizen verification.',
      data: { task: updated },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
