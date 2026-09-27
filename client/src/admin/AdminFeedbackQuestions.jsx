import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { useAdminLocale } from './AdminLocaleContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const blank = (order) => ({
  _new: true,
  label: { ar: '', en: '' },
  help: { ar: '', en: '' },
  type: 'rating',
  options: [],
  required: true,
  active: true,
  order,
  courses: [],
});

const idOf = (v) => (v && typeof v === 'object' ? v._id : v);
const titleOf = (c, locale) => c?.title?.[locale] || c?.title?.ar || c?.title?.en || c?.code || '';

/** How the question will look to a student — a quick read of what was built. */
function QuestionPreview({ q, locale }) {
  const { t } = useTranslation('admin');
  if (q.type === 'rating') {
    return <p className="text-lg tracking-widest text-warning" aria-hidden="true">★★★★★</p>;
  }
  if (q.type === 'choice') {
    return (
      <div className="flex flex-wrap gap-1.5">
        {(q.options.length ? q.options : [{ ar: '…' }]).map((o, i) => (
          <span key={i} className="rounded-pill border border-rule px-3 py-0.5 text-xs text-ink-soft">
            {o[locale] || o.ar || '…'}
          </span>
        ))}
      </div>
    );
  }
  return <div className="h-12 rounded-sm border border-dashed border-rule bg-bg px-3 py-2 text-xs text-muted">{t('questions.textAnswer')}</div>;
}

function QuestionCard({ q, index, count, courses, onSaved, onDeleted, onMove }) {
  const { t } = useTranslation('admin');
  const { locale } = useAdminLocale();
  const [form, setForm] = useState(q);
  const [dirty, setDirty] = useState(!!q._new);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [limited, setLimited] = useState((q.courses || []).length > 0);

  useEffect(() => {
    setForm(q);
    setDirty(!!q._new);
    setLimited((q.courses || []).length > 0);
  }, [q]);

  const set = (patch) => {
    setForm((f) => ({ ...f, ...patch }));
    setDirty(true);
    setError('');
  };

  async function save() {
    if (!form.label.ar?.trim()) {
      setError(t('questions.needArabic'));
      return;
    }
    if (form.type === 'choice' && form.options.filter((o) => o.ar?.trim()).length < 2) {
      setError(t('questions.needOptions'));
      return;
    }
    setBusy(true);
    const payload = {
      label: form.label,
      help: form.help,
      type: form.type,
      options: form.type === 'choice' ? form.options.filter((o) => o.ar?.trim()) : [],
      required: form.required,
      active: form.active,
      order: form.order,
      courses: limited ? (form.courses || []).map(idOf) : [],
    };
    try {
      if (form._new) await api.post('/admin/feedback-questions', payload);
      else await api.put(`/admin/feedback-questions/${form._id}`, payload);
      setDirty(false);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || t('form.saveFailed'));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (form._new) return onDeleted();
    if (!window.confirm(t('questions.deleteConfirm'))) return;
    await api.delete(`/admin/feedback-questions/${form._id}`);
    onDeleted();
  }

  const chosen = new Set((form.courses || []).map(idOf));

  return (
    <li className={`rounded-md border bg-surface ${form.active ? 'border-rule' : 'border-dashed border-rule opacity-75'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule px-4 py-2.5">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
          {t('questions.number', { n: index + 1 })}
          {!form.active && <span className="rounded-pill border border-rule px-2 py-0.5 normal-case">{t('questions.retired')}</span>}
          {dirty && <span className="rounded-pill bg-warning/15 px-2 py-0.5 normal-case text-warning">{t('settings.unsaved')}</span>}
        </span>
        <span className="flex gap-1">
          <button type="button" className="rounded-sm px-2 py-1 text-sm hover:bg-sunk disabled:opacity-30" disabled={index === 0 || form._new} onClick={() => onMove(-1)} aria-label={t('certTemplates.moveUp')}>
            ↑
          </button>
          <button type="button" className="rounded-sm px-2 py-1 text-sm hover:bg-sunk disabled:opacity-30" disabled={index === count - 1 || form._new} onClick={() => onMove(1)} aria-label={t('certTemplates.moveDown')}>
            ↓
          </button>
        </span>
      </div>

      <div className="grid gap-5 p-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="flex flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Input label={t('questions.labelAr')} dir="rtl" value={form.label.ar} onChange={(e) => set({ label: { ...form.label, ar: e.target.value } })} />
            <Input label={t('questions.labelEn')} dir="ltr" value={form.label.en} onChange={(e) => set({ label: { ...form.label, en: e.target.value } })} />
            <Input label={t('questions.helpAr')} dir="rtl" value={form.help?.ar || ''} onChange={(e) => set({ help: { ...form.help, ar: e.target.value } })} />
            <Input label={t('questions.helpEn')} dir="ltr" value={form.help?.en || ''} onChange={(e) => set({ help: { ...form.help, en: e.target.value } })} />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Select label={t('questions.type')} value={form.type} onChange={(e) => set({ type: e.target.value, options: e.target.value === 'choice' && !form.options.length ? [{ ar: '', en: '' }, { ar: '', en: '' }] : form.options })}>
              <option value="rating">{t('questions.types.rating')}</option>
              <option value="choice">{t('questions.types.choice')}</option>
              <option value="text">{t('questions.types.text')}</option>
            </Select>
            <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-ink">
              <input type="checkbox" className="h-4 w-4" checked={form.required} onChange={(e) => set({ required: e.target.checked })} />
              {t('questions.required')}
            </label>
            <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-ink">
              <input type="checkbox" className="h-4 w-4" checked={form.active} onChange={(e) => set({ active: e.target.checked })} />
              {t('questions.active')}
            </label>
          </div>

          {form.type === 'choice' && (
            <div className="flex flex-col gap-2">
              <span className="text-xs caps-label text-muted">{t('questions.options')}</span>
              {form.options.map((o, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
                  <input
                    dir="rtl"
                    value={o.ar || ''}
                    placeholder={t('questions.optionAr', { n: i + 1 })}
                    onChange={(e) => set({ options: form.options.map((x, j) => (j === i ? { ...x, ar: e.target.value } : x)) })}
                    className="rounded-md border border-rule bg-bg px-3 py-2 text-sm text-ink focus-visible:border-accent"
                  />
                  <input
                    dir="ltr"
                    value={o.en || ''}
                    placeholder={t('questions.optionEn', { n: i + 1 })}
                    onChange={(e) => set({ options: form.options.map((x, j) => (j === i ? { ...x, en: e.target.value } : x)) })}
                    className="rounded-md border border-rule bg-bg px-3 py-2 text-sm text-ink focus-visible:border-accent"
                  />
                  <button type="button" className="rounded-sm px-2 py-1 text-sm text-error hover:bg-error-wash" onClick={() => set({ options: form.options.filter((_, j) => j !== i) })}>
                    ×
                  </button>
                </div>
              ))}
              <button type="button" className="self-start text-sm font-medium text-accent hover:underline" onClick={() => set({ options: [...form.options, { ar: '', en: '' }] })}>
                + {t('questions.addOption')}
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <span className="text-xs caps-label text-muted">{t('questions.appliesTo')}</span>
            <div className="flex flex-wrap gap-4 text-sm text-ink">
              <label className="flex items-center gap-2">
                <input type="radio" checked={!limited} onChange={() => { setLimited(false); setDirty(true); }} />
                {t('questions.allCourses')}
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={limited} onChange={() => { setLimited(true); setDirty(true); }} />
                {t('questions.someCourses')}
              </label>
            </div>
            {limited && (
              <div className="max-h-44 overflow-y-auto rounded-sm border border-rule">
                {courses.map((c) => (
                  <label key={c._id} className="flex cursor-pointer items-center gap-3 border-b border-rule px-3 py-2 text-sm text-ink-soft last:border-b-0 hover:bg-sunk">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={chosen.has(c._id)}
                      onChange={() =>
                        set({ courses: chosen.has(c._id) ? form.courses.filter((x) => idOf(x) !== c._id) : [...(form.courses || []), c._id] })
                      }
                    />
                    {titleOf(c, locale)}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* What the student sees. */}
        <aside className="flex flex-col gap-2 rounded-md bg-sunk p-4">
          <span className="text-2xs caps-label text-muted">{t('questions.preview')}</span>
          <p className="text-sm font-medium text-ink">
            {form.label[locale] || form.label.ar || '…'}
            {form.required && <span className="ms-1 text-error">*</span>}
          </p>
          {(form.help?.[locale] || form.help?.ar) && <p className="text-xs text-muted">{form.help[locale] || form.help.ar}</p>}
          <QuestionPreview q={form} locale={locale} />
        </aside>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-rule px-4 py-3">
        <Button size="sm" onClick={save} disabled={busy || !dirty}>
          {busy ? t('list.working') : t('settings.save')}
        </Button>
        <Button size="sm" variant="ghost" onClick={remove}>
          {t('list.delete')}
        </Button>
        {error && <span className="text-sm text-error">{error}</span>}
      </div>
    </li>
  );
}

/**
 * The course evaluation, written by the admin. Students answer it once they
 * complete a course; the results are under Evaluation Results. A question
 * with answers is better retired (unticked "In use") than deleted, so its
 * results stay readable.
 */
export default function AdminFeedbackQuestions() {
  const { t } = useTranslation('admin');
  const [items, setItems] = useState(null);
  const [courses, setCourses] = useState([]);

  async function load() {
    const { data } = await api.get('/admin/feedback-questions', { params: { limit: 100, sort: 'order' } });
    setItems(data.data || []);
  }

  useEffect(() => {
    load().catch(() => setItems([]));
    api.get('/admin/courses', { params: { limit: 100 } }).then(({ data }) => setCourses(data.data || [])).catch(() => {});
  }, []);

  async function move(index, dir) {
    const a = items[index];
    const b = items[index + dir];
    // Renumber the whole list so the swap holds even if orders were equal.
    const next = [...items];
    [next[index], next[index + dir]] = [b, a];
    await Promise.all(next.filter((q) => !q._new).map((q, i) => api.put(`/admin/feedback-questions/${q._id}`, { order: i + 1 })));
    load();
  }

  if (items === null) return <p className="text-muted">{t('list.loading')}</p>;

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{t('resource.feedback-questions')}</h1>
          <p className="mt-1 max-w-[70ch] text-sm text-muted">{t('questions.intro')}</p>
        </div>
        <Button onClick={() => setItems([...items, blank(items.length + 1)])}>{t('questions.add')}</Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-sm border border-rule bg-surface p-10 text-center">
          <p className="font-medium text-ink">{t('questions.empty')}</p>
        </div>
      ) : (
        <ol className="flex flex-col gap-4">
          {items.map((q, i) => (
            <QuestionCard
              key={q._id || `new-${i}`}
              q={q}
              index={i}
              count={items.length}
              courses={courses}
              onSaved={load}
              onDeleted={() => (q._new ? setItems(items.filter((_, j) => j !== i)) : load())}
              onMove={(dir) => move(i, dir)}
            />
          ))}
        </ol>
      )}
    </div>
  );
}
