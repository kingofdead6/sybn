import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Button from '../ui/Button';

/** Per-assistant copy: the empty-thread intro and the input placeholder. */
const COPY = {
  idea: { intro: 'chatIntro', placeholder: 'chatPlaceholder' },
  simulator: { intro: 'simChatIntro', placeholder: 'simChatPlaceholder' },
};

/**
 * One of the AI page's assistants — `bot` is 'idea' (the Idea Generator) or
 * 'simulator' (the business simulator).
 *
 * The conversation is held here and posted to our own API, which holds the
 * Hugging Face key and the system prompt — the browser never sees either.
 * Until the integration is configured the panel says so plainly rather than
 * offering an input that cannot answer.
 */
export default function AssistantChat({ bot = 'idea' }) {
  const { t } = useTranslation('programs');
  const { locale } = useLocale();
  const copy = COPY[bot] || COPY.idea;

  const [available, setAvailable] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const threadRef = useRef(null);

  useEffect(() => {
    let active = true;
    api
      .get(`/ai/chat/${bot}/status`)
      .then(({ data }) => {
        if (active) setAvailable(!!data.data?.available);
      })
      .catch(() => {
        if (active) setAvailable(false);
      });
    return () => {
      active = false;
    };
  }, [bot]);

  // Keep the newest message in view as the thread grows.
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  async function send(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;

    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setDraft('');
    setError('');
    setSending(true);

    try {
      const { data } = await api.post(`/ai/chat/${bot}`, { messages: next, locale });
      setMessages([...next, { role: 'assistant', content: data.data.reply }]);
    } catch (err) {
      // The question is kept in the thread so a retry does not retype it.
      setError(err.response?.data?.error || t('chatError'));
    } finally {
      setSending(false);
    }
  }

  if (available === false) {
    return (
      <div className="rounded-lg border border-rule/60 bg-surface p-8 text-center shadow-raised">
        <p className="text-md text-ink-soft">{t('chatUnavailable')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-rule/60 bg-surface shadow-raised">
      <div
        ref={threadRef}
        className="flex max-h-[26rem] min-h-[16rem] flex-col gap-4 overflow-y-auto p-6"
      >
        {messages.length === 0 && (
          <p className="m-auto max-w-[46ch] text-center text-sm leading-relaxed text-muted">
            {t(copy.intro)}
          </p>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <p
              className={`max-w-[85%] whitespace-pre-line rounded-lg px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-accent text-on-accent'
                  : 'bg-sunk text-ink-soft'
              }`}
            >
              {m.content}
            </p>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <p className="rounded-lg bg-sunk px-4 py-3 text-sm text-muted" role="status">
              {t('chatThinking')}
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="border-t border-rule bg-error-wash px-6 py-3 text-sm text-error" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={send} className="flex items-end gap-3 border-t border-rule p-4">
        <textarea
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends, Shift+Enter breaks the line — the convention people
            // already expect from a chat box.
            if (e.key === 'Enter' && !e.shiftKey) send(e);
          }}
          placeholder={t(copy.placeholder)}
          aria-label={t(copy.placeholder)}
          className="flex-1 resize-none rounded-md border border-rule bg-bg px-3.5 py-2.5 text-sm text-ink transition-colors focus-visible:border-accent"
        />
        <Button type="submit" disabled={!draft.trim() || sending}>
          {t('chatSend')}
        </Button>
      </form>
    </div>
  );
}
