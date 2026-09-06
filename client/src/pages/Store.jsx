import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Select from '../components/ui/Select';
import Rule from '../components/ui/Rule';
import Accordion, { AccordionItem } from '../components/ui/Accordion';
import SEO from '../components/SEO';

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

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO title={content?.title?.[locale]} description={content?.intro?.[locale]} path="/store" />

      <Section>
        <h1 className="font-display text-2xl md:text-3xl text-ink mb-4">{content?.title?.[locale]}</h1>
        {content?.intro?.[locale] && <p className="text-body max-w-3xl mb-8">{content.intro[locale]}</p>}

        {content?.categories?.length > 0 && (
          <div className="max-w-xs mb-8">
            <Select
              label={t('filterByCategory')}
              value={category}
              onChange={(e) => {
                const next = e.target.value;
                setSearchParams(next ? { category: next } : {});
              }}
            >
              <option value="">{t('allCategories')}</option>
              {content.categories.map((c, i) => (
                <option key={i} value={c[locale]}>
                  {c[locale]}
                </option>
              ))}
            </Select>
          </div>
        )}

        {status === 'ready' && products.length === 0 && (
          <div className="border border-line rounded p-8 text-center bg-surface mb-8">
            <p className="font-medium text-ink mb-1">{t('emptyStateTitle')}</p>
            <p className="text-sage">{t('emptyStateBody')}</p>
          </div>
        )}

        {status === 'ready' && products.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {products.map((p) => (
              <Link
                key={p.slug}
                to={`${prefix}/store/${p.slug}`}
                className="border border-line rounded overflow-hidden bg-surface block"
              >
                {p.images?.[0] && (
                  <img src={p.images[0]} alt={p.title?.[locale]} className="w-full aspect-square object-cover" />
                )}
                <div className="p-4">
                  <p className="font-medium text-ink">{p.title?.[locale]}</p>
                  <p className="text-sm text-saffron-deep mt-1">
                    {p.price} {p.currency}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {content?.faq && (
        <Section tone="surface">
          <h2 className="font-display text-xl text-ink mb-4">{content.faq.heading?.[locale]}</h2>
          <Rule className="mb-2" />
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
        </Section>
      )}
    </motion.div>
  );
}
