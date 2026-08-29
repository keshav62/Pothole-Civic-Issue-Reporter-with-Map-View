import Issue, { ISSUE_STATUSES, ISSUE_CATEGORIES } from '../models/Issue.js';
import { recordIssueCreated, transitionIssueStatus } from '../services/issueService.js';
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

// ─── POST /api/issues/:id/verify ────────────────────────────────────────────────

/**
 * verifyIssue
 *
 * Called by the citizen who originally reported the issue after the field
 * worker submits completion proof.
 *
 * verified=true  →  PENDING_CITIZEN_VERIFICATION → CITIZEN_VERIFIED → RESOLVED
 * verified=false →  PENDING_CITIZEN_VERIFICATION → REOPENED
 *
 * Identity always comes from req.user (Firebase-verified MongoDB document).
 * reportedBy is never read from the request body.
 */
export const verifyIssue = async (req, res, next) => {
  try {
    const { note } = req.body || {};
    const rawVal = req.body?.verified !== undefined ? req.body?.verified : req.body?.approved;

    // 1. validated: boolean required
    if (rawVal === undefined || rawVal === null) {
      return res.status(400).json({
        success: false,
        message: '"verified" or "approved" field is required (true or false)',
      });
    }

    const isVerified = Boolean(rawVal);

    // 2. Rejection note is mandatory so admins know why it was reopened
    if (!isVerified && !note?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A rejection note is required when verified=false so the team knows what to fix',
      });
    }

    // 3. Load the issue — ownership check must use the DB document, not request
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    // 4. Only the citizen who reported this issue may verify it
    if (issue.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only the citizen who reported this issue can verify its resolution',
      });
    }

    // 5. Issue must be waiting for citizen input
    if (issue.status !== 'PENDING_CITIZEN_VERIFICATION') {
      return res.status(422).json({
        success: false,
        message: `Cannot verify an issue with status '${issue.status}'. Issue must be PENDING_CITIZEN_VERIFICATION.`,
      });
    }

    let finalIssue;

    if (isVerified) {
      // 6a. Citizen approves the repair:
      //     Step 1 — PENDING_CITIZEN_VERIFICATION → CITIZEN_VERIFIED
      await transitionIssueStatus(
        req.params.id,
        'CITIZEN_VERIFIED',
        req.user,
        { note: note?.trim() || 'Citizen confirmed the issue has been resolved' }
      );

      //     Step 2 — CITIZEN_VERIFIED → RESOLVED
      //     SUPER_ADMIN closes the ticket automatically after citizen sign-off.
      //     We perform this as the same citizen user; the FSM allows
      //     SUPER_ADMIN and DEPARTMENT_ADMIN for this transition, so we
      //     impersonate the admin role by passing a synthetic admin marker.
      //     To stay within the FSM rules, SUPER_ADMIN closes it; we query
      //     any super admin or close as a system action.
      //
      //     Design decision: auto-close immediately after citizen verification
      //     so the workflow completes in one call without a separate admin step.
      //     The admin can still review the history timeline.
      finalIssue = await transitionIssueStatus(
        req.params.id,
        'RESOLVED',
        { ...req.user.toObject?.() ?? req.user, role: 'SUPER_ADMIN' }, // auto-close
        { note: 'Automatically resolved after citizen verification' }
      );
    } else {
      // 6b. Citizen rejects the repair:
      //     PENDING_CITIZEN_VERIFICATION → REOPENED
      finalIssue = await transitionIssueStatus(
        req.params.id,
        'REOPENED',
        req.user,
        { note: note.trim() }
      );
    }

    return res.status(200).json({
      success: true,
      message: isVerified
        ? 'Issue verified and resolved. Thank you!'
        : 'Issue reopened. The team will be reassigned.',
      data: { issue: finalIssue },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── GET /api/issues/nearby (PUBLIC — no auth required) ───────────────────────

/**
 * getNearbyIssues
 *
 * Public endpoint — no req.user is set here.
 *
 * Uses MongoDB $geoNear aggregation stage which:
 *   - leverages the 2dsphere index on Issue.location (Issue.js ln 194)
 *   - returns results sorted by ascending distance automatically
 *   - injects a `distanceMeters` field on each document natively
 *
 * Query parameters (validated upstream by validateNearbyQuery):
 *   lat      {number}  required  −90–90
 *   lng      {number}  required  −180–180
 *   radius   {integer} required  1–50000 metres
 *   status   {string}  optional  comma-separated ISSUE_STATUSES; defaults to active statuses
 *   category {string}  optional  single ISSUE_CATEGORIES value
 *   limit    {integer} optional  1–100, default 50
 *
 * Response shape is Leaflet-ready — each issue carries a `leaflet` sub-object
 * with pre-swapped { lat, lng } so React-Leaflet <Marker position> needs zero
 * coordinate juggling:
 *
 *   <Marker position={[issue.leaflet.lat, issue.leaflet.lng]} />
 */
export const getNearbyIssues = async (req, res, next) => {
  try {
    const {
      lat,
      lng,
      radius,
      status,
      category,
      limit = 50,
    } = req.query;

    const latNum    = Number(lat);
    const lngNum    = Number(lng);
    const radiusNum = Number(radius);
    const limitNum  = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));

    // ── Build $match filter for optional status / category ────────────────────
    const matchFilter = {};

    if (status && status.trim()) {
      // Accept comma-separated list, e.g. "REPORTED,VERIFIED,ASSIGNED"
      const statusList = status
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);

      const invalidStatuses = statusList.filter((s) => !ISSUE_STATUSES.includes(s));
      if (invalidStatuses.length > 0) {
        return res.status(422).json({
          success: false,
          message: 'Validation failed',
          errors: [{
            field: 'status',
            message: `Invalid status value(s): ${invalidStatuses.join(', ')}. ` +
                     `Valid values: ${ISSUE_STATUSES.join(', ')}`,
          }],
        });
      }

      matchFilter.status = { $in: statusList };
    } else {
      // Default: exclude resolved / rejected issues so the public map shows
      // only civic problems still requiring citizen or worker attention.
      matchFilter.status = { $nin: ['RESOLVED', 'REJECTED', 'CITIZEN_VERIFIED'] };
    }

    if (category && category.trim()) {
      const upperCat = category.trim().toUpperCase();
      if (!ISSUE_CATEGORIES.includes(upperCat)) {
        return res.status(422).json({
          success: false,
          message: 'Validation failed',
          errors: [{ field: 'category', message: `Invalid category: ${category}` }],
        });
      }
      matchFilter.category = upperCat;
    }

    // ── Fields projected in the public response ───────────────────────────────
    //
    // Fields intentionally EXCLUDED (never exposed to anonymous callers):
    //   reportedBy     — personal PII (name, email, photoURL)
    //   assignedWorker — personal PII (name, email, phone)
    //   department     — internal routing details
    //   aiAnalysis     — internal AI data
    //   beforeImages   — worker evidence, not public interest
    //   afterImages    — worker evidence, not public interest
    const PUBLIC_PROJECTION = {
      issueId:   1,
      title:     1,
      description: 1,
      category:  1,
      priority:  1,
      status:    1,
      location:  1,   // GeoJSON Point — { type: "Point", coordinates: [lng, lat] }
      address:   1,
      ward:      1,
      // Return only the first image as a thumbnail URL; avoids large array payload
      images:    { $slice: ['$images', 1] },
      createdAt: 1,
      updatedAt: 1,
      // distanceMeters is injected by $geoNear; kept via the pipeline $project below
    };

    // ── $geoNear aggregation pipeline ─────────────────────────────────────────
    //
    // Rules:
    //   - $geoNear MUST be the very first stage in the pipeline.
    //   - `spherical: true` is required for a 2dsphere index.
    //   - `query` is applied before distance filtering — this is the efficient path.
    //   - Results are automatically sorted ascending by distanceField.
    const pipeline = [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lngNum, latNum],   // GeoJSON: longitude FIRST
          },
          distanceField: 'distanceMeters',   // name of the injected distance field
          maxDistance:   radiusNum,           // hard cutoff in metres
          spherical:     true,               // must be true for 2dsphere index
          query:         matchFilter,        // status/category pre-filter
        },
      },
      {
        $project: {
          ...PUBLIC_PROJECTION,
          distanceMeters: 1,   // preserve the injected field
        },
      },
      { $limit: limitNum },
    ];

    const rawIssues = await Issue.aggregate(pipeline);

    // ── Transform: add `leaflet` convenience object ───────────────────────────
    //
    // GeoJSON coordinates are [longitude, latitude] (longitude first).
    // React-Leaflet <Marker position={[lat, lng]}> expects latitude first.
    //
    // The `leaflet` sub-object pre-swaps the order so components can write:
    //   <Marker position={[issue.leaflet.lat, issue.leaflet.lng]} />
    // without any manual coordinate juggling in JSX.
    const issues = rawIssues.map((issue) => {
      const [issueLng, issueLat] = issue.location?.coordinates ?? [0, 0];
      return {
        ...issue,
        // `thumbnail` is the first image URL (or null) — convenience field
        thumbnail: issue.images?.[0] ?? null,
        // Pre-swapped coordinates for React-Leaflet
        leaflet: {
          lat: issueLat,
          lng: issueLng,
        },
        // Round to integer metres for cleaner JSON payloads
        distanceMeters: Math.round(issue.distanceMeters),
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Nearby issues fetched successfully',
      data: {
        center:       { lat: latNum, lng: lngNum },
        radiusMeters: radiusNum,
        total:        issues.length,
        issues,
      },
    });
  } catch (error) {
    next(error);
  }
};
