import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
 * A programme that sits beneath Training of Trainers, at its own nested
 * address. Built to the same shape as the TOT page — masthead, audience,
 * what it covers, packages, links, request form — so moving between them
 * feels like moving within one section of the site.
 *
 * This is the canonical home of a programme flagged `totResource`; the flat
 * `/programs/:slug` address redirects here.
 */
export default function TotResourceDetail() {
  const { slug } = useParams();
  const { locale } = useLocale();
  const { t } = useTranslation('programs');
  const reduceMotion = useReducedMotion();
  const prefix = locale === 'en' ? '/en' : '';

  const [program, setProgram] = useState(null);
  const [siblings, setSiblings] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');

    api
      .get(`/programs/${slug}`)
      .then(({ data }) => {
        if (active) {
          setProgram(data.data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    api
      .get('/programs-tot-resources')
      .then(({ data }) => {
        if (active) setSiblings(data.data || []);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [slug]);

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
        <p className="mt-4 text-center">
          <Link to={`${prefix}/${TOT_SLUG}`} className="text-accent font-medium hover:underline">
            {t('backToTot')}
          </Link>
        </p>
      </Section>
    );
  }

  const { interactive, videoPlaylist, pdfUrl } = program.resources || {};
  const hasLinks = interactive || videoPlaylist || pdfUrl;
  const bullets = (program.bullets || []).filter((b) => b?.[locale]);
  const others = siblings.filter((s) => s.slug !== slug);

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
        /* The nested address is this programme's canonical URL. */
        path={`/${TOT_SLUG}/${program.slug}`}
      />

      <Section tone="surface">
        {/* The breadcrumb is what makes the nesting legible — it says this
            programme belongs to TOT rather than standing alone. */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            to={`${prefix}/${TOT_SLUG}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
          >
            <span aria-hidden="true">{isAr ? '→' : '←'}</span>
            {t('backToTot')}
          </Link>
        </nav>

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

          <div className="mt-2">
            <Button as="a" href="#request" variant="primary" size="lg">
              {program.ctaLabel?.[locale] || t('requestHeading')}
            </Button>
          </div>
        </div>
      </Section>

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

      {hasLinks && (
        <Section tone="surface" label={t('resourcesHeading')}>
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

      <Section id="request" className="scroll-mt-28">
        <CertificateRequestForm
          programId={program._id}
          programTitle={program.title?.[locale]}
          program={program}
        />
      </Section>

      {/* The rest of the shelf, so the page closes and the section holds. */}
      {others.length > 0 && (
        <Section tone="surface" label={t('totResourcesHeading')}>
          <h2 className="mb-7 font-display text-xl md:text-2xl leading-tight text-ink">
            {t('otherTotResources')}
          </h2>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other, i) => (
              <Reveal key={other._id || other.slug} as="li" from="up" delay={i * 0.05}>
                <Link
                  to={`${prefix}/${TOT_SLUG}/${other.slug}`}
                  className="flex h-full flex-col gap-3 rounded-lg border border-rule/60 bg-bg p-5 shadow-raised transition-shadow duration-base ease-out hover:shadow-md"
                >
                  {other.code && <Pill tone="saffron" className="self-start">{other.code}</Pill>}
                  <h3 className="font-display text-md leading-snug text-ink">
                    {other.title?.[locale]}
                  </h3>
                  <span className="mt-auto pt-1 text-sm font-medium text-accent">
                    {t('viewProgram')} {isAr ? '←' : '→'}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}
    </motion.div>
  );
}
