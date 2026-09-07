import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { RESOURCE_SCHEMAS } from './resourceSchemas';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import MediaUploader from './MediaUploader';

function getPath(obj, path) {
  return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

function setPath(obj, path, value) {
  const keys = path.split('.');
  const next = { ...obj };
  let cursor = next;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      cursor[k] = value;
    } else {
      cursor[k] = { ...(cursor[k] || {}) };
      cursor = cursor[k];
    }
  });
  return next;
}

function BilingualField({ label, value = {}, onChange, textarea }) {
  const { t } = useTranslation('admin');
  const Comp = textarea ? 'textarea' : 'input';
  const missingEn = !value?.en;
  const inputClass =
    'w-full mt-1 rounded-lg border border-line bg-surface px-3 py-2 text-body shadow-sm transition-colors focus-visible:border-saffron';

  return (
    <div className="rounded-lg border border-line bg-surface p-4 shadow-sm">
      <p className="text-sm font-semibold text-ink mb-3">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-sage">العربية</label>
          <Comp
            dir="rtl"
            value={value?.ar || ''}
            onChange={(e) => onChange({ ...value, ar: e.target.value })}
            className={inputClass}
            rows={textarea ? 4 : undefined}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-sage flex items-center gap-2">
            English
            {missingEn && (
              <span className="rounded-full bg-clay-tint px-2 py-0.5 text-[11px] font-semibold text-clay">
                {t('form.missingEn')}
              </span>
            )}
          </label>
          <Comp
            dir="ltr"
            value={value?.en || ''}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            className={inputClass}
            rows={textarea ? 4 : undefined}
          />
        </div>
      </div>
    </div>
  );
}

function BulletListField({ value = [], onChange }) {
  const { t } = useTranslation('admin');

  function updateBullet(i, patch) {
    const next = [...value];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      {value.map((b, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1">
            <BilingualField
              label={t('form.bullet', { n: i + 1 })}
              value={b}
              onChange={(v) => updateBullet(i, v)}
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="text-clay text-sm mt-3 hover:underline"
          >
            {t('form.removeBullet')}
          </button>
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" onClick={() => onChange([...value, { ar: '', en: '' }])}>
        {t('form.addBullet')}
      </Button>
    </div>
  );
}

/**
 * Editor for a program's training packages. Each module is the card shown on
 * the program page: bilingual title, illustration, and the video / PDF / exam
 * links behind its three buttons.
 */
function ModuleListField({ value = [], onChange, resource }) {
  const { t } = useTranslation('admin');
  const [exams, setExams] = useState([]);

  useEffect(() => {
    api
      .get('/admin/exams', { params: { limit: 100 } })
      .then(({ data }) => setExams(data.data || []))
      .catch(() => {});
  }, []);

  function updateModule(i, patch) {
    const next = [...value];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-4">
      {value.map((m, i) => (
        <div key={i} className="border border-line rounded-lg shadow-sm p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">{t('form.module', { n: i + 1 })}</span>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="text-clay text-sm hover:underline"
            >
              {t('form.removeModule')}
            </button>
          </div>

          <BilingualField label={t('field.title')} value={m.title} onChange={(v) => updateModule(i, { title: v })} />

          <div>
            <label className="text-sm font-medium text-ink">{t('field.image')}</label>
            <div className="mt-1">
              <MediaUploader
                value={m.image}
                onChange={(v) => updateModule(i, { image: v })}
                folder={`siyb/${resource}`}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label={t('field.videoUrl')}
              value={m.videoUrl || ''}
              onChange={(e) => updateModule(i, { videoUrl: e.target.value })}
            />
            <Input
              label={t('field.pdfUrl')}
              value={m.pdfUrl || ''}
              onChange={(e) => updateModule(i, { pdfUrl: e.target.value })}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Select
              label={t('field.exam')}
              value={m.exam || ''}
              onChange={(e) => updateModule(i, { exam: e.target.value || undefined })}
            >
              <option value="">—</option>
              {exams.map((ex) => (
                <option key={ex._id} value={ex._id}>
                  {ex.program?.title?.ar || ex.program?.code || ex._id} · {ex.questions?.length ?? 0} Q
                </option>
              ))}
            </Select>
            <Input
              label={t('field.order')}
              type="number"
              value={m.order ?? i + 1}
              onChange={(e) => updateModule(i, { order: Number(e.target.value) })}
            />
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() =>
          onChange([
            ...value,
            { title: { ar: '', en: '' }, image: '', videoUrl: '', pdfUrl: '', order: value.length + 1 },
          ])
        }
      >
        {t('form.addModule')}
      </Button>
    </div>
  );
}

export default function AdminForm() {
  const { resource, id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('admin');
  const schema = RESOURCE_SCHEMAS[resource];
  const isNew = !id;
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew) {
      api.get(`/admin/${resource}/${id}`).then(({ data }) => {
        setForm(data.data);
        setLoading(false);
      });
    }
  }, [resource, id, isNew]);

  if (!schema) {
    return (
      <p className="text-clay">
        {t('list.unknownResource')} {resource}
      </p>
    );
  }
  if (loading) return <p className="text-sage">{t('form.loading')}</p>;

  const label = t(`resource.${resource}`, { defaultValue: schema.label });

  function update(name, value) {
    setSaved(false);
    setForm((prev) => setPath(prev, name, value));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      if (isNew) {
        const { data } = await api.post(`/admin/${resource}`, form);
        navigate(`/admin/${resource}/${data.data._id}`);
      } else {
        await api.put(`/admin/${resource}/${id}`, form);
        setSaved(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || t('form.saveFailed'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-ink mb-6">
        {isNew ? t('form.new', { label }) : t('form.edit', { label })}
      </h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {schema.fields.map((f) => {
          const val = getPath(form, f.name);
          const fieldLabel = t(`field.${f.name}`, { defaultValue: f.name });

          if (f.type === 'bilingual') {
            return <BilingualField key={f.name} label={fieldLabel} value={val} onChange={(v) => update(f.name, v)} />;
          }
          if (f.type === 'bilingual-textarea') {
            return (
              <BilingualField key={f.name} label={fieldLabel} value={val} onChange={(v) => update(f.name, v)} textarea />
            );
          }
          if (f.type === 'bulletlist-bilingual') {
            return (
              <div key={f.name}>
                <label className="text-sm font-semibold text-ink">{fieldLabel}</label>
                <div className="mt-2">
                  <BulletListField value={val} onChange={(v) => update(f.name, v)} />
                </div>
              </div>
            );
          }
          if (f.type === 'modulelist') {
            return (
              <div key={f.name}>
                <label className="text-sm font-semibold text-ink">{fieldLabel}</label>
                <div className="mt-2">
                  <ModuleListField value={val} onChange={(v) => update(f.name, v)} resource={resource} />
                </div>
              </div>
            );
          }
          if (f.type === 'image') {
            return (
              <div key={f.name}>
                <label className="text-sm font-semibold text-ink">{fieldLabel}</label>
                <div className="mt-2">
                  <MediaUploader value={val} onChange={(v) => update(f.name, v)} folder={`siyb/${resource}`} />
                </div>
              </div>
            );
          }
          if (f.type === 'checkbox') {
            return (
              <label
                key={f.name}
                className="flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink shadow-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-saffron"
                  checked={!!val}
                  onChange={(e) => update(f.name, e.target.checked)}
                />
                {fieldLabel}
              </label>
            );
          }
          if (f.type === 'select') {
            return (
              <Select
                key={f.name}
                label={fieldLabel}
                value={val || ''}
                onChange={(e) => update(f.name, e.target.value)}
              >
                <option value="">—</option>
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </Select>
            );
          }
          return (
            <Input
              key={f.name}
              label={fieldLabel}
              type={f.type === 'number' ? 'number' : 'text'}
              value={val ?? ''}
              required={f.required}
              onChange={(e) => update(f.name, f.type === 'number' ? Number(e.target.value) : e.target.value)}
            />
          );
        })}
        {error && (
          <p className="rounded-lg bg-clay-tint px-4 py-3 text-sm text-clay" role="alert">
            {error}
          </p>
        )}

        <div className="sticky bottom-0 -mx-1 flex items-center gap-3 border-t border-line bg-surface/95 backdrop-blur px-1 py-4">
          <Button type="submit" disabled={saving}>
            {saving ? t('form.saving') : t('form.save')}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(`/admin/${resource}`)}>
            {t('form.back')}
          </Button>
          {saved && (
            <span className="text-sm font-medium text-success" role="status">
              {t('form.saved')}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
