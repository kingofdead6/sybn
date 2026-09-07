import { useTranslation } from 'react-i18next';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const FIELD_TYPES = ['text', 'email', 'tel', 'select', 'textarea', 'checkbox'];

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
    'w-full rounded-sm border border-rule bg-surface px-3 py-2 text-sm text-ink transition-colors duration-fast ease-out focus-visible:border-accent';
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted">{label}</span>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field
          dir="rtl"
          rows={textarea ? 2 : undefined}
          className={shared}
          placeholder="العربية"
          value={value?.ar || ''}
          onChange={(e) => onChange({ ...value, ar: e.target.value })}
        />
        <Field
          dir="ltr"
          rows={textarea ? 2 : undefined}
          className={shared}
          placeholder="English"
          value={value?.en || ''}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
        />
      </div>
    </div>
  );
}

/**
 * Builder for an admin-defined registration form.
 *
 * Each program/course carries its own field list, so the admin decides what the
 * public form asks for. `name` is the storage key for the answer: it is derived
 * once from the label and then held fixed, because changing it would orphan the
 * answers already submitted under the old key.
 */
export default function FormBuilderField({ value = [], onChange }) {
  const { t } = useTranslation('admin');
  const fields = Array.isArray(value) ? value : [];

  function patch(i, next) {
    onChange(fields.map((f, idx) => (idx === i ? { ...f, ...next } : f)));
  }

  function add() {
    onChange([
      ...fields,
      { name: slugifyName('field', fields.map((f) => f.name)), type: 'text', label: { ar: '', en: '' }, required: false, options: [], order: fields.length },
    ]);
  }

  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= fields.length) return;
    const next = [...fields];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next.map((f, idx) => ({ ...f, order: idx })));
  }

  return (
    <div className="flex flex-col gap-4">
      {fields.length === 0 && (
        <p className="text-sm text-muted">{t('form.formBuilderEmpty')}</p>
      )}

      {fields.map((f, i) => (
        <div key={f._id || i} className="border border-rule rounded-sm p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-ink">
              {t('form.field', { n: i + 1 })}
              <code className="ms-2 text-xs font-normal text-muted">{f.name}</code>
            </span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                className="text-xs text-muted disabled:opacity-40 hover:text-ink" aria-label={t('form.moveUp')}>↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === fields.length - 1}
                className="text-xs text-muted disabled:opacity-40 hover:text-ink" aria-label={t('form.moveDown')}>↓</button>
              <button
                type="button"
                onClick={() => onChange(fields.filter((_, idx) => idx !== i))}
                className="text-error text-sm hover:underline"
              >
                {t('form.removeField')}
              </button>
            </div>
          </div>

          <BilingualPair
            label={t('field.label')}
            value={f.label}
            onChange={(v) => {
              // Adopt a derived name only while the field is still untitled, so
              // renaming a live field never orphans submitted answers.
              const untouched = !f.label?.ar && !f.label?.en;
              patch(i, untouched
                ? { label: v, name: slugifyName(v.en || v.ar, fields.filter((_, idx) => idx !== i).map((x) => x.name)) }
                : { label: v });
            }}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Select label={t('field.type')} value={f.type || 'text'} onChange={(e) => patch(i, { type: e.target.value })}>
              {FIELD_TYPES.map((ty) => (
                <option key={ty} value={ty}>{t(`form.fieldType.${ty}`, { defaultValue: ty })}</option>
              ))}
            </Select>
            <Input
              label={t('field.name')}
              value={f.name || ''}
              onChange={(e) => patch(i, { name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
              hint={t('form.fieldNameHint')}
            />
          </div>

          <BilingualPair label={t('field.placeholder')} value={f.placeholder} onChange={(v) => patch(i, { placeholder: v })} />
          <BilingualPair label={t('field.help')} value={f.help} onChange={(v) => patch(i, { help: v })} textarea />

          {f.type === 'select' && (
            <div className="flex flex-col gap-2 border-t border-rule pt-3">
              <span className="text-xs font-medium text-muted">{t('field.options')}</span>
              {(f.options || []).map((o, oi) => (
                <div key={oi} className="grid gap-2 sm:grid-cols-[10rem_1fr_auto] items-end">
                  <Input
                    label={t('field.optionValue')}
                    value={o.value || ''}
                    onChange={(e) =>
                      patch(i, { options: f.options.map((x, xi) => (xi === oi ? { ...x, value: e.target.value } : x)) })
                    }
                  />
                  <BilingualPair
                    label={t('field.optionLabel')}
                    value={o.label}
                    onChange={(v) =>
                      patch(i, { options: f.options.map((x, xi) => (xi === oi ? { ...x, label: v } : x)) })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => patch(i, { options: f.options.filter((_, xi) => xi !== oi) })}
                    className="text-error text-sm hover:underline pb-2"
                  >
                    {t('form.removeOption')}
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => patch(i, { options: [...(f.options || []), { value: '', label: { ar: '', en: '' } }] })}
                className="self-start text-sm text-accent hover:underline"
              >
                {t('form.addOption')}
              </button>
            </div>
          )}

          <label className="flex items-center gap-3 text-sm text-ink cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={!!f.required}
              onChange={(e) => patch(i, { required: e.target.checked })}
            />
            {t('field.required')}
          </label>
        </div>
      ))}

      <button type="button" onClick={add} className="self-start text-sm text-accent hover:underline">
        {t('form.addField')}
      </button>
    </div>
  );
}
