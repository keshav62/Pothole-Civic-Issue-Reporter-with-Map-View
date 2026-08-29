import Issue, { ISSUE_STATUSES } from '../models/Issue.js';
import { recordIssueCreated } from '../services/issueService.js';
import { assignWorkerToIssue } from '../services/assignmentService.js';

// ─── Allowed fields per role for PATCH ───────────────────────────────────────
// This is the authoritative whitelist. The frontend cannot update anything
// outside these sets regardless of what it sends in the request body.

const CITIZEN_EDITABLE = ['title', 'description'];

const ADMIN_EDITABLE = [
  'title', 'description', 'priority', 'status',
  'department', 'assignedWorker', 'ward', 'dueDate',
];

const WORKER_EDITABLE = ['status', 'beforeImages', 'afterImages'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Pick only allowed keys from a plain object.
 */
const pick = (obj, keys) =>
  keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) acc[key] = obj[key];
    return acc;
  }, {});


// ─── POST /api/issues ─────────────────────────────────────────────────────────
// Input is already validated by validateCreateIssue middleware in the router.

export const createIssue = async (req, res, next) => {
  try {
    const { title, description, category, location, address, ward, priority } = req.body;

    const issue = await Issue.create({
      title:       title.trim(),
      description: description.trim(),
      category,
      location,
      address:     address?.trim() || '',
      ward:        ward?.trim()    || '',
      priority:    priority        || 'MEDIUM',
      status:      'REPORTED',
      reportedBy:  req.user._id,   // always from the authenticated session — never from body
    });

    // Record the initial history entry — ISSUE_REPORTED
    // Done after create() so we have the issue._id
    await recordIssueCreated(issue, req.user);

    return res.status(201).json({
      success: true,
      message: 'Issue reported successfully',
      data: { issue },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/issues ──────────────────────────────────────────────────────────

export const getIssues = async (req, res, next) => {
  try {
    const {
      status,
      category,
      priority,
      ward,
      search,
      page  = 1,
      limit = 20,
    } = req.query;

    // Build filter object
    const filter = {};

    if (status) {
      if (!ISSUE_STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
      }
      filter.status = status;
    }

    if (category) {
      if (!ISSUE_CATEGORIES.includes(category)) {
        return res.status(400).json({ success: false, message: `Invalid category: ${category}` });
      }
      filter.category = category;
    }

    if (priority) {
      if (!ISSUE_PRIORITIES.includes(priority)) {
        return res.status(400).json({ success: false, message: `Invalid priority: ${priority}` });
      }
      filter.priority = priority;
    }

    if (ward) filter.ward = ward;

    // Role-based visibility scoping
    const role = req.user.role;
    if (role === 'CITIZEN') {
      // Citizens only see their own reports
      filter.reportedBy = req.user._id;
    } else if (role === 'FIELD_WORKER') {
      // Field workers only see tasks assigned to them
      filter.assignedWorker = req.user._id;
    } else if (role === 'DEPARTMENT_ADMIN') {
      // Department admins only see issues belonging to their department
      filter.department = req.user.department;
    }
    // SUPER_ADMIN and WARD_OFFICER see everything (no extra filter)

    // Keyword search on title and description
    if (search?.trim()) {
      filter.$or = [
        { title:       { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Pagination
    const pageNum  = Math.max(1, parseInt(page, 10)  || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip     = (pageNum - 1) * limitNum;

    const [issues, total] = await Promise.all([
      Issue.find(filter)
        .populate('reportedBy',    'name email photoURL')
        .populate('assignedWorker','name email photoURL')
        .populate('department',    'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Issue.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Issues fetched successfully',
      data: {
        issues,
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

// ─── GET /api/issues/:id ──────────────────────────────────────────────────────

export const getIssueById = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy',    'name email photoURL')
      .populate('assignedWorker','name email phone photoURL')
      .populate('department',    'name code contactEmail contactPhone');

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Issue fetched successfully',
      data: { issue },
    });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/issues/:id ────────────────────────────────────────────────────

export const updateIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const { role, _id: userId } = req.user;

    // Determine which fields this role may update
    let allowedFields;

    if (role === 'SUPER_ADMIN') {
      allowedFields = ADMIN_EDITABLE;
    } else if (role === 'DEPARTMENT_ADMIN') {
      allowedFields = ADMIN_EDITABLE;
    } else if (role === 'FIELD_WORKER') {
      // Worker may only update their own assigned tasks
      if (!issue.assignedWorker || issue.assignedWorker.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Forbidden: This task is not assigned to you' });
      }
      allowedFields = WORKER_EDITABLE;
    } else if (role === 'CITIZEN') {
      // Citizen may only edit their own reports while still REPORTED
      if (issue.reportedBy.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Forbidden: You can only edit your own reports' });
      }
      if (issue.status !== 'REPORTED') {
        return res.status(403).json({ success: false, message: 'Forbidden: Issue has already been processed and cannot be edited' });
      }
      allowedFields = CITIZEN_EDITABLE;
    } else {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    // Validate status transition if status is being changed
    const updates = pick(req.body, allowedFields);
    if (updates.status && !ISSUE_STATUSES.includes(updates.status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status: ${updates.status}`,
      });
    }

    // Automatically set resolvedAt when an issue is resolved
    if (updates.status === 'RESOLVED' || updates.status === 'CITIZEN_VERIFIED') {
      updates.resolvedAt = new Date();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided for update' });
    }

    const updated = await Issue.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('reportedBy',    'name email photoURL')
      .populate('assignedWorker','name email photoURL')
      .populate('department',    'name code');

    return res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: { issue: updated },
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/issues/:id ───────────────────────────────────────────────────

export const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const { role, _id: userId } = req.user;

    // Only SUPER_ADMIN can delete any issue.
    // A CITIZEN can delete their own report only while it is still REPORTED.
    const isSuperAdmin = role === 'SUPER_ADMIN';
    const isOwnerAndReported =
      role === 'CITIZEN' &&
      issue.reportedBy.toString() === userId.toString() &&
      issue.status === 'REPORTED';

    if (!isSuperAdmin && !isOwnerAndReported) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this issue',
      });
    }

    await Issue.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Issue deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/issues/:id/assign ───────────────────────────────────────────────

/**
 * Assign a FIELD_WORKER to an issue.
 * Only SUPER_ADMIN and DEPARTMENT_ADMIN can call this.
 *
 * The request body must contain { workerId }.
 * All validation (worker role, active status, dept match) is done
 * inside assignmentService — nothing from the request body is trusted
 * beyond the raw workerId used to look up the worker in MongoDB.
 */
export const assignIssue = async (req, res, next) => {
  try {
    const { workerId, note } = req.body;

    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: 'workerId is required',
      });
    }

    const updated = await assignWorkerToIssue(
      req.params.id,
      workerId,
      req.user,     // authenticated admin — never trust role/dept from body
      note || ''
    );

    return res.status(200).json({
      success: true,
      message: 'Worker assigned successfully',
      data: { issue: updated },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
