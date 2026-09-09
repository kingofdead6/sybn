import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Button from '../ui/Button';
import Reveal from '../motion/Reveal';
import AscentEdge from '../motion/AscentEdge';

/**
 * Closing call to action. The band sits on --c-ink directly above the footer,
 * which is also ink — so it carries its own top and bottom rules to stay a
 * distinct plate rather than dissolving into one continuous black mass.
 *
 * Contact details are laid out as a ledger (label / value) rather than a stray
 * paragraph: the phone number is the operative fact here, so it is set large and
 * tabular, and the two buttons act on it instead of repeating it.
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
    <section
      id="contact-cta"
      className="relative bg-ink text-on-ink py-9 md:py-10"
    >
      <div className="mx-auto max-w-[86rem] px-4 md:px-8">
        <div className="grid items-center gap-7 lg:grid-cols-12 lg:gap-7">
          {/* The proposition. Held to a measure so the rag stays controlled. */}
          <Reveal from="start" className="lg:col-span-7 flex flex-col gap-4">
            <AscentEdge label={tc('phone')} labelClassName="text-on-ink/70" />
            <h2 className="font-display text-xl md:text-2xl leading-tight max-w-[26ch]">
              {cta.heading?.[locale]}
            </h2>
            {cta.sub?.[locale] && (
              <p className="text-sm leading-relaxed text-on-ink/70 max-w-[46ch]">
                {cta.sub[locale]}
              </p>
            )}
          </Reveal>

          {/* The channel ledger — one rule-separated row per way to reach us. */}
          <Reveal from="end" delay={0.1} className="lg:col-span-5 lg:border-s lg:border-on-ink/15 lg:ps-7">
            <dl>
              {phone && (
                <div className="flex flex-col gap-1.5">
                  {/* 70%, not less: at 55% this label falls to 3.89:1 in dark mode. */}
                  <dt className="text-2xs caps-label text-on-ink/70">{tc('phone')}</dt>
                  <dd>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      dir="ltr"
                      className="numerals font-display text-lg md:text-xl leading-none transition-opacity duration-fast ease-out hover:opacity-70"
                    >
                      {phone}
                    </a>
                  </dd>
                </div>
              )}

            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {waDigits && (
                <Button
                  as="a"
                  href={`https://wa.me/${waDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                >
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
