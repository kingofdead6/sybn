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
import adminRoutes from './routes/admin.js';
import seoRoutes from './routes/seo.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(compression());
const devOrigins = ['http://localhost:5173', 'http://localhost:4173'];
const allowedOrigins = process.env.NODE_ENV === 'production' ? [process.env.CLIENT_URL] : [process.env.CLIENT_URL, ...devOrigins];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
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
app.use('/api/v1/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
