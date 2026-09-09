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
  category: z.string().optional(),
  budget: z.string().optional(),
  quantity: z.coerce.number().int().min(1).optional(),
});

/**
 * Visitors ask for an item to be stocked. Nothing here reaches the storefront
 * directly — the admin reviews each request and lists the item himself.
 */
export default function ProductRequestForm() {
  const { t } = useTranslation('store');
  const { t: tc } = useTranslation('common');
  const [status, setStatus] = useState('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      itemTitle: '',
      itemDescription: '',
      category: '',
      budget: '',
      quantity: 1,
    },
  });

  async function onSubmit(values) {
    setStatus('sending');
    try {
      await api.post('/product-requests', values);
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  }

  const req = tc('required');

  if (status === 'success') {
    return (
      <p className="text-success" role="status">
        {t('request.success')}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <Input
        label={t('request.name')}
        {...register('name')}
        error={errors.name ? req : undefined}
      />
      <Input
        label={t('request.email')}
        type="email"
        {...register('email')}
        error={errors.email ? req : undefined}
      />
      <Input label={t('request.phone')} {...register('phone')} />
      <Input label={t('request.category')} {...register('category')} />

      <div className="md:col-span-2">
        <Input
          label={t('request.itemTitle')}
          {...register('itemTitle')}
          error={errors.itemTitle ? req : undefined}
        />
      </div>

      <div className="md:col-span-2 flex flex-col gap-1.5">
        <label htmlFor="itemDescription" className="text-xs caps-label text-muted">
          {t('request.itemDescription')}
        </label>
        <textarea
          id="itemDescription"
          rows={4}
          aria-invalid={!!errors.itemDescription}
          className="w-full rounded-md border border-rule bg-surface px-3.5 py-2.5 text-ink placeholder:text-muted transition-colors duration-fast ease-out focus-visible:border-accent"
          {...register('itemDescription')}
        />
        {errors.itemDescription && <span className="text-xs text-error">{req}</span>}
      </div>

      <Input label={t('request.budget')} {...register('budget')} />
      <Input label={t('request.quantity')} type="number" min="1" {...register('quantity')} />

      {status === 'error' && (
        <p className="md:col-span-2 text-sm text-error" role="alert">
          {t('request.error')}
        </p>
      )}

      <div className="md:col-span-2 mt-2 border-t border-rule pt-5">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('sending') : t('request.submit')}
        </Button>
      </div>
    </form>
  );
}
