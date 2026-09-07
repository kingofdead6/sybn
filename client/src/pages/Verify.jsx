import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import { formatDate } from '../lib/format';
import Section from '../components/ui/Section';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Pill from '../components/ui/Pill';
import SEO from '../components/SEO';

const schema = z.object({
  number: z.string().min(1),
});

export default function Verify() {
  const { locale } = useLocale();
  const reduceMotion = useReducedMotion();
  const [title, setTitle] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let active = true;
    api
      .get('/settings/certVerify.page')
      .then(({ data }) => {
        if (active) setTitle(data.data?.title);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { number: '' } });

  async function onSubmit(values) {
    setStatus('checking');
    setError('');
    setResult(null);
    try {
      const { data } = await api.post('/verify-certificate', { number: values.number.trim() });
      setResult(data.data);
      setStatus('found');
    } catch (err) {
      setError(err.response?.data?.error || (locale === 'ar' ? 'حدث خطأ ما' : 'Something went wrong'));
      setStatus('notfound');
    }
  }

  const isAr = locale === 'ar';

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={title?.[locale] || (isAr ? 'تحقق من صحة شهادتك' : 'Verify Your Certificate')}
        description={isAr ? 'تحقق من صحة شهادات المنظمة الدولية للعمل' : 'Verify the validity of ILO certificates'}
        path="/verify"
      />

      <Section>
        <h1 className="font-display text-2xl md:text-3xl text-ink mb-8">
          {title?.[locale] || (isAr ? 'تحقق من صحة شهادتك' : 'Verify Your Certificate')}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 max-w-xl mb-8">
          <div className="flex-1">
            <Input
              label={isAr ? 'رقم الشهادة' : 'Certificate number'}
              {...register('number')}
              error={errors.number ? (isAr ? 'أدخل رقم الشهادة' : 'Enter a certificate number') : undefined}
            />
          </div>
          <div className="shrink-0 self-end">
            <Button type="submit" disabled={isSubmitting}>
              {isAr ? 'تحقق' : 'Verify'}
            </Button>
          </div>
        </form>

        <div aria-live="polite">
          {status === 'found' && result && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="border border-rule rounded-sm p-6 bg-surface max-w-xl"
            >
              <Pill tone={result.status === 'valid' ? 'success' : 'clay'}>
                {result.status === 'valid' ? (isAr ? 'سارية' : 'Valid') : isAr ? 'ملغاة' : 'Revoked'}
              </Pill>
              <p className="font-display text-lg text-ink mt-4">{result.holderName}</p>
              <p className="text-ink-soft mt-1">{result.program?.title?.[locale]}</p>
              <p className="text-sm text-muted mt-2">{formatDate(result.issuedAt, locale)}</p>
            </motion.div>
          )}

          {status === 'notfound' && (
            <p className="text-error max-w-xl" role="alert">
              {error}
            </p>
          )}
        </div>
      </Section>
    </motion.div>
  );
}
