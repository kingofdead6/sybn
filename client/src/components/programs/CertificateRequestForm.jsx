import { useEffect, useState } from 'react';
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
  email: z.string().email(),
  whatsapp: z.string().min(6),
  country: z.string().min(2),
  wantsForums: z.enum(['yes', 'no']),
});

export default function CertificateRequestForm({ programId, programTitle }) {
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
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', whatsapp: '', country: '', wantsForums: 'no' },
  });

  async function onSubmit(values) {
    setStatus('sending');
    try {
      await api.post('/certificate-requests', {
        fullName: values.fullName,
        email: values.email,
        whatsapp: values.whatsapp,
        country: values.country,
        program: programId,
        wantsForums: values.wantsForums === 'yes',
      });
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  }

  if (!setting) return null;

  const heading = (setting.heading?.[locale] || '').replace(
    locale === 'ar' ? '<اسم البرنامج>' : '<Program Name>',
    programTitle || ''
  );
  const fieldLabels = setting.fields || [];

  return (
    <div className="border border-line rounded bg-surface p-6 md:p-8">
      <h2 className="font-display text-xl text-ink mb-2">{heading}</h2>
      {setting.preamble?.[locale] && <p className="text-body mb-6">{setting.preamble[locale]}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
        <Input
          label={fieldLabels[0]?.[locale]}
          {...register('fullName')}
          error={errors.fullName ? t('required', { ns: 'common' }) : undefined}
        />
        <Input
          label={fieldLabels[1]?.[locale]}
          type="email"
          {...register('email')}
          error={errors.email ? t('required', { ns: 'common' }) : undefined}
        />
        <Input
          label={fieldLabels[2]?.[locale]}
          {...register('whatsapp')}
          error={errors.whatsapp ? t('required', { ns: 'common' }) : undefined}
        />
        <Input
          label={fieldLabels[3]?.[locale]}
          {...register('country')}
          error={errors.country ? t('required', { ns: 'common' }) : undefined}
        />
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

        {setting.shippingNote?.[locale] && (
          <p className="md:col-span-2 text-sm text-sage">{setting.shippingNote[locale]}</p>
        )}

        {status === 'success' && (
          <p className="md:col-span-2 text-sm text-success" role="status">
            {t('certRequestSuccess')}
          </p>
        )}
        {status === 'error' && (
          <p className="md:col-span-2 text-sm text-clay" role="alert">
            {t('certRequestError')}
          </p>
        )}

        <div className="md:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('sending') : t('submitRequest')}
          </Button>
        </div>
      </form>
    </div>
  );
}
