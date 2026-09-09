import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const schema = z.object({
  fullName: z.string().min(2),
  whatsapp: z.string().min(6),
  email: z.string().email(),
  country: z.string().min(2),
  forum: z.string().min(1),
});

export default function ForumRegistrationForm({ openForums, fieldLabels, showHeading = true }) {
  const { locale } = useLocale();
  const { t } = useTranslation('forums');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', whatsapp: '', email: '', country: '', forum: '' },
  });

  async function onSubmit(values) {
    setStatus('sending');
    setErrorMsg('');
    try {
      await api.post('/forum-registrations', {
        fullName: values.fullName,
        whatsapp: values.whatsapp,
        email: values.email,
        country: values.country,
        forum: values.forum,
      });
      setStatus('success');
      reset();
    } catch (err) {
      setStatus('error');
      // Server messages are English-only, so map its error code to a
      // translated string rather than showing the raw text to Arabic users.
      const code = err.response?.data?.code;
      setErrorMsg(code === 'FORUM_NOT_OPEN' ? t('forumFullError') : t('registrationError'));
    }
  }

  // The setting stores labels as { ar: [...], en: [...] }, but older callers may
  // pass an array of { ar, en }. Normalise both shapes to a flat array of strings
  // for the current locale so the inputs never render without a label.
  const labels = Array.isArray(fieldLabels)
    ? fieldLabels.map((l) => (typeof l === 'string' ? l : l?.[locale] || ''))
    : fieldLabels?.[locale] || [];

  return (
    <div className="rounded-lg border border-rule/60 bg-surface p-6 shadow-raised md:p-8">
      {showHeading && (
        <h2 className="font-display text-xl text-ink mb-6">{t('registrationHeading')}</h2>
      )}

      {openForums.length === 0 ? (
        <p className="text-muted">{t('noOpenForums')}</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <Input
            label={labels[0]}
            {...register('fullName')}
            error={errors.fullName ? t('required', { ns: 'common' }) : undefined}
          />
          <Input
            label={labels[1]}
            {...register('whatsapp')}
            error={errors.whatsapp ? t('required', { ns: 'common' }) : undefined}
          />
          <Input
            label={labels[2]}
            type="email"
            {...register('email')}
            error={errors.email ? t('required', { ns: 'common' }) : undefined}
          />
          <Input
            label={labels[3]}
            {...register('country')}
            error={errors.country ? t('required', { ns: 'common' }) : undefined}
          />
          <div className="md:col-span-2">
            <Controller
              control={control}
              name="forum"
              render={({ field }) => (
                <Select label={labels[4] || t('forumSelectLabel')} {...field}>
                  <option value="" disabled>
                    {t('forumSelectLabel')}
                  </option>
                  {openForums.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.month} {f.year}
                    </option>
                  ))}
                </Select>
              )}
            />
          </div>

          {status === 'success' && (
            <p className="md:col-span-2 text-sm text-success" role="status">
              {t('registrationSuccess')}
            </p>
          )}
          {status === 'error' && (
            <p className="md:col-span-2 text-sm text-error" role="alert">
              {errorMsg}
            </p>
          )}

          <div className="md:col-span-2 mt-2 border-t border-rule pt-5">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('sending') : labels[5] || t('submitRegistration')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
