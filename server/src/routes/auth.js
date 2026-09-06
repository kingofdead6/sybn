import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ok, fail } from '../utils/apiResponse.js';
import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/index.js';

const router = Router();

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, locale } = req.body;
  if (!name || !email || !password) return fail(res, 400, 'Name, email and password are required');
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return fail(res, 409, 'An account with this email already exists');
  const user = new User({ name, email: email.toLowerCase(), locale });
  await user.setPassword(password);
  await user.save();
  const token = signToken(user);
  res.cookie('token', token, COOKIE_OPTS);
  ok(res, user.toSafeJSON());
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user || !(await user.checkPassword(password || ''))) {
    return fail(res, 401, 'Invalid email or password');
  }
  const token = signToken(user);
  res.cookie('token', token, COOKIE_OPTS);
  ok(res, user.toSafeJSON());
}));

router.post('/logout', (req, res) => {
  res.clearCookie('token', COOKIE_OPTS);
  ok(res, { loggedOut: true });
});

router.post('/refresh', requireAuth, (req, res) => {
  const token = signToken(req.user);
  res.cookie('token', token, COOKIE_OPTS);
  ok(res, req.user.toSafeJSON());
});

router.get('/me', requireAuth, (req, res) => {
  ok(res, req.user.toSafeJSON());
});

export default router;
