import { ISSUE_CATEGORIES, ISSUE_PRIORITIES } from '../models/Issue.js';

// ─── Shared constants ─────────────────────────────────────────────────────────

const TITLE_MAX       = 200;
const DESCRIPTION_MAX = 2000;
const ADDRESS_MAX     = 500;
const WARD_MAX        = 100;

// ─── Field-level validators ───────────────────────────────────────────────────
// Each returns an error string or null.

const validateTitle = (value) => {
  if (!value || typeof value !== 'string' || !value.trim()) {
    return 'title is required';
  }
  if (value.trim().length > TITLE_MAX) {
    return `title must not exceed ${TITLE_MAX} characters`;
  }
  return null;
};

const validateDescription = (value) => {
  if (!value || typeof value !== 'string' || !value.trim()) {
    return 'description is required';
  }
  if (value.trim().length > DESCRIPTION_MAX) {
    return `description must not exceed ${DESCRIPTION_MAX} characters`;
  }
  return null;
};

const validateCategory = (value) => {
  if (!value) return 'category is required';
  if (!ISSUE_CATEGORIES.includes(value)) {
    return `category must be one of: ${ISSUE_CATEGORIES.join(', ')}`;
  }
  return null;
};

const validatePriority = (value) => {
  // Priority is optional on create; when provided it must be valid
  if (value === undefined || value === null || value === '') return null;
  if (!ISSUE_PRIORITIES.includes(value)) {
    return `priority must be one of: ${ISSUE_PRIORITIES.join(', ')}`;
  }
  return null;
};

const validateLatitude = (value) => {
  if (value === undefined || value === null) return 'latitude is required';
  const lat = Number(value);
  if (Number.isNaN(lat)) return 'latitude must be a number';
  if (lat < -90 || lat > 90) return 'latitude must be between -90 and 90';
  return null;
};

const validateLongitude = (value) => {
  if (value === undefined || value === null) return 'longitude is required';
  const lng = Number(value);
  if (Number.isNaN(lng)) return 'longitude must be a number';
  if (lng < -180 || lng > 180) return 'longitude must be between -180 and 180';
  return null;
};

const validateAddress = (value) => {
  // Optional field — only validate length when provided
  if (value && value.length > ADDRESS_MAX) {
    return `address must not exceed ${ADDRESS_MAX} characters`;
  }
  return null;
};

const validateWard = (value) => {
  // Optional field — only validate length when provided
  if (value && value.length > WARD_MAX) {
    return `ward must not exceed ${WARD_MAX} characters`;
  }
  return null;
};

/**
 * validateGeoJSONLocation
 *
 * Accepts the GeoJSON location object sent in the request body:
 *   { type: "Point", coordinates: [longitude, latitude] }
 *
 * Returns an array of error strings (empty = valid).
 *
 * NOTE: GeoJSON coordinates are [longitude, latitude] — longitude FIRST.
 * This is the MongoDB / GeoJSON standard, the inverse of most map libraries.
 */
const validateGeoJSONLocation = (location) => {
  const errors = [];

  if (!location || typeof location !== 'object') {
    errors.push('location is required');
    return errors;          // Stop here; further checks would throw
  }

  if (location.type !== 'Point') {
    errors.push('location.type must be "Point"');
  }

  const coords = location.coordinates;

  if (!Array.isArray(coords) || coords.length !== 2) {
    errors.push('location.coordinates must be an array of [longitude, latitude]');
    return errors;          // Stop here; cannot destructure safely
  }

  const [lng, lat] = coords;

  const lngError = validateLongitude(lng);
  if (lngError) errors.push(`location.coordinates[0] (longitude): ${lngError}`);

  const latError = validateLatitude(lat);
  if (latError) errors.push(`location.coordinates[1] (latitude): ${latError}`);

  return errors;
};

// ─── Middleware factories ─────────────────────────────────────────────────────

/**
 * validateCreateIssue
 *
 * Express middleware. Validates all required and optional fields for
 * POST /api/issues. Collects ALL errors before responding so the client
 * receives the full picture in a single round-trip.
 *
 * Responds 422 Unprocessable Entity on validation failure.
 */
export const validateCreateIssue = (req, res, next) => {
  // Support multipart/form-data where location is passed as a JSON string or lat/lng fields
  if (typeof req.body.location === 'string') {
    try {
      req.body.location = JSON.parse(req.body.location);
    } catch {
      // invalid string will be caught by validateGeoJSONLocation below
    }
  } else if (!req.body.location && req.body.latitude !== undefined && req.body.longitude !== undefined) {
    req.body.location = {
      type: 'Point',
      coordinates: [Number(req.body.longitude), Number(req.body.latitude)],
    };
  }

  const { title, description, category, priority, location, address, ward } = req.body;
  const errors = [];

  const titleErr       = validateTitle(title);
  const descErr        = validateDescription(description);
  const categoryErr    = validateCategory(category);
  const priorityErr    = validatePriority(priority);
  const addressErr     = validateAddress(address);
  const wardErr        = validateWard(ward);
  const locationErrors = validateGeoJSONLocation(location);

  if (titleErr)    errors.push({ field: 'title',       message: titleErr });
  if (descErr)     errors.push({ field: 'description', message: descErr });
  if (categoryErr) errors.push({ field: 'category',    message: categoryErr });
  if (priorityErr) errors.push({ field: 'priority',    message: priorityErr });
  if (addressErr)  errors.push({ field: 'address',     message: addressErr });
  if (wardErr)     errors.push({ field: 'ward',        message: wardErr });

  locationErrors.forEach((msg) => errors.push({ field: 'location', message: msg }));

  if (errors.length > 0) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

/**
 * validateUpdateIssue
 *
 * Express middleware. Validates only fields that are present in the body
 * for PATCH /api/issues/:id. Empty body is caught in the controller.
 */
export const validateUpdateIssue = (req, res, next) => {
  const { title, description, category, priority, address, ward } = req.body;
  const errors = [];

  // Only validate fields that were actually sent
  if (title       !== undefined) { const e = validateTitle(title);           if (e) errors.push({ field: 'title',       message: e }); }
  if (description !== undefined) { const e = validateDescription(description);if (e) errors.push({ field: 'description', message: e }); }
  if (category    !== undefined) { const e = validateCategory(category);      if (e) errors.push({ field: 'category',    message: e }); }
  if (priority    !== undefined) { const e = validatePriority(priority);      if (e) errors.push({ field: 'priority',    message: e }); }
  if (address     !== undefined) { const e = validateAddress(address);        if (e) errors.push({ field: 'address',     message: e }); }
  if (ward        !== undefined) { const e = validateWard(ward);              if (e) errors.push({ field: 'ward',        message: e }); }

  if (errors.length > 0) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

// ─── Constants ───────────────────────────────────────────────────────────────

const RADIUS_MIN = 1;          // metres
const RADIUS_MAX = 50_000;     // 50 km hard cap
const NEARBY_LIMIT_MAX = 100;
const NEARBY_LIMIT_DEFAULT = 50;

/**
 * validateNearbyQuery
 *
 * Express middleware for GET /api/issues/nearby.
 * Validates lat, lng, radius (required) and status, category, limit (optional).
 * This is a PUBLIC endpoint — no authentication middleware runs before it.
 *
 * 422 Unprocessable Entity on validation failure (consistent with other endpoints).
 */
export const validateNearbyQuery = (req, res, next) => {
  const { lat, lng, radius, status, category, limit } = req.query;
  const errors = [];

  // ── lat ────────────────────────────────────────────────────────────────────
  const latErr = validateLatitude(lat);
  if (latErr) errors.push({ field: 'lat', message: latErr });

  // ── lng ────────────────────────────────────────────────────────────────────
  const lngErr = validateLongitude(lng);
  if (lngErr) errors.push({ field: 'lng', message: lngErr });

  // ── radius ─────────────────────────────────────────────────────────────────
  if (radius === undefined || radius === null || radius === '') {
    errors.push({ field: 'radius', message: 'radius is required' });
  } else {
    const r = Number(radius);
    if (!Number.isFinite(r) || !Number.isInteger(r)) {
      errors.push({ field: 'radius', message: 'radius must be an integer (metres)' });
    } else if (r < RADIUS_MIN || r > RADIUS_MAX) {
      errors.push({
        field: 'radius',
        message: `radius must be between ${RADIUS_MIN} and ${RADIUS_MAX} metres`,
      });
    }
  }

  // ── status (optional, comma-separated) ────────────────────────────────────
  if (status !== undefined && status !== '') {
    // Import ISSUE_STATUSES is not available here yet; inline the list or import at top.
    // We import it via the model — re-use the already-imported ISSUE_CATEGORIES reference
    // and validate below in the controller where the model is imported.
    // Here we only reject obviously wrong formats.
    const statusValues = status.split(',').map((s) => s.trim()).filter(Boolean);
    if (statusValues.length === 0) {
      errors.push({ field: 'status', message: 'status must not be empty when provided' });
    }
    // Individual enum check happens in the controller which imports ISSUE_STATUSES.
  }

  // ── category (optional, single enum value) ─────────────────────────────────
  if (category !== undefined && category !== '') {
    const catErr = validateCategory(category);
    if (catErr) errors.push({ field: 'category', message: catErr });
  }

  // ── limit (optional) ───────────────────────────────────────────────────────
  if (limit !== undefined && limit !== '') {
    const l = Number(limit);
    if (!Number.isFinite(l) || !Number.isInteger(l) || l < 1 || l > NEARBY_LIMIT_MAX) {
      errors.push({
        field: 'limit',
        message: `limit must be an integer between 1 and ${NEARBY_LIMIT_MAX}`,
      });
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

// ─── Named exports for unit testing ──────────────────────────────────────────
export {
  validateTitle,
  validateDescription,
  validateCategory,
  validatePriority,
  validateLatitude,
  validateLongitude,
  validateAddress,
  validateWard,
  validateGeoJSONLocation,
  RADIUS_MIN,
  RADIUS_MAX,
  NEARBY_LIMIT_DEFAULT,
};
