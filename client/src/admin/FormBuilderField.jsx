import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import CustomFormFields from '../components/forms/CustomFormFields';
import { useAdminLocale } from './AdminLocaleContext';

const FIELD_TYPES = ['text', 'email', 'tel', 'number', 'date', 'select', 'radio', 'textarea', 'checkbox'];
const WITH_OPTIONS = ['select', 'radio'];

/**
 * Ready-made fields for the questions forms usually ask, so the admin adds a
 * whole, sensibly-labelled field in one click and only edits what differs.
 */
const PRESETS = [
  { key: 'phone', type: 'tel', name: 'phone', width: 'half', label: { ar: 'رقم الهاتف', en: 'Phone number' } },
  { key: 'country', type: 'text', name: 'country', width: 'half', label: { ar: 'بلد الإقامة', en: 'Country of residence' } },
  { key: 'city', type: 'text', name: 'city', width: 'half', label: { ar: 'المدينة', en: 'City' } },
  { key: 'organization', type: 'text', name: 'organization', width: 'half', label: { ar: 'المؤسسة أو الشركة', en: 'Organisation or company' } },
  { key: 'jobTitle', type: 'text', name: 'job_title', width: 'half', label: { ar: 'المسمى الوظيفي', en: 'Job title' } },
  { key: 'birthDate', type: 'date', name: 'birth_date', width: 'half', label: { ar: 'تاريخ الميلاد', en: 'Date of birth' } },
  {
    key: 'experience',
    type: 'radio',
    name: 'experience',
    width: 'full',
    label: { ar: 'مستوى خبرتك في المجال', en: 'Your experience in the field' },
    options: [
      { value: 'none', label: { ar: 'مبتدئ', en: 'Beginner' } },
      { value: 'some', label: { ar: 'متوسط', en: 'Intermediate' } },
      { value: 'expert', label: { ar: 'متقدم', en: 'Advanced' } },
    ],
  },
  {
    key: 'agree',
    type: 'checkbox',
    name: 'agree_terms',
    width: 'full',
    required: true,
    label: { ar: 'أوافق على الشروط والأحكام', en: 'I agree to the terms and conditions' },
  },
];

/** Derive a stable machine key from a label, used when the admin adds a field. */
function slugifyName(label, taken) {
  const base =
    String(label || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'field';
  let name = base;
  let n = 2;
  while (taken.includes(name)) name = `${base}_${n++}`;
  return name;
}

function BilingualPair({ label, value = {}, onChange, textarea = false }) {
  const Field = textarea ? 'textarea' : 'input';
  const shared =
    'w-full rounded-md border border-rule bg-bg px-3 py-2 text-sm text-ink transition-colors duration-fast ease-out focus-visible:border-accent';
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs caps-label text-muted">{label}</span>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field dir="rtl" rows={textarea ? 2 : undefined} className={shared} placeholder="العربية" value={value?.ar || ''} onChange={(e) => onChange({ ...value, ar: e.target.value })} />
        <Field dir="ltr" rows={textarea ? 2 : undefined} className={shared} placeholder="English" value={value?.en || ''} onChange={(e) => onChange({ ...value, en: e.target.value })} />
      </div>
    </div>
  );
}

const TYPE_GLYPH = { text: 'Aa', email: '@', tel: '☎', number: '#', date: '📅', select: '▾', radio: '◉', textarea: '¶', checkbox: '☑' };

/**
 * Builder for an admin-defined form (a program's or a course's registration).
 *
 * Each program/course carries its own field list, so the admin decides what
 * the public form asks for. `name` is the storage key for the answer: it is
 * derived once from the label and then held fixed, because changing it would
 * orphan the answers already submitted under the old key.
 */
export default function FormBuilderField({ value = [], onChange }) {
  const { t } = useTranslation('admin');
  const { locale } = useAdminLocale();
  const fields = Array.isArray(value) ? value : [];
  const [open, setOpen] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState({});
  const names = fields.map((f) => f.name);

  const tr = (v) => v?.[locale] || v?.ar || v?.en || '';

  function patch(i, next) {
    onChange(fields.map((f, idx) => (idx === i ? { ...f, ...next } : f)));
  }

  function add(base) {
    const field = {
      type: 'text',
      label: { ar: '', en: '' },
      required: false,
      width: 'full',
      options: [],
      ...base,
      name: slugifyName(base?.name || 'field', names),
      order: fields.length,
    };
    if (WITH_OPTIONS.includes(field.type) && !field.options.length) {
      field.options = [
        { value: 'option_1', label: { ar: '', en: '' } },
        { value: 'option_2', label: { ar: '', en: '' } },
      ];
    }
    onChange([...fields, field]);
    setOpen(fields.length);
  }

  function duplicate(i) {
    const { _id, ...copy } = fields[i];
    const next = [...fields];
    next.splice(i + 1, 0, { ...copy, name: slugifyName(`${copy.name}_copy`, names) });
    onChange(next.map((f, idx) => ({ ...f, order: idx })));
    setOpen(i + 1);
  }

  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= fields.length) return;
    const next = [...fields];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next.map((f, idx) => ({ ...f, order: idx })));
    setOpen(open === i ? j : open === j ? i : open);
  }

  return (
    <div className="flex flex-col gap-4">
      {fields.length === 0 && (
        <p className="rounded-md border border-dashed border-rule px-4 py-6 text-center text-sm text-muted">{t('form.formBuilderEmpty')}</p>
      )}

      <ol className="flex flex-col gap-2">
        {fields.map((f, i) => {
          const expanded = open === i;
          return (
            <li key={f._id || `${f.name}-${i}`} className={`rounded-md border bg-surface ${expanded ? 'border-accent shadow-raised' : 'border-rule'}`}>
              {/* Summary */}
              <div className="flex items-center gap-3 px-3 py-2.5">
                <span className="flex h-[2rem] w-[2rem] shrink-0 items-center justify-center rounded-md bg-sunk text-sm text-ink-soft" aria-hidden="true">
                  {TYPE_GLYPH[f.type] || 'Aa'}
                </span>
                <button type="button" onClick={() => setOpen(expanded ? null : i)} className="min-w-0 flex-1 text-start" aria-expanded={expanded}>
                  <span className="block truncate text-sm font-medium text-ink">
                    {tr(f.label) || <span className="text-muted">{t('form.untitledField')}</span>}
                    {f.required && <span className="ms-1 text-error">*</span>}
                  </span>
                  <span className="flex flex-wrap gap-x-2 text-2xs text-muted">
                    <span>{t(`form.fieldType.${f.type || 'text'}`, { defaultValue: f.type })}</span>
                    <span>·</span>
                    <span>{t(`form.width.${f.width === 'half' ? 'half' : 'full'}`)}</span>
                    <code dir="ltr">{f.name}</code>
                  </span>
                </button>
                <span className="flex shrink-0 items-center gap-0.5">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-sm px-1.5 py-1 text-sm text-muted hover:bg-sunk hover:text-ink disabled:opacity-30" aria-label={t('form.moveUp')}>↑</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === fields.length - 1} className="rounded-sm px-1.5 py-1 text-sm text-muted hover:bg-sunk hover:text-ink disabled:opacity-30" aria-label={t('form.moveDown')}>↓</button>
                  <button type="button" onClick={() => duplicate(i)} className="rounded-sm px-1.5 py-1 text-sm text-muted hover:bg-sunk hover:text-ink" title={t('form.duplicateField')} aria-label={t('form.duplicateField')}>⧉</button>
                  <button type="button" onClick={() => { onChange(fields.filter((_, idx) => idx !== i)); setOpen(null); }} className="rounded-sm px-1.5 py-1 text-sm text-error hover:bg-error-wash" title={t('form.removeField')} aria-label={t('form.removeField')}>✕</button>
                </span>
              </div>

              {/* Editor */}
              {expanded && (
                <div className="flex flex-col gap-4 border-t border-rule p-4">
                  <BilingualPair
                    label={t('field.label')}
                    value={f.label}
                    onChange={(v) => {
                      // Adopt a derived name only while the field is still
                      // untitled, so renaming a live field never orphans answers.
                      const untouched = !f.label?.ar && !f.label?.en;
                      patch(i, untouched && /^field(_\d+)?$/.test(f.name)
                        ? { label: v, name: slugifyName(v.en || v.ar, names.filter((_, idx) => idx !== i)) }
                        : { label: v });
                    }}
                  />

                  <div className="grid gap-3 sm:grid-cols-3">
                    <Select label={t('field.type')} value={f.type || 'text'} onChange={(e) => {
                      const type = e.target.value;
                      const needsOptions = WITH_OPTIONS.includes(type) && !(f.options || []).length;
                      patch(i, { type, ...(needsOptions ? { options: [{ value: 'option_1', label: { ar: '', en: '' } }, { value: 'option_2', label: { ar: '', en: '' } }] } : {}) });
                    }}>
                      {FIELD_TYPES.map((ty) => (
                        <option key={ty} value={ty}>{t(`form.fieldType.${ty}`, { defaultValue: ty })}</option>
                      ))}
                    </Select>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs caps-label text-muted">{t('form.widthLabel')}</span>
                      <div className="grid grid-cols-2 overflow-hidden rounded-md border border-rule">
                        {['full', 'half'].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => patch(i, { width: w })}
                            aria-pressed={(f.width || 'full') === w}
                            className={`px-3 py-2 text-sm transition-colors ${(f.width || 'full') === w ? 'bg-accent text-on-accent' : 'bg-bg text-ink-soft hover:bg-sunk'}`}
                          >
                            {t(`form.width.${w}`)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-ink">
                      <input type="checkbox" className="h-[1rem] w-[1rem]" checked={!!f.required} onChange={(e) => patch(i, { required: e.target.checked })} />
                      {t('field.required')}
                    </label>
                  </div>

                  {f.type !== 'checkbox' && (
                    <BilingualPair label={t('field.placeholder')} value={f.placeholder} onChange={(v) => patch(i, { placeholder: v })} />
                  )}
                  <BilingualPair label={t('field.help')} value={f.help} onChange={(v) => patch(i, { help: v })} textarea />

                  {WITH_OPTIONS.includes(f.type) && (
                    <div className="flex flex-col gap-2 rounded-md bg-sunk p-3">
                      <span className="text-xs caps-label text-muted">{t('field.options')}</span>
                      {(f.options || []).map((o, oi) => (
                        <div key={oi} className="grid items-center gap-2 sm:grid-cols-[1fr_1fr_8rem_auto]">
                          <input dir="rtl" placeholder="العربية" value={o.label?.ar || ''} onChange={(e) => patch(i, { options: f.options.map((x, xi) => (xi === oi ? { ...x, label: { ...x.label, ar: e.target.value } } : x)) })} className="rounded-md border border-rule bg-bg px-3 py-2 text-sm text-ink focus-visible:border-accent" />
                          <input dir="ltr" placeholder="English" value={o.label?.en || ''} onChange={(e) => patch(i, { options: f.options.map((x, xi) => (xi === oi ? { ...x, label: { ...x.label, en: e.target.value } } : x)) })} className="rounded-md border border-rule bg-bg px-3 py-2 text-sm text-ink focus-visible:border-accent" />
                          <input dir="ltr" placeholder={t('field.optionValue')} title={t('field.optionValue')} value={o.value || ''} onChange={(e) => patch(i, { options: f.options.map((x, xi) => (xi === oi ? { ...x, value: e.target.value.replace(/[^a-zA-Z0-9_-]/g, '') } : x)) })} className="rounded-md border border-rule bg-bg px-3 py-2 font-mono text-xs text-ink-soft focus-visible:border-accent" />
                          <button type="button" onClick={() => patch(i, { options: f.options.filter((_, xi) => xi !== oi) })} className="rounded-sm px-2 py-1 text-sm text-error hover:bg-error-wash" aria-label={t('form.removeOption')}>✕</button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => patch(i, { options: [...(f.options || []), { value: `option_${(f.options || []).length + 1}`, label: { ar: '', en: '' } }] })}
                        className="self-start text-sm font-medium text-accent hover:underline"
                      >
                        + {t('form.addOption')}
                      </button>
                    </div>
                  )}

                  <Input
                    label={t('field.name')}
                    dir="ltr"
                    value={f.name || ''}
                    onChange={(e) => patch(i, { name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                    hint={t('form.fieldNameHint')}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Adding fields */}
      <div className="flex flex-col gap-3 rounded-md border border-dashed border-rule p-4">
        <span className="text-xs caps-label text-muted">{t('form.addField')}</span>
        <div className="flex flex-wrap gap-1.5">
          {FIELD_TYPES.map((ty) => (
            <button key={ty} type="button" onClick={() => add({ type: ty })} className="inline-flex items-center gap-1.5 rounded-md border border-rule bg-surface px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent">
              <span aria-hidden="true" className="text-xs">{TYPE_GLYPH[ty]}</span>
              {t(`form.fieldType.${ty}`, { defaultValue: ty })}
            </button>
          ))}
        </div>
        <span className="mt-1 text-xs caps-label text-muted">{t('form.presets')}</span>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.filter((p) => !names.includes(p.name)).map(({ key, ...preset }) => (
            <button key={key} type="button" onClick={() => add(preset)} className="rounded-pill border border-rule px-3 py-1 text-xs text-ink-soft transition-colors hover:border-accent hover:text-accent">
              + {tr(preset.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {fields.length > 0 && (
        <div className="rounded-md border border-rule">
          <button type="button" onClick={() => setShowPreview((v) => !v)} className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-ink" aria-expanded={showPreview}>
            {t('form.previewForm')}
            <span className={`transition-transform ${showPreview ? 'rotate-180' : ''}`} aria-hidden="true">▾</span>
          </button>
          {showPreview && (
            <div className="border-t border-rule bg-bg p-5">
              <CustomFormFields fields={fields} values={preview} locale={locale} onChange={(n, v) => setPreview((p) => ({ ...p, [n]: v }))} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
