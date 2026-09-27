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
import { issueFromRequest } from '../utils/issueCertificate.js';

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
 * Certifies the person behind a certificate request.
 *
 * Issues a numbered certificate, renders it from the template for the
 * request's program or course with the requester's own name and email, and
 * emails it to them as an image. Their details carry over from the request
 * rather than being retyped, and the request is marked `issued` so it leaves
 * the pending queue. A failed email does not undo the issue: it is reported,
 * and the certificate can be resent from the Certificates list.
 */
router.post(
  '/certify/:requestId',
  asyncHandler(async (req, res) => {
    const request = await CertificateRequest.findById(req.params.requestId)
      .populate('program')
      .populate('course');
    if (!request) return fail(res, 404, 'Request not found');
    if (!request.email) return fail(res, 400, 'That request has no email address');

    let issued;
    try {
      issued = await issueFromRequest(request);
    } catch (err) {
      return fail(res, err.status || 500, err.message || 'Could not issue the certificate');
    }

    // The certified-trainer list feeds the trainer email tool. Someone already
    // on it (certified for another program or course) keeps their one record.
    const email = request.email.toLowerCase();
    if (!(await CertifiedTrainer.exists({ email }))) {
      await CertifiedTrainer.create({
        name: request.fullName,
        email,
        phone: request.whatsapp || '',
        country: request.country || '',
        program: request.program?._id || request.program,
        certificate: issued.certificate._id,
        request: request._id,
        user: request.user,
        certifiedAt: new Date(),
      });
    }

    ok(res, {
      number: issued.certificate.number,
      email,
      emailed: issued.emailed,
      emailError: issued.error || '',
    });
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
