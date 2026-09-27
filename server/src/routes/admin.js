import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ok, fail, paginate } from '../utils/apiResponse.js';
import { upload, cloudinary } from '../config/cloudinary.js';
import { adminCrudRouter } from '../utils/generateAdminCrud.js';
import { nextSequence } from '../models/Counter.js';
import { sendMail } from '../utils/mailer.js';
import { notifyWhatsApp, whatsappRecipients } from '../utils/whatsapp.js';
import { renderCertificate, CERTIFICATE_PLACEHOLDERS, SAMPLE_DATA } from '../utils/certificateImage.js';
import { sendCertificate, templateFor } from '../utils/issueCertificate.js';
import { notifyStudent } from '../utils/courseEnrollment.js';
import mongoose from 'mongoose';
import {
  Program,
  Category,
  Course,
  Story,
  Forum,
  Product,
  ProductRequest,
  StoreExample,
  Resource,
  CertifiedTrainer,
  EmailTemplate,
  Certificate,
  CertificateRequest,
  CertificateTemplate,
  CourseEnrollment,
  FeedbackQuestion,
  CourseFeedback,
  ForumRegistration,
  ProposalRequest,
  Enquiry,
  User,
  Setting,
  Media,
  ExamAttempt,
  Exam,
} from '../models/index.js';

const router = Router();

// ---- Certificate templates and sending ----
// Declared before the generic CRUD mounts so these paths are never mistaken
// for a record id.
const staff = [requireAuth, requireRole('admin', 'editor')];

/** The placeholders a template's text may use, for the editor to list. */
router.get('/certificate-templates/placeholders', ...staff, (req, res) =>
  ok(res, CERTIFICATE_PLACEHOLDERS)
);

/**
 * Renders a template — saved or still being edited — with sample details, or
 * with a real request's, and returns the PNG. The editor's live preview is
 * this image, drawn by the same code that renders the emailed certificate.
 */
router.post(
  '/certificate-templates/preview',
  ...staff,
  asyncHandler(async (req, res) => {
    const { template, requestId, scale } = req.body || {};
    if (!template || typeof template !== 'object') return fail(res, 400, 'Send a template to preview');

    const language = template.language === 'en' ? 'en' : 'ar';
    let data = SAMPLE_DATA[language];
    if (requestId) {
      const request = await CertificateRequest.findById(requestId).populate('program').populate('course');
      if (request) {
        const title = (request.program || request.course)?.title || {};
        data = {
          ...data,
          name: request.fullName,
          email: request.email,
          country: request.country,
          program: title[language] || title.ar || title.en || '',
        };
      }
    }

    const png = await renderCertificate(template, data, {
      scale: Math.min(1, Math.max(0.2, Number(scale) || 0.5)),
    });
    res.set('Content-Type', 'image/png').set('Cache-Control', 'no-store').send(png);
  })
);

/** Emails an issued certificate again — after a failed send, or on request. */
router.post(
  '/certificates/send/:id',
  ...staff,
  asyncHandler(async (req, res) => {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return fail(res, 404, 'Certificate not found');
    const result = await sendCertificate(cert._id);
    if (!result.emailed) return fail(res, 502, result.error);
    ok(res, { number: cert.number, email: cert.email, emailed: true });
  })
);

/** The certificate as an image, for the admin to view or download. */
router.get(
  '/certificates/image/:id',
  ...staff,
  asyncHandler(async (req, res) => {
    const cert = await Certificate.findById(req.params.id).populate('program').populate('course').populate('template');
    if (!cert) return fail(res, 404, 'Certificate not found');
    const template = cert.template || (await templateFor(cert));
    if (!template) return fail(res, 400, 'Create a certificate template first');
    const subject = cert.program || cert.course;
    const title = subject?.title || {};
    const png = await renderCertificate(template, {
      name: cert.holderName,
      email: cert.email,
      program: title[template.language] || title.ar || title.en || '',
      number: cert.number,
      date: cert.issuedAt,
      country: cert.country,
    });
    res.set('Content-Type', 'image/png').send(png);
  })
);

// ---- Course registrations ------------------------------------------------------

const ENROLLMENT_STATUSES = ['pending', 'accepted', 'rejected', 'completed'];

/**
 * Registrations, newest first, filtered by status and course and searchable
 * by the student's name or email (which live on the user, not the record).
 */
router.get(
  '/course-enrollments',
  ...staff,
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const filter = {};
    if (ENROLLMENT_STATUSES.includes(req.query.status)) filter.status = req.query.status;
    if (req.query.course) filter.course = req.query.course;
    if (req.query.q) {
      const rx = new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      const users = await User.find({ $or: [{ name: rx }, { email: rx }] }).select('_id').limit(500);
      filter.user = { $in: users.map((u) => u._id) };
    }
    const [items, total, byStatus] = await Promise.all([
      CourseEnrollment.find(filter)
        .populate('user', 'name email')
        .populate('course', 'slug title code')
        .populate({ path: 'certificateRequest', select: 'status certificate', populate: { path: 'certificate', select: 'number' } })
        .populate('feedback', 'score')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      CourseEnrollment.countDocuments(filter),
      // Counts per status for the tabs, within the course filter only.
      CourseEnrollment.aggregate([
        { $match: req.query.course ? { course: new mongoose.Types.ObjectId(String(req.query.course)) } : {} },
        { $group: { _id: '$status', n: { $sum: 1 } } },
      ]),
    ]);
    const counts = Object.fromEntries(ENROLLMENT_STATUSES.map((s) => [s, 0]));
    byStatus.forEach((row) => (counts[row._id] = row.n));
    ok(res, items, { meta: { page, limit, total, counts } });
  })
);

/**
 * The admin's decision on one registration: accept, reject, mark completed,
 * or return it to pending. The student is told by email (when configured)
 * and always sees it in their account, with the admin's note.
 */
router.post(
  '/course-enrollments/decision/:id',
  ...staff,
  asyncHandler(async (req, res) => {
    const { status, adminNote } = req.body || {};
    if (!ENROLLMENT_STATUSES.includes(status)) return fail(res, 400, 'Unknown status');
    const enrollment = await CourseEnrollment.findById(req.params.id).populate('user', 'name email').populate('course', 'title');
    if (!enrollment) return fail(res, 404, 'Registration not found');
    // A certificate requested or an evaluation given belongs to a completed
    // course; taking the completion back would strand them.
    if (enrollment.status === 'completed' && status !== 'completed' && (enrollment.certificateRequest || enrollment.feedback)) {
      return fail(res, 409, 'This student has already requested the certificate or rated the course');
    }

    enrollment.status = status;
    if (typeof adminNote === 'string') enrollment.adminNote = adminNote.trim().slice(0, 1000);
    if (status === 'accepted' || status === 'rejected') enrollment.decidedAt = new Date();
    if (status === 'completed') {
      enrollment.completedAt = new Date();
      enrollment.decidedAt = enrollment.decidedAt || new Date();
    }
    if (status === 'pending') {
      enrollment.decidedAt = undefined;
      enrollment.completedAt = undefined;
    }
    await enrollment.save();
    notifyStudent(enrollment, enrollment.user, enrollment.course).catch(() => {});
    ok(res, enrollment);
  })
);

/** Marks a course done for everyone accepted onto it, in one step. */
router.post(
  '/course-enrollments/complete-course/:courseId',
  ...staff,
  asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId).select('title');
    if (!course) return fail(res, 404, 'Course not found');
    const enrollments = await CourseEnrollment.find({ course: course._id, status: 'accepted' }).populate('user', 'name email');
    const now = new Date();
    for (const enrollment of enrollments) {
      enrollment.status = 'completed';
      enrollment.completedAt = now;
      await enrollment.save();
      notifyStudent(enrollment, enrollment.user, course).catch(() => {});
    }
    ok(res, { completed: enrollments.length });
  })
);

router.use(
  '/course-enrollments',
  adminCrudRouter(CourseEnrollment, { populate: ['user', 'course'] })
);

// ---- Course evaluation ------------------------------------------------------------

router.use(
  '/feedback-questions',
  adminCrudRouter(FeedbackQuestion, { searchFields: ['label.ar', 'label.en'], populate: ['courses'] })
);

/** Each course that has evaluations: how many, and the average rating. */
router.get(
  '/course-feedback/overview',
  ...staff,
  asyncHandler(async (req, res) => {
    const rows = await CourseFeedback.aggregate([
      { $group: { _id: '$course', responses: { $sum: 1 }, average: { $avg: '$score' }, last: { $max: '$createdAt' } } },
      { $sort: { last: -1 } },
    ]);
    const courses = await Course.find({ _id: { $in: rows.map((r) => r._id) } }).select('title code slug');
    const byId = new Map(courses.map((c) => [String(c._id), c]));
    ok(res, rows.map((r) => ({ course: byId.get(String(r._id)) || null, responses: r.responses, average: r.average, last: r.last })));
  })
);

/**
 * One course's evaluation results: per question, the star average and
 * spread, the count for each option, or the written answers with who wrote
 * them. Questions since edited or retired still report under the wording
 * the students answered.
 */
router.get(
  '/course-feedback/summary/:courseId',
  ...staff,
  asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId).select('title code rating ratingCount');
    if (!course) return fail(res, 404, 'Course not found');
    const feedback = await CourseFeedback.find({ course: course._id }).populate('user', 'name email').sort('-createdAt');

    const byQuestion = new Map();
    for (const f of feedback) {
      for (const a of f.answers) {
        const key = String(a.question || `${a.type}:${a.label?.ar}`);
        if (!byQuestion.has(key)) {
          byQuestion.set(key, { question: a.question, type: a.type, label: a.label, count: 0, sum: 0, distribution: [0, 0, 0, 0, 0], choices: [], texts: [] });
        }
        const q = byQuestion.get(key);
        q.count += 1;
        if (a.type === 'rating') {
          q.sum += a.rating;
          q.distribution[a.rating - 1] += 1;
        } else if (a.type === 'choice') {
          const c = q.choices.find((x) => x.index === a.choice) || q.choices[q.choices.push({ index: a.choice, label: a.choiceLabel, count: 0 }) - 1];
          c.count += 1;
        } else if (a.text) {
          q.texts.push({ text: a.text, name: f.user?.name || '', at: f.createdAt });
        }
      }
    }

    // Report in the admin's current question order, retired ones last.
    const order = await FeedbackQuestion.find({ _id: { $in: [...byQuestion.values()].map((q) => q.question).filter(Boolean) } }).select('order');
    const rank = new Map(order.map((q) => [String(q._id), q.order]));
    const questions = [...byQuestion.values()]
      .map(({ sum, ...q }) => ({ ...q, average: q.type === 'rating' && q.count ? sum / q.count : null, choices: q.choices.sort((a, b) => b.count - a.count) }))
      .sort((a, b) => (rank.get(String(a.question)) ?? 1e9) - (rank.get(String(b.question)) ?? 1e9));

    const scores = feedback.map((f) => f.score).filter((s) => typeof s === 'number');
    ok(res, {
      course,
      responses: feedback.length,
      average: scores.length ? scores.reduce((s, n) => s + n, 0) / scores.length : null,
      questions,
    });
  })
);

router.use(
  '/certificate-templates',
  adminCrudRouter(CertificateTemplate, { searchFields: ['name'], populate: ['programs', 'courses'] })
);

router.use('/programs', adminCrudRouter(Program, { searchFields: ['slug', 'code'], filterFields: ['track'] }));
router.use('/categories', adminCrudRouter(Category, { searchFields: ['slug'] }));
router.use('/courses', adminCrudRouter(Course, { searchFields: ['slug'], populate: ['category', 'program'] }));
router.use('/stories', adminCrudRouter(Story, { searchFields: ['slug', 'country'] }));
router.use('/forums', adminCrudRouter(Forum, { searchFields: ['month', 'city'] }));
router.use('/products', adminCrudRouter(Product, { searchFields: ['slug', 'title.ar', 'title.en', 'url'] }));
router.use('/product-requests', adminCrudRouter(ProductRequest, { searchFields: ['name', 'email', 'itemTitle'], populate: ['product'] }));
router.use('/store-examples', adminCrudRouter(StoreExample, { searchFields: ['url', 'owner', 'country'] }));
router.use('/resources', adminCrudRouter(Resource, { searchFields: ['slug'] }));
router.use('/certified-trainers', adminCrudRouter(CertifiedTrainer, { searchFields: ['name', 'email', 'country'], populate: ['program'] }));
router.use('/email-templates', adminCrudRouter(EmailTemplate, { searchFields: ['name', 'subject'] }));
router.use('/certificates', adminCrudRouter(Certificate, { searchFields: ['number', 'holderName', 'email'], populate: ['program', 'course'] }));
router.use('/certificate-requests', adminCrudRouter(CertificateRequest, { searchFields: ['fullName', 'email'], populate: ['program', 'course', 'certificate'] }));
router.use('/forum-registrations', adminCrudRouter(ForumRegistration, { searchFields: ['fullName', 'email'], populate: ['forum'] }));
router.use('/proposal-requests', adminCrudRouter(ProposalRequest, { searchFields: ['fullName', 'email'] }));
router.use('/enquiries', adminCrudRouter(Enquiry, { searchFields: ['name', 'email'] }));
router.use('/users', adminCrudRouter(User, { searchFields: ['name', 'email'] }));
router.use('/settings', adminCrudRouter(Setting, { searchFields: ['key'] }));
router.use('/exams', adminCrudRouter(Exam, { populate: ['program'] }));

/**
 * Multer/Cloudinary failures reject before the route handler runs, and their
 * message is otherwise lost behind a generic 500. Surface the real reason so
 * a misconfigured upload is diagnosable from the client.
 */
function uploadSingle(field) {
  return (req, res, next) => {
    upload.single(field)(req, res, (err) => {
      if (!err) return next();
      const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 413 : 400);
      console.error('Media upload failed:', err);
      return fail(res, status, err.message || 'Upload failed');
    });
  };
}

router.post(
  '/media/upload',
  requireAuth,
  requireRole('admin', 'editor'),
  uploadSingle('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) return fail(res, 400, 'No file uploaded');
    const { ar = '', en = '' } = req.body;
    if (!ar || !en) return fail(res, 400, 'Bilingual alt text (ar and en) is required');
    const media = await Media.create({
      cloudinaryId: req.file.filename,
      url: req.file.path,
      format: req.file.format || '',
      width: req.file.width || 0,
      height: req.file.height || 0,
      alt: { ar, en },
      folder: req.query.folder || 'siyb/misc',
      uploadedBy: req.user._id,
    });
    ok(res, media);
  })
);

router.delete(
  '/media/:id',
  requireAuth,
  requireRole('admin', 'editor'),
  asyncHandler(async (req, res) => {
    const media = await Media.findById(req.params.id);
    if (!media) return fail(res, 404, 'Not found');
    await cloudinary.uploader.destroy(media.cloudinaryId);
    await media.deleteOne();
    ok(res, { deleted: true });
  })
);

router.get(
  '/stats',
  requireAuth,
  requireRole('admin', 'editor'),
  asyncHandler(async (req, res) => {
    const [pendingCertRequests, pendingEnrollments, pendingForumRegs, unhandledEnquiries, totalCertificates] = await Promise.all([
      CertificateRequest.countDocuments({ status: 'pending' }),
      CourseEnrollment.countDocuments({ status: 'pending' }),
      ForumRegistration.countDocuments({ status: 'pending' }),
      Enquiry.countDocuments({ handled: false }),
      Certificate.countDocuments(),
    ]);
    ok(res, { pendingCertRequests, pendingEnrollments, pendingForumRegs, unhandledEnquiries, totalCertificates });
  })
);

router.post(
  '/certificates/issue-from-attempt/:attemptId',
  requireAuth,
  requireRole('admin', 'editor'),
  asyncHandler(async (req, res) => {
    const attempt = await ExamAttempt.findById(req.params.attemptId).populate({ path: 'exam', populate: 'program' }).populate('user');
    if (!attempt || !attempt.passed) return fail(res, 400, 'Attempt not found or not passed');
    const year = new Date().getFullYear();
    const seq = String(await nextSequence(`certificate-${year}`)).padStart(5, '0');
    const number = `SIYB-${year}-${seq}`;
    const cert = await Certificate.create({
      number,
      holderName: attempt.user.name,
      program: attempt.exam.program._id,
      user: attempt.user._id,
      examAttempt: attempt._id,
    });
    ok(res, cert);
  })
);

router.post(
  '/certificates/:id/revoke',
  requireAuth,
  requireRole('admin', 'editor'),
  asyncHandler(async (req, res) => {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return fail(res, 404, 'Not found');
    cert.status = 'revoked';
    cert.revokedReason = req.body.reason || '';
    await cert.save();
    ok(res, cert);
  })
);

/**
 * Sends a test message with whatever email settings are currently saved, so
 * credentials can be proved from the panel rather than by waiting for a real
 * enquiry to go missing.
 */
router.post(
  '/integrations/test-email',
  requireAuth,
  requireRole('admin', 'editor'),
  asyncHandler(async (req, res) => {
    const to = (req.body?.to || '').trim();
    if (!to) return fail(res, 400, 'Enter an address to send to');

    try {
      await sendMail({
        to,
        subject: 'SIYB — test email',
        text: 'This is a test message from the SIYB admin panel. Your email settings work.',
      });
      ok(res, { sent: true });
    } catch (err) {
      // The SMTP error names the host and sometimes the user, which the admin
      // needs in order to fix it — this route is already admin-only.
      return fail(res, 502, err.message || 'Could not send the message');
    }
  })
);

/** Sends a test WhatsApp message to every configured number at once. */
router.post(
  '/integrations/test-whatsapp',
  requireAuth,
  requireRole('admin', 'editor'),
  asyncHandler(async (req, res) => {
    if (!(await whatsappRecipients()).length) {
      return fail(res, 400, 'Add at least one number with its API key, then save');
    }
    const result = await notifyWhatsApp('SIYB — test message. Shop requests will arrive here.');
    // Each failure names its number and CallMeBot's reason, which the admin
    // needs to fix it — this route is already admin-only.
    if (!result.sent) return fail(res, 502, result.failed.join(' · '));
    ok(res, result);
  })
);

export default router;
