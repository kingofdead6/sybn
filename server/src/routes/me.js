import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ok, fail } from '../utils/apiResponse.js';
import { requireAuth } from '../middleware/auth.js';
import {
  Certificate,
  CertificateRequest,
  Course,
  CourseEnrollment,
  CourseFeedback,
  ForumRegistration,
  ExamAttempt,
  Exam,
} from '../models/index.js';
import { questionsFor, buildAnswers, scoreOf, recomputeCourseRating } from '../utils/courseEnrollment.js';
import { notifyAdmin } from '../utils/mailer.js';
import { cleanFormAnswers } from '../utils/formAnswers.js';

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
  const items = await Certificate.find({ user: req.user._id }).populate('program').populate('course').sort('-issuedAt');
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

// ---- Course registrations ----------------------------------------------------

/** The account's own registration, or a 404 — never another user's. */
async function ownEnrollment(req, res) {
  const enrollment = await CourseEnrollment.findOne({ _id: req.params.id, user: req.user._id });
  if (!enrollment) fail(res, 404, 'Registration not found');
  return enrollment;
}

/** Every course this account registered for, with where each stands. */
router.get('/enrollments', asyncHandler(async (req, res) => {
  const items = await CourseEnrollment.find({ user: req.user._id })
    .populate('course', 'slug title code image')
    .populate({ path: 'certificateRequest', select: 'status certificate createdAt', populate: { path: 'certificate', select: 'number issuedAt status' } })
    .populate('feedback', 'createdAt score')
    .sort('-updatedAt');
  ok(res, items);
}));

/** This account's registration for one course, for the course page (or null). */
router.get('/enrollments/course/:courseId', asyncHandler(async (req, res) => {
  const item = await CourseEnrollment.findOne({ user: req.user._id, course: req.params.courseId });
  ok(res, item);
}));

/**
 * Registers for a course. Registering again after a rejection reopens the
 * same record as pending; any other existing registration is left as it is.
 */
router.post('/enrollments', asyncHandler(async (req, res) => {
  const { courseId, message = '', answers = {} } = req.body || {};
  const course = await Course.findOne({ _id: courseId, published: true });
  if (!course) return fail(res, 404, 'Course not found');

  const existing = await CourseEnrollment.findOne({ user: req.user._id, course: course._id });
  if (existing && existing.status !== 'rejected') {
    return fail(res, 409, 'You are already registered for this course');
  }

  // The course's own settings: open or closed, and how many seats.
  if (course.enrollmentOpen === false) return fail(res, 400, 'Registration for this course is closed');
  if (course.capacity > 0) {
    const taken = await CourseEnrollment.countDocuments({ course: course._id, status: { $in: ['accepted', 'completed'] } });
    if (taken >= course.capacity) return fail(res, 400, 'This course is full');
  }

  // The admin's own fields for this course, checked and kept as declared.
  let clean;
  try {
    clean = cleanFormAnswers(course.formFields || [], answers);
  } catch (err) {
    return fail(res, err.status || 400, err.message);
  }
  const note = course.askMessage === false ? '' : String(message).slice(0, 1000);

  if (existing) {
    // Registering again after a rejection reopens the same record.
    existing.status = 'pending';
    existing.message = note;
    existing.answers = clean;
    existing.adminNote = '';
    existing.decidedAt = undefined;
    await existing.save();
    return ok(res, existing);
  }

  const item = await CourseEnrollment.create({
    user: req.user._id,
    course: course._id,
    message: note,
    answers: clean,
  });
  ok(res, item);
}));

/** Withdraws a registration the admin has not decided on yet. */
router.delete('/enrollments/:id', asyncHandler(async (req, res) => {
  const enrollment = await ownEnrollment(req, res);
  if (!enrollment) return;
  if (enrollment.status !== 'pending') return fail(res, 400, 'Only a registration still under review can be withdrawn');
  await enrollment.deleteOne();
  ok(res, { deleted: true });
}));

/** The evaluation form for a completed course. */
router.get('/enrollments/:id/feedback-form', asyncHandler(async (req, res) => {
  const enrollment = await ownEnrollment(req, res);
  if (!enrollment) return;
  if (enrollment.status !== 'completed') return fail(res, 400, 'The course is not completed yet');
  const questions = await questionsFor(enrollment.course);
  ok(res, { questions, submitted: !!enrollment.feedback });
}));

/** Submits the evaluation — once per registration. */
router.post('/enrollments/:id/feedback', asyncHandler(async (req, res) => {
  const enrollment = await ownEnrollment(req, res);
  if (!enrollment) return;
  if (enrollment.status !== 'completed') return fail(res, 400, 'The course is not completed yet');
  if (enrollment.feedback) return fail(res, 409, 'You have already rated this course');

  let answers;
  try {
    answers = await buildAnswers(enrollment.course, req.body?.answers || {});
  } catch (err) {
    return fail(res, err.status || 400, err.message);
  }

  const feedback = await CourseFeedback.create({
    user: req.user._id,
    course: enrollment.course,
    enrollment: enrollment._id,
    answers,
    score: scoreOf(answers),
  });
  enrollment.feedback = feedback._id;
  await enrollment.save();
  await recomputeCourseRating(enrollment.course);
  ok(res, { submitted: true });
}));

/**
 * Requests the certificate for a completed course. The email is the account's
 * own, so the certificate reaches the person who took the course; the name is
 * theirs to give as it should appear on the certificate.
 */
router.post('/enrollments/:id/certificate-request', asyncHandler(async (req, res) => {
  const enrollment = await ownEnrollment(req, res);
  if (!enrollment) return;
  if (enrollment.status !== 'completed') return fail(res, 400, 'The course is not completed yet');
  if (enrollment.certificateRequest) return fail(res, 409, 'You have already requested this certificate');

  const { fullName, whatsapp, country } = req.body || {};
  if (!fullName?.trim() || !whatsapp?.trim() || !country?.trim()) {
    return fail(res, 400, 'Fill in your name, WhatsApp number and country');
  }

  const request = await CertificateRequest.create({
    fullName: fullName.trim().slice(0, 200),
    email: req.user.email,
    whatsapp: whatsapp.trim().slice(0, 50),
    country: country.trim().slice(0, 100),
    user: req.user._id,
    course: enrollment.course,
    enrollment: enrollment._id,
  });
  enrollment.certificateRequest = request._id;
  await enrollment.save();
  notifyAdmin(
    'New certificate request (course)',
    `From: ${request.fullName} <${request.email}>`
  ).catch(() => {});
  ok(res, request);
}));

export default router;
