import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Rule from '../components/ui/Rule';
import SEO from '../components/SEO';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5),
});

export default function Contact() {
  const { locale } = useLocale();
  const reduceMotion = useReducedMotion();
  const [brand, setBrand] = useState(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let active = true;
    api
      .get('/settings/brand')
      .then(({ data }) => {
        if (active) setBrand(data.data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  });

  async function onSubmit(values) {
    setStatus('sending');
    try {
      await api.post('/enquiries', { ...values, source: 'contact' });
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  }

  const isAr = locale === 'ar';
  const waNumber = brand?.whatsapp?.replace(/[^\d]/g, '');

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={isAr ? 'اتصل بنا | أبسط' : 'Contact Us | ABCET'}
        description={isAr ? 'تواصل مع فريق أبسط' : 'Get in touch with the ABCET team'}
        path="/contact"
      />

      <Section>
        <h1 className="font-display text-2xl md:text-3xl text-ink mb-8">{isAr ? 'اتصل بنا' : 'Contact Us'}</h1>

        <div className="grid gap-10 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label={isAr ? 'الإسم' : 'Name'}
              {...register('name')}
              error={errors.name ? (isAr ? 'حقل إلزامي' : 'Required') : undefined}
            />
            <Input
              label={isAr ? 'البريد الإلكتروني' : 'Email'}
              type="email"
              {...register('email')}
              error={errors.email ? (isAr ? 'حقل إلزامي' : 'Required') : undefined}
            />
            <Input label={isAr ? 'الهاتف (اختياري)' : 'Phone (optional)'} {...register('phone')} />
            <Input label={isAr ? 'الموضوع (اختياري)' : 'Subject (optional)'} {...register('subject')} />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-medium text-ink">
                {isAr ? 'الرسالة' : 'Message'}
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full rounded border border-rule bg-surface px-3.5 py-2.5 text-ink-soft placeholder:text-muted focus-visible:border-accent"
                {...register('message')}
              />
              {errors.message && (
                <span className="text-xs text-error">{isAr ? 'حقل إلزامي' : 'Required'}</span>
              )}
            </div>

            {status === 'success' && (
              <p className="text-sm text-success" role="status">
                {isAr ? 'تم استلام رسالتكم بنجاح.' : 'Your message has been received.'}
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-error" role="alert">
                {isAr ? 'تعذر إرسال الرسالة.' : 'Could not send the message.'}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (isAr ? 'جارٍ الإرسال...' : 'Sending...') : isAr ? 'إرسال' : 'Send'}
            </Button>
          </form>

          {brand && (
            <div>
              <h2 className="font-display text-md text-ink-soft mb-4">
                {isAr ? 'معلومات الاتصال' : 'Contact details'}
              </h2>
              <div className="flex flex-col gap-3 text-ink-soft">
                {brand.phone && (
                  <a href={`tel:${brand.phone.replace(/\s/g, '')}`} className="text-accent font-medium">
                    {brand.phone}
                  </a>
                )}
                {brand.email && (
                  <a href={`mailto:${brand.email}`} className="text-accent font-medium">
                    {brand.email}
                  </a>
                )}
                {waNumber && (
                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent font-medium"
                  >
                    {isAr ? 'واتساب' : 'WhatsApp'}
                  </a>
                )}
                <Rule className="my-2" />
                {brand.facebook && (
                  <a href={brand.facebook} target="_blank" rel="noreferrer" className="text-accent font-medium">
                    Facebook
                  </a>
                )}
                {brand.youtube && (
                  <a href={brand.youtube} target="_blank" rel="noreferrer" className="text-accent font-medium">
                    YouTube
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </Section>
    </motion.div>
  );
}
