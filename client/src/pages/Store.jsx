import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Rule from '../components/ui/Rule';
import Accordion, { AccordionItem } from '../components/ui/Accordion';
import SEO from '../components/SEO';
import Reveal from '../components/motion/Reveal';
import ProductRequestForm from '../components/store/ProductRequestForm';

export default function Store() {
  const { locale } = useLocale();
  const { t } = useTranslation('store');
  const reduceMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
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
    const params = category ? { category } : {};
    api
      .get('/products', { params })
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
  }, [category]);

  const prefix = locale === 'en' ? '/en' : '';
  const categories = content?.categories || [];
  const isEmpty = status === 'ready' && products.length === 0;

  function selectCategory(value) {
    setSearchParams(value ? { category: value } : {});
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO title={content?.title?.[locale]} description={content?.intro?.[locale]} path="/store" />

      <Section label={content?.title?.[locale]}>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-7">
          <h1 className="lg:col-span-5 font-display text-2xl md:text-3xl leading-tight text-ink">
            {content?.title?.[locale]}
          </h1>
          {content?.intro?.[locale] && (
            <p className="lg:col-span-7 lg:border-s lg:border-rule lg:ps-7 text-md leading-relaxed text-ink-soft self-end">
              {content.intro[locale]}
            </p>
          )}
        </div>

        {/* Categories are visible facets, not a collapsed dropdown: they are the
            only signal of what this store will carry while it has no stock. */}
        {categories.length > 0 && (
          <>
            <Rule className="my-7" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="me-1 text-2xs caps-label text-muted">{t('filterByCategory')}</span>
              <button
                type="button"
                onClick={() => selectCategory('')}
                aria-pressed={category === ''}
                className={`rounded-pill border px-3 py-1.5 text-xs transition-colors duration-fast ease-out ${
                  category === ''
                    ? 'border-accent bg-accent text-on-accent'
                    : 'border-rule bg-surface text-ink-soft hover:border-ink'
                }`}
              >
                {t('allCategories')}
              </button>
              {categories.map((c, i) => {
                const value = c[locale];
                const active = category === value;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectCategory(value)}
                    aria-pressed={active}
                    className={`rounded-pill border px-3 py-1.5 text-xs transition-colors duration-fast ease-out ${
                      active
                        ? 'border-accent bg-accent text-on-accent'
                        : 'border-rule bg-surface text-ink-soft hover:border-ink'
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {status === 'error' && <p className="mt-6 text-error">{t('emptyStateTitle')}</p>}

        {isEmpty && (
          /* Empty is the store's normal state for now, so it is set as a proper
             notice on the grid rather than a lone box in a field of nothing. */
          <div className="mt-7 border-s-2 border-s-accent bg-surface px-5 py-6 md:px-7 md:py-7">
            <p className="font-display text-lg text-ink">{t('emptyStateTitle')}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted max-w-prose">
              {t('emptyStateBody')}
            </p>
            {category && (
              <button
                type="button"
                onClick={() => selectCategory('')}
                className="mt-4 inline-block border-b border-accent pb-0.5 text-sm text-accent transition-colors duration-fast ease-out hover:text-accent-deep hover:border-accent-deep"
              >
                {t('allCategories')}
              </button>
            )}
          </div>
        )}

        {status === 'ready' && products.length > 0 && (
          <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal key={p.slug} as="li" from="up" delay={Math.min(i, 8) * 0.05}>
                <article className="flex h-full flex-col overflow-hidden rounded-lg border border-rule/60 bg-surface shadow-raised transition-shadow duration-base ease-out hover:shadow-md">
                  <div className="aspect-square w-full overflow-hidden border-b border-rule bg-sunk">
                    {p.images?.[0] && (
                      <img
                        src={p.images[0]}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h2 className="font-display text-md leading-snug text-ink">
                      <Link
                        to={`${prefix}/store/${p.slug}`}
                        className="transition-colors duration-fast ease-out hover:text-accent"
                      >
                        {p.title?.[locale]}
                      </Link>
                    </h2>
                    <p className="numerals mt-auto text-sm font-medium text-ink">
                      {p.price} <span className="text-2xs caps-label text-muted">{p.currency}</span>
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        )}
      </Section>

      {content?.faq && (
        <Section tone="surface" label={content.faq.heading?.[locale]}>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-7">
            <h2 className="lg:col-span-4 font-display text-xl md:text-2xl leading-tight text-ink">
              {content.faq.heading?.[locale]}
            </h2>
            <div className="lg:col-span-8">
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
          </div>
        </Section>
      )}

      {/* The store is stocked on request: visitors ask, the admin lists. */}
      <Section id="request-item" label={t('request.heading')}>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-7">
          <div className="lg:col-span-4 flex flex-col gap-3">
            <h2 className="font-display text-xl md:text-2xl leading-tight text-ink">
              {t('request.heading')}
            </h2>
            <p className="text-sm leading-relaxed text-ink-soft max-w-prose">
              {t('request.intro')}
            </p>
          </div>
          <div className="lg:col-span-8 rounded-lg border border-rule/60 bg-surface p-6 shadow-raised md:p-8">
            <ProductRequestForm />
          </div>
        </div>
      </Section>
    </motion.div>
  );
}
