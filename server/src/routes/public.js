import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ok, fail, paginate } from '../utils/apiResponse.js';
import {
  Program,
  Category,
  TeamMember,
  Story,
  Forum,
  Product,
  Certificate,
  CertificateRequest,
  ForumRegistration,
  ProposalRequest,
  Enquiry,
  Order,
  Setting,
} from '../models/index.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { notifyAdmin } from '../utils/mailer.js';

const router = Router();

// ---- Programs ----
router.get('/programs', asyncHandler(async (req, res) => {
  const items = await Program.find({ published: true }).sort('order');
  ok(res, items);
}));

router.get('/programs/:slug', asyncHandler(async (req, res) => {
  const item = await Program.findOne({ slug: req.params.slug, published: true });
  if (!item) return fail(res, 404, 'Program not found');
  ok(res, item);
}));

// ---- Categories ----
router.get('/categories', asyncHandler(async (req, res) => {
  const items = await Category.find().sort('order');
  ok(res, items);
}));

router.get('/categories/:slug', asyncHandler(async (req, res) => {
  const item = await Category.findOne({ slug: req.params.slug });
  if (!item) return fail(res, 404, 'Category not found');
  ok(res, item);
}));

// ---- Team / network ----
router.get('/team', asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.region) filter.region = req.query.region;
  const items = await TeamMember.find(filter).sort('order');
  ok(res, items);
}));

router.get('/team/:slug', asyncHandler(async (req, res) => {
  const item = await TeamMember.findOne({ slug: req.params.slug });
  if (!item) return fail(res, 404, 'Team member not found');
  ok(res, item);
}));

// ---- Stories ----
router.get('/stories', asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;
  const [items, total] = await Promise.all([
    Story.find(filter).sort('order').skip(skip).limit(limit),
    Story.countDocuments(filter),
  ]);
  ok(res, items, { meta: { page, limit, total } });
}));

// ---- Forums ----
router.get('/forums', asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const items = await Forum.find(filter).sort('startDate');
  ok(res, items);
}));

// ---- Products ----
router.get('/products', asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = { published: true };
  if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;
  const [items, total] = await Promise.all([
    Product.find(filter).sort('-createdAt').skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);
  ok(res, items, { meta: { page, limit, total } });
}));

router.get('/products/:slug', asyncHandler(async (req, res) => {
  const item = await Product.findOne({ slug: req.params.slug, published: true });
  if (!item) return fail(res, 404, 'Product not found');
  ok(res, item);
}));

// ---- Certificate verification (rate limited) ----
const verifyLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });

router.post('/verify-certificate', verifyLimiter, asyncHandler(async (req, res) => {
  const { number } = req.body;
  if (!number || typeof number !== 'string') return fail(res, 400, 'Enter a certificate number');
  const cert = await Certificate.findOne({ number: number.trim() }).populate('program');
  if (!cert) return fail(res, 404, 'No certificate found with this number. Double-check the number and try again.');
  ok(res, {
    number: cert.number,
    holderName: cert.holderName,
    program: cert.program,
    issuedAt: cert.issuedAt,
    status: cert.status,
  });
}));

// ---- Form submissions ----
router.post('/certificate-requests', asyncHandler(async (req, res) => {
  const item = await CertificateRequest.create(req.body);
  notifyAdmin('New certificate request', `From: ${item.fullName} <${item.email}>`).catch(() => {});
  ok(res, item);
}));

router.post('/forum-registrations', optionalAuth, asyncHandler(async (req, res) => {
  // Atomic conditional increment: only succeeds while the forum is still open
  // and has a free seat, so two concurrent requests for the last seat can't
  // both win (the loser's filter simply matches zero documents). A
  // seatsTotal of 0 means "uncapped" and is always allowed through.
  const forum = await Forum.findOneAndUpdate(
    {
      _id: req.body.forum,
      status: 'open',
      $or: [{ seatsTotal: 0 }, { $expr: { $lt: ['$seatsTaken', '$seatsTotal'] } }],
    },
    { $inc: { seatsTaken: 1 } },
    { new: true }
  );
  if (!forum) return fail(res, 400, 'This forum is not open for registration');

  if (forum.seatsTotal && forum.seatsTaken >= forum.seatsTotal && forum.status !== 'full') {
    forum.status = 'full';
    await forum.save();
  }

  const item = await ForumRegistration.create({ ...req.body, user: req.user?._id });
  notifyAdmin('New forum registration', `From: ${item.fullName} <${item.email}> for ${forum.month} ${forum.year}`).catch(() => {});
  ok(res, item);
}));

router.post('/proposal-requests', requireAuth, asyncHandler(async (req, res) => {
  const cert = await Certificate.findOne({ _id: req.body.certificate, user: req.user._id, status: 'valid' }).populate('program');
  if (!cert || cert.program.slug !== 'generate-your-business-idea') {
    return fail(res, 403, 'A verified GYB certificate is required to submit this form');
  }
  const item = await ProposalRequest.create({ ...req.body, user: req.user._id });
  ok(res, item);
}));

router.post('/enquiries', asyncHandler(async (req, res) => {
  const item = await Enquiry.create(req.body);
  notifyAdmin('New enquiry', `From: ${item.name} <${item.email}>\n\n${item.message}`).catch(() => {});
  ok(res, item);
}));

router.post('/orders', asyncHandler(async (req, res) => {
  const item = await Order.create(req.body);
  notifyAdmin('New order', `From: ${item.customer?.name} <${item.customer?.email}>\nTotal: ${item.total}`).catch(() => {});
  ok(res, item);
}));

// ---- Settings (public read) ----
router.get('/settings/:key', asyncHandler(async (req, res) => {
  const item = await Setting.findOne({ key: req.params.key });
  if (!item) return fail(res, 404, 'Setting not found');
  ok(res, item.value);
}));

export default router;
