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
    <section className="relative bg-ink text-on-ink py-9 md:py-10">
      <div className="mx-auto max-w-[86rem] px-4 md:px-8 flex flex-col gap-5 md:max-w-[52ch]">
        <h2 className="font-display text-xl md:text-2xl leading-tight">{cta.heading?.[locale]}</h2>
        {cta.sub?.[locale] && <p className="text-sm opacity-80">{cta.sub[locale]}</p>}

        {phone && (
          <p className="text-md">
            <span dir="ltr" className="font-medium">{phone}</span>
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {waDigits && (
            <Button as="a" href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer" variant="primary">
              {t('cta.whatsapp')}
            </Button>
          )}
          {phone && (
            <Button
              as="a"
              href={`tel:${phone.replace(/\s+/g, '')}`}
              variant="secondary"
              className="!bg-transparent !border-on-ink/40 !text-on-ink hover:!border-on-ink"
            >
              {t('cta.call')}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
