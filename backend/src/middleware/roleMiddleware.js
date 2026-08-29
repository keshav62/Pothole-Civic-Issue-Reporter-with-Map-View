/**
 * authorizeRoles(...allowedRoles)
 *
 * Factory that returns an Express middleware.
 * Must always run AFTER the protect middleware so that req.user is available.
 *
 * Usage:
 *   router.get('/admin/users', protect, authorizeRoles('SUPER_ADMIN'), getUsers);
 *   router.patch('/issues/:id/assign', protect, authorizeRoles('SUPER_ADMIN', 'DEPARTMENT_ADMIN'), assignIssue);
 *
 * The role is read from req.user (the MongoDB document attached by protect).
 * We never read, trust, or inspect anything sent by the frontend.
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // protect middleware must have already populated req.user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not permitted to perform this action`,
      });
    }

    next();
  };
};

