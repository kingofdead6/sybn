import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

/* The four identity fields are always collected — certificate issuance and the
   admin list read them as columns. Anything the admin adds in the form builder
   is stored alongside them under `answers`. */
const baseSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().min(6),
  country: z.string().min(2),
  wantsForums: z.enum(['yes', 'no']),
});

/** Build the validator for the admin-defined fields. */
function schemaFor(fields) {
  const shape = {};
  for (const f of fields) {
    let rule;
    if (f.type === 'checkbox') {
      rule = f.required ? z.literal(true) : z.boolean().optional();
    } else if (f.type === 'email') {
      rule = f.required ? z.string().email() : z.string().email().or(z.literal(''));
    } else {
      rule = f.required ? z.string().min(1) : z.string().optional();
    }
    shape[f.name] = rule;
  }
  return baseSchema.extend({ custom: z.object(shape) });
}

export default function CertificateRequestForm({ programId, courseId, programTitle, program }) {
  const { locale } = useLocale();
  const { t } = useTranslation('programs');
  const [setting, setSetting] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  useEffect(() => {
    let active = true;
    api
      .get('/settings/certRequest.form')
      .then(({ data }) => {
        if (active) setSetting(data.data);
      })
      .catch(() => {
        if (active) setSetting({});
      });
    return () => {
      active = false;
    };
  }, []);

  // Admin-defined fields for this specific program/course, in order.
  const fields = useMemo(
    () => [...(program?.formFields || [])].sort((a, b) => (a.order || 0) - (b.order || 0)),
    [program]
  );

  const defaults = useMemo(() => {
    const custom = {};
    for (const f of fields) custom[f.name] = f.type === 'checkbox' ? false : '';
    return { fullName: '', email: '', whatsapp: '', country: '', wantsForums: 'no', custom };
  }, [fields]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schemaFor(fields)), defaultValues: defaults });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  async function onSubmit(values) {
    setStatus('sending');
    try {
      const answers = {};
      for (const f of fields) {
        const v = values.custom?.[f.name];
        if (v === undefined || v === '' || v === false) continue;
        answers[f.name] = f.type === 'checkbox' ? 'true' : String(v);
      }
      await api.post('/certificate-requests', {
        fullName: values.fullName,
        email: values.email,
        whatsapp: values.whatsapp,
        country: values.country,
        ...(courseId ? { course: courseId } : { program: programId }),
        wantsForums: values.wantsForums === 'yes',
        answers,
      });
      setStatus('success');
      reset(defaults);
    } catch {
      setStatus('error');
    }
  }

  if (!setting) return null;

  // Per-program copy wins; the global setting is the fallback so programs that
  // have not been given their own form keep the wording they already had.
  const heading =
    program?.formHeading?.[locale] ||
    (setting.heading?.[locale] || '').replace(
      locale === 'ar' ? '<اسم البرنامج>' : '<Program Name>',
      programTitle || ''
    );
  const intro = program?.formIntro?.[locale] || setting.preamble?.[locale];
  const note = program?.formNote?.[locale] || setting.shippingNote?.[locale];
  const fieldLabels = setting.fields || [];
  const req = t('required', { ns: 'common' });

  return (
    <div className="rounded-lg border border-rule/60 bg-surface p-6 shadow-raised md:p-8">
      <h2 className="font-display text-xl text-ink mb-2">{heading}</h2>
      {intro && <p className="text-ink-soft mb-6">{intro}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
        <Input label={fieldLabels[0]?.[locale]} {...register('fullName')} error={errors.fullName ? req : undefined} />
        <Input label={fieldLabels[1]?.[locale]} type="email" {...register('email')} error={errors.email ? req : undefined} />
        <Input label={fieldLabels[2]?.[locale]} {...register('whatsapp')} error={errors.whatsapp ? req : undefined} />
        <Input label={fieldLabels[3]?.[locale]} {...register('country')} error={errors.country ? req : undefined} />

        <div className="md:col-span-2">
          <Controller
            control={control}
            name="wantsForums"
            render={({ field }) => (
              <Select label={fieldLabels[4]?.[locale] || t('wantsForumsLabel')} {...field}>
                <option value="yes">{t('wantsForumsYes')}</option>
                <option value="no">{t('wantsForumsNo')}</option>
              </Select>
            )}
          />
        </div>

        {fields.map((f) => {
          const err = errors.custom?.[f.name] ? req : undefined;
          const label = f.label?.[locale] || f.name;
          const placeholder = f.placeholder?.[locale] || undefined;
          const hint = f.help?.[locale] || undefined;
          const wide = f.type === 'textarea' || f.type === 'checkbox' || f.type === 'select';

          if (f.type === 'checkbox') {
            return (
              <div key={f.name} className="md:col-span-2">
                <label className="flex items-start gap-3 text-sm text-ink cursor-pointer">
                  <input type="checkbox" className="mt-0.5 h-4 w-4" {...register(`custom.${f.name}`)} />
                  <span>
                    {label}
                    {hint && <span className="block text-xs text-muted">{hint}</span>}
                  </span>
                </label>
                {err && <p className="mt-1 text-xs text-error">{err}</p>}
              </div>
            );
          }

          if (f.type === 'textarea') {
            return (
              <div key={f.name} className="md:col-span-2 flex flex-col gap-1.5">
                <label htmlFor={f.name} className="text-xs caps-label text-muted">{label}</label>
                <textarea
                  id={f.name}
                  rows={4}
                  placeholder={placeholder}
                  aria-invalid={!!err}
                  className="w-full rounded-md border border-rule bg-surface px-3.5 py-2.5 text-ink placeholder:text-muted transition-colors duration-fast ease-out focus-visible:border-accent"
                  {...register(`custom.${f.name}`)}
                />
                {hint && !err && <span className="text-xs text-muted">{hint}</span>}
                {err && <span className="text-xs text-error">{err}</span>}
              </div>
            );
          }

          if (f.type === 'select') {
            return (
              <div key={f.name} className="md:col-span-2">
                <Select label={label} hint={hint} error={err} {...register(`custom.${f.name}`)}>
                  <option value="">{placeholder || '—'}</option>
                  {(f.options || []).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label?.[locale] || o.value}
                    </option>
                  ))}
                </Select>
              </div>
            );
          }

          return (
            <div key={f.name} className={wide ? 'md:col-span-2' : undefined}>
              <Input
                label={label}
                type={f.type === 'email' ? 'email' : f.type === 'tel' ? 'tel' : 'text'}
                placeholder={placeholder}
                hint={hint}
                error={err}
                {...register(`custom.${f.name}`)}
              />
            </div>
          );
        })}

        {note && <p className="md:col-span-2 text-sm text-muted">{note}</p>}

        {status === 'success' && (
          <p className="md:col-span-2 text-sm text-success" role="status">
            {t('certRequestSuccess')}
          </p>
        )}
        {status === 'error' && (
          <p className="md:col-span-2 text-sm text-error" role="alert">
            {t('certRequestError')}
          </p>
        )}

        <div className="md:col-span-2 mt-2 border-t border-rule pt-5">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('sending') : t('submitRequest')}
          </Button>
        </div>
      </form>
    </div>
  );
}
