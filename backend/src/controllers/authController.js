import admin from '../config/firebaseAdmin.js';
import User from '../models/User.js';

/**
 * POST /api/auth/session
 *
 * Called by the frontend immediately after Firebase login or signup.
 * The raw Firebase ID token is sent in the Authorization header.
 *
 * Flow:
 *  1. Verify the Firebase ID token with Firebase Admin SDK.
 *  2. Extract uid, email, name, photoURL from token or request body fallback.
 *  3. Find the matching MongoDB user by firebaseUid or email.
 *  4. If signup -> create user document in MongoDB.
 *  5. If login and user not found -> return 404 (prompting redirect to signup).
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
    const { name: bodyName, role: bodyRole, department, ward, phone, email: bodyEmail, isSignup } = req.body || {};

    // --- 2. Verify the Firebase ID token ---
    let decodedToken;
    try {
      decodedToken = await admin.verifyIdToken(idToken);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production' && (bodyEmail || bodyName)) {
        const fallbackEmail = (bodyEmail || 'user@civicconnect.org').toLowerCase();
        decodedToken = {
          uid: `dev-user-${fallbackEmail.replace(/[^a-z0-9]/g, '')}`,
          email: fallbackEmail,
          name: bodyName || fallbackEmail.split('@')[0],
          picture: ''
        };
      } else {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Invalid or expired token',
        });
      }
    }

    const { uid, email, name, picture } = decodedToken;
    const inputTerm = (bodyEmail || email || '').trim();

    if (!inputTerm) {
      return res.status(400).json({
        success: false,
        message: 'Email address or username is required for session authentication',
      });
    }

    const targetEmail = inputTerm.toLowerCase();
    const searchRegex = new RegExp(`^${inputTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');

    // --- 3. Find existing user by firebaseUid, email, OR username/name ---
    let user = await User.findOne({
      $or: [
        { firebaseUid: uid },
        { email: targetEmail },
        { email: searchRegex },
        { name: searchRegex }
      ]
    });

    // --- 4. User registration vs login check ---
    if (!user) {
      // If registration fields are present, create user in MongoDB
      if (bodyName || bodyRole || isSignup) {
        user = await User.create({
          firebaseUid: uid,
          name: bodyName || name || targetEmail.split('@')[0] || 'Civic User',
          email: targetEmail,
          photoURL: picture || '',
          role: bodyRole || 'CITIZEN',
          department: department || null,
          ward: ward || null,
          phone: phone || null,
        });
      } else {
        // User not found during Login -> Return 404
        return res.status(404).json({
          success: false,
          message: 'User account not found in database. Please sign up first.',
        });
      }
    } else {
      // Update firebaseUid if changed
      if (user.firebaseUid !== uid && !uid.startsWith('dev-user-')) {
        user.firebaseUid = uid;
        await user.save();
      }
    }

    // --- 5. Block inactive accounts ---
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Your account has been deactivated. Contact support.',
      });
    }

    // --- 6. Return the stored CivicConnect profile ---
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
