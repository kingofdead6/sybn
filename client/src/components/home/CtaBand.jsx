import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Button from '../ui/Button';

export default function CtaBand() {
  const { t } = useTranslation('home');
  const { locale } = useLocale();
  const [cta, setCta] = useState(null);
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get('/settings/cta.band').catch(() => ({ data: { data: null } })),
      api.get('/settings/brand').catch(() => ({ data: { data: null } })),
    ]).then(([ctaRes, brandRes]) => {
      if (!mounted) return;
      setCta(ctaRes.data.data);
      setBrand(brandRes.data.data);
    });
    return () => { mounted = false; };
  }, []);

  if (!cta) return null;

  const phone = brand?.phone || '';
  const waDigits = phone.replace(/[^\d]/g, '').replace(/^0+/, '');

  return (
    <section className="bg-ink text-on-ink py-9 md:py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6 flex flex-col items-center gap-6 text-center">
        <h2 className="font-display text-xl md:text-2xl font-bold">{cta.heading?.[locale]}</h2>
        {cta.sub?.[locale] && <p className="max-w-2xl text-sm opacity-90">{cta.sub[locale]}</p>}

        {phone && (
          <p className="text-md">
            <span dir="ltr" className="font-medium">{phone}</span>
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          {waDigits && (
            <Button as="a" href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer" variant="primary">
              {t('cta.whatsapp')}
            </Button>
          )}
          {phone && (
            <Button as="a" href={`tel:${phone.replace(/\s+/g, '')}`} variant="secondary" className="border-on-ink text-on-ink hover:bg-on-ink hover:text-ink">
              {t('cta.call')}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
