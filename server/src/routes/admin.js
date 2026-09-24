import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ok, fail } from '../utils/apiResponse.js';
import { upload, cloudinary } from '../config/cloudinary.js';
import { adminCrudRouter } from '../utils/generateAdminCrud.js';
import { nextSequence } from '../models/Counter.js';
import { sendMail } from '../utils/mailer.js';
import { notifyWhatsApp, whatsappRecipients } from '../utils/whatsapp.js';
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

router.use('/programs', adminCrudRouter(Program, { searchFields: ['slug', 'code'], filterFields: ['track'] }));
router.use('/categories', adminCrudRouter(Category, { searchFields: ['slug'] }));
router.use('/courses', adminCrudRouter(Course, { searchFields: ['slug'], populate: ['category', 'program'] }));
router.use('/stories', adminCrudRouter(Story, { searchFields: ['slug', 'country'] }));
router.use('/forums', adminCrudRouter(Forum, { searchFields: ['month', 'city'] }));
router.use('/products', adminCrudRouter(Product, { searchFields: ['slug', 'category'], populate: ['owner'] }));
router.use('/product-requests', adminCrudRouter(ProductRequest, { searchFields: ['name', 'email', 'itemTitle'], populate: ['product'] }));
router.use('/store-examples', adminCrudRouter(StoreExample, { searchFields: ['url', 'owner', 'country'] }));
router.use('/resources', adminCrudRouter(Resource, { searchFields: ['slug'] }));
router.use('/certified-trainers', adminCrudRouter(CertifiedTrainer, { searchFields: ['name', 'email', 'country'], populate: ['program'] }));
router.use('/email-templates', adminCrudRouter(EmailTemplate, { searchFields: ['name', 'subject'] }));
router.use('/certificates', adminCrudRouter(Certificate, { searchFields: ['number', 'holderName'], populate: ['program'] }));
router.use('/certificate-requests', adminCrudRouter(CertificateRequest, { searchFields: ['fullName', 'email'], populate: ['program', 'certificate'] }));
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
    const [pendingCertRequests, pendingForumRegs, unhandledEnquiries, pendingProductRequests, totalCertificates] = await Promise.all([
      CertificateRequest.countDocuments({ status: 'pending' }),
      ForumRegistration.countDocuments({ status: 'pending' }),
      Enquiry.countDocuments({ handled: false }),
      ProductRequest.countDocuments({ status: 'pending' }),
      Certificate.countDocuments(),
    ]);
    ok(res, { pendingCertRequests, pendingForumRegs, unhandledEnquiries, pendingProductRequests, totalCertificates });
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
