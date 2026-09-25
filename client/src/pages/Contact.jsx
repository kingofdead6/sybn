import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';
import { CONTACTS, SocialIcon } from '../lib/contactInfo';

/** Arabic names for each contact point; the English names live on CONTACTS. */
const NAMES_AR = {
  whatsapp: 'واتساب',
  email: 'البريد الإلكتروني',
  instagram: 'إنستغرام',
  facebook: 'فيسبوك',
  youtube: 'يوتيوب',
};

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
  const [status, setStatus] = useState('idle');

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

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={isAr ? 'اتصل بنا | SIYB' : 'Contact Us | SIYB'}
        description={isAr ? 'تواصل مع فريق SIYB' : 'Get in touch with the SIYB team'}
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
                className="w-full rounded-md border border-rule bg-surface px-3.5 py-2.5 text-ink-soft placeholder:text-muted focus-visible:border-accent"
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

          {/* The same contact points as the footer, from the same list. */}
          <div>
            <h2 className="font-display text-md text-ink-soft mb-4">
              {isAr ? 'معلومات الاتصال' : 'Contact details'}
            </h2>
            <ul className="flex flex-col gap-3">
              {CONTACTS.map((c) => (
                <li key={c.key}>
                  <a
                    href={c.href}
                    target={c.key === 'email' ? undefined : '_blank'}
                    rel="noreferrer"
                    className="group flex items-center gap-4 rounded-lg border border-rule/60 bg-surface p-4 shadow-raised transition-shadow duration-base ease-out hover:shadow-md"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-wash text-accent">
                      <SocialIcon name={c.key} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-2xs caps-label text-muted">
                        {isAr ? NAMES_AR[c.key] : c.name}
                      </span>
                      <span
                        dir={c.ltr ? 'ltr' : undefined}
                        className={`block truncate font-medium text-ink transition-colors group-hover:text-accent ${
                          c.key === 'whatsapp' ? 'numerals' : ''
                        }`}
                      >
                        {c.label}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </motion.div>
  );
}
