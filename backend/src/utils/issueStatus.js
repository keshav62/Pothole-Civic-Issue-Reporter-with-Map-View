import { ROLES, STATUS } from './constants.js';

/**
 * TRANSITION_MAP
 *
 * The authoritative finite-state machine for CivicConnect issue status.
 *
 * Structure:
 *   [FROM_STATUS]: [
 *     { to: TO_STATUS, allowedRoles: [...], description: '...' }
 *   ]
 *
 * A transition is valid only when:
 *   1. The issue's current status matches FROM_STATUS.
 *   2. The requesting user's role is in allowedRoles.
 *
 * No other status changes are permitted — period.
 */
export const TRANSITION_MAP = Object.freeze({

  /**
   * REPORTED → VERIFIED
   * Admin or Department Admin has confirmed the issue is real and legitimate.
   * This is the first human review step.
   */
  [STATUS.REPORTED]: [
    {
      to:           STATUS.VERIFIED,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.DEPARTMENT_ADMIN, ROLES.WARD_OFFICER],
      description:  'Admin/Officer verifies the issue is legitimate',
    },
    {
      to:           STATUS.REJECTED,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.DEPARTMENT_ADMIN, ROLES.WARD_OFFICER],
      description:  'Admin/Officer rejects the issue (duplicate, invalid, or out of scope)',
    },
  ],

  /**
   * VERIFIED → ASSIGNED
   * The issue has been assigned to a department and a specific field worker.
   * Both assignedWorker and department must be set before this transition.
   *
   * VERIFIED → REJECTED
   * Even after initial verification, further review may reject it.
   */
  [STATUS.VERIFIED]: [
    {
      to:           STATUS.ASSIGNED,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.DEPARTMENT_ADMIN],
      description:  'Admin/Dept Admin assigns a department and field worker to the issue',
    },
    {
      to:           STATUS.REJECTED,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.DEPARTMENT_ADMIN],
      description:  'Admin rejects the issue after closer inspection',
    },
  ],

  /**
   * ASSIGNED → ACCEPTED
   * The assigned field worker acknowledges the task and commits to handling it.
   * Only the assigned worker may accept — not any worker.
   */
  [STATUS.ASSIGNED]: [
    {
      to:           STATUS.ACCEPTED,
      allowedRoles: [ROLES.FIELD_WORKER],
      description:  'Assigned field worker accepts the task',
    },
  ],

  /**
   * ACCEPTED → IN_PROGRESS
   * The field worker has arrived on-site and started the repair / resolution.
   */
  [STATUS.ACCEPTED]: [
    {
      to:           STATUS.IN_PROGRESS,
      allowedRoles: [ROLES.FIELD_WORKER],
      description:  'Field worker starts work on-site',
    },
  ],

  /**
   * IN_PROGRESS → PENDING_CITIZEN_VERIFICATION
   * The field worker has completed the work and uploaded before/after proof.
   * The issue now waits for the citizen who reported it to confirm the fix.
   */
  [STATUS.IN_PROGRESS]: [
    {
      to:           STATUS.PENDING_CITIZEN_VERIFICATION,
      allowedRoles: [ROLES.FIELD_WORKER],
      description:  'Field worker marks the task as done; citizen verification pending',
    },
  ],

  /**
   * PENDING_CITIZEN_VERIFICATION → CITIZEN_VERIFIED
   * The reporting citizen has inspected the location and confirmed the issue is resolved.
   *
   * PENDING_CITIZEN_VERIFICATION → REOPENED
   * The citizen is not satisfied with the resolution and requests re-work.
   */
  [STATUS.PENDING_CITIZEN_VERIFICATION]: [
    {
      to:           STATUS.CITIZEN_VERIFIED,
      allowedRoles: [ROLES.CITIZEN, ROLES.SUPER_ADMIN],
      description:  'Citizen confirms the issue has been resolved satisfactorily',
    },
    {
      to:           STATUS.REOPENED,
      allowedRoles: [ROLES.CITIZEN, ROLES.SUPER_ADMIN],
      description:  'Citizen is unsatisfied; issue is sent back for rework',
    },
  ],

  /**
   * CITIZEN_VERIFIED → RESOLVED
   * Admin officially closes the ticket after citizen sign-off.
   */
  [STATUS.CITIZEN_VERIFIED]: [
    {
      to:           STATUS.RESOLVED,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.DEPARTMENT_ADMIN],
      description:  'Admin officially closes the verified-resolved issue',
    },
  ],

  /**
   * REOPENED → ASSIGNED
   * The issue is re-assigned (possibly to the same or a different worker)
   * to address the citizen's concerns.
   */
  [STATUS.REOPENED]: [
    {
      to:           STATUS.ASSIGNED,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.DEPARTMENT_ADMIN],
      description:  'Admin re-assigns the issue to a field worker after citizen rejection',
    },
  ],

  // Terminal states — no outgoing transitions
  [STATUS.REJECTED]:  [],
  [STATUS.RESOLVED]:  [],
});

// ─── Public helpers ───────────────────────────────────────────────────────────

/**
 * getAvailableTransitions(currentStatus, role)
 *
 * Returns the list of transitions available to a given role from a given status.
 * Used by the frontend to decide which action buttons to show.
 */
export const getAvailableTransitions = (currentStatus, role) => {
  const transitions = TRANSITION_MAP[currentStatus] ?? [];
  return transitions.filter((t) => t.allowedRoles.includes(role));
};

/**
 * canTransition(currentStatus, targetStatus, role)
 *
 * Returns { allowed: true } or { allowed: false, reason: '...' }.
 * This is the single enforcement gate — call it before every status update.
 */
export const canTransition = (currentStatus, targetStatus, role) => {
  const transitions = TRANSITION_MAP[currentStatus];

  if (!transitions) {
    return {
      allowed: false,
      reason:  `Status '${currentStatus}' is not a recognised issue status`,
    };
  }

  // Terminal state — no transitions ever allowed
  if (transitions.length === 0) {
    return {
      allowed: false,
      reason:  `Issue is in a terminal state ('${currentStatus}') and cannot be updated`,
    };
  }

  // Find a matching transition by target status
  const match = transitions.find((t) => t.to === targetStatus);

  if (!match) {
    const valid = transitions.map((t) => t.to).join(', ');
    return {
      allowed: false,
      reason:  `Cannot transition from '${currentStatus}' to '${targetStatus}'. ` +
               `Valid next statuses from '${currentStatus}': ${valid}`,
    };
  }

  // Transition exists but this role is not permitted
  if (!match.allowedRoles.includes(role)) {
    return {
      allowed: false,
      reason:  `Role '${role}' cannot perform the transition '${currentStatus}' → '${targetStatus}'. ` +
               `Allowed roles: ${match.allowedRoles.join(', ')}`,
    };
  }

  return { allowed: true, transition: match };
};
