import { Router } from 'express';
import { session, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/auth/session
// Called by the frontend after every Firebase login.
// Verifies the ID token, upserts the MongoDB user, returns the CivicConnect profile.
// No protect middleware here — the controller verifies the token itself.
router.post('/session', session);

// GET /api/auth/me
// Returns the currently authenticated user's profile.
// Requires a valid Firebase ID token via the protect middleware.
router.get('/me', protect, getMe);

export default router;

