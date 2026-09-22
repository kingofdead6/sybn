import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { RESOURCE_SCHEMAS } from './resourceSchemas';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import MediaUploader from './MediaUploader';
import FormBuilderField from './FormBuilderField';

/* The order sections appear in, regardless of field order in the schema. */
const GROUP_ORDER = ['basics', 'content', 'media', 'presentation', 'registration', 'commerce', 'publish'];

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

function BilingualField({ label, value = {}, onChange, textarea, required }) {
  const { t } = useTranslation('admin');
  const Comp = textarea ? 'textarea' : 'input';
  // Arabic is the site's primary language, so it is the one that must be
  // filled. English is optional and falls back to Arabic when left blank.
  const missingAr = required && !value?.ar;
  const inputClass =
    'w-full mt-1 rounded-sm border border-rule bg-surface px-3 py-2 text-ink-soft transition-colors focus-visible:border-accent';

  return (
    <div className="rounded-sm border border-rule bg-surface p-4">
      <p className="text-sm font-semibold text-ink mb-3">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-muted flex items-center gap-2">
            العربية
            {required && (
              <span className="text-[11px] font-semibold text-error">{t('form.required')}</span>
            )}
            {missingAr && (
              <span className="rounded-sm bg-error-wash px-2 py-0.5 text-[11px] font-semibold text-error">
                {t('form.missingAr')}
              </span>
            )}
          </label>
          <Comp
            dir="rtl"
            value={value?.ar || ''}
            onChange={(e) => onChange({ ...value, ar: e.target.value })}
            className={inputClass}
            rows={textarea ? 4 : undefined}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted flex items-center gap-2">
            English
            <span className="text-[11px] text-muted">{t('form.optional')}</span>
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
            className="text-error text-sm mt-3 hover:underline"
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
 * Gallery editor for a list of image URLs (a product's `images`). The first
 * image is what the store cards and the product page open on, so the order
 * matters and each row can be moved.
 */
function ImageListField({ value, onChange, resource }) {
  const { t } = useTranslation('admin');
  // A document saved before this field existed has no array at all.
  const images = Array.isArray(value) ? value : [];

  function move(i, delta) {
    const target = i + delta;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      {images.map((img, i) => (
        <div key={i} className="flex items-start gap-3 rounded-sm border border-rule bg-surface p-3">
          <img
            src={img}
            alt=""
            className="h-20 w-20 shrink-0 rounded-sm border border-rule object-cover"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="text-2xs caps-label text-muted">
              {i === 0 ? t('media.coverImage') : t('media.imageN', { n: i + 1 })}
            </span>
            <input
              dir="ltr"
              value={img}
              onChange={(e) => {
                const next = [...images];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="w-full rounded-sm border border-rule bg-surface px-3 py-2 text-sm text-ink-soft transition-colors focus-visible:border-accent"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="text-sm text-ink-soft hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t('form.moveUp')}
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === images.length - 1}
                className="text-sm text-ink-soft hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t('form.moveDown')}
              </button>
              <button
                type="button"
                onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                className="text-sm text-error hover:underline"
              >
                {t('media.remove')}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Uploading appends rather than replacing, so the picker stays empty
          and is always ready for the next image. */}
      <MediaUploader value="" onChange={(url) => url && onChange([...images, url])} folder={`siyb/${resource}`} />
    </div>
  );
}

/**
 * Editor for a program's training packages. Each module is the card shown on
 * the program page: bilingual title, illustration, and the video / PDF / exam
 * links behind its three buttons.
 */
/** Picks one document from another admin resource (e.g. a course's category). */
function ReferenceField({ label, value, resource, onChange, excludeId }) {
  const { i18n } = useTranslation('admin');
  const [items, setItems] = useState([]);
  const locale = i18n.language?.startsWith('en') ? 'en' : 'ar';

  useEffect(() => {
    api
      .get(`/admin/${resource}`, { params: { limit: 200 } })
      .then(({ data }) => setItems(data.data || []))
      .catch(() => {});
  }, [resource]);

  // The API may return the reference populated or as a bare id.
  const current = typeof value === 'object' && value !== null ? value._id : value;

  // A record must not reference itself — a program cannot be its own parent.
  const options = excludeId ? items.filter((it) => String(it._id) !== String(excludeId)) : items;

  return (
    <Select label={label} value={current || ''} onChange={(e) => onChange(e.target.value || null)}>
      <option value="">—</option>
      {options.map((it) => (
        <option key={it._id} value={it._id}>
          {it.code ? `${it.code} · ` : ''}
          {it.title?.[locale] || it.name?.[locale] || it.slug}
        </option>
      ))}
    </Select>
  );
}

/**
 * The training packages of a program.
 *
 * A package is one of two things, chosen per row:
 *  - *written* — its own title, artwork and links, as before;
 *  - *linked*  — it points at another program, and the card on the page
 *    stands for that program and opens its page.
 *
 * A linked package carries nothing of its own — it stands entirely for the
 * program it points at, so the written fields are hidden on that row.
 */
function ModuleListField({ value = [], onChange, resource, currentId }) {
  const { t, i18n } = useTranslation('admin');
  const locale = i18n.language?.startsWith('en') ? 'en' : 'ar';
  const [exams, setExams] = useState([]);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    api
      .get('/admin/exams', { params: { limit: 100 } })
      .then(({ data }) => setExams(data.data || []))
      .catch(() => {});

    api
      .get('/admin/programs', { params: { limit: 200 } })
      .then(({ data }) => setPrograms(data.data || []))
      .catch(() => {});
  }, []);

  function updateModule(i, patch) {
    const next = [...value];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  /** The id a row points at, whether the API populated it or not. */
  const linkedIdOf = (m) =>
    typeof m?.program === 'object' && m.program !== null ? m.program._id : m.program;

  // Every program already spoken for by another row. A picker offers what is
  // left, so the same program cannot be added twice to one program's packages.
  const takenElsewhere = (rowIndex) =>
    new Set(
      value
        .map((m, idx) => (idx === rowIndex ? null : linkedIdOf(m)))
        .filter(Boolean)
        .map(String),
    );

  // A program must not be offered as a package of itself either.
  const optionsFor = (rowIndex) => {
    const taken = takenElsewhere(rowIndex);
    return programs.filter((p) => String(p._id) !== String(currentId) && !taken.has(String(p._id)));
  };

  return (
    <div className="flex flex-col gap-4">
      {value.map((m, i) => {
        // The API returns the link populated; the form keeps a bare id.
        const linkedId = linkedIdOf(m);
        // `program: ''` means the row is in linked mode with nothing chosen
        // yet, so the picker must stay on screen rather than flipping back.
        const isPickingProgram = m.program !== undefined && m.program !== null;

        return (
          <div key={i} className="border border-rule rounded-sm p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">{t('form.module', { n: i + 1 })}</span>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="text-error text-sm hover:underline"
              >
                {t('form.removeModule')}
              </button>
            </div>

            {/* Which kind of package this row is. */}
            <Select
              label={t('form.moduleKind')}
              value={isPickingProgram ? 'program' : 'written'}
              onChange={(e) =>
                updateModule(
                  i,
                  e.target.value === 'program'
                    ? // Switching to a link drops the written content, so a
                      // half-filled package is not saved invisibly behind it.
                      {
                        program: linkedId || '',
                        title: { ar: '', en: '' },
                        image: '',
                        videoUrl: '',
                        pdfUrl: '',
                        exam: undefined,
                      }
                    : { program: undefined },
                )
              }
            >
              <option value="written">{t('form.moduleKindWritten')}</option>
              <option value="program">{t('form.moduleKindProgram')}</option>
            </Select>

            {/* A linked row is just the pointer and its position — everything
                else on the card comes from the program it points at. */}
            {isPickingProgram ? (
              <>
                <Select
                  label={t('form.moduleProgram')}
                  value={linkedId || ''}
                  onChange={(e) => updateModule(i, { program: e.target.value || '' })}
                >
                  <option value="">—</option>
                  {optionsFor(i).map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.code ? `${p.code} · ` : ''}
                      {p.title?.[locale] || p.title?.ar || p.slug}
                    </option>
                  ))}
                </Select>
                <p className="text-xs text-muted">{t('form.moduleProgramHint')}</p>
              </>
            ) : (
              <>
                <BilingualField
                  label={t('field.title')}
                  value={m.title}
                  onChange={(v) => updateModule(i, { title: v })}
                />

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

                <Select
                  label={t('field.exam')}
                  value={m.exam || ''}
                  onChange={(e) => updateModule(i, { exam: e.target.value || undefined })}
                >
                  <option value="">—</option>
                  {exams.map((ex) => (
                    <option key={ex._id} value={ex._id}>
                      {ex.program?.title?.ar || ex.program?.code || ex._id} ·{' '}
                      {ex.questions?.length ?? 0} Q
                    </option>
                  ))}
                </Select>
              </>
            )}

            <Input
              label={t('field.order')}
              type="number"
              value={m.order ?? i + 1}
              onChange={(e) => updateModule(i, { order: Number(e.target.value) })}
            />
          </div>
        );
      })}

      <div className="flex flex-wrap gap-2">
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
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            onChange([
              ...value,
              { title: { ar: '', en: '' }, program: '', image: '', order: value.length + 1 },
            ])
          }
        >
          {t('form.addModuleProgram')}
        </Button>
      </div>
    </div>
  );
}

/**
 * Prepares `modules` for the API.
 *
 * The editor keeps a linked package's program as a bare id and uses `''` for
 * "linked, not chosen yet" — which Mongoose would reject as a malformed
 * ObjectId. Empty links are dropped to undefined, and a populated link is
 * flattened back to its id so re-saving a loaded document does not send the
 * whole nested program back.
 */
function normalizeModules(form) {
  if (!Array.isArray(form.modules)) return form;

  return {
    ...form,
    modules: form.modules.map((m) => {
      const linked = typeof m.program === 'object' && m.program !== null ? m.program._id : m.program;
      return { ...m, program: linked || undefined };
    }),
  };
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
      <p className="text-error">
        {t('list.unknownResource')} {resource}
      </p>
    );
  }
  if (loading) return <p className="text-muted">{t('form.loading')}</p>;

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
      const payload = normalizeModules(form);
      if (isNew) {
        const { data } = await api.post(`/admin/${resource}`, payload);
        navigate(`/admin/${resource}/${data.data._id}`);
      } else {
        await api.put(`/admin/${resource}/${id}`, payload);
        setSaved(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || t('form.saveFailed'));
    } finally {
      setSaving(false);
    }
  }

  // Fields render in labelled sections so a 24-field form reads as a handful of
  // short groups rather than one long column.
  const grouped = schema.fields.reduce((acc, f) => {
    const g = f.group || 'basics';
    (acc[g] = acc[g] || []).push(f);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-ink mb-6">
        {isNew ? t('form.new', { label }) : t('form.edit', { label })}
      </h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {/* Submitted data the admin reviews but must not edit — shown as a
            record above the fields that are actually his to change. */}
        {!isNew && schema.readOnlyFields?.length > 0 && (
          <dl className="rounded-md border border-rule bg-sunk p-4 flex flex-col gap-3">
            {schema.readOnlyFields.map((name) => {
              const val = getPath(form, name);
              if (val === undefined || val === null || val === '') return null;
              const text =
                typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
              return (
                <div key={name} className="flex flex-col gap-1">
                  <dt className="text-2xs caps-label text-muted">
                    {t(`field.${name}`, { defaultValue: name })}
                  </dt>
                  <dd className="whitespace-pre-wrap break-words text-sm text-ink">{text}</dd>
                </div>
              );
            })}
          </dl>
        )}

        {GROUP_ORDER.filter((g) => grouped[g]?.length).map((g) => (
          <fieldset key={g} className="flex flex-col gap-5">
            <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
              {t(`group.${g}`, { defaultValue: g })}
            </legend>
            {grouped[g].map((f) => {
          const val = getPath(form, f.name);
          const fieldLabel = t(`field.${f.name}`, { defaultValue: f.name });

          if (f.type === 'bilingual') {
            return <BilingualField key={f.name} label={fieldLabel} value={val} onChange={(v) => update(f.name, v)} required={f.required} />;
          }
          if (f.type === 'bilingual-textarea') {
            return (
              <BilingualField key={f.name} label={fieldLabel} value={val} onChange={(v) => update(f.name, v)} textarea required={f.required} />
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
                  <ModuleListField
                  value={val}
                  onChange={(v) => update(f.name, v)}
                  resource={resource}
                  currentId={id}
                />
                </div>
              </div>
            );
          }
          if (f.type === 'formbuilder') {
            return (
              <div key={f.name}>
                <label className="text-sm font-semibold text-ink">{fieldLabel}</label>
                <div className="mt-2">
                  <FormBuilderField value={val} onChange={(v) => update(f.name, v)} />
                </div>
              </div>
            );
          }
          if (f.type === 'reference') {
            return (
              <ReferenceField
                key={f.name}
                label={fieldLabel}
                value={val}
                resource={f.resource}
                /* Self-reference is only possible when the picker lists the
                   same resource being edited, e.g. a program's parent. */
                excludeId={f.resource === resource ? id : undefined}
                onChange={(v) => update(f.name, v)}
              />
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
          if (f.type === 'imagelist') {
            return (
              <div key={f.name}>
                <label className="text-sm font-semibold text-ink">{fieldLabel}</label>
                <div className="mt-2">
                  <ImageListField value={val} onChange={(v) => update(f.name, v)} resource={resource} />
                </div>
              </div>
            );
          }
          if (f.type === 'checkbox') {
            return (
              <label
                key={f.name}
                className="flex items-center gap-3 rounded-sm border border-rule bg-surface px-4 py-3 text-sm text-ink cursor-pointer"
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
          if (f.type === 'date') {
            // The API stores an ISO timestamp; the date input wants YYYY-MM-DD,
            // so it is trimmed on the way in and sent back as an empty string
            // when cleared rather than as an invalid date.
            return (
              <Input
                key={f.name}
                label={fieldLabel}
                type="date"
                value={typeof val === 'string' ? val.slice(0, 10) : ''}
                required={f.required}
                onChange={(e) => update(f.name, e.target.value || '')}
              />
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
          </fieldset>
        ))}

        {error && (
          <p className="rounded-sm bg-error-wash px-4 py-3 text-sm text-error" role="alert">
            {error}
          </p>
        )}

        <div className="sticky bottom-0 -mx-1 flex items-center gap-3 border-t border-rule bg-bg px-1 py-4">
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
