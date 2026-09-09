import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Pill from '../components/ui/Pill';
import Rule from '../components/ui/Rule';
import SEO from '../components/SEO';
import CertificateRequestForm from '../components/programs/CertificateRequestForm';
import ProposalRequestForm from '../components/programs/ProposalRequestForm';
import ModuleGrid from '../components/programs/ModuleGrid';

// Resource links read as things you can pick up, not as inline prose links.
const resourceClass =
  'inline-flex items-center rounded-md border border-rule bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors duration-fast ease-out hover:border-accent hover:text-accent';

export default function ProgramDetail() {
  const { slug } = useParams();
  const { locale } = useLocale();
  const { t } = useTranslation('programs');
  const reduceMotion = useReducedMotion();
  const [program, setProgram] = useState(null);
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
    return () => {
      active = false;
    };
  }, [slug]);

  if (status === 'loading') {
    return (
      <Section>
        <p className="text-muted">{t('loading')}</p>
      </Section>
    );
  }

  if (status === 'error' || !program) {
    return (
      <Section>
        <p className="text-error">{t('loadError')}</p>
        <Link to={`${locale === 'en' ? '/en' : ''}/`} className="text-accent font-medium">
          {t('backToPrograms')}
        </Link>
      </Section>
    );
  }

  const { interactive, videoPlaylist, pdfUrl } = program.resources || {};
  const hasResources = interactive || videoPlaylist || pdfUrl;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO title={program.title?.[locale]} description={program.audience?.[locale]} path={`/programs/${program.slug}`} />

      <Section label={program.code || undefined}>
        {/* Masthead: the title holds the wide column, the meta rail sits opposite. */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-7">
          <div className="lg:col-span-8">
            {program.code && <Pill tone="saffron">{program.code}</Pill>}
            <h1 className="font-display text-2xl md:text-3xl leading-tight text-ink mt-3">
              {program.title?.[locale]}
            </h1>
          </div>

          {program.audience?.[locale] && (
            <div className="lg:col-span-4 lg:border-s lg:border-rule lg:ps-7 flex flex-col gap-2 self-end">
              <h2 className="text-2xs caps-label text-muted">{t('audienceHeading')}</h2>
              <p className="text-sm leading-relaxed text-ink-soft">{program.audience?.[locale]}</p>
            </div>
          )}
        </div>

        <Rule className="my-7" />

        {/* Body: prose held to a readable measure, outcomes listed beside it. */}
        <div className="grid gap-7 lg:grid-cols-12 lg:gap-7">
          {program.intro?.[locale] && (
            <div className="lg:col-span-7">
              <p className="text-ink-soft leading-relaxed whitespace-pre-line max-w-prose">
                {program.intro[locale]}
              </p>
            </div>
          )}

          {program.bullets?.length > 0 && (
            <ul
              className={`flex flex-col ${program.intro?.[locale] ? 'lg:col-span-5' : 'lg:col-span-7'}`}
            >
              {program.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-3 border-b border-rule py-2.5 first:border-t text-ink-soft"
                >
                  <span className="numerals shrink-0 text-2xs text-accent" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm leading-relaxed">{b[locale]}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {hasResources && (
          <>
            <Rule className="my-7" />
            <h2 className="text-2xs caps-label text-muted mb-3">{t('resourcesHeading')}</h2>
            <div className="flex flex-wrap gap-2">
              {interactive && (
                <a href={interactive} target="_blank" rel="noreferrer" className={resourceClass}>
                  {t('interactiveLink')}
                </a>
              )}
              {videoPlaylist && (
                <a href={videoPlaylist} target="_blank" rel="noreferrer" className={resourceClass}>
                  {t('videoPlaylistLink')}
                </a>
              )}
              {pdfUrl && (
                <a href={pdfUrl} target="_blank" rel="noreferrer" className={resourceClass}>
                  {t('pdfLink')}
                </a>
              )}
            </div>
          </>
        )}
      </Section>

      {program.modules?.length > 0 && (
        <Section tone="surface" label={t('modulesHeading')}>
          <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-rule pb-4">
            <h2 className="font-display text-xl md:text-2xl text-ink">{t('modulesHeading')}</h2>
            <span className="numerals shrink-0 text-sm text-muted" aria-hidden="true">
              {program.modules.length}
            </span>
          </div>
          <ModuleGrid modules={program.modules} accent={program.accent} />
        </Section>
      )}

      <Section>
        <CertificateRequestForm
          programId={program._id}
          programTitle={program.title?.[locale]}
          program={program}
        />
      </Section>

      {program.slug === 'generate-your-business-idea' && (
        <Section tone="surface">
          <ProposalRequestForm />
        </Section>
      )}
    </motion.div>
  );
}
