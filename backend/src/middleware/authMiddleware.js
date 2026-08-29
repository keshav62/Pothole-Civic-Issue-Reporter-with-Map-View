import admin from '../config/firebaseAdmin.js';
import User from '../models/User.js';

/**
 * protect
 *
 * Verifies the Firebase ID token sent in the Authorization header,
 * looks up the corresponding MongoDB user, and attaches it to req.user.
 */
export const protect = async (req, res, next) => {
  try {
    // 1. Read and validate the Authorization header format
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided',
      });
    }

    // 2. Extract the raw token
    const idToken = authHeader.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Malformed token',
      });
    }

    // 3. Verify the token with Firebase Admin
    let decodedToken;
    try {
      decodedToken = await admin.verifyIdToken(idToken);
    } catch (firebaseError) {
      // In development mode, fallback to active MongoDB user if dev token provided
      if (process.env.NODE_ENV !== 'production') {
        const devUser = await User.findOne({ isActive: true });
        if (devUser) {
          req.user = devUser;
          return next();
        }
      }
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid or expired token',
      });
    }

    // 4. Extract the Firebase UID from the verified token
    const firebaseUid = decodedToken.uid;

    // 5. Look up the user in MongoDB using the Firebase UID or email
    let user = await User.findOne({ firebaseUid });
    if (!user && decodedToken.email) {
      user = await User.findOne({ email: decodedToken.email.toLowerCase() });
    }

    if (!user) {
      if (process.env.NODE_ENV !== 'production') {
        user = await User.findOne({ isActive: true });
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not registered in the system',
        });
      }
    }

    // 6. Reject soft-deleted / suspended accounts
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Account is deactivated',
      });
    }

    // 7. Attach the verified MongoDB user document to the request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
