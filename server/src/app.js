import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import publicRoutes from './routes/public.js';
import authRoutes from './routes/auth.js';
import meRoutes from './routes/me.js';
import examRoutes from './routes/exams.js';
import aiRoutes from './routes/ai.js';
import trainerRoutes from './routes/trainers.js';
import adminRoutes from './routes/admin.js';
import seoRoutes from './routes/seo.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

/*
 * Render (like most hosts) terminates TLS at a proxy and forwards plain HTTP
 * to the app. Without this, Express sees an insecure connection and will not
 * set a `Secure` cookie — so login would appear to succeed while no session
 * cookie ever reached the browser. It also makes the rate limiter key on the
 * real client IP rather than the proxy's.
 */
app.set('trust proxy', 1);

app.use(helmet());
app.use(compression());
/*
 * Which sites may call this API with credentials.
 *
 * `CLIENT_URL` accepts a comma-separated list, so a production domain and a
 * preview deployment can both be allowed. Values are normalised by trimming a
 * trailing slash: an origin header never has one, so `https://example.com/`
 * in the environment would otherwise never match and every request would fail
 * CORS with no clue as to why.
 */
const devOrigins = ['http://localhost:5173', 'http://localhost:4173'];

const normalise = (value) => (value || '').trim().replace(/\/+$/, '');

const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(normalise)
  .filter(Boolean);

const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? configuredOrigins
    : [...configuredOrigins, ...devOrigins];

if (allowedOrigins.length === 0) {
  console.warn('[cors] CLIENT_URL is not set — every cross-origin request will be rejected.');
}

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header: same-origin, curl, or a server-to-server call.
      if (!origin || allowedOrigins.includes(normalise(origin))) return callback(null, true);
      // Logged rather than thrown: an unknown origin is a configuration
      // problem, and a thrown error here surfaces as an opaque 500 instead of
      // a plain CORS refusal the browser can report properly.
      console.warn(`[cors] refused origin: ${origin} (allowed: ${allowedOrigins.join(', ') || 'none'})`);
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

const globalLimiter = rateLimit({ windowMs: 60 * 1000, max: 300 });
app.use('/api', globalLimiter);

app.get('/api/health', (req, res) => res.json({ success: true, data: { status: 'ok' }, error: null }));
app.use('/', seoRoutes);

app.use('/api/v1', publicRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/me', meRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/admin/trainers', trainerRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
