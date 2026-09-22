import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import SEO from '../components/SEO';
import Reveal from '../components/motion/Reveal';
import AscentEdge from '../components/motion/AscentEdge';
import Button from '../components/ui/Button';
import ShopRequestForm from '../components/store/ShopRequestForm';

/**
 * Create your own e-shop: the case, the proof, and the way to ask.
 *
 * The examples are the existing admin-managed `StoreExample` records — real
 * storefronts built by graduates — so the page argues from evidence before it
 * asks anyone to fill a form.
 */
export default function CreateShop() {
  const { locale } = useLocale();
  const { t } = useTranslation('store');
  const reduceMotion = useReducedMotion();

  const [content, setContent] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get('/settings/store.examples').catch(() => ({ data: { data: null } })),
      api.get('/store-examples').catch(() => ({ data: { data: [] } })),
    ]).then(([c, e]) => {
      if (!active) return;
      setContent(c.data.data);
      setItems(e.data.data || []);
    });
    return () => {
      active = false;
    };
  }, []);

  const isAr = locale === 'ar';

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={`${t('createShop.title')} | SIYB`}
        description={t('createShop.intro')}
        path="/store/create-your-shop"
      />

      {/* 1 — The offer. */}
      <Section tone="surface">
        <div className="flex flex-col items-center gap-5 text-center">
          <AscentEdge label={isAr ? 'متجرك' : 'Your shop'} centered />

          <h1 className="font-display text-3xl md:text-4xl leading-[1.08] text-ink max-w-[24ch]">
            {t('createShop.title')}
          </h1>

          <p className="text-md leading-relaxed text-ink-soft max-w-[62ch]">
            {t('createShop.intro')}
          </p>

          <div className="mt-2">
            <Button as="a" href="#request-shop" variant="primary" size="lg">
              {t('createShop.cta')}
            </Button>
          </div>
        </div>
      </Section>

      {/* 2 — The proof: shops already built. */}
      {items.length > 0 && (
        <Section label={content?.title?.[locale] || t('createShop.examplesHeading')}>
          <div className="mb-8 border-b border-rule pb-5 text-center">
            <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">
              {content?.title?.[locale] || t('createShop.examplesHeading')}
            </h2>
            {content?.intro?.[locale] && (
              <p className="mx-auto mt-4 max-w-[62ch] text-md leading-relaxed text-ink-soft">
                {content.intro[locale]}
              </p>
            )}
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <Reveal key={item._id || item.url} as="li" from="up" delay={Math.min(i, 6) * 0.05}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-rule/60 bg-surface shadow-raised transition-shadow duration-base ease-out hover:shadow-md"
                >
                  <div className="relative w-full overflow-hidden bg-sunk pb-[62%]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-base ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center justify-center text-accent/25"
                      >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M3 9h18M5 9V6.5A1.5 1.5 0 016.5 5h11A1.5 1.5 0 0119 6.5V9m-14 0v9.5A1.5 1.5 0 006.5 20h11a1.5 1.5 0 001.5-1.5V9"
                            stroke="currentColor"
                            strokeWidth="1.25"
                          />
                        </svg>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="font-display text-md leading-snug text-ink transition-colors group-hover:text-accent">
                      {item.title?.[locale]}
                    </h3>

                    {(item.owner || item.country) && (
                      <p className="text-2xs caps-label text-muted">
                        {[item.owner, item.country].filter(Boolean).join(' · ')}
                      </p>
                    )}

                    {item.description?.[locale] && (
                      <p className="text-sm leading-relaxed text-ink-soft line-clamp-3">
                        {item.description[locale]}
                      </p>
                    )}

                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-accent">
                      {t('createShop.visitShop')}
                      <span aria-hidden="true">{isAr ? '←' : '→'}</span>
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* 3 — The ask. */}
      <Section id="request-shop" tone="surface" className="scroll-mt-24">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">
            {t('createShop.formHeading')}
          </h2>
          <p className="mx-auto mt-4 max-w-[62ch] text-md leading-relaxed text-ink-soft">
            {t('createShop.formIntro')}
          </p>
        </div>

        <div className="mx-auto max-w-3xl rounded-lg border border-rule/60 bg-bg p-6 shadow-raised md:p-8">
          <ShopRequestForm />
        </div>
      </Section>
    </motion.div>
  );
}
