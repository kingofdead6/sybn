import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  return transporter;
}

export async function notifyAdmin(subject, text) {
  const t = getTransporter();
  if (!t || !process.env.ADMIN_NOTIFY_EMAIL) return;
  await t.sendMail({
    from: process.env.MAIL_FROM || 'no-reply@abcet.net',
    to: process.env.ADMIN_NOTIFY_EMAIL,
    subject,
    text,
  });
}
