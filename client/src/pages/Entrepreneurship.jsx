import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { withDefaults } from '../lib/homeDefaults';
import { useLocale } from '../context/LocaleContext';
import { programPath } from '../lib/programRoutes';
import Section from '../components/ui/Section';
import Pill from '../components/ui/Pill';
import SEO from '../components/SEO';
import Reveal from '../components/motion/Reveal';
import AscentEdge from '../components/motion/AscentEdge';
import Button from '../components/ui/Button';

/**
 * The entrepreneurship branch as a destination of its own.
 *
 * The copy comes from the "entrepreneurs" path of the admin-managed
 * `home.audiences` record, so this page and the home page's path card say the
 * same thing and are edited in one place. The programmes beneath are every
 * programme on the entrepreneurship track, in the same order as the nav.
 */
export default function Entrepreneurship() {
  const { locale } = useLocale();
  const { t } = useTranslation('programs');
  const { t: tNav } = useTranslation('nav');
  const reduceMotion = useReducedMotion();
  const prefix = locale === 'en' ? '/en' : '';

  const [data, setData] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;

    api
      .get('/settings/home.audiences')
      .then(({ data: res }) => {
        if (active) setData(res.data);
      })
      .catch(() => {});

    // Untagged programmes count as entrepreneurship, matching the nav.
    api
      .get('/programs')
      .then(({ data: res }) => {
        if (!active) return;
        setPrograms(
          (res.data || []).filter((p) => (p.track || 'entrepreneurship') === 'entrepreneurship')
        );
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, []);

  const isAr = locale === 'ar';
  const content = withDefaults('home.audiences', data, 'items');
  const path = (content?.items || []).find((i) => i.key === 'entrepreneurs');
  const bullets = path?.bullets || [];
  const title = tNav('entrepreneurship');

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={`${title} | SIYB`}
        description={path?.tagline?.[locale]}
        path="/entrepreneurship"
      />

      {/* 1 — Masthead. */}
      <Section tone="surface" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-gradient-to-b from-accent-wash to-transparent"
        />

        <div className="relative flex flex-col items-center gap-5 text-center">
          <AscentEdge label={path?.title?.[locale] || title} />

          <h1 className="font-display text-3xl md:text-4xl leading-[1.08] text-ink max-w-[26ch]">
            {title}
          </h1>

          {path?.tagline?.[locale] && (
            <p className="text-md leading-relaxed text-ink max-w-[62ch]">{path.tagline[locale]}</p>
          )}
          {path?.body?.[locale] && (
            <p className="text-md leading-relaxed text-ink-soft max-w-[62ch]">{path.body[locale]}</p>
          )}

          {programs.length > 0 && (
            <div className="mt-2">
              <Button as="a" href="#programs" variant="primary" size="lg">
                {t('entrepreneurshipPrograms')}
              </Button>
            </div>
          )}
        </div>
      </Section>

      {/* 2 — The stages of the path, each its own row. */}
      {bullets.length > 0 && (
        <Section label={t('entrepreneurshipPath')}>
          <div className="mb-8 border-b border-rule pb-5 text-center">
            <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">
              {t('entrepreneurshipPath')}
            </h2>
          </div>

          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {bullets.map((b, i) => (
              <Reveal
                key={i}
                as="li"
                from="up"
                delay={Math.min(i, 6) * 0.05}
                className="flex items-start gap-4 rounded-lg border border-rule/60 bg-surface p-6 shadow-raised"
              >
                <span
                  className="numerals shrink-0 font-display text-lg leading-none text-accent"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-md leading-relaxed text-ink-soft">{b[locale]}</span>
              </Reveal>
            ))}
          </ol>
        </Section>
      )}

      {/* 3 — The programmes on this track. */}
      <Section
        id="programs"
        tone="surface"
        label={t('entrepreneurshipPrograms')}
        className="scroll-mt-[5.5rem]"
      >
        <div className="mb-8 border-b border-rule pb-5 text-center">
          <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">
            {t('entrepreneurshipPrograms')}
          </h2>
        </div>

        {status === 'loading' && <p className="text-center text-muted">{t('loading')}</p>}
        {status === 'error' && <p className="text-center text-error">{t('loadError')}</p>}

        {status === 'ready' && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((p, i) => (
              <Reveal key={p._id || p.slug} as="li" from="up" delay={Math.min(i, 6) * 0.05}>
                <Link
                  to={programPath(prefix, p)}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-rule/60 bg-bg shadow-raised transition-shadow duration-base ease-out hover:shadow-md"
                >
                  <div className="relative w-full overflow-hidden bg-sunk pb-[58%]">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-base ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center justify-center font-display text-2xl text-accent/30"
                      >
                        {p.code || ''}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-6">
                    {p.code && <Pill tone="saffron" className="self-start">{p.code}</Pill>}

                    <h3 className="font-display text-md leading-snug text-ink">
                      {p.title?.[locale]}
                    </h3>

                    {p.audience?.[locale] && (
                      <p className="text-sm leading-relaxed text-ink-soft line-clamp-3">
                        {p.audience[locale]}
                      </p>
                    )}

                    <span className="mt-auto pt-2 text-sm font-medium text-accent">
                      {t('viewProgram')} {isAr ? '←' : '→'}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </Section>
    </motion.div>
  );
}
