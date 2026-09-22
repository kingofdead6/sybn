import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Rule from '../components/ui/Rule';
import SEO from '../components/SEO';
import Reveal from '../components/motion/Reveal';
import CountUp from '../components/motion/CountUp';
import WorldMap from '../components/ui/WorldMap';

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
  // The map artwork is shared with the About page's numbers band, so both
  // read from the one `about.stats` record rather than two uploads.
  const [map, setMap] = useState(null);

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

    api
      .get('/settings/about.stats')
      .then(({ data }) => {
        if (active) setMap(data.data);
      })
      .catch(() => {});

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
        title={isAr ? 'البرنامج حول العالم | SIYB' : 'The Program Worldwide | SIYB'}
        description={t('worldwideIntro')}
        path="/worldwide"
      />

      <Section label={isAr ? 'حول العالم' : 'Worldwide'}>
        {/* Centred masthead, set at the same scale as the programme pages. */}
        <div className="flex flex-col items-center gap-5 text-center">
          <h1 className="font-display text-3xl md:text-4xl leading-[1.08] text-ink max-w-[26ch]">
            {isAr ? 'البرنامج حول العالم' : 'The Program Worldwide'}
          </h1>
          <p className="text-md leading-relaxed text-ink-soft max-w-[62ch]">
            {t('worldwideIntro')}
          </p>
        </div>

        {/* The spread, drawn. */}
        <WorldMap
          className="mt-9"
          src={map?.mapImage}
          alt={isAr ? 'خريطة انتشار البرنامج حول العالم' : 'Map of the programme around the world'}
          caption={map?.mapCaption?.[locale]}
        />

        {/* Reach, stated up front: this page's whole claim is its spread. */}
        {status === 'ready' && members.length > 0 && (
          <>
            <Rule className="my-7" />
            <dl
              id="numbers"
              className="grid grid-cols-2 sm:grid-cols-3 border-t border-rule scroll-mt-28"
            >
              {[
                { label: t('statCountries'), value: String(totalCountries) },
                { label: t('statMembers'), value: String(members.length) },
                { label: t('statRegions'), value: String(present.length) },
              ].map((s) => (
                <Reveal
                  key={s.label}
                  from="up"
                  className="border-b border-rule bg-surface p-5 text-center"
                >
                  <dd className="numerals font-display text-3xl md:text-4xl leading-none text-ink">
                    <CountUp value={s.value} />
                  </dd>
                  <dt className="mt-2 text-xs caps-label text-muted">{s.label}</dt>
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

          </>
        )}
      </Section>
    </motion.div>
  );
}
