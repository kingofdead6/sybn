import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { useAdminLocale } from './AdminLocaleContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import MediaUploader from './MediaUploader';

/**
 * Certificate templates: the designs certificates are issued from.
 *
 * A template is a page (a colour, an uploaded design, an optional frame) with
 * lines of text over it. Text may carry placeholders — {{name}}, {{program}}…
 * — filled from each certificate request when it is certified. The preview is
 * the server's own rendering, so what the admin sees here is exactly the image
 * that is emailed.
 */

const SIZES = {
  landscape: { width: 2000, height: 1414 },
  portrait: { width: 1414, height: 2000 },
};

/** A ready-made layout, so a new template starts as a certificate, not a blank page. */
function starterTemplate() {
  return {
    name: '',
    language: 'ar',
    width: 2000,
    height: 1414,
    backgroundColor: '#FFFFFF',
    backgroundImage: '',
    frameColor: '#1E3A5F',
    isDefault: false,
    programs: [],
    courses: [],
    elements: [
      { text: 'شهادة إتمام', x: 50, y: 17, fontSize: 110, color: '#1E3A5F', bold: true, align: 'middle', font: 'Cairo' },
      { text: 'تشهد إدارة برنامج SIYB بأن', x: 50, y: 33, fontSize: 44, color: '#4A5568', bold: false, align: 'middle', font: 'Cairo' },
      { text: '{{name}}', x: 50, y: 45, fontSize: 96, color: '#10151F', bold: true, align: 'middle', font: 'Cairo' },
      { text: 'قد أتمّ بنجاح متطلبات', x: 50, y: 56, fontSize: 44, color: '#4A5568', bold: false, align: 'middle', font: 'Cairo' },
      { text: '{{program}}', x: 50, y: 66, fontSize: 64, color: '#1E2DBE', bold: true, align: 'middle', font: 'Cairo' },
      { text: 'رقم الشهادة: {{number}}', x: 24, y: 86, fontSize: 32, color: '#4A5568', bold: false, align: 'middle', font: 'Cairo' },
      { text: 'التاريخ: {{date}}', x: 76, y: 86, fontSize: 32, color: '#4A5568', bold: false, align: 'middle', font: 'Cairo' },
    ],
  };
}

const newElement = () => ({
  text: '{{name}}',
  x: 50,
  y: 50,
  fontSize: 48,
  color: '#10151F',
  bold: false,
  align: 'middle',
  font: 'Cairo',
});

const idOf = (v) => (v && typeof v === 'object' ? v._id : v);

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

function TemplateList() {
  const { t } = useTranslation('admin');
  const [items, setItems] = useState(null);

  useEffect(() => {
    api
      .get('/admin/certificate-templates', { params: { limit: 100 } })
      .then(({ data }) => setItems(data.data || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{t('resource.certificate-templates')}</h1>
          <p className="mt-1 max-w-[60ch] text-sm text-muted">{t('certTemplates.intro')}</p>
        </div>
        <Button as={Link} to="/admin/certificate-templates/new">
          {t('list.new')}
        </Button>
      </div>

      {items === null ? (
        <p className="text-muted">{t('list.loading')}</p>
      ) : items.length === 0 ? (
        <div className="rounded-sm border border-rule bg-surface p-10 text-center">
          <p className="font-medium text-ink">{t('certTemplates.empty')}</p>
          <p className="mb-5 mt-1 text-sm text-muted">{t('certTemplates.emptyHint')}</p>
          <Button as={Link} to="/admin/certificate-templates/new">
            {t('list.new')}
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((tpl) => (
            <li key={tpl._id}>
              <Link
                to={`/admin/certificate-templates/${tpl._id}`}
                className="flex h-full flex-col gap-2 rounded-md border border-rule bg-surface p-5 transition-colors hover:border-accent"
              >
                <span className="flex items-center gap-2">
                  <span className="font-display text-md text-ink">{tpl.name}</span>
                  {tpl.isDefault && (
                    <span className="rounded-pill bg-accent-wash px-2 py-0.5 text-2xs font-semibold text-accent">
                      {t('certTemplates.default')}
                    </span>
                  )}
                </span>
                <span className="text-sm text-muted">
                  {t('certTemplates.usedBy', {
                    programs: tpl.programs?.length || 0,
                    courses: tpl.courses?.length || 0,
                  })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

/** A checklist of programs or courses, for choosing what a template is for. */
function SubjectPicker({ label, options, selected, onChange, locale }) {
  const chosen = new Set(selected.map(idOf));
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-xs caps-label text-muted">{label}</legend>
      <div className="max-h-48 overflow-y-auto rounded-sm border border-rule bg-surface">
        {options.length === 0 && <p className="p-3 text-sm text-muted">—</p>}
        {options.map((o) => (
          <label
            key={o._id}
            className="flex cursor-pointer items-center gap-3 border-b border-rule px-3 py-2 text-sm text-ink-soft last:border-b-0 hover:bg-sunk"
          >
            <input
              type="checkbox"
              className="h-4 w-4 shrink-0"
              checked={chosen.has(o._id)}
              onChange={() =>
                onChange(chosen.has(o._id) ? selected.filter((s) => idOf(s) !== o._id) : [...selected, o._id])
              }
            />
            <span className="min-w-0">{o.title?.[locale] || o.title?.ar || o.title?.en || o.code || o.slug}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ElementEditor({ el, index, count, selected, onSelect, onChange, onMove, onRemove, placeholders }) {
  const { t } = useTranslation('admin');
  const textRef = useRef(null);

  function insert(key) {
    const token = `{{${key}}}`;
    const node = textRef.current;
    const start = node?.selectionStart ?? el.text.length;
    const end = node?.selectionEnd ?? el.text.length;
    onChange({ text: el.text.slice(0, start) + token + el.text.slice(end) });
    requestAnimationFrame(() => {
      node?.focus();
      node?.setSelectionRange(start + token.length, start + token.length);
    });
  }

  const num = (key, min, max, step = 1) => (
    <Input
      label={t(`certTemplates.el.${key}`)}
      type="number"
      dir="ltr"
      min={min}
      max={max}
      step={step}
      value={el[key]}
      onChange={(e) => onChange({ [key]: e.target.value === '' ? '' : Number(e.target.value) })}
    />
  );

  return (
    <li
      onFocusCapture={onSelect}
      onClick={onSelect}
      className={`flex flex-col gap-3 rounded-md border bg-surface p-4 transition-colors ${
        selected ? 'border-accent ring-1 ring-accent' : 'border-rule'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">
          {t('certTemplates.line', { n: index + 1 })}
        </span>
        <span className="flex gap-1">
          <button type="button" className="rounded-sm px-2 py-1 text-sm hover:bg-sunk disabled:opacity-30" disabled={index === 0} onClick={() => onMove(-1)} aria-label={t('certTemplates.moveUp')}>
            ↑
          </button>
          <button type="button" className="rounded-sm px-2 py-1 text-sm hover:bg-sunk disabled:opacity-30" disabled={index === count - 1} onClick={() => onMove(1)} aria-label={t('certTemplates.moveDown')}>
            ↓
          </button>
          <button type="button" className="rounded-sm px-2 py-1 text-sm text-error hover:bg-error-wash" onClick={onRemove}>
            {t('list.delete')}
          </button>
        </span>
      </div>

      <textarea
        ref={textRef}
        rows={2}
        value={el.text}
        onChange={(e) => onChange({ text: e.target.value })}
        className="w-full rounded-md border border-rule bg-bg px-3 py-2 text-sm text-ink focus-visible:border-accent"
      />
      <div className="flex flex-wrap gap-1.5">
        {placeholders.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => insert(p)}
            className="rounded-pill border border-rule px-2.5 py-0.5 font-mono text-2xs text-ink-soft hover:border-accent hover:text-accent"
            title={t(`certTemplates.ph.${p}`)}
          >
            {`{{${p}}}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {num('x', 0, 100, 0.5)}
        {num('y', 0, 100, 0.5)}
        {num('fontSize', 8, 400)}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs caps-label text-muted">{t('certTemplates.el.color')}</span>
          <input
            type="color"
            value={el.color || '#10151F'}
            onChange={(e) => onChange({ color: e.target.value })}
            className="h-[2.5rem] w-full cursor-pointer rounded-md border border-rule bg-bg"
          />
        </label>
        <Select label={t('certTemplates.el.align')} value={el.align} onChange={(e) => onChange({ align: e.target.value })}>
          <option value="start">{t('certTemplates.alignLeft')}</option>
          <option value="middle">{t('certTemplates.alignCenter')}</option>
          <option value="end">{t('certTemplates.alignRight')}</option>
        </Select>
        <Select label={t('certTemplates.el.font')} value={el.font} onChange={(e) => onChange({ font: e.target.value })}>
          <option value="Cairo">Cairo</option>
          <option value="Inter">Inter</option>
        </Select>
        <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-ink">
          <input type="checkbox" className="h-4 w-4" checked={!!el.bold} onChange={(e) => onChange({ bold: e.target.checked })} />
          {t('certTemplates.el.bold')}
        </label>
      </div>
    </li>
  );
}

function TemplateEditor({ id }) {
  const { t } = useTranslation('admin');
  const { locale } = useAdminLocale();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [tpl, setTpl] = useState(isNew ? starterTemplate() : null);
  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [requests, setRequests] = useState([]);
  const [placeholders, setPlaceholders] = useState(['name', 'email', 'program', 'number', 'date', 'country']);
  const [selected, setSelected] = useState(0);
  const [previewWith, setPreviewWith] = useState('');
  const [preview, setPreview] = useState({ url: '', loading: false, error: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!isNew) {
      api
        .get(`/admin/certificate-templates/${id}`)
        .then(({ data }) => setTpl(data.data))
        .catch(() => setMessage({ tone: 'error', text: t('form.loadFailed') }));
    }
    api.get('/admin/programs', { params: { limit: 100 } }).then(({ data }) => setPrograms(data.data || [])).catch(() => {});
    api.get('/admin/courses', { params: { limit: 100 } }).then(({ data }) => setCourses(data.data || [])).catch(() => {});
    api
      .get('/admin/certificate-requests', { params: { limit: 20 } })
      .then(({ data }) => setRequests(data.data || []))
      .catch(() => {});
    api
      .get('/admin/certificate-templates/placeholders')
      .then(({ data }) => data.data?.length && setPlaceholders(data.data))
      .catch(() => {});
  }, [id, isNew, t]);

  // The preview is re-rendered by the server a moment after the last change,
  // at half size — enough to judge the layout without waiting on every key.
  const payload = useMemo(
    () =>
      tpl && {
        ...tpl,
        programs: (tpl.programs || []).map(idOf),
        courses: (tpl.courses || []).map(idOf),
      },
    [tpl]
  );

  useEffect(() => {
    if (!payload) return undefined;
    let cancelled = false;
    setPreview((p) => ({ ...p, loading: true }));
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.post(
          '/admin/certificate-templates/preview',
          { template: payload, requestId: previewWith || undefined, scale: 0.5 },
          { responseType: 'blob' }
        );
        if (cancelled) return;
        const url = URL.createObjectURL(data);
        setPreview((p) => {
          if (p.url) URL.revokeObjectURL(p.url);
          return { url, loading: false, error: '' };
        });
      } catch {
        if (!cancelled) setPreview((p) => ({ ...p, loading: false, error: t('certTemplates.previewFailed') }));
      }
    }, 450);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [payload, previewWith, t]);

  if (!tpl) return <p className="text-muted">{message?.text || t('form.loading')}</p>;

  const set = (patch) => {
    setMessage(null);
    setTpl((prev) => ({ ...prev, ...patch }));
  };
  const setElement = (i, patch) =>
    set({ elements: tpl.elements.map((el, j) => (j === i ? { ...el, ...patch } : el)) });
  const moveElement = (i, dir) => {
    const next = [...tpl.elements];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    set({ elements: next });
    setSelected(i + dir);
  };
  const orientation = tpl.width >= tpl.height ? 'landscape' : 'portrait';

  // Clicking the preview moves the selected line to that spot.
  function placeSelected(e) {
    if (!tpl.elements[selected]) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - r.left) / r.width) * 1000) / 10;
    const y = Math.round(((e.clientY - r.top) / r.height) * 1000) / 10;
    setElement(selected, { x, y });
  }

  async function save() {
    if (!tpl.name.trim()) {
      setMessage({ tone: 'error', text: t('certTemplates.nameRequired') });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      if (isNew) {
        const { data } = await api.post('/admin/certificate-templates', payload);
        navigate(`/admin/certificate-templates/${data.data._id}`, { replace: true });
      } else {
        await api.put(`/admin/certificate-templates/${id}`, payload);
      }
      setMessage({ tone: 'success', text: t('settings.saved') });
    } catch (err) {
      setMessage({ tone: 'error', text: err.response?.data?.error || t('form.saveFailed') });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm(t('list.confirmDelete'))) return;
    await api.delete(`/admin/certificate-templates/${id}`);
    navigate('/admin/certificate-templates');
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to="/admin/certificate-templates" className="text-sm text-muted hover:text-accent">
            ← {t('resource.certificate-templates')}
          </Link>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink">
            {isNew ? t('certTemplates.new') : tpl.name || t('certTemplates.new')}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {message && (
            <span className={`text-sm font-medium ${message.tone === 'error' ? 'text-error' : 'text-success'}`} role="status">
              {message.text}
            </span>
          )}
          {!isNew && (
            <Button variant="ghost" onClick={remove}>
              {t('list.delete')}
            </Button>
          )}
          <Button onClick={save} disabled={saving}>
            {saving ? t('list.working') : t('settings.save')}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        {/* Settings and text lines */}
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-4 rounded-md border border-rule bg-surface p-5">
            <Input label={t('certTemplates.name')} value={tpl.name} onChange={(e) => set({ name: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Select label={t('certTemplates.language')} value={tpl.language} onChange={(e) => set({ language: e.target.value })}>
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </Select>
              <Select
                label={t('certTemplates.orientation')}
                value={orientation}
                onChange={(e) => set(SIZES[e.target.value])}
              >
                <option value="landscape">{t('certTemplates.landscape')}</option>
                <option value="portrait">{t('certTemplates.portrait')}</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs caps-label text-muted">{t('certTemplates.backgroundColor')}</span>
                <input
                  type="color"
                  value={tpl.backgroundColor || '#FFFFFF'}
                  onChange={(e) => set({ backgroundColor: e.target.value })}
                  className="h-[2.5rem] w-full cursor-pointer rounded-md border border-rule bg-bg"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="flex items-center justify-between text-xs caps-label text-muted">
                  {t('certTemplates.frame')}
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5"
                    checked={!!tpl.frameColor}
                    onChange={(e) => set({ frameColor: e.target.checked ? '#1E3A5F' : '' })}
                    aria-label={t('certTemplates.frame')}
                  />
                </span>
                <input
                  type="color"
                  value={tpl.frameColor || '#1E3A5F'}
                  disabled={!tpl.frameColor}
                  onChange={(e) => set({ frameColor: e.target.value })}
                  className="h-[2.5rem] w-full cursor-pointer rounded-md border border-rule bg-bg disabled:opacity-40"
                />
              </label>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs caps-label text-muted">{t('certTemplates.backgroundImage')}</span>
              <p className="text-xs text-muted">{t('certTemplates.backgroundHint')}</p>
              <MediaUploader value={tpl.backgroundImage} onChange={(url) => set({ backgroundImage: url || '' })} folder="siyb/certificates" />
              {tpl.backgroundImage && (
                <button type="button" onClick={() => set({ backgroundImage: '' })} className="self-start text-sm text-error hover:underline">
                  {t('certTemplates.removeBackground')}
                </button>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-md border border-rule bg-surface p-5">
            <h2 className="font-display text-md text-ink">{t('certTemplates.usage')}</h2>
            <label className="flex items-start gap-3 text-sm text-ink">
              <input type="checkbox" className="mt-0.5 h-4 w-4" checked={!!tpl.isDefault} onChange={(e) => set({ isDefault: e.target.checked })} />
              <span>
                {t('certTemplates.isDefault')}
                <span className="block text-xs text-muted">{t('certTemplates.isDefaultHint')}</span>
              </span>
            </label>
            <SubjectPicker label={t('certTemplates.programs')} options={programs} selected={tpl.programs || []} onChange={(v) => set({ programs: v })} locale={locale} />
            <SubjectPicker label={t('certTemplates.courses')} options={courses} selected={tpl.courses || []} onChange={(v) => set({ courses: v })} locale={locale} />
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-md text-ink">{t('certTemplates.lines')}</h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  set({ elements: [...tpl.elements, newElement()] });
                  setSelected(tpl.elements.length);
                }}
              >
                {t('certTemplates.addLine')}
              </Button>
            </div>
            <ul className="flex flex-col gap-3">
              {tpl.elements.map((el, i) => (
                <ElementEditor
                  key={i}
                  el={el}
                  index={i}
                  count={tpl.elements.length}
                  selected={i === selected}
                  onSelect={() => setSelected(i)}
                  onChange={(patch) => setElement(i, patch)}
                  onMove={(dir) => moveElement(i, dir)}
                  onRemove={() => {
                    set({ elements: tpl.elements.filter((_, j) => j !== i) });
                    setSelected((s) => Math.max(0, s - (s >= i ? 1 : 0)));
                  }}
                  placeholders={placeholders}
                />
              ))}
            </ul>
          </section>
        </div>

        {/* Live preview */}
        <div className="xl:sticky xl:top-20 xl:self-start">
          <div className="flex flex-col gap-3 rounded-md border border-rule bg-surface p-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-md text-ink">{t('certTemplates.preview')}</h2>
              <div className="min-w-[14rem]">
                <Select label={t('certTemplates.previewWith')} value={previewWith} onChange={(e) => setPreviewWith(e.target.value)}>
                  <option value="">{t('certTemplates.sampleData')}</option>
                  {requests.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.fullName} — {r.email}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <p className="text-xs text-muted">{t('certTemplates.previewHint')}</p>
            <div
              className="relative cursor-crosshair overflow-hidden rounded-sm border border-rule bg-sunk"
              style={{ aspectRatio: `${tpl.width} / ${tpl.height}` }}
              onClick={placeSelected}
              role="presentation"
            >
              {preview.url && <img src={preview.url} alt="" className="absolute inset-0 h-full w-full" draggable={false} />}
              {preview.loading && (
                <span className="absolute end-2 top-2 rounded-pill bg-ink/70 px-2.5 py-1 text-2xs text-on-ink">
                  {t('list.working')}
                </span>
              )}
            </div>
            {preview.error && <p className="text-sm text-error">{preview.error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminCertificateTemplates() {
  const { id } = useParams();
  return id ? <TemplateEditor key={id} id={id} /> : <TemplateList />;
}
