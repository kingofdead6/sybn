import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Button from '../ui/Button';
import Tile from '../ui/Tile';

/**
 * Closing call to action. The one accent-toned tile on the grid — it is the
 * single dominant action on the page, so it gets the only filled ground.
 * The phone number is the operative fact, set large and tabular.
 */
export default function CtaBand() {
  const { t } = useTranslation('home');
  const { t: tc } = useTranslation('common');
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
    <Tile id="contact-cta" as="section" span="xl" tone="accent" label={tc('phone')}>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-xl md:text-2xl leading-tight max-w-[24ch]">
            {cta.heading?.[locale]}
          </h2>
          {cta.sub?.[locale] && (
            <p className="text-sm leading-relaxed opacity-80 max-w-[46ch]">
              {cta.sub[locale]}
            </p>
          )}
          {phone && (
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              dir="ltr"
              className="numerals font-display text-lg md:text-xl leading-none self-start transition-opacity duration-fast ease-out hover:opacity-70"
            >
              {phone}
            </a>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {waDigits && (
            <Button
              as="a"
              href={`https://wa.me/${waDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="!bg-on-accent !border-on-accent !text-accent hover:!opacity-90"
            >
              {t('cta.whatsapp')}
            </Button>
          )}
          {phone && (
            <Button
              as="a"
              href={`tel:${phone.replace(/\s+/g, '')}`}
              variant="secondary"
              className="!bg-transparent !border-on-accent/50 !text-on-accent hover:!border-on-accent"
            >
              {t('cta.call')}
            </Button>
          )}
        </div>
      </div>
    </Tile>
  );
}
