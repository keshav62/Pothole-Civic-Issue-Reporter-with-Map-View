import Issue, { ISSUE_CATEGORIES, ISSUE_PRIORITIES, ISSUE_STATUSES } from '../models/Issue.js';

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

/**
 * Validate that a GeoJSON Point payload is well-formed.
 * Returns an error string or null.
 */
const validateLocation = (location) => {
  if (!location || typeof location !== 'object') {
    return 'location is required';
  }
  if (location.type !== 'Point') {
    return 'location.type must be "Point"';
  }
  const coords = location.coordinates;
  if (!Array.isArray(coords) || coords.length !== 2) {
    return 'location.coordinates must be [longitude, latitude]';
  }
  const [lng, lat] = coords;
  if (typeof lng !== 'number' || typeof lat !== 'number') {
    return 'location.coordinates must contain numbers';
  }
  if (lng < -180 || lng > 180) {
    return 'longitude must be between -180 and 180';
  }
  if (lat < -90 || lat > 90) {
    return 'latitude must be between -90 and 90';
  }
  return null;
};

// ─── POST /api/issues ─────────────────────────────────────────────────────────

export const createIssue = async (req, res, next) => {
  try {
    const { title, description, category, location, address, ward, priority } = req.body;

    // Validate required text fields
    if (!title?.trim())       return res.status(400).json({ success: false, message: 'title is required' });
    if (!description?.trim()) return res.status(400).json({ success: false, message: 'description is required' });
    if (!category)            return res.status(400).json({ success: false, message: 'category is required' });

    if (!ISSUE_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `category must be one of: ${ISSUE_CATEGORIES.join(', ')}`,
      });
    }

    // Validate GeoJSON location
    const locationError = validateLocation(location);
    if (locationError) {
      return res.status(400).json({ success: false, message: locationError });
    }

    // Validate optional priority
    if (priority && !ISSUE_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: `priority must be one of: ${ISSUE_PRIORITIES.join(', ')}`,
      });
    }

    const issue = await Issue.create({
      title:       title.trim(),
      description: description.trim(),
      category,
      location,
      address:     address?.trim() || '',
      ward:        ward?.trim()    || '',
      priority:    priority        || 'MEDIUM',
      status:      'REPORTED',
      reportedBy:  req.user._id,   // always from authenticated session — never from body
    });

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
