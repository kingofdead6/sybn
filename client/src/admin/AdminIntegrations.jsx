import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

/**
 * Credentials for the services the platform talks to.
 *
 * These live on the `integrations` setting rather than in environment
 * variables so they can be changed without a redeploy. The public settings
 * route refuses to serve that record, so the values here are readable only
 * through the authenticated admin API.
 */
export default function AdminIntegrations() {
  const { t } = useTranslation('admin');
  const [value, setValue] = useState(null);
  const [id, setId] = useState(null);
  const [status, setStatus] = useState('loading');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [testTo, setTestTo] = useState('');
  const [testState, setTestState] = useState(null);

  useEffect(() => {
    api
      .get('/admin/settings', { params: { q: 'integrations', limit: 5 } })
      .then(({ data }) => {
        const row = (data.data || []).find((s) => s.key === 'integrations');
        if (!row) {
          setStatus('missing');
          return;
        }
        setId(row._id);
        setValue(row.value || {});
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  function patchSection(section, next) {
    setValue((v) => ({ ...v, [section]: { ...(v[section] || {}), ...next } }));
    setSaved(false);
  }

  async function save() {
    setError('');
    try {
      await api.put(`/admin/settings/${id}`, { value });
      setSaved(true);
    } catch {
      setError(t('form.saveFailed'));
    }
  }

  async function sendTest() {
    setTestState({ state: 'sending' });
    try {
      await api.post('/admin/integrations/test-email', { to: testTo });
      setTestState({ state: 'ok' });
    } catch (err) {
      setTestState({ state: 'error', message: err.response?.data?.error || '' });
    }
  }

  if (status === 'loading') return <p className="text-muted">{t('list.loading')}</p>;
  if (status === 'error') return <p className="text-error">{t('form.loadFailed')}</p>;
  if (status === 'missing') return <p className="text-error">{t('integrations.missing')}</p>;

  const hf = value.huggingFace || {};
  const email = value.email || {};

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink mb-1">
            {t('integrations.title')}
          </h1>
          <p className="text-sm text-muted">{t('integrations.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm font-medium text-success" role="status">
              {t('settings.saved')}
            </span>
          )}
          <Button onClick={save}>{t('settings.save')}</Button>
        </div>
      </div>

      {/* These are credentials, and the panel shows them in clear — worth
          saying so plainly rather than leaving it to be discovered. */}
      <p className="mb-8 rounded-sm border border-warning/40 bg-warning/5 px-4 py-3 text-sm text-ink-soft">
        {t('integrations.secretNotice')}
      </p>

      {/* Hugging Face */}
      <section className="mb-8 rounded-sm border border-rule bg-surface p-5">
        <h2 className="font-display text-lg text-ink mb-1">{t('integrations.hfTitle')}</h2>
        <p className="text-sm text-muted mb-5">{t('integrations.hfSubtitle')}</p>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t('integrations.hfApiKey')}
            type="password"
            dir="ltr"
            autoComplete="off"
            placeholder="hf_..."
            value={hf.apiKey || ''}
            onChange={(e) => patchSection('huggingFace', { apiKey: e.target.value })}
          />
          <Input
            label={t('integrations.hfModel')}
            dir="ltr"
            placeholder="mistralai/Mistral-7B-Instruct-v0.3"
            value={hf.model || ''}
            onChange={(e) => patchSection('huggingFace', { model: e.target.value })}
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs caps-label text-muted">
              {t('integrations.hfPrompt')} (AR)
            </span>
            <textarea
              dir="rtl"
              rows={5}
              className="w-full rounded-md border border-rule bg-surface px-3.5 py-2.5 text-sm text-ink transition-colors focus-visible:border-accent"
              value={hf.systemPrompt?.ar || ''}
              onChange={(e) =>
                patchSection('huggingFace', {
                  systemPrompt: { ...(hf.systemPrompt || {}), ar: e.target.value },
                })
              }
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs caps-label text-muted">
              {t('integrations.hfPrompt')} (EN)
            </span>
            <textarea
              dir="ltr"
              rows={5}
              className="w-full rounded-md border border-rule bg-surface px-3.5 py-2.5 text-sm text-ink transition-colors focus-visible:border-accent"
              value={hf.systemPrompt?.en || ''}
              onChange={(e) =>
                patchSection('huggingFace', {
                  systemPrompt: { ...(hf.systemPrompt || {}), en: e.target.value },
                })
              }
            />
          </label>
        </div>
      </section>

      {/* Email */}
      <section className="rounded-sm border border-rule bg-surface p-5">
        <h2 className="font-display text-lg text-ink mb-1">{t('integrations.emailTitle')}</h2>
        <p className="text-sm text-muted mb-5">{t('integrations.emailSubtitle')}</p>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t('integrations.smtpHost')}
            dir="ltr"
            placeholder="smtp.example.com"
            value={email.smtpHost || ''}
            onChange={(e) => patchSection('email', { smtpHost: e.target.value })}
          />
          <Input
            label={t('integrations.smtpPort')}
            type="number"
            dir="ltr"
            value={email.smtpPort ?? 587}
            onChange={(e) => patchSection('email', { smtpPort: Number(e.target.value) })}
          />
          <Input
            label={t('integrations.smtpUser')}
            dir="ltr"
            autoComplete="off"
            value={email.smtpUser || ''}
            onChange={(e) => patchSection('email', { smtpUser: e.target.value })}
          />
          <Input
            label={t('integrations.smtpPass')}
            type="password"
            dir="ltr"
            autoComplete="new-password"
            value={email.smtpPass || ''}
            onChange={(e) => patchSection('email', { smtpPass: e.target.value })}
          />
          <Input
            label={t('integrations.mailFrom')}
            dir="ltr"
            placeholder="no-reply@abcet.net"
            value={email.from || ''}
            onChange={(e) => patchSection('email', { from: e.target.value })}
          />
          <Input
            label={t('integrations.adminEmail')}
            dir="ltr"
            placeholder="contact@abcet.net"
            value={email.adminNotifyEmail || ''}
            onChange={(e) => patchSection('email', { adminNotifyEmail: e.target.value })}
          />
        </div>

        {/* Proving the settings work matters more than storing them. */}
        <div className="mt-5 border-t border-rule pt-5">
          <p className="text-sm text-muted mb-3">{t('integrations.testHint')}</p>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[16rem] flex-1">
              <Input
                label={t('integrations.testTo')}
                dir="ltr"
                type="email"
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
              />
            </div>
            <Button
              variant="secondary"
              onClick={sendTest}
              disabled={!testTo || testState?.state === 'sending'}
            >
              {testState?.state === 'sending'
                ? t('integrations.testSending')
                : t('integrations.testSend')}
            </Button>
          </div>

          {testState?.state === 'ok' && (
            <p className="mt-3 text-sm font-medium text-success" role="status">
              {t('integrations.testOk')}
            </p>
          )}
          {testState?.state === 'error' && (
            <p className="mt-3 rounded-sm bg-error-wash px-4 py-2 text-sm text-error" role="alert">
              {t('integrations.testFailed')}
              {testState.message ? ` — ${testState.message}` : ''}
            </p>
          )}
          <p className="mt-2 text-xs text-muted">{t('integrations.testSaveFirst')}</p>
        </div>
      </section>

      {error && (
        <p className="mt-4 rounded-sm bg-error-wash px-4 py-2 text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
