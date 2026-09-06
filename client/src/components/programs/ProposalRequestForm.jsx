import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Pill from '../ui/Pill';

const TAB_KEYS = ['investments', 'migration', 'employment'];

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().min(6),
  targetCountry: z.string().min(2),
  field: z.string().min(1),
  wantsForums: z.enum(['yes', 'no']),
});

export default function ProposalRequestForm() {
  const { locale } = useLocale();
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation('programs');
  const [setting, setSetting] = useState(null);
  const [certState, setCertState] = useState('checking'); // checking | none | ready
  const [certId, setCertId] = useState(null);
  const [tab, setTab] = useState(0);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let active = true;
    api
      .get('/settings/proposal.form')
      .then(({ data }) => {
        if (active) setSetting(data.data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    let active = true;
    api
      .get('/me/certificates')
      .then(({ data }) => {
        if (!active) return;
        const list = data.data || [];
        const gyb = list.find(
          (c) => c.program?.slug === 'generate-your-business-idea' && c.status === 'valid'
        );
        if (gyb) {
          setCertId(gyb._id);
          setCertState('ready');
        } else {
          setCertState('none');
        }
      })
      .catch(() => {
        if (active) setCertState('none');
      });
    return () => {
      active = false;
    };
  }, [user]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      whatsapp: '',
      targetCountry: '',
      field: '',
      wantsForums: 'no',
    },
  });

  async function onSubmit(values) {
    setStatus('sending');
    try {
      await api.post('/proposal-requests', {
        fullName: values.fullName,
        email: values.email,
        whatsapp: values.whatsapp,
        targetCountry: values.targetCountry,
        field: values.field,
        tab: TAB_KEYS[tab],
        wantsForums: values.wantsForums === 'yes',
        certificate: certId,
      });
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  }

  if (!setting) return null;

  const fieldLabels = setting.fields || [];
  const options = setting.fieldOptions || [];

  return (
    <div className="border border-line rounded bg-surface p-6 md:p-8">
      <h2 className="font-display text-xl text-ink mb-2">{setting.heading?.[locale]}</h2>
      {setting.note?.[locale] && <p className="text-body mb-6">{setting.note[locale]}</p>}

      {authLoading && <p className="text-sage">{t('checkingCertificate')}</p>}

      {!authLoading && !user && (
        <p className="text-body">
          {t('proposalGatedNoUser')}{' '}
          <Link to={`${locale === 'en' ? '/en' : ''}/login`} className="text-saffron-deep font-medium">
            {t('loginLink')}
          </Link>
        </p>
      )}

      {!authLoading && user && certState === 'checking' && (
        <p className="text-sage">{t('checkingCertificate')}</p>
      )}

      {!authLoading && user && certState === 'none' && (
        <p className="text-body">{t('proposalGatedNoCert')}</p>
      )}

      {!authLoading && user && certState === 'ready' && (
        <>
          <div className="flex flex-wrap gap-2 mb-6" role="tablist">
            {setting.tabs?.map((tabLabel, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={tab === i}
                onClick={() => setTab(i)}
                className="border-0"
              >
                <Pill tone={tab === i ? 'saffron' : 'default'}>{tabLabel[locale]}</Pill>
              </button>
            ))}
          </div>

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
              {...register('targetCountry')}
              error={errors.targetCountry ? t('required', { ns: 'common' }) : undefined}
            />
            <div className="md:col-span-2">
              <Controller
                control={control}
                name="field"
                render={({ field: f }) => (
                  <Select label={fieldLabels[4]?.[locale] || t('proposalFieldOption')} {...f}>
                    <option value="" disabled>
                      {t('proposalFieldOption')}
                    </option>
                    {options.map((opt, i) => (
                      <option key={i} value={opt[locale]}>
                        {opt[locale]}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </div>
            <div className="md:col-span-2">
              <Controller
                control={control}
                name="wantsForums"
                render={({ field: f }) => (
                  <Select label={fieldLabels[5]?.[locale] || t('wantsForumsLabel')} {...f}>
                    <option value="yes">{t('wantsForumsYes')}</option>
                    <option value="no">{t('wantsForumsNo')}</option>
                  </Select>
                )}
              />
            </div>

            {status === 'success' && (
              <p className="md:col-span-2 text-sm text-success" role="status">
                {t('proposalSuccess')}
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
        </>
      )}
    </div>
  );
}
