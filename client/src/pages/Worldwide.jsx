import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
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

      {/* The masthead and the map are one band: the claim, then the evidence
          for it, on a tinted ground that sets the page apart from the regions
          ledger below. */}
      <Section tone="surface" label={isAr ? 'حول العالم' : 'Worldwide'}>
        <div className="flex flex-col items-center gap-5 text-center">
          <h1 className="font-display text-3xl md:text-4xl leading-[1.08] text-ink max-w-[26ch]">
            {isAr ? 'البرنامج حول العالم' : 'The Program Worldwide'}
          </h1>
          <p className="text-md leading-relaxed text-ink-soft max-w-[62ch]">
            {t('worldwideIntro')}
          </p>
        </div>

        {/* The map runs wider than the text measure — it is the page's
            centrepiece, so it gets the room to be read. */}
        <Reveal from="up" className="mt-10 md:mt-12">
          <WorldMap
            src={map?.mapImage}
            alt={
              isAr ? 'خريطة انتشار البرنامج حول العالم' : 'Map of the programme around the world'
            }
            caption={map?.mapCaption?.[locale]}
            /* The swatches are sampled from the artwork itself rather than
               taken from the palette — a legend has to match the map it
               describes, and both of its categories are blues. */
            legend={[
              { label: t('mapActive'), color: '#1F6FBF' },
              { label: t('mapIntroduced'), color: '#A8CFEA' },
            ]}
          />
        </Reveal>
      </Section>

      {/* Reach, stated as figures — its own band so the numbers land rather
          than trailing the map. */}
      {status === 'ready' && members.length > 0 && (
        <Section id="numbers" className="scroll-mt-24">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-3">
            {[
              { label: t('statCountries'), value: String(totalCountries) },
              { label: t('statMembers'), value: String(members.length) },
              { label: t('statRegions'), value: String(present.length) },
            ].map((s, i) => (
              <Reveal
                key={s.label}
                from="up"
                delay={i * 0.05}
                className="bg-bg p-6 text-center md:p-8"
              >
                <dd className="numerals font-display text-3xl md:text-4xl leading-none text-accent">
                  <CountUp value={s.value} />
                </dd>
                <dt className="mt-3 text-xs caps-label text-muted">{s.label}</dt>
              </Reveal>
            ))}
          </dl>
        </Section>
      )}

      <Section tone="surface" label={isAr ? 'المناطق' : 'Regions'}>
        <div className="mb-8 border-b border-rule pb-5 text-center">
          <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">
            {isAr ? 'المناطق والدول' : 'Regions and countries'}
          </h2>
        </div>

        {status === 'loading' && <p className="text-center text-muted">{t('loading')}</p>}
        {status === 'error' && <p className="text-center text-error">{t('loadError')}</p>}

        {status === 'ready' && (
          <>
            {/* Each region is a card: a numbered header rule, its counts, then
                the countries as a wrapping row of pills. Cards sit in a grid
                but keep their natural height, so a long region and a short one
                both look deliberate. */}
            <div className="grid gap-5 lg:grid-cols-2">
              {present.map(({ region, countries, count }, i) => (
                <Reveal
                  key={region}
                  from="up"
                  delay={Math.min(i, 5) * 0.05}
                  className="flex flex-col gap-4 rounded-lg border border-rule/60 bg-bg p-6 shadow-raised"
                >
                  <div className="flex items-start gap-3 border-b border-rule pb-4">
                    <span
                      className="numerals shrink-0 font-display text-lg leading-none text-accent"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg leading-snug text-ink">
                        {t(REGION_KEY_MAP[region])}
                      </h3>
                      <p className="mt-1.5 text-2xs caps-label text-muted">
                        <span className="numerals">{countries.length}</span> {t('statCountries')}
                        <span aria-hidden="true"> · </span>
                        <span className="numerals">{count}</span> {t('statMembers')}
                      </p>
                    </div>
                  </div>

                  <ul className="flex flex-wrap gap-2">
                    {countries.map((c) => (
                      <li
                        key={c}
                        className="rounded-pill border border-rule bg-surface px-3 py-1 text-xs text-ink-soft"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>

            {absent.length > 0 && (
              <p className="mt-7 text-center text-sm text-muted">
                {t('noCountriesListed')} —{' '}
                {absent.map((r) => t(REGION_KEY_MAP[r.region])).join(isAr ? '، ' : ', ')}
              </p>
            )}
          </>
        )}
      </Section>
    </motion.div>
  );
}
