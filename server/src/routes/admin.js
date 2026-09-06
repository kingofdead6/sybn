import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ok, fail } from '../utils/apiResponse.js';
import { upload, cloudinary } from '../config/cloudinary.js';
import { adminCrudRouter } from '../utils/generateAdminCrud.js';
import {
  Program,
  Category,
  Course,
  TeamMember,
  Story,
  Forum,
  Product,
  Order,
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

router.use('/programs', adminCrudRouter(Program, { searchFields: ['slug', 'code'] }));
router.use('/categories', adminCrudRouter(Category, { searchFields: ['slug'] }));
router.use('/courses', adminCrudRouter(Course, { searchFields: ['slug'], populate: ['category', 'program'] }));
router.use('/team', adminCrudRouter(TeamMember, { searchFields: ['slug', 'country'] }));
router.use('/stories', adminCrudRouter(Story, { searchFields: ['slug', 'country'] }));
router.use('/forums', adminCrudRouter(Forum, { searchFields: ['month', 'city'] }));
router.use('/products', adminCrudRouter(Product, { searchFields: ['slug', 'category'], populate: ['owner'] }));
router.use('/orders', adminCrudRouter(Order, {}));
router.use('/certificates', adminCrudRouter(Certificate, { searchFields: ['number', 'holderName'], populate: ['program'] }));
router.use('/certificate-requests', adminCrudRouter(CertificateRequest, { searchFields: ['fullName', 'email'], populate: ['program', 'certificate'] }));
router.use('/forum-registrations', adminCrudRouter(ForumRegistration, { searchFields: ['fullName', 'email'], populate: ['forum'] }));
router.use('/proposal-requests', adminCrudRouter(ProposalRequest, { searchFields: ['fullName', 'email'] }));
router.use('/enquiries', adminCrudRouter(Enquiry, { searchFields: ['name', 'email'] }));
router.use('/users', adminCrudRouter(User, { searchFields: ['name', 'email'] }));
router.use('/settings', adminCrudRouter(Setting, { searchFields: ['key'] }));
router.use('/exams', adminCrudRouter(Exam, { populate: ['program'] }));

router.post(
  '/media/upload',
  requireAuth,
  requireRole('admin', 'editor'),
  upload.single('file'),
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
    const [pendingCertRequests, pendingForumRegs, unhandledEnquiries, pendingOrders, totalCertificates] = await Promise.all([
      CertificateRequest.countDocuments({ status: 'pending' }),
      ForumRegistration.countDocuments({ status: 'pending' }),
      Enquiry.countDocuments({ handled: false }),
      Order.countDocuments({ status: 'pending' }),
      Certificate.countDocuments(),
    ]);
    ok(res, { pendingCertRequests, pendingForumRegs, unhandledEnquiries, pendingOrders, totalCertificates });
  })
);

router.post(
  '/certificates/issue-from-attempt/:attemptId',
  requireAuth,
  requireRole('admin', 'editor'),
  asyncHandler(async (req, res) => {
    const attempt = await ExamAttempt.findById(req.params.attemptId).populate({ path: 'exam', populate: 'program' }).populate('user');
    if (!attempt || !attempt.passed) return fail(res, 400, 'Attempt not found or not passed');
    const seq = String((await Certificate.countDocuments()) + 1).padStart(5, '0');
    const number = `SIYB-${new Date().getFullYear()}-${seq}`;
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

export default router;
