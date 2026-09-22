import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ok, fail } from '../utils/apiResponse.js';
import {
  CertifiedTrainer,
  CertificateRequest,
  EmailTemplate,
  Setting,
} from '../models/index.js';
import { sendMail } from '../utils/mailer.js';
import { renderTemplate, PLACEHOLDERS } from '../utils/emailTemplate.js';

const router = Router();
router.use(requireAuth, requireRole('admin', 'editor'));

/** How many trainers one send may target, so a misclick cannot mail everyone twice over. */
const MAX_RECIPIENTS = 500;

/** The brand record, for the signature placeholders. */
async function loadBrand() {
  const row = await Setting.findOne({ key: 'brand' });
  return row?.value || {};
}

/** The placeholders a template may use — the admin UI lists these. */
router.get('/placeholders', (req, res) => ok(res, PLACEHOLDERS));

/**
 * Certifies the person behind an approved certificate request.
 *
 * The trainer's details carry over from the request rather than being
 * retyped, and the request is marked `issued` so it leaves the pending queue.
 */
router.post(
  '/certify/:requestId',
  asyncHandler(async (req, res) => {
    const request = await CertificateRequest.findById(req.params.requestId).populate('program');
    if (!request) return fail(res, 404, 'Request not found');
    if (!request.email) return fail(res, 400, 'That request has no email address');

    const email = request.email.toLowerCase();

    // Certifying the same person twice is a mistake; the existing record is
    // returned so the caller can see who it already is.
    const existing = await CertifiedTrainer.findOne({ email });
    if (existing) {
      return fail(res, 409, 'This email is already certified');
    }

    const trainer = await CertifiedTrainer.create({
      name: request.fullName,
      email,
      phone: request.whatsapp || '',
      country: request.country || '',
      program: request.program?._id || request.program,
      certificate: request.certificate,
      request: request._id,
      user: request.user,
      certifiedAt: new Date(),
    });

    request.status = 'issued';
    await request.save();

    ok(res, trainer);
  })
);

/**
 * Renders a template against real trainers without sending anything, so the
 * admin sees exactly what each person would receive.
 */
router.post(
  '/preview',
  asyncHandler(async (req, res) => {
    const { templateId, trainerIds = [], locale = 'ar' } = req.body || {};

    const template = await EmailTemplate.findById(templateId);
    if (!template) return fail(res, 404, 'Template not found');

    const trainers = await CertifiedTrainer.find({ _id: { $in: trainerIds.slice(0, 3) } })
      .populate('program', 'title code')
      .limit(3);
    if (!trainers.length) return fail(res, 400, 'Select at least one trainer to preview');

    const brand = await loadBrand();
    ok(
      res,
      trainers.map((trainer) => ({
        to: trainer.email,
        name: trainer.name,
        ...renderTemplate(template, trainer, brand, locale),
      }))
    );
  })
);

/**
 * Sends a template to the selected trainers, personalised per recipient.
 *
 * Messages go out one at a time rather than as a single multi-recipient
 * message: each body differs, and trainers must not see each other's
 * addresses. A failure for one recipient is recorded and the rest continue,
 * so one bad address cannot stop the batch.
 */
router.post(
  '/send',
  asyncHandler(async (req, res) => {
    const { templateId, trainerIds = [], format, locale = 'ar' } = req.body || {};

    if (!Array.isArray(trainerIds) || trainerIds.length === 0) {
      return fail(res, 400, 'Select at least one trainer');
    }
    if (trainerIds.length > MAX_RECIPIENTS) {
      return fail(res, 400, `Too many recipients — the limit is ${MAX_RECIPIENTS}`);
    }

    const template = await EmailTemplate.findById(templateId);
    if (!template) return fail(res, 404, 'Template not found');

    const trainers = await CertifiedTrainer.find({
      _id: { $in: trainerIds },
      status: 'active',
    }).populate('program', 'title code');
    if (!trainers.length) return fail(res, 400, 'No active trainers in that selection');

    const brand = await loadBrand();
    const asHtml = (format || template.format) === 'html';

    const sent = [];
    const failed = [];

    for (const trainer of trainers) {
      const body = renderTemplate(template, trainer, brand, locale);
      try {
        await sendMail({
          to: trainer.email,
          subject: body.subject,
          // HTML carries the text body as its fallback; a plain send carries
          // text alone, falling back to a stripped HTML body if that is all
          // the template has.
          ...(asHtml
            ? { html: body.html, text: body.text || undefined }
            : { text: body.text || body.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() }),
        });
        sent.push(trainer.email);
        trainer.lastEmailedAt = new Date();
        await trainer.save();
      } catch (err) {
        failed.push({ email: trainer.email, error: err.message });
      }
    }

    ok(res, { sent: sent.length, failed });
  })
);

export default router;
