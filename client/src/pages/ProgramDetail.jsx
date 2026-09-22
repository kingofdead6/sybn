import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import { programPath, parentSlugOf } from '../lib/programRoutes';
import Section from '../components/ui/Section';
import Pill from '../components/ui/Pill';
import SEO from '../components/SEO';
import Reveal from '../components/motion/Reveal';
import Button from '../components/ui/Button';
import ModuleGrid from '../components/programs/ModuleGrid';
import CertificateRequestForm from '../components/programs/CertificateRequestForm';
import ProposalRequestForm from '../components/programs/ProposalRequestForm';

/**
 * Every program page.
 *
 * The page is a sequence of titled bands — who it is for, what it covers, its
 * packages, the programs nested beneath it, its downloads, and the request
 * form — each in its own section rather than one continuous column. Bands with
 * nothing to show are omitted, so a short program reads as deliberately short
 * rather than as a page with holes in it.
 *
 * The same component serves a top-level program and a nested one; the only
 * difference is the breadcrumb a child carries back to its parent.
 */
export default function ProgramDetail() {
  const { slug, parentSlug } = useParams();
  const { locale } = useLocale();
  const { t } = useTranslation('programs');
  const reduceMotion = useReducedMotion();
  const prefix = locale === 'en' ? '/en' : '';

  const [program, setProgram] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');

    // The nested endpoint verifies the parent, so a mismatched pair 404s here
    // rather than rendering a child under a parent it does not belong to.
    const url = parentSlug ? `/programs/${parentSlug}/${slug}` : `/programs/${slug}`;

    api
      .get(url)
      .then(({ data }) => {
        if (active) {
          setProgram(data.data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [slug, parentSlug]);

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
          <Link to={prefix || '/'} className="text-accent font-medium hover:underline">
            {t('backToPrograms')}
          </Link>
        </p>
      </Section>
    );
  }

  // A nested program's canonical address includes its parent. Reached at the
  // flat path, it redirects rather than serving the same page twice.
  const ownParentSlug = parentSlugOf(program);
  if (!parentSlug && ownParentSlug) {
    return <Navigate to={programPath(prefix, program)} replace />;
  }

  const { interactive, videoPlaylist, pdfUrl } = program.resources || {};
  const hasLinks = interactive || videoPlaylist || pdfUrl;
  const bullets = (program.bullets || []).filter((b) => b?.[locale]);
  const children = program.children || [];
  const parent = program.parent;

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
        path={programPath('', program)}
      />

      {/* 1 — Masthead. */}
      <Section tone="surface">
        {parent && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              to={programPath(prefix, parent)}
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
            >
              <span aria-hidden="true">{isAr ? '→' : '←'}</span>
              {parent.title?.[locale] || parent.code}
            </Link>
          </nav>
        )}

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
            {children.length > 0 && (
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

      {/* 5 — The programs nested beneath this one. */}
      {children.length > 0 && (
        <Section
          id="training-resources"
          tone="surface"
          label={t('totResourcesHeading')}
          className="scroll-mt-24"
        >
          <div className="mb-8 border-b border-rule pb-5 text-center">
            <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">
              {t('totResourcesHeading')}
            </h2>
            <p className="mx-auto mt-4 max-w-[62ch] text-md leading-relaxed text-ink-soft">
              {t('childProgramsIntro')}
            </p>
          </div>

          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {children.map((child, i) => (
              <Reveal key={child._id || child.slug} as="li" from="up" delay={Math.min(i, 6) * 0.05}>
                <Link
                  /* The child arrives without its parent populated — it is
                     this program, so the path is built from the slug here. */
                  to={`${prefix}/programs/${program.slug}/${child.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-rule/60 bg-bg shadow-raised transition-shadow duration-base ease-out hover:shadow-md"
                >
                  <div className="relative w-full overflow-hidden bg-sunk pb-[58%]">
                    {child.image ? (
                      <img
                        src={child.image}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-base ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center justify-center font-display text-2xl text-accent/30"
                      >
                        {child.code || ''}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-6">
                    {child.code && <Pill tone="saffron" className="self-start">{child.code}</Pill>}

                    <h3 className="font-display text-md leading-snug text-ink">
                      {child.title?.[locale]}
                    </h3>

                    {child.audience?.[locale] && (
                      <p className="text-sm leading-relaxed text-ink-soft line-clamp-3">
                        {child.audience[locale]}
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
      <Section id="request" tone="surface" className="scroll-mt-24">
        <CertificateRequestForm
          programId={program._id}
          programTitle={program.title?.[locale]}
          program={program}
        />
      </Section>

      {program.slug === 'generate-your-business-idea' && (
        <Section>
          <ProposalRequestForm />
        </Section>
      )}
    </motion.div>
  );
}
