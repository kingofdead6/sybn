import { Setting } from '../models/index.js';

/**
 * WhatsApp notifications to the team's own numbers, through CallMeBot.
 *
 * CallMeBot sends a message to a number that has opted in: each number sends
 * the bot an activation message once and receives an API key for itself. The
 * pairs live on the `integrations` setting under `whatsapp.recipients`, so
 * numbers can be added or changed in the admin panel without a redeploy.
 */

/** The configured recipients that can actually be sent to. */
export async function whatsappRecipients() {
  try {
    const row = await Setting.findOne({ key: 'integrations' });
    return (row?.value?.whatsapp?.recipients || [])
      .map((r) => ({ phone: String(r?.phone || '').replace(/[^\d]/g, ''), apiKey: String(r?.apiKey || '').trim() }))
      .filter((r) => r.phone && r.apiKey);
  } catch {
    return [];
  }
}

async function sendOne({ phone, apiKey }, text) {
  const url =
    'https://api.callmebot.com/whatsapp.php' +
    `?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  // CallMeBot answers with an HTML page either way; a refusal says so in the
  // text rather than (always) in the status.
  const body = (await res.text().catch(() => ''))
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!res.ok || /error|invalid|not (been )?activated/i.test(body)) {
    throw new Error(`+${phone}: ${body.slice(0, 200) || `HTTP ${res.status}`}`);
  }
}

/**
 * Sends `text` to every configured number at the same time.
 * Resolves to { sent, failed: [message…] }; it never throws.
 */
export async function notifyWhatsApp(text) {
  const recipients = await whatsappRecipients();
  const results = await Promise.allSettled(recipients.map((r) => sendOne(r, text)));
  const failed = results.filter((r) => r.status === 'rejected').map((r) => r.reason?.message || 'failed');
  if (failed.length) console.error('[whatsapp] send failed', failed);
  return { sent: results.length - failed.length, failed };
}
