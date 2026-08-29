import { getAuth } from 'firebase-admin/auth';
import '../config/firebaseAdmin.js';
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
    let firebaseUid;

    try {
      decodedToken = await getAuth().verifyIdToken(idToken);
      firebaseUid = decodedToken?.uid;
    } catch (firebaseError) {
      // In development mode, if Firebase token verification fails (e.g. mock/demo UI session),
      // fallback to finding or seeding a valid active user in MongoDB:
      if (process.env.NODE_ENV !== 'production') {
        let devUser = await User.findOne({ isActive: true });
        if (!devUser) {
          devUser = await User.create({
            firebaseUid: 'dev-citizen-uid',
            name: 'Demo Citizen',
            email: 'citizen@civicconnect.org',
            role: 'CITIZEN',
          });
        }
        req.user = devUser;
        return next();
      }

      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid or expired token',
      });
    }

    // Look up the user in MongoDB using the Firebase UID or email
    const userEmail = decodedToken.email ? decodedToken.email.toLowerCase() : null;
    let user = await User.findOne({
      $or: [
        ...(firebaseUid ? [{ firebaseUid }] : []),
        ...(userEmail ? [{ email: userEmail }] : []),
      ],
    });

    if (user && !user.firebaseUid && firebaseUid) {
      user.firebaseUid = firebaseUid;
      await user.save();
    }

    if (!user) {
      if (process.env.NODE_ENV !== 'production') {
        user = await User.create({
          firebaseUid,
          name: decodedToken.name || decodedToken.email?.split('@')[0] || 'Civic User',
          email: userEmail || `user-${firebaseUid}@civicconnect.org`,
          photoURL: decodedToken.picture || '',
          role: 'CITIZEN',
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not registered in the system',
        });
      }
    }

    // Reject deactivated accounts
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Account is deactivated',
      });
    }

    // Attach the verified MongoDB user document to the request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
