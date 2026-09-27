import { Certificate, CertificateTemplate } from '../models/index.js';
import { nextSequence } from '../models/Counter.js';
import { renderCertificate } from './certificateImage.js';
import { sendMail } from './mailer.js';

/**
 * Issuing a certificate from a request, and (re)sending it.
 *
 * The holder's name and email come from the request, never retyped, and the
 * design is the template assigned to the request's program or course — or the
 * default template when none is.
 */

/** The template for a program or course: its own, else the default, else any. */
export async function templateFor({ program, course }) {
  const programId = program?._id || program;
  const courseId = course?._id || course;
  const own = await CertificateTemplate.findOne({
    $or: [
      ...(programId ? [{ programs: programId }] : []),
      ...(courseId ? [{ courses: courseId }] : []),
    ],
  }).sort('-updatedAt');
  if (own && (programId || courseId)) return own;
  return (
    (await CertificateTemplate.findOne({ isDefault: true }).sort('-updatedAt')) ||
    (await CertificateTemplate.findOne().sort('-updatedAt'))
  );
}

/** The placeholder values for one certificate. */
function dataFor(cert, subject, language) {
  const title = subject?.title || {};
  return {
    name: cert.holderName,
    email: cert.email,
    program: title[language] || title.ar || title.en || subject?.code || '',
    number: cert.number,
    date: cert.issuedAt,
    country: cert.country || '',
  };
}

async function nextNumber() {
  const year = new Date().getFullYear();
  const seq = String(await nextSequence(`certificate-${year}`)).padStart(5, '0');
  return `SIYB-${year}-${seq}`;
}

/**
 * Renders a certificate and emails it to its holder. Resolves to
 * { emailed: true } or { emailed: false, error } — a failed email never undoes
 * the issue, it is reported so the admin can resend.
 */
export async function sendCertificate(certId) {
  const cert = await Certificate.findById(certId).populate('program').populate('course').populate('template');
  if (!cert) throw new Error('Certificate not found');
  if (!cert.email) return { emailed: false, error: 'This certificate has no email address' };

  const template = cert.template || (await templateFor(cert));
  if (!template) return { emailed: false, error: 'Create a certificate template first' };

  const subject = cert.program || cert.course;
  const png = await renderCertificate(template, dataFor(cert, subject, template.language));
  const titleAr = subject?.title?.ar || subject?.title?.en || '';
  const titleEn = subject?.title?.en || subject?.title?.ar || '';
  const siteUrl = (process.env.CLIENT_URL || '').replace(/\/$/, '');

  const text = [
    `مرحباً ${cert.holderName}،`,
    '',
    `يسعدنا أن نرسل إليك شهادتك${titleAr ? ` في «${titleAr}»` : ''}، مرفقة بهذه الرسالة.`,
    `رقم الشهادة: ${cert.number}`,
    siteUrl ? `يمكن التحقق منها في أي وقت على: ${siteUrl}/verify` : '',
    '',
    '—',
    '',
    `Hello ${cert.holderName},`,
    '',
    `We are pleased to send you your certificate${titleEn ? ` for "${titleEn}"` : ''}, attached to this email.`,
    `Certificate number: ${cert.number}`,
    siteUrl ? `It can be verified at any time at: ${siteUrl}/en/verify` : '',
  ]
    .filter((line, i, all) => line !== '' || all[i - 1] !== '')
    .join('\n');

  try {
    await sendMail({
      to: cert.email,
      subject: `شهادتك | Your certificate — ${cert.number}`,
      text,
      attachments: [{ filename: `certificate-${cert.number}.png`, content: png, contentType: 'image/png' }],
    });
  } catch (err) {
    return { emailed: false, error: err.message || 'Could not send the email' };
  }

  cert.sentAt = new Date();
  await cert.save();
  return { emailed: true };
}

/**
 * Issues the certificate for a request and emails it. The request must still
 * be open; one that already has a certificate is resent from the Certificates
 * list instead, so no one is issued two numbers for the same request.
 */
export async function issueFromRequest(request) {
  if (request.certificate) {
    const error = new Error('This request already has a certificate — resend it from the Certificates list');
    error.status = 409;
    throw error;
  }

  const template = await templateFor(request);
  if (!template) {
    const error = new Error('Create a certificate template first (Certificate Templates in the admin menu)');
    error.status = 400;
    throw error;
  }

  const cert = await Certificate.create({
    number: await nextNumber(),
    holderName: request.fullName,
    email: (request.email || '').toLowerCase(),
    country: request.country || '',
    program: request.program?._id || request.program || undefined,
    course: request.course?._id || request.course || undefined,
    template: template._id,
    request: request._id,
    user: request.user,
  });

  request.certificate = cert._id;
  request.status = 'issued';
  await request.save();

  const result = await sendCertificate(cert._id);
  return { certificate: cert, ...result };
}
