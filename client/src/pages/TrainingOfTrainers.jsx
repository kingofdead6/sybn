import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Pill from '../components/ui/Pill';
import SEO from '../components/SEO';
import Reveal from '../components/motion/Reveal';
import Button from '../components/ui/Button';
import ModuleGrid from '../components/programs/ModuleGrid';
import CertificateRequestForm from '../components/programs/CertificateRequestForm';
import { TOT_SLUG } from '../lib/totRoutes';

/**
 * The Training of Trainers landing page.
 *
 * TOT is the entry point of the trainer branch, so it gets a page of its own
 * rather than sharing the generic programme template: each part of the
 * offering — who it is for, what it covers, its packages, the programmes that
 * build on it, and the request form — is its own titled band, in its own
 * section, instead of one continuous column.
 */
export default function TrainingOfTrainers() {
  const { locale } = useLocale();
  const { t } = useTranslation('programs');
  const reduceMotion = useReducedMotion();
  const prefix = locale === 'en' ? '/en' : '';

  const [program, setProgram] = useState(null);
  const [resources, setResources] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;

    api
      .get(`/programs/${TOT_SLUG}`)
      .then(({ data }) => {
        if (active) {
          setProgram(data.data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    // The shelf of programmes that build on TOT. A failure here must not take
    // the page down — the band is simply omitted.
    api
      .get('/programs-tot-resources')
      .then(({ data }) => {
        if (active) setResources(data.data || []);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const isAr = locale === 'ar';

  if (status === 'loading') {
    return (
      <Section>
        <p className="text-center text-muted">{t('loading')}</p>
      </Section>
    );
  }

  if (status === 'error' || !program) {
    return (
      <Section>
        <p className="text-center text-error">{t('loadError')}</p>
      </Section>
    );
  }

  const { interactive, videoPlaylist, pdfUrl } = program.resources || {};
  const hasLinks = interactive || videoPlaylist || pdfUrl;
  const bullets = (program.bullets || []).filter((b) => b?.[locale]);

  const linkClass =
    'inline-flex items-center rounded-md border border-rule bg-surface px-5 py-3 text-sm font-medium text-ink transition-colors duration-fast ease-out hover:border-accent hover:text-accent';

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={program.title?.[locale]}
        description={program.audience?.[locale]}
        path={`/${TOT_SLUG}`}
      />

      {/* 1 — Masthead. */}
      <Section tone="surface">
        <div className="flex flex-col items-center gap-5 text-center">
          {program.code && <Pill tone="saffron">{program.code}</Pill>}

          <h1 className="font-display text-3xl md:text-4xl leading-[1.08] text-ink max-w-[24ch]">
            {program.title?.[locale]}
          </h1>

          {program.intro?.[locale] && (
            <p className="text-md leading-relaxed text-ink-soft max-w-[62ch] whitespace-pre-line">
              {program.intro[locale]}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Button as="a" href="#request" variant="primary" size="lg">
              {program.ctaLabel?.[locale] || t('requestHeading')}
            </Button>
            {resources.length > 0 && (
              <Button as="a" href="#training-resources" variant="secondary" size="lg">
                {t('totResourcesHeading')}
              </Button>
            )}
          </div>
        </div>
      </Section>

      {/* 2 — Who it is for. */}
      {program.audience?.[locale] && (
        <Section label={t('audienceHeading')}>
          <div className="mx-auto max-w-[70ch] text-center">
            <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">
              {t('audienceHeading')}
            </h2>
            <p className="mt-5 text-md leading-relaxed text-ink-soft">
              {program.audience[locale]}
            </p>
          </div>
        </Section>
      )}

      {/* 3 — What it covers, each point its own row. */}
      {bullets.length > 0 && (
        <Section tone="surface" label={t('whatYouGetHeading')}>
          <div className="mb-8 border-b border-rule pb-5 text-center">
            <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">
              {t('whatYouGetHeading')}
            </h2>
          </div>

          <ul className="grid gap-5 lg:grid-cols-2">
            {bullets.map((b, i) => (
              <Reveal
                key={i}
                as="li"
                from="up"
                delay={Math.min(i, 6) * 0.05}
                className="flex items-start gap-4 rounded-lg border border-rule/60 bg-bg p-6 shadow-raised"
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
          </ul>
        </Section>
      )}

      {/* 4 — Training packages. */}
      {program.modules?.length > 0 && (
        <Section label={t('modulesHeading')}>
          <div className="mb-8 border-b border-rule pb-5 text-center">
            <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">
              {t('modulesHeading')}
            </h2>
          </div>
          <ModuleGrid modules={program.modules} accent={program.accent} />
        </Section>
      )}

      {/* 5 — The programmes that build on TOT. */}
      {resources.length > 0 && (
        <Section
          id="training-resources"
          tone="surface"
          label={t('totResourcesHeading')}
          className="scroll-mt-28"
        >
          <div className="mb-8 border-b border-rule pb-5 text-center">
            <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">
              {t('totResourcesHeading')}
            </h2>
            <p className="mx-auto mt-4 max-w-[62ch] text-md leading-relaxed text-ink-soft">
              {t('totResourcesIntro')}
            </p>
          </div>

          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((r, i) => (
              <Reveal key={r._id || r.slug} as="li" from="up" delay={Math.min(i, 6) * 0.05}>
                <Link
                  to={`${prefix}/${TOT_SLUG}/${r.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-rule/60 bg-bg shadow-raised transition-shadow duration-base ease-out hover:shadow-md"
                >
                  <div className="relative w-full overflow-hidden bg-sunk pb-[58%]">
                    {r.image ? (
                      <img
                        src={r.image}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-base ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center justify-center font-display text-2xl text-accent/30"
                      >
                        {r.code || ''}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-6">
                    {r.code && <Pill tone="saffron" className="self-start">{r.code}</Pill>}

                    <h3 className="font-display text-md leading-snug text-ink">
                      {r.title?.[locale]}
                    </h3>

                    {r.audience?.[locale] && (
                      <p className="text-sm leading-relaxed text-ink-soft line-clamp-3">
                        {r.audience[locale]}
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
        </Section>
      )}

      {/* 6 — Downloads and links. */}
      {hasLinks && (
        <Section label={t('resourcesHeading')}>
          <div className="mb-7 text-center">
            <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">
              {t('resourcesHeading')}
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {interactive && (
              <a href={interactive} target="_blank" rel="noreferrer" className={linkClass}>
                {t('interactiveLink')}
              </a>
            )}
            {videoPlaylist && (
              <a href={videoPlaylist} target="_blank" rel="noreferrer" className={linkClass}>
                {t('videoPlaylistLink')}
              </a>
            )}
            {pdfUrl && (
              <a href={pdfUrl} target="_blank" rel="noreferrer" className={linkClass}>
                {t('pdfLink')}
              </a>
            )}
          </div>
        </Section>
      )}

      {/* 7 — The request form. */}
      <Section id="request" tone="surface" className="scroll-mt-28">
        <CertificateRequestForm
          programId={program._id}
          programTitle={program.title?.[locale]}
          program={program}
        />
      </Section>
    </motion.div>
  );
}
