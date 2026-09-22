import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Pill from '../components/ui/Pill';

/**
 * Sending a saved template to certified trainers.
 *
 * The admin picks the recipients and a template, previews what one of them
 * would actually receive — placeholders filled in with that person's own
 * details — and only then sends. The preview is the point: a message going to
 * many people at once is not something to send blind.
 */
export default function AdminTrainerEmail() {
  const { t } = useTranslation('admin');

  const [trainers, setTrainers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [selected, setSelected] = useState(() => new Set());
  const [templateId, setTemplateId] = useState('');
  const [format, setFormat] = useState('');
  const [query, setQuery] = useState('');

  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/admin/certified-trainers', { params: { limit: 500 } }),
      api.get('/admin/email-templates', { params: { limit: 100, sort: 'order' } }),
    ])
      .then(([tr, tp]) => {
        setTrainers(tr.data.data || []);
        setTemplates(tp.data.data || []);
      })
      .catch(() => setError(t('form.loadFailed')))
      .finally(() => setLoaded(true));
  }, [t]);

  // Only active trainers can be sent to, so suspended ones are shown but not
  // selectable — hiding them would make the list look wrong.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return trainers;
    return trainers.filter(
      (x) =>
        x.name?.toLowerCase().includes(q) ||
        x.email?.toLowerCase().includes(q) ||
        x.country?.toLowerCase().includes(q)
    );
  }, [trainers, query]);

  const selectableIds = visible.filter((x) => x.status === 'active').map((x) => x._id);
  const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selected.has(id));

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setPreview(null);
    setResult(null);
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) selectableIds.forEach((id) => next.delete(id));
      else selectableIds.forEach((id) => next.add(id));
      return next;
    });
    setPreview(null);
    setResult(null);
  }

  const ids = [...selected];
  const chosenTemplate = templates.find((x) => x._id === templateId);

  async function runPreview() {
    setError('');
    setResult(null);
    setBusy('preview');
    try {
      const { data } = await api.post('/admin/trainers/preview', {
        templateId,
        trainerIds: ids,
      });
      setPreview(data.data);
    } catch (err) {
      setError(err.response?.data?.error || t('form.saveFailed'));
    } finally {
      setBusy('');
    }
  }

  async function send() {
    if (!window.confirm(t('trainerEmail.confirmSend', { count: ids.length }))) return;
    setError('');
    setBusy('send');
    try {
      const { data } = await api.post('/admin/trainers/send', {
        templateId,
        trainerIds: ids,
        format: format || undefined,
      });
      setResult(data.data);
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.error || t('form.saveFailed'));
    } finally {
      setBusy('');
    }
  }

  if (!loaded) return <p className="text-muted">{t('list.loading')}</p>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink mb-1">
          {t('trainerEmail.title')}
        </h1>
        <p className="text-sm text-muted">{t('trainerEmail.subtitle')}</p>
      </div>

      {trainers.length === 0 && (
        <p className="rounded-sm border border-rule bg-surface p-8 text-center text-muted">
          {t('trainerEmail.noTrainers')}
        </p>
      )}

      {trainers.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          {/* Recipients */}
          <div className="rounded-sm border border-rule bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule p-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleAll}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  {allSelected ? t('trainerEmail.selectNone') : t('trainerEmail.selectAll')}
                </button>
                <span className="numerals text-sm text-muted">
                  {t('trainerEmail.selectedCount', { count: ids.length })}
                </span>
              </div>

              <Input
                placeholder={t('list.search')}
                aria-label={t('list.search')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <ul className="max-h-[32rem] overflow-y-auto">
              {visible.map((trainer) => {
                const disabled = trainer.status !== 'active';
                return (
                  <li key={trainer._id} className="border-b border-rule last:border-0">
                    <label
                      className={`flex items-center gap-3 p-4 ${
                        disabled ? 'opacity-50' : 'cursor-pointer hover:bg-sunk'
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={disabled}
                        checked={selected.has(trainer._id)}
                        onChange={() => toggle(trainer._id)}
                        className="h-4 w-4 shrink-0 accent-[var(--c-accent)]"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-ink">{trainer.name}</span>
                        <span dir="ltr" className="block text-xs text-muted">
                          {trainer.email}
                          {trainer.country ? ` · ${trainer.country}` : ''}
                        </span>
                      </span>
                      {disabled && <Pill tone="clay">{t('trainerEmail.suspended')}</Pill>}
                      {trainer.lastEmailedAt && !disabled && (
                        <span className="shrink-0 text-2xs text-muted">
                          {new Date(trainer.lastEmailedAt).toLocaleDateString('en-GB')}
                        </span>
                      )}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* The message */}
          <div className="flex flex-col gap-4">
            <div className="rounded-sm border border-rule bg-surface p-4">
              <Select
                label={t('trainerEmail.template')}
                value={templateId}
                onChange={(e) => {
                  setTemplateId(e.target.value);
                  setFormat('');
                  setPreview(null);
                  setResult(null);
                }}
              >
                <option value="">—</option>
                {templates.map((tpl) => (
                  <option key={tpl._id} value={tpl._id}>
                    {tpl.name}
                  </option>
                ))}
              </Select>

              {templates.length === 0 && (
                <p className="mt-3 text-xs text-muted">
                  {t('trainerEmail.noTemplates')}{' '}
                  <Link to="/admin/email-templates/new" className="text-accent hover:underline">
                    {t('list.new')}
                  </Link>
                </p>
              )}

              {chosenTemplate && (
                <div className="mt-4">
                  <Select
                    label={t('trainerEmail.format')}
                    value={format || chosenTemplate.format}
                    onChange={(e) => setFormat(e.target.value)}
                  >
                    <option value="html">{t('trainerEmail.formatHtml')}</option>
                    <option value="text">{t('trainerEmail.formatText')}</option>
                  </Select>
                  <p className="mt-2 text-xs text-muted">{t('trainerEmail.subjectLabel')}: {chosenTemplate.subject}</p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={runPreview}
                  disabled={!templateId || ids.length === 0 || busy === 'preview'}
                >
                  {busy === 'preview' ? t('trainerEmail.previewing') : t('trainerEmail.preview')}
                </Button>
                <Button
                  onClick={send}
                  disabled={!templateId || ids.length === 0 || busy === 'send'}
                >
                  {busy === 'send'
                    ? t('trainerEmail.sending')
                    : t('trainerEmail.send', { count: ids.length })}
                </Button>
              </div>
            </div>

            {error && (
              <p className="rounded-sm bg-error-wash px-4 py-2 text-sm text-error" role="alert">
                {error}
              </p>
            )}

            {result && (
              <div className="rounded-sm border border-rule bg-surface p-4">
                <p className="text-sm font-medium text-success">
                  {t('trainerEmail.sentCount', { count: result.sent })}
                </p>
                {result.failed?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-error">
                      {t('trainerEmail.failedCount', { count: result.failed.length })}
                    </p>
                    <ul className="mt-1 flex flex-col gap-1">
                      {result.failed.map((f) => (
                        <li key={f.email} dir="ltr" className="text-xs text-muted">
                          {f.email} — {f.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* What each recipient would actually get. */}
      {preview && (
        <div className="mt-6">
          <h2 className="font-display text-lg text-ink mb-3">{t('trainerEmail.previewHeading')}</h2>
          <div className="flex flex-col gap-4">
            {preview.map((p) => (
              <div key={p.to} className="rounded-sm border border-rule bg-surface p-4">
                <p dir="ltr" className="text-xs text-muted">
                  {t('trainerEmail.to')}: {p.to}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">{p.subject}</p>

                {(format || chosenTemplate?.format) === 'html' ? (
                  /* The body is rendered as markup because that is what the
                     recipient will see; placeholder values were escaped on
                     the server before being substituted in. */
                  <div
                    className="prose-sm mt-3 max-w-none rounded-sm border border-rule bg-bg p-4 text-sm text-ink-soft"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: p.html }}
                  />
                ) : (
                  <pre className="mt-3 whitespace-pre-wrap rounded-sm border border-rule bg-bg p-4 text-sm text-ink-soft">
                    {p.text}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
