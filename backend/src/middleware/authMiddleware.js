import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * protect
 *
 * Verifies the JWT token sent in the Authorization header,
 * looks up the corresponding MongoDB user, and attaches it to req.user.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Read and validate the Authorization header format
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // 2. Extract the raw token
        token = req.headers.authorization.split(' ')[1];

        // 3. Verify the JWT
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'fallback_secret_12345'
        );

        // 4. Find the user in DB (excluding password)
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'Unauthorized: User not found',
          });
        }

        // 5. Reject deactivated accounts
        if (!req.user.isActive) {
          return res.status(401).json({
            success: false,
            message: 'Unauthorized: Account is deactivated',
          });
        }

        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Token failed or expired',
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided',
      });
    }
  } catch (error) {
    next(error);
  }
};
