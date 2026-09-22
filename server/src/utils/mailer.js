import nodemailer from 'nodemailer';
import { Setting } from '../models/index.js';

let cached = null;

/**
 * Email settings, preferring what the admin panel holds and falling back to
 * the environment. A deployment configured through `.env` keeps working
 * untouched; filling the panel in overrides it without a redeploy.
 */
async function loadConfig() {
  let stored = {};
  try {
    const row = await Setting.findOne({ key: 'integrations' });
    stored = row?.value?.email || {};
  } catch {
    // A database hiccup must not stop mail that `.env` alone could send.
  }

  return {
    host: stored.smtpHost || process.env.SMTP_HOST || '',
    port: Number(stored.smtpPort || process.env.SMTP_PORT) || 587,
    user: stored.smtpUser || process.env.SMTP_USER || '',
    pass: stored.smtpPass || process.env.SMTP_PASS || '',
    from: stored.from || process.env.MAIL_FROM || 'no-reply@abcet.net',
    adminEmail: stored.adminNotifyEmail || process.env.ADMIN_NOTIFY_EMAIL || '',
  };
}

/**
 * The transport is cached against the settings it was built from, so changing
 * the credentials in the admin panel takes effect on the next send rather
 * than requiring a restart.
 */
async function getTransporter() {
  const config = await loadConfig();
  if (!config.host) return { transporter: null, config };

  const fingerprint = `${config.host}:${config.port}:${config.user}:${config.pass}`;
  if (cached?.fingerprint !== fingerprint) {
    cached = {
      fingerprint,
      transporter: nodemailer.createTransport({
        host: config.host,
        port: config.port,
        auth: config.user ? { user: config.user, pass: config.pass } : undefined,
      }),
    };
  }

  return { transporter: cached.transporter, config };
}

export async function notifyAdmin(subject, text) {
  const { transporter, config } = await getTransporter();
  if (!transporter || !config.adminEmail) return;
  await transporter.sendMail({
    from: config.from,
    to: config.adminEmail,
    subject,
    text,
  });
}

/** Sends to an arbitrary address — used by the admin panel's test button. */
export async function sendMail({ to, subject, text }) {
  const { transporter, config } = await getTransporter();
  if (!transporter) throw new Error('No SMTP host is configured');
  await transporter.sendMail({ from: config.from, to, subject, text });
}
