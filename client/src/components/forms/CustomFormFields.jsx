import Input from '../ui/Input';
import Select from '../ui/Select';

const inputClass =
  'w-full rounded-md border border-rule bg-surface px-3.5 py-2.5 text-ink placeholder:text-muted transition-colors duration-fast ease-out focus-visible:border-accent';

/**
 * The fields an admin built for a form (a course's registration, say),
 * rendered in their order and at their width — a full row, or half beside
 * the next. `values` is keyed by field name; `errors` holds a message for any
 * field that needs one.
 */
export default function CustomFormFields({ fields = [], values = {}, errors = {}, onChange, locale = 'ar', requiredLabel = '*' }) {
  const sorted = [...fields].sort((a, b) => (a.order || 0) - (b.order || 0));
  if (!sorted.length) return null;
  const tr = (v) => v?.[locale] || v?.ar || v?.en || '';

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {sorted.map((f) => {
        const label = (
          <>
            {tr(f.label) || f.name}
            {f.required && (
              <span className="ms-1 text-error" aria-hidden="true">
                {requiredLabel}
              </span>
            )}
          </>
        );
        const hint = tr(f.help) || undefined;
        const placeholder = tr(f.placeholder) || undefined;
        const error = errors[f.name];
        const value = values[f.name] ?? (f.type === 'checkbox' ? false : '');
        const set = (v) => onChange(f.name, v);
        const wide = f.width !== 'half' || f.type === 'textarea' || f.type === 'radio' || f.type === 'checkbox';
        const span = wide ? 'sm:col-span-2' : '';

        if (f.type === 'checkbox') {
          return (
            <div key={f.name} className={span}>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
                <input type="checkbox" className="mt-0.5 h-[1rem] w-[1rem]" checked={!!value} onChange={(e) => set(e.target.checked)} />
                <span>
                  {label}
                  {hint && <span className="block text-xs text-muted">{hint}</span>}
                </span>
              </label>
              {error && <p className="mt-1 text-xs text-error">{error}</p>}
            </div>
          );
        }

        if (f.type === 'radio') {
          return (
            <fieldset key={f.name} className={`flex flex-col gap-2 ${span}`}>
              <legend className="mb-1 text-xs caps-label text-muted">{label}</legend>
              <div className="flex flex-wrap gap-2">
                {(f.options || []).map((o) => (
                  <label
                    key={o.value}
                    className={`cursor-pointer rounded-pill border px-4 py-1.5 text-sm transition-colors ${
                      value === o.value ? 'border-accent bg-accent text-on-accent' : 'border-rule text-ink-soft hover:border-accent'
                    }`}
                  >
                    <input type="radio" name={f.name} className="sr-only" checked={value === o.value} onChange={() => set(o.value)} />
                    {tr(o.label) || o.value}
                  </label>
                ))}
              </div>
              {hint && !error && <span className="text-xs text-muted">{hint}</span>}
              {error && <span className="text-xs text-error">{error}</span>}
            </fieldset>
          );
        }

        if (f.type === 'select') {
          return (
            <div key={f.name} className={span}>
              <Select id={`cf-${f.name}`} label={label} hint={hint} error={error} value={value} onChange={(e) => set(e.target.value)}>
                <option value="">{placeholder || '—'}</option>
                {(f.options || []).map((o) => (
                  <option key={o.value} value={o.value}>
                    {tr(o.label) || o.value}
                  </option>
                ))}
              </Select>
            </div>
          );
        }

        if (f.type === 'textarea') {
          return (
            <div key={f.name} className={`flex flex-col gap-1.5 ${span}`}>
              <label htmlFor={`cf-${f.name}`} className="text-xs caps-label text-muted">
                {label}
              </label>
              <textarea
                id={`cf-${f.name}`}
                rows={4}
                value={value}
                placeholder={placeholder}
                aria-invalid={!!error}
                onChange={(e) => set(e.target.value)}
                className={inputClass}
              />
              {hint && !error && <span className="text-xs text-muted">{hint}</span>}
              {error && <span className="text-xs text-error">{error}</span>}
            </div>
          );
        }

        const type = { email: 'email', tel: 'tel', number: 'number', date: 'date' }[f.type] || 'text';
        return (
          <div key={f.name} className={span}>
            <Input
              id={`cf-${f.name}`}
              label={label}
              type={type}
              dir={['email', 'tel', 'number'].includes(type) ? 'ltr' : undefined}
              placeholder={placeholder}
              hint={hint}
              error={error}
              value={value}
              onChange={(e) => set(e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
}

/** Which required fields are still empty, as { name: message }. */
export function missingRequired(fields = [], values = {}, message = 'Required') {
  const errors = {};
  for (const f of fields) {
    const v = values[f.name];
    if (f.required && (v === undefined || v === null || v === '' || v === false)) errors[f.name] = message;
  }
  return errors;
}
