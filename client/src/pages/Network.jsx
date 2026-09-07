import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Select from '../components/ui/Select';
import SEO from '../components/SEO';

const REGIONS = [
  'leadership',
  'mena',
  'sub-saharan-africa',
  'europe-central-asia',
  'companies-institutions',
  'training-institutes',
];

const REGION_KEY_MAP = {
  leadership: 'regionLeadership',
  mena: 'regionMena',
  'sub-saharan-africa': 'regionSubSaharanAfrica',
  'europe-central-asia': 'regionEuropeCentralAsia',
  'companies-institutions': 'regionCompaniesInstitutions',
  'training-institutes': 'regionTrainingInstitutes',
};

export default function Network() {
  const { locale } = useLocale();
  const { t } = useTranslation('network');
  const reduceMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
  const region = searchParams.get('region') || '';
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    api
      .get('/team', { params: region ? { region } : {} })
      .then(({ data }) => {
        if (active) {
          setMembers(data.data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [region]);

  const prefix = locale === 'en' ? '/en' : '';
  const isAr = locale === 'ar';

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={isAr ? 'شبكة الخبراء | أبسط' : 'Expert Network | ABCET'}
        description={isAr ? 'شبكة خبراء ومدربين ومؤسسات شريكة للبرنامج' : 'The program network of experts, trainers, and partner institutions'}
        path="/network"
      />

      <Section>
        <h1 className="font-display text-2xl md:text-3xl text-ink mb-6">{isAr ? 'شبكة الخبراء' : 'Expert Network'}</h1>

        <div className="max-w-xs mb-8">
          <Select
            label={t('filterByRegion')}
            value={region}
            onChange={(e) => {
              const next = e.target.value;
              setSearchParams(next ? { region: next } : {});
            }}
          >
            <option value="">{t('allRegions')}</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {t(REGION_KEY_MAP[r])}
              </option>
            ))}
          </Select>
        </div>

        {status === 'loading' && <p className="text-muted">{t('loading')}</p>}
        {status === 'error' && <p className="text-error">{t('loadError')}</p>}
        {status === 'ready' && members.length === 0 && <p className="text-muted">{t('noMembers')}</p>}

        {status === 'ready' && members.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <Link
                key={m.slug}
                to={`${prefix}/network/${m.slug}`}
                className="flex items-start gap-3 border border-rule rounded-sm p-4 bg-surface"
              >
                <img
                  src={m.photo}
                  alt={m.name?.[locale] || ''}
                  className="w-14 h-14 rounded object-cover shrink-0 bg-bg"
                />
                <div>
                  <p className="font-medium text-ink">{m.name?.[locale]}</p>
                  <p className="text-sm text-ink-soft">{m.role?.[locale]}</p>
                  {m.country && <p className="text-xs text-muted mt-1">{m.country}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </motion.div>
  );
}
