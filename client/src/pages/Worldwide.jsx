import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
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

export default function Worldwide() {
  const { locale } = useLocale();
  const { t } = useTranslation('network');
  const reduceMotion = useReducedMotion();
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    api
      .get('/team')
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
  }, []);

  const isAr = locale === 'ar';

  const byRegion = REGIONS.map((region) => {
    const inRegion = members.filter((m) => m.region === region);
    const countries = [...new Set(inRegion.map((m) => m.country).filter(Boolean))];
    return { region, countries };
  });

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={isAr ? 'البرنامج حول العالم | أبسط' : 'The Program Worldwide | ABCET'}
        description={t('worldwideIntro')}
        path="/worldwide"
      />

      <Section>
        <h1 className="font-display text-2xl md:text-3xl text-ink mb-4">
          {isAr ? 'البرنامج حول العالم' : 'The Program Worldwide'}
        </h1>
        <p className="text-body max-w-3xl mb-8">{t('worldwideIntro')}</p>

        {status === 'loading' && <p className="text-sage">{t('loading')}</p>}
        {status === 'error' && <p className="text-clay">{t('loadError')}</p>}

        {status === 'ready' && (
          <div className="grid gap-6 md:grid-cols-2">
            {byRegion.map(({ region, countries }) => (
              <div key={region} className="border border-line rounded-lg shadow-sm p-5 bg-surface">
                <h2 className="font-display text-md text-ink mb-3">{t(REGION_KEY_MAP[region])}</h2>
                {countries.length > 0 ? (
                  <ul className="flex flex-col gap-1">
                    {countries.map((c) => (
                      <li key={c} className="text-body text-sm py-1 border-b border-line last:border-0">
                        {c}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sage text-sm">{t('noCountriesListed')}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>
    </motion.div>
  );
}
