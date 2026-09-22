import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Accordion, { AccordionItem } from '../components/ui/Accordion';
import SEO from '../components/SEO';
import Reveal from '../components/motion/Reveal';
import AscentEdge from '../components/motion/AscentEdge';
import Button from '../components/ui/Button';

export default function Store() {
  const { locale } = useLocale();
  const { t } = useTranslation('store');
  const reduceMotion = useReducedMotion();
  const [content, setContent] = useState(null);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    api
      .get('/settings/store.content')
      .then(({ data }) => {
        if (active) setContent(data.data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    api
      .get('/products')
      .then(({ data }) => {
        if (active) {
          setProducts(data.data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, []);

  const prefix = locale === 'en' ? '/en' : '';
  const isAr = locale === 'ar';
  const isEmpty = status === 'ready' && products.length === 0;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO title={content?.title?.[locale]} description={content?.intro?.[locale]} path="/store" />

      {/* Masthead — centred, with the route to building your own shop offered
          up front rather than buried under the catalogue. */}
      <Section tone="surface">
        <div className="flex flex-col items-center gap-5 text-center">
          <AscentEdge label={isAr ? 'المتجر' : 'Store'} centered />

          <h1 className="font-display text-3xl md:text-4xl leading-[1.08] text-ink max-w-[24ch]">
            {content?.title?.[locale]}
          </h1>

          {content?.intro?.[locale] && (
            <p className="text-md leading-relaxed text-ink-soft max-w-[62ch]">
              {content.intro[locale]}
            </p>
          )}

          <div className="mt-2">
            <Button as={Link} to={`${prefix}/store/create-your-shop`} variant="primary" size="lg">
              {t('createShop.cta')}
            </Button>
          </div>
        </div>
      </Section>

      <Section label={t('productsHeading')}>
        {status === 'error' && <p className="text-center text-error">{t('emptyStateTitle')}</p>}

        {isEmpty && (
          <div className="mx-auto max-w-[62ch] rounded-lg border border-rule/60 bg-surface p-8 text-center shadow-raised">
            <p className="font-display text-lg text-ink">{t('emptyStateTitle')}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t('emptyStateBody')}</p>
          </div>
        )}

        {status === 'ready' && products.length > 0 && (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p.slug} as="li" from="up" delay={Math.min(i, 8) * 0.05}>
                {/* The whole card is the link, and it leaves the site — the
                    product is sold wherever the admin pointed it. */}
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-rule/60 bg-surface shadow-raised transition-shadow duration-base ease-out hover:shadow-md"
                >
                  <div className="aspect-square w-full overflow-hidden border-b border-rule bg-sunk">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-base ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-full w-full items-center justify-center text-accent/25"
                      >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                          <path d="M4 7h16l-1.4 12.2a2 2 0 01-2 1.8H7.4a2 2 0 01-2-1.8L4 7zm4 0a4 4 0 118 0" stroke="currentColor" strokeWidth="1.25" />
                        </svg>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h2 className="font-display text-md leading-snug text-ink transition-colors group-hover:text-accent">
                      {p.title?.[locale]}
                    </h2>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-accent">
                      {t('visitProduct')}
                      <span aria-hidden="true">{isAr ? '←' : '→'}</span>
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </ul>
        )}
      </Section>

      {content?.faq && (
        <Section tone="surface" label={content.faq.heading?.[locale]}>
          <div className="mb-8 border-b border-rule pb-5 text-center">
            <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">
              {content.faq.heading?.[locale]}
            </h2>
          </div>
          <div className="mx-auto max-w-3xl">
            <Accordion>
              {content.faq.items?.map((item, i) => (
                <AccordionItem key={i} title={item.question?.[locale]}>
                  {Array.isArray(item.answer?.[locale]) ? (
                    <ul className="flex flex-col gap-1">
                      {item.answer[locale].map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{item.answer?.[locale]}</p>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Section>
      )}
    </motion.div>
  );
}
