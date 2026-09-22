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
 * A request to have an online shop built.
 *
 * It posts to the same `product-requests` endpoint the stock request used —
 * the shape is identical (who is asking, what they want, their budget) and the
 * admin reviews both in one inbox. `itemTitle` carries the shop's name and
 * `itemDescription` what it is meant to sell.
 */
export default function ShopRequestForm() {
  const { t } = useTranslation('store');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    setError('');
    try {
      await api.post('/product-requests', values);
      setSent(true);
      reset();
    } catch (err) {
      setError(err.response?.data?.error || t('createShop.error'));
    }
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-success/40 bg-success-wash p-8 text-center">
        <p className="font-display text-lg text-ink">{t('createShop.successTitle')}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t('createShop.successBody')}</p>
        <Button variant="secondary" className="mt-5" onClick={() => setSent(false)}>
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
