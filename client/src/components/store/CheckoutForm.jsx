import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import Input from '../ui/Input';
import Button from '../ui/Button';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  address: z.string().min(4),
  wilaya: z.string().min(2),
  paymentMethod: z.enum(['cod', 'chargily']),
});

export default function CheckoutForm({ items, total, onSuccess }) {
  const { t } = useTranslation('store');
  const [status, setStatus] = useState('idle');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      wilaya: '',
      paymentMethod: 'cod',
    },
  });

  async function onSubmit(values) {
    setStatus('sending');
    try {
      await api.post('/orders', {
        items: items.map((i) => ({ product: i.productId, title: i.title, price: i.price, qty: i.qty })),
        customer: {
          name: values.name,
          phone: values.phone,
          email: values.email,
          address: values.address,
          wilaya: values.wilaya,
        },
        total,
        paymentMethod: values.paymentMethod,
      });
      setStatus('success');
      onSuccess?.();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p className="text-success" role="status">
        {t('orderSuccess')}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <Input
        label={t('customerName')}
        {...register('name')}
        error={errors.name ? t('required', { ns: 'common' }) : undefined}
      />
      <Input
        label={t('customerPhone')}
        {...register('phone')}
        error={errors.phone ? t('required', { ns: 'common' }) : undefined}
      />
      <Input
        label={t('customerEmail')}
        type="email"
        {...register('email')}
        error={errors.email ? t('required', { ns: 'common' }) : undefined}
      />
      <Input
        label={t('customerWilaya')}
        {...register('wilaya')}
        error={errors.wilaya ? t('required', { ns: 'common' }) : undefined}
      />
      <div className="md:col-span-2">
        <Input
          label={t('customerAddress')}
          {...register('address')}
          error={errors.address ? t('required', { ns: 'common' }) : undefined}
        />
      </div>

      <div className="md:col-span-2">
        <span className="text-sm font-medium text-ink block mb-2">{t('paymentMethod')}</span>
        <Controller
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-ink-soft">
                <input
                  type="radio"
                  value="cod"
                  checked={field.value === 'cod'}
                  onChange={() => field.onChange('cod')}
                />
                {t('paymentCod')}
              </label>
              <label className="flex items-center gap-2 text-ink-soft">
                <input
                  type="radio"
                  value="chargily"
                  checked={field.value === 'chargily'}
                  onChange={() => field.onChange('chargily')}
                />
                {t('paymentChargily')}
              </label>
              {field.value === 'chargily' && <p className="text-sm text-muted">{t('chargilyNote')}</p>}
            </div>
          )}
        />
      </div>

      {status === 'error' && (
        <p className="md:col-span-2 text-sm text-error" role="alert">
          {t('orderError')}
        </p>
      )}

      <div className="md:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('sending') : t('submitOrder')}
        </Button>
      </div>
    </form>
  );
}
