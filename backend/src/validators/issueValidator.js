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
};
