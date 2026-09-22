import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ok, fail } from '../utils/apiResponse.js';
import { Setting } from '../models/index.js';

const router = Router();

/** How much conversation we accept and pass on, to bound cost and abuse. */
const MAX_MESSAGES = 12;
const MAX_CHARS = 2000;

/**
 * The Idea Generator assistant.
 *
 * The browser talks to this route, never to Hugging Face: the API key stays on
 * the server, the system prompt cannot be edited by the caller, and the
 * conversation is capped before it is forwarded.
 */
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
});

/** The Hugging Face settings, or null when the integration is unconfigured. */
async function huggingFaceConfig() {
  const row = await Setting.findOne({ key: 'integrations' });
  const hf = row?.value?.huggingFace;
  if (!hf?.apiKey || !hf?.model) return null;
  return hf;
}

router.get(
  '/idea-chat/status',
  asyncHandler(async (req, res) => {
    // Whether the assistant is usable — never the key itself, so the page can
    // decide what to render without learning anything sensitive.
    ok(res, { available: !!(await huggingFaceConfig()) });
  }),
);

router.post(
  '/idea-chat',
  chatLimiter,
  asyncHandler(async (req, res) => {
    const hf = await huggingFaceConfig();
    if (!hf) return fail(res, 503, 'The assistant is not configured yet');

    const { messages, locale } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return fail(res, 400, 'Send at least one message');
    }

    // Only the two roles we expect, only the tail of the conversation, and
    // only text of a sane length — the client is not trusted to bound this.
    const trimmed = messages
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-MAX_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

    if (!trimmed.length) return fail(res, 400, 'Send at least one message');

    const system = hf.systemPrompt?.[locale === 'en' ? 'en' : 'ar'] || hf.systemPrompt?.ar || '';

    let response;
    try {
      response = await fetch(
        `https://router.huggingface.co/v1/chat/completions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${hf.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: hf.model,
            messages: system ? [{ role: 'system', content: system }, ...trimmed] : trimmed,
            max_tokens: 700,
            temperature: 0.7,
          }),
        },
      );
    } catch {
      return fail(res, 502, 'Could not reach the assistant');
    }

    if (!response.ok) {
      // The upstream body may name the model or the token; it is logged for
      // the operator rather than returned to the caller.
      const detail = await response.text().catch(() => '');
      console.error('[ai] Hugging Face error', response.status, detail.slice(0, 500));
      return fail(res, 502, 'The assistant could not answer just now');
    }

    const data = await response.json().catch(() => null);
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) return fail(res, 502, 'The assistant returned an empty answer');

    ok(res, { reply });
  }),
);

export default router;
