import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ok, fail } from '../utils/apiResponse.js';
import { requireAuth } from '../middleware/auth.js';
import {
  Certificate,
  CertificateRequest,
  ForumRegistration,
  ExamAttempt,
  Exam,
} from '../models/index.js';

const router = Router();
router.use(requireAuth);

/**
 * Certificate requests this account has made.
 *
 * Matched by the linked user and, as a fallback, by email — so requests made
 * before the account existed, or while signed out under the same address,
 * still surface on the dashboard rather than disappearing.
 */
router.get('/requests', asyncHandler(async (req, res) => {
  const items = await CertificateRequest.find({
    $or: [{ user: req.user._id }, { email: req.user.email }],
  })
    .populate('program', 'slug title code')
    .populate('course', 'slug title code')
    .populate('certificate')
    .sort('-createdAt');
  ok(res, items);
}));

router.get('/certificates', asyncHandler(async (req, res) => {
  const items = await Certificate.find({ user: req.user._id }).populate('program').sort('-issuedAt');
  ok(res, items);
}));

router.get('/bookings', asyncHandler(async (req, res) => {
  // Match by linked user first (registrations made while logged in), and
  // also by email as a fallback for registrations made before this account
  // existed or without being signed in under the same address.
  const items = await ForumRegistration.find({
    $or: [{ user: req.user._id }, { email: req.user.email }],
  })
    .populate('forum')
    .sort('-createdAt');
  ok(res, items);
}));

router.get('/attempts', asyncHandler(async (req, res) => {
  const items = await ExamAttempt.find({ user: req.user._id }).populate({ path: 'exam', populate: 'program' }).sort('-createdAt');
  ok(res, items);
}));

export default router;
