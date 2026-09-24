import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import Input from '../ui/Input';
import Button from '../ui/Button';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  itemTitle: z.string().min(2),
  itemDescription: z.string().min(10),
  budget: z.string().optional(),
});

/**
 * The shop desk's WhatsApp numbers: `number` in international form for wa.me,
 * `label` as it is shown.
 */
export const SHOP_WHATSAPP = [
  { number: '213542120271', label: '+213 542 120 271' },
  { number: '213770313448', label: '+213 770 31 34 48' },
];

/** A wa.me link that opens a chat with one number, optionally pre-filled. */
export function shopWhatsAppUrl(number, text = '') {
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

/**
 * A request to have an online shop built.
 *
 * It is posted to the `product-requests` endpoint — `itemTitle` carries the
 * shop's name and `itemDescription` what it will sell — and the server
 * messages every one of the team's WhatsApp numbers at the same moment, so
 * the visitor has nothing more to do.
 *
 * Until those numbers are set up in the admin panel (or if every send fails)
 * the page falls back to handing the visitor a pre-filled wa.me chat for each
 * number instead, so a request is never lost.
 */
export default function ShopRequestForm() {
  const { t } = useTranslation('store');
  // 'delivered' when the server reached the team; otherwise the fallback text.
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    const fields = [
      [t('createShop.name'), values.name],
      [t('createShop.email'), values.email],
      [t('createShop.phone'), values.phone],
      [t('createShop.shopName'), values.itemTitle],
      [t('createShop.describe'), values.itemDescription],
      [t('createShop.budget'), values.budget],
    ].filter(([, v]) => v);
    const text = [
      t('createShop.waGreeting'),
      '',
      ...fields.map(([label, v]) => `${label.replace(/[?:：؟]\s*$/, '')}: ${v}`),
    ].join('\n');
    setError('');
    try {
      const { data } = await api.post('/product-requests', values);
      setResult(data.data?.whatsappSent > 0 ? 'delivered' : text);
      reset();
    } catch (err) {
      // The request never reached us — keep the form filled so it can be retried.
      setError(err.response?.data?.error || t('createShop.error'));
    }
  }

  if (result === 'delivered') {
    return (
      <div className="rounded-lg border border-success/40 bg-success-wash p-8 text-center">
        <p className="font-display text-lg text-ink">{t('createShop.deliveredTitle')}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t('createShop.deliveredBody')}</p>
        <Button variant="secondary" className="mt-5" onClick={() => setResult(null)}>
          {t('createShop.sendAnother')}
        </Button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="rounded-lg border border-success/40 bg-success-wash p-8 text-center">
        <p className="font-display text-lg text-ink">{t('createShop.successTitle')}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t('createShop.successBody')}</p>
        {/* Fallback: one pre-filled chat per number. */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {SHOP_WHATSAPP.map((w, i) => (
            <Button
              key={w.number}
              as="a"
              href={shopWhatsAppUrl(w.number, result)}
              target="_blank"
              rel="noreferrer"
              variant={i === 0 ? 'primary' : 'secondary'}
            >
              {t('createShop.sendTo')} <span dir="ltr">{w.label}</span>
            </Button>
          ))}
        </div>
        <Button variant="ghost" className="mt-4" onClick={() => setResult(null)}>
          {t('createShop.sendAnother')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label={t('createShop.name')}
          {...register('name')}
          error={errors.name && t('createShop.required')}
        />
        <Input
          label={t('createShop.email')}
          type="email"
          dir="ltr"
          {...register('email')}
          error={errors.email && t('createShop.invalidEmail')}
        />
        <Input label={t('createShop.phone')} dir="ltr" {...register('phone')} />
        <Input
          label={t('createShop.shopName')}
          {...register('itemTitle')}
          error={errors.itemTitle && t('createShop.required')}
        />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs caps-label text-muted">{t('createShop.describe')}</span>
        <textarea
          rows={5}
          {...register('itemDescription')}
          className="w-full rounded-md border border-rule bg-surface px-3.5 py-2.5 text-sm text-ink transition-colors focus-visible:border-accent"
        />
        {errors.itemDescription && (
          <span className="text-xs text-error">{t('createShop.describeError')}</span>
        )}
      </label>

      <Input label={t('createShop.budget')} {...register('budget')} />

      {error && (
        <p className="rounded-sm bg-error-wash px-4 py-2 text-sm text-error" role="alert">
          {error}
        </p>
      )}

      <div className="mt-1">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? t('createShop.sending') : t('createShop.submit')}
        </Button>
      </div>
    </form>
  );
}
