import { Router } from 'express';
import { register, login, getMe, demoLogin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/auth/register
// Registers a new user and returns a JWT
router.post('/register', register);

// POST /api/auth/login
// Authenticates a user and returns a JWT
router.post('/login', login);

// POST /api/auth/demo-login
// Generates a JWT for a demo role
router.post('/demo-login', demoLogin);

// GET /api/auth/me
// Returns the currently authenticated user's profile.
// Requires a valid JWT token via the protect middleware.
router.get('/me', protect, getMe);

export default router;
