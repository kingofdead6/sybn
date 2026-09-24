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
 * The AI page's assistants: the Idea Generator and the business simulator.
 *
 * Both run through the one Hugging Face key and model; each has its own system
 * prompt, temperature and reply length, tuned in the admin Integrations page.
 * The browser talks to these routes, never to Hugging Face: the key stays on
 * the server, the prompt cannot be edited by the caller, and the conversation
 * is capped before it is forwarded.
 */
const BOT_DEFAULTS = {
  idea: {
    systemPrompt: {
      ar: 'أنت مستشار ريادة أعمال ضمن برنامج SIYB. ساعد المستخدم على توليد أفكار مشاريع واقعية وقابلة للتنفيذ، واسأل عن اهتماماته ومهاراته ورأس ماله وسوقه المحلي قبل الاقتراح. أجب بالعربية وبإيجاز.',
      en: 'You are an entrepreneurship advisor within the SIYB programme. Help the user generate realistic, workable business ideas; ask about their interests, skills, capital and local market before suggesting. Answer concisely.',
    },
    temperature: 0.7,
    maxTokens: 700,
  },
  simulator: {
    systemPrompt: {
      ar: 'أنت محاكي أعمال تفاعلي ضمن برنامج SIYB. أدر لعبة محاكاة يدير فيها المستخدم مشروعاً صغيراً: ابدأ بسؤاله عن نوع المشروع ورأس المال، ثم قدّم في كل جولة موقفاً سوقياً واقعياً (طلب، منافسة، تكاليف، مخاطر) مع خيارات واضحة، واحسب أثر قراره على المبيعات والأرباح والسيولة، وقدّم ملاحظة تعليمية قصيرة. تدرّج في الصعوبة من المستوى الأول حتى السادس. أجب بالعربية وبإيجاز.',
      en: 'You are an interactive business simulator within the SIYB programme. Run a simulation game in which the user manages a small business: start by asking what the business is and how much capital they have, then each round present a realistic market situation (demand, competition, costs, risk) with clear options, work out the effect of their decision on sales, profit and cash, and give a short teaching note. Raise the difficulty from level one to level six. Answer concisely.',
    },
    temperature: 0.8,
    maxTokens: 800,
  },
};

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
});

const clamp = (n, min, max, fallback) =>
  Number.isFinite(Number(n)) && n !== '' && n !== null ? Math.min(max, Math.max(min, Number(n))) : fallback;

/**
 * The shared Hugging Face credentials plus one bot's tuning, or null when the
 * integration is unconfigured or the bot is unknown.
 */
async function botConfig(bot) {
  const defaults = BOT_DEFAULTS[bot];
  if (!defaults) return null;

  const row = await Setting.findOne({ key: 'integrations' });
  const hf = row?.value?.huggingFace;
  if (!hf?.apiKey || !hf?.model) return null;

  const tuned = hf.bots?.[bot] || {};
  // The Idea Generator's prompt used to live directly on `huggingFace`; it is
  // still honoured so an install saved before the second bot keeps its prompt.
  const legacyPrompt = bot === 'idea' ? hf.systemPrompt : null;

  return {
    apiKey: hf.apiKey,
    model: hf.model,
    systemPrompt: {
      ar: tuned.systemPrompt?.ar || legacyPrompt?.ar || defaults.systemPrompt.ar,
      en: tuned.systemPrompt?.en || legacyPrompt?.en || defaults.systemPrompt.en,
    },
    temperature: clamp(tuned.temperature, 0, 1.5, defaults.temperature),
    maxTokens: Math.round(clamp(tuned.maxTokens, 100, 2000, defaults.maxTokens)),
  };
}

async function status(req, res, bot) {
  // Whether the assistant is usable — never the key itself, so the page can
  // decide what to render without learning anything sensitive.
  ok(res, { available: !!(await botConfig(bot)) });
}

async function chat(req, res, bot) {
  if (!BOT_DEFAULTS[bot]) return fail(res, 404, 'Unknown assistant');

  const cfg = await botConfig(bot);
  if (!cfg) return fail(res, 503, 'The assistant is not configured yet');

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

  const system = cfg.systemPrompt[locale === 'en' ? 'en' : 'ar'];

  let response;
  try {
    response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: cfg.model,
        messages: system ? [{ role: 'system', content: system }, ...trimmed] : trimmed,
        max_tokens: cfg.maxTokens,
        temperature: cfg.temperature,
      }),
      signal: AbortSignal.timeout(60000),
    });
  } catch {
    return fail(res, 502, 'Could not reach the assistant');
  }

  if (!response.ok) {
    // The upstream body may name the model or the token; it is logged for
    // the operator rather than returned to the caller.
    const detail = await response.text().catch(() => '');
    console.error(`[ai:${bot}] Hugging Face error`, response.status, detail.slice(0, 500));
    return fail(res, 502, 'The assistant could not answer just now');
  }

  const data = await response.json().catch(() => null);
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) return fail(res, 502, 'The assistant returned an empty answer');

  ok(res, { reply });
}

router.get('/chat/:bot/status', asyncHandler((req, res) => status(req, res, req.params.bot)));
router.post('/chat/:bot', chatLimiter, asyncHandler((req, res) => chat(req, res, req.params.bot)));

// The original Idea Generator addresses, kept so nothing already calling them breaks.
router.get('/idea-chat/status', asyncHandler((req, res) => status(req, res, 'idea')));
router.post('/idea-chat', chatLimiter, asyncHandler((req, res) => chat(req, res, 'idea')));

export default router;
