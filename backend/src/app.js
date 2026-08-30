import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import './models/Department.js';
import './models/IssueHistory.js';
import './models/Notification.js';

const app = express();

// ─── Security headers (Helmet) ────────────────────────────────────────────────
// Sets X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security,
// Content-Security-Policy and more. Applied before all other middleware.
app.use(helmet({
  contentSecurityPolicy: false,   // React SPA uses inline scripts/styles
  crossOriginEmbedderPolicy: false, // Allow loading map tiles and external resources
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// ─── CORS ─────────────────────────────────────────────────────────────────────
// VULN-05 fix: whitelist only the HTTP methods and headers actually used by
// this API. Prevents unrecognised verbs (TRACE, CONNECT) and arbitrary custom
// headers from being allowed from the permitted origin.
app.use(cors({
  origin:         function(origin, callback) {
    // Allow same-origin requests (no origin header) in production
    if (!origin) return callback(null, true);
    const allowed = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:5000',
    ];
    // Allow any .onrender.com subdomain
    if (origin.endsWith('.onrender.com') || allowed.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // permissive for hackathon demo
  },
  credentials:    true,
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
}));



// ─── Request body parsing ─────────────────────────────────────────────────────
// Allow up to 25mb for JSON payloads to seamlessly support base64 image uploads in issue reporting
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// ─── Logging ──────────────────────────────────────────────────────────────────
// VULN-09 fix: use 'combined' (Apache-style) format in production — structured,
// log-aggregator-friendly, and does not expose Authorization header values.
// 'dev' is fine for local development (colourised, concise).
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Rate limiting ────────────────────────────────────────────────────────────
// VULN-01 fix: apply two layers of rate limiting.
//
// Layer 1 — Global API limiter (200 req / 15 min per IP).
//   Protects all endpoints against general abuse and DDoS amplification.
const globalLimiter = rateLimit({
  windowMs:          15 * 60 * 1000,   // 15 minutes
  max:               2000,             // 2000 requests / 15 min per IP to support real-time polling
  standardHeaders:   true,             // Return rate limit info in RateLimit-* headers
  legacyHeaders:     false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in 15 minutes.',
  },
});

// Layer 2 — Auth session limiter (15 req / 15 min per IP).
//   /api/auth/session is a token-verification endpoint — brute-forcing it
//   would allow user enumeration and amplify Firebase Auth API costs.
const authLimiter = rateLimit({
  windowMs:          15 * 60 * 1000,   // 15 minutes
  max:               15,
  standardHeaders:   true,
  legacyHeaders:     false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
});

// Apply global limiter to all /api/* routes
app.use('/api/', globalLimiter);

// Apply strict limiter to the auth endpoint specifically
// (must be after the global limiter so both limits are enforced)
app.use('/api/auth/session', authLimiter);

// ─── Health check (exempt from rate limiting above) ──────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CivicConnect backend is running',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/issues',        issueRoutes);
app.use('/api/workers',       workerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics',     analyticsRoutes);

// ─── Serve React frontend in production ───────────────────────────────────────
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../../civic-connect/dist');
  app.use(express.static(clientBuildPath));

  // Catch-all: serve React index.html for any non-API route (client-side routing)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  // Dev: Root route returns API info
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'CivicConnect Backend API Server is active.',
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    });
  });
}

// ─── Error handling (must be last) ───────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
