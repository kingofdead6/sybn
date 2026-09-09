import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Rule from '../components/ui/Rule';
import SEO from '../components/SEO';
import Reveal from '../components/motion/Reveal';
import CountUp from '../components/motion/CountUp';

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
  const prefix = locale === 'en' ? '/en' : '';
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
    const countries = [...new Set(inRegion.map((m) => m.country).filter(Boolean))].sort();
    return { region, countries, count: inRegion.length };
  });

  // Regions with nothing in them are listed as a footnote instead of rendering
  // as large empty cards — an empty card reads as broken, a footnote as honest.
  const present = byRegion.filter((r) => r.countries.length > 0);
  const absent = byRegion.filter((r) => r.countries.length === 0);

  const totalCountries = new Set(members.map((m) => m.country).filter(Boolean)).size;

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

      <Section label={isAr ? 'حول العالم' : 'Worldwide'}>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-7">
          <h1 className="lg:col-span-5 font-display text-2xl md:text-3xl leading-tight text-ink">
            {isAr ? 'البرنامج حول العالم' : 'The Program Worldwide'}
          </h1>
          <p className="lg:col-span-7 lg:border-s lg:border-rule lg:ps-7 text-md leading-relaxed text-ink-soft self-end">
            {t('worldwideIntro')}
          </p>
        </div>

        {/* Reach, stated up front: this page's whole claim is its spread. */}
        {status === 'ready' && members.length > 0 && (
          <>
            <Rule className="my-7" />
            <dl className="grid grid-cols-2 sm:grid-cols-3 border-s border-t border-rule">
              {[
                { label: t('statCountries'), value: String(totalCountries) },
                { label: t('statMembers'), value: String(members.length) },
                { label: t('statRegions'), value: String(present.length) },
              ].map((s) => (
                <Reveal key={s.label} from="up" className="border-e border-b border-rule bg-surface p-5">
                  <dt className="text-2xs caps-label text-muted">{s.label}</dt>
                  <dd className="numerals font-display text-2xl md:text-3xl leading-none text-ink mt-2">
                    <CountUp value={s.value} />
                  </dd>
                </Reveal>
              ))}
            </dl>
          </>
        )}
      </Section>

      <Section tone="surface" label={isAr ? 'المناطق' : 'Regions'}>
        {status === 'loading' && <p className="text-muted">{t('loading')}</p>}
        {status === 'error' && <p className="text-error">{t('loadError')}</p>}

        {status === 'ready' && (
          <>
            {/* Each region is a ledger block: name, count, then its countries as
                a wrapping row. Cards no longer stretch to a shared grid height,
                so a long region and a short one both look deliberate. */}
            <div className="flex flex-col border-t border-rule">
              {present.map(({ region, countries, count }, i) => (
                <Reveal
                  key={region}
                  from="up"
                  delay={Math.min(i, 5) * 0.05}
                  className="grid gap-3 border-b border-rule py-5 lg:grid-cols-12 lg:gap-7"
                >
                  <div className="lg:col-span-4 flex items-baseline gap-3">
                    <span className="numerals shrink-0 text-2xs text-accent" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h2 className="font-display text-md leading-snug text-ink">
                        {t(REGION_KEY_MAP[region])}
                      </h2>
                      <p className="mt-1 text-2xs caps-label text-muted">
                        <span className="numerals">{countries.length}</span> {t('statCountries')}
                        <span aria-hidden="true"> · </span>
                        <span className="numerals">{count}</span> {t('statMembers')}
                      </p>
                    </div>
                  </div>

                  <ul className="lg:col-span-8 flex flex-wrap gap-x-2 gap-y-2 self-center">
                    {countries.map((c) => (
                      <li
                        key={c}
                        className="rounded-pill border border-rule bg-bg px-2.5 py-1 text-xs text-ink-soft"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>

            {absent.length > 0 && (
              <p className="mt-5 text-sm text-muted">
                {t('noCountriesListed')} —{' '}
                {absent.map((r) => t(REGION_KEY_MAP[r.region])).join('، ')}
              </p>
            )}

            <div className="mt-7">
              <Link
                to={`${prefix}/network`}
                className="inline-block border-b border-accent pb-0.5 text-sm text-accent transition-colors duration-fast ease-out hover:text-accent-deep hover:border-accent-deep"
              >
                {t('viewNetwork')}
              </Link>
            </div>
          </>
        )}
      </Section>
    </motion.div>
  );
}
