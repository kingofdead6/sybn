import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import { youTubeThumbnail } from '../lib/format';
import Section from '../components/ui/Section';
import Pill from '../components/ui/Pill';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';

const FILTERS = [
  { value: '', key: 'storiesFilterAll' },
  { value: 'lead-trainers', key: 'storiesFilterLeadTrainers' },
  { value: 'trainer-consultants', key: 'storiesFilterTrainerConsultants' },
  { value: 'entrepreneurs', key: 'storiesFilterEntrepreneurs' },
  { value: 'organizations', key: 'storiesFilterOrganizations' },
];

const LIMIT = 9;

export default function Stories() {
  const { locale } = useLocale();
  const { t } = useTranslation('network');
  const reduceMotion = useReducedMotion();
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [category]);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    const params = { page, limit: LIMIT };
    if (category) params.category = category;
    api
      .get('/stories', { params })
      .then(({ data }) => {
        if (!active) return;
        setItems((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
        setTotal(data.meta?.total ?? data.data.length);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [category, page]);

  const isAr = locale === 'ar';
  const canLoadMore = items.length < total;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={isAr ? 'قصص ونجاحات | أبسط' : 'Stories & Successes | ABCET'}
        description={isAr ? 'قصص نجاح المتدربين والمدربين والمنظمات الشريكة' : 'Success stories from trainees, trainers, and partner organizations'}
        path="/stories"
      />

      <Section>
        <h1 className="font-display text-2xl md:text-3xl text-ink mb-6">
          {isAr ? 'قصص ونجاحات' : 'Stories & Successes'}
        </h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => (
            <button key={f.value} type="button" onClick={() => setCategory(f.value)} className="border-0">
              <Pill tone={category === f.value ? 'saffron' : 'default'}>{t(f.key)}</Pill>
            </button>
          ))}
        </div>

        {status === 'loading' && items.length === 0 && <p className="text-muted">{t('storiesLoading')}</p>}
        {status === 'error' && <p className="text-error">{t('storiesLoadError')}</p>}
        {status === 'ready' && items.length === 0 && <p className="text-muted">{t('storiesEmpty')}</p>}

        {items.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {items.map((s) => {
              const thumb = s.thumbnail || youTubeThumbnail(s.videoUrl);
              return (
                <a
                  key={s.slug}
                  href={s.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block overflow-hidden rounded-lg border border-rule/60 bg-surface shadow-raised transition-shadow duration-base ease-out hover:shadow-md"
                >
                  {thumb && (
                    <img
                      src={thumb}
                      alt={s.title?.[locale] || s.country}
                      className="w-full aspect-video object-cover"
                    />
                  )}
                  <div className="p-4">
                    <p className="text-xs text-muted mb-1">{s.country}</p>
                    <p className="font-medium text-ink">{s.title?.[locale] || s.country}</p>
                    {s.excerpt?.[locale] && (
                      <p className="text-sm text-ink-soft mt-1 line-clamp-2">{s.excerpt[locale]}</p>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {canLoadMore && (
          <Button variant="secondary" onClick={() => setPage((p) => p + 1)} disabled={status === 'loading'}>
            {t('storiesLoadMore')}
          </Button>
        )}
      </Section>
    </motion.div>
  );
}
