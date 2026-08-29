import admin from '../config/firebaseAdmin.js';
import User from '../models/User.js';

/**
 * POST /api/auth/session
 *
 * Called by the frontend immediately after a successful Firebase login.
 * The raw Firebase ID token is sent in the Authorization header.
 *
 * Flow:
 *  1. Verify the Firebase ID token with Firebase Admin SDK.
 *  2. Extract uid, email, name, photoURL from the verified token.
 *  3. Find the matching MongoDB user by firebaseUid.
 *  4. If no user exists → create one with role CITIZEN (never trust role from client).
 *  5. If user exists but is inactive → reject with 403.
 *  6. Return the CivicConnect user profile.
 */
export const session = async (req, res, next) => {
  try {
    // --- 1. Read and validate the Authorization header ---
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided',
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    // --- 2. Verify the Firebase ID token ---
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid or expired token',
      });
    }

    const { uid, email, name, picture } = decodedToken;

    // --- 3. Find existing user ---
    let user = await User.findOne({ firebaseUid: uid });

    // --- 4. New user: create with role CITIZEN ---
    //        Regardless of anything the frontend may have sent in the body,
    //        the role is always set server-side.
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        photoURL: picture || '',
        role: 'CITIZEN',   // hardcoded — frontend cannot override this
      });
    }

    // --- 5. Block inactive accounts ---
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Your account has been deactivated. Contact support.',
      });
    }

    // --- 6. Return the CivicConnect profile ---
    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: {
        user: {
          id: user._id,
          firebaseUid: user.firebaseUid,
          name: user.name,
          email: user.email,
          phone: user.phone || null,
          photoURL: user.photoURL,
          role: user.role,
          department: user.department || null,
          ward: user.ward || null,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 *
 * Returns the currently authenticated user's profile.
 * Requires the protect middleware — req.user is already populated.
 */
export const getMe = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'User profile fetched',
    data: {
      user: {
        id: req.user._id,
        firebaseUid: req.user.firebaseUid,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || null,
        photoURL: req.user.photoURL,
        role: req.user.role,
        department: req.user.department || null,
        ward: req.user.ward || null,
        isActive: req.user.isActive,
        createdAt: req.user.createdAt,
      },
    },
  });
};

