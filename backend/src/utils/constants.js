// ─── User roles ───────────────────────────────────────────────────────────────
export const ROLES = Object.freeze({
  CITIZEN:          'CITIZEN',
  SUPER_ADMIN:      'SUPER_ADMIN',
  DEPARTMENT_ADMIN: 'DEPARTMENT_ADMIN',
  WARD_OFFICER:     'WARD_OFFICER',
  FIELD_WORKER:     'FIELD_WORKER',
});

// ─── Issue statuses ───────────────────────────────────────────────────────────
export const STATUS = Object.freeze({
  REPORTED:                    'REPORTED',
  VERIFIED:                    'VERIFIED',
  REJECTED:                    'REJECTED',
  ASSIGNED:                    'ASSIGNED',
  ACCEPTED:                    'ACCEPTED',
  IN_PROGRESS:                 'IN_PROGRESS',
  PENDING_CITIZEN_VERIFICATION:'PENDING_CITIZEN_VERIFICATION',
  CITIZEN_VERIFIED:            'CITIZEN_VERIFIED',
  REOPENED:                    'REOPENED',
  RESOLVED:                    'RESOLVED',
});
