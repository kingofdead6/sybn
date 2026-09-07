import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Rule from '../components/ui/Rule';
import SEO from '../components/SEO';

export default function CategoryDetail() {
  const { slug } = useParams();
  const { locale } = useLocale();
  const { t } = useTranslation('programs');
  const reduceMotion = useReducedMotion();
  const [category, setCategory] = useState(null);
  const [siblings, setSiblings] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    Promise.all([api.get(`/categories/${slug}`), api.get('/categories')])
      .then(([one, all]) => {
        if (!active) return;
        setCategory(one.data.data);
        setSiblings(all.data.data.filter((c) => c.slug !== slug));
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (status === 'loading') {
    return (
      <Section>
        <p className="text-muted">{t('loading')}</p>
      </Section>
    );
  }

  if (status === 'error' || !category) {
    return (
      <Section>
        <p className="text-error">{t('categoryLoadError')}</p>
      </Section>
    );
  }

  const prefix = locale === 'en' ? '/en' : '';

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={category.title?.[locale]}
        description={category.description?.[locale]}
        path={`/categories/${category.slug}`}
      />
      <Section>
        <h1 className="font-display text-2xl md:text-3xl text-ink mb-4">{category.title?.[locale]}</h1>
        {category.description?.[locale] && (
          <p className="text-ink-soft max-w-3xl mb-8">{category.description[locale]}</p>
        )}

        <p className="text-muted max-w-3xl mb-8">{t('categoryComingSoon')}</p>

        <Rule className="mb-6" />

        <h2 className="font-display text-md text-ink-soft mb-4">{t('categoriesHeading')}</h2>
        <ul className="flex flex-col gap-1">
          {siblings.map((c) => (
            <li key={c.slug}>
              <Link to={`${prefix}/categories/${c.slug}`} className="text-accent font-medium">
                {c.title?.[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </motion.div>
  );
}
