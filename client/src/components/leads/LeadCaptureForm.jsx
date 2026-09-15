import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { countryNames } from '../../lib/countries';
import { useLocale } from '../../context/LocaleContext';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const schema = z.object({
  fullName: z.string().min(2),
  whatsapp: z.string().min(6).regex(/^[+\d][\d\s()-]{5,}$/),
  email: z.string().email(),
  country: z.string().min(2),
  interest: z.enum(['entrepreneur', 'trainer', 'partnership']),
  track: z.string().optional(),
});

const EASE = [0.2, 0, 0, 1];

/**
 * The short "quick registration" form — name, WhatsApp, email, country and which
 * route the person wants. It deliberately does not book a forum seat: it opens a
 * conversation and sends the introductory pack. Seat booking stays with the full
 * forum registration form, which needs a specific forum to decrement.
 *
 * Copy is admin-managed under the `home.lead` setting; `preselect` lets a track
 * card elsewhere on the page hand the visitor's choice straight to the form.
 */
export default function LeadCaptureForm({ content, preselect }) {
  const { locale } = useLocale();
  const { t } = useTranslation('home');
  const { t: tc } = useTranslation('common');
  const reduce = useReducedMotion();
  const [status, setStatus] = useState('idle');

  const countries = useMemo(() => countryNames(locale), [locale]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      whatsapp: '',
      email: '',
      country: '',
      interest: preselect?.interest || '',
      track: preselect?.track || '',
    },
  });

  // A track card elsewhere on the page can hand its choice to the form; the
  // fields are already mounted by then, so this is a setValue, not a default.
  useEffect(() => {
    if (!preselect?.interest) return;
    setValue('interest', preselect.interest, { shouldValidate: true });
    setValue('track', preselect.track || '');
  }, [preselect, setValue]);

  const interest = watch('interest');
  const interests = content?.interests || [];
  const activeInterest = interests.find((i) => i.key === interest);
  const trackOptions = activeInterest?.options || [];

  async function onSubmit(values) {
    setStatus('sending');
    try {
      await api.post('/leads', {
        ...values,
        track: values.interest === 'partnership' ? '' : values.track || '',
        source: 'home',
      });
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  }

  const interestField = register('interest');
  const f = content?.fields || {};
  const label = (key, fallback) => f[key]?.[locale] || fallback;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-5 md:grid-cols-2"
      noValidate
    >
      <Input
        label={label('fullName', tc('fullName'))}
        autoComplete="name"
        {...register('fullName')}
        error={errors.fullName ? tc('required') : undefined}
      />
      <Input
        label={label('whatsapp', tc('whatsapp'))}
        dir="ltr"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+213 770 31 34 48"
        className="numerals"
        {...register('whatsapp')}
        error={errors.whatsapp ? t('lead.phoneError') : undefined}
      />
      <Input
        label={label('email', tc('email'))}
        type="email"
        dir="ltr"
        autoComplete="email"
        placeholder="name@example.com"
        {...register('email')}
        error={errors.email ? t('lead.emailError') : undefined}
      />
      <Controller
        control={control}
        name="country"
        render={({ field }) => (
          <Select
            label={label('country', tc('country'))}
            error={errors.country ? tc('required') : undefined}
            {...field}
          >
            <option value="">{label('countryPlaceholder', tc('country'))}</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        )}
      />

      {/* The route choice. Three cards rather than a select: it is the decision
          the whole form exists to capture, so it gets the room to be read. */}
      <fieldset className="md:col-span-2 flex flex-col gap-3">
        <legend className="text-xs caps-label text-muted mb-3">
          {label('interest', t('lead.interest'))}
        </legend>

        <div className="grid gap-3 sm:grid-cols-3">
          {interests.map((option) => {
            const selected = interest === option.key;
            return (
              <label
                key={option.key}
                className={`group relative flex cursor-pointer flex-col gap-1.5 rounded-md border p-4 transition-all duration-base ease-out ${
                  selected
                    ? 'border-accent bg-accent-wash shadow-md'
                    : 'border-rule bg-surface shadow-raised hover:-translate-y-0.5 hover:border-rule-strong hover:shadow-md'
                }`}
              >
                <input
                  type="radio"
                  value={option.key}
                  className="sr-only"
                  {...interestField}
                  onChange={(e) => {
                    interestField.onChange(e);
                    // A stale sub-track from the previously selected route would
                    // otherwise be submitted against the new one.
                    setValue('track', '');
                  }}
                />
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-ink">
                    {option.label?.[locale]}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 shrink-0 rounded-pill border transition-all duration-base ease-out ${
                      selected ? 'border-accent bg-accent' : 'border-rule-strong bg-surface'
                    }`}
                  />
                </span>
                {option.hint?.[locale] && (
                  <span className="numerals text-2xs text-muted">{option.hint[locale]}</span>
                )}
              </label>
            );
          })}
        </div>

        {errors.interest && (
          <span className="text-xs text-error">{t('lead.interestError')}</span>
        )}
      </fieldset>

      {/* The sub-track only exists for two of the three routes, so it is
          revealed rather than shown empty and disabled. */}
      <AnimatePresence initial={false}>
        {trackOptions.length > 0 && (
          <motion.div
            key={interest}
            className="md:col-span-2 overflow-hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <Controller
              control={control}
              name="track"
              render={({ field }) => (
                <Select label={label('track', t('lead.track'))} {...field}>
                  <option value="">{t('lead.track')}</option>
                  {trackOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label?.[locale]}
                    </option>
                  ))}
                </Select>
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {status === 'success' && (
          <motion.p
            key="success"
            role="status"
            className="md:col-span-2 rounded-md bg-success-wash px-4 py-3 text-sm text-success"
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {content?.success?.[locale] || t('lead.success')}
          </motion.p>
        )}
        {status === 'error' && (
          <motion.p
            key="error"
            role="alert"
            className="md:col-span-2 rounded-md bg-error-wash px-4 py-3 text-sm text-error"
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {t('lead.error')}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="md:col-span-2 mt-1 flex flex-col gap-4 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={isSubmitting} className="group">
          <span>
            {isSubmitting
              ? t('lead.sending')
              : content?.submit?.[locale] || t('lead.submit')}
          </span>
          <span
            aria-hidden="true"
            className="transition-transform duration-base ease-out group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
          >
            →
          </span>
        </Button>

        {content?.privacy?.[locale] && (
          <p className="text-xs leading-relaxed text-muted max-w-[42ch]">
            {content.privacy[locale]}
          </p>
        )}
      </div>
    </form>
  );
}
