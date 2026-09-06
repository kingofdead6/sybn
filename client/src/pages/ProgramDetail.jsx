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
        <p className="text-sage">{t('loading')}</p>
      </Section>
    );
  }

  if (status === 'error' || !program) {
    return (
      <Section>
        <p className="text-clay">{t('loadError')}</p>
        <Link to={`${locale === 'en' ? '/en' : ''}/`} className="text-saffron-deep font-medium">
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

      <Section>
        {program.code && <Pill tone="saffron">{program.code}</Pill>}
        <h1 className="font-display text-2xl md:text-3xl text-ink mt-4 mb-4">{program.title?.[locale]}</h1>

        <h2 className="font-display text-md text-ink-soft mb-2">{t('audienceHeading')}</h2>
        <p className="text-body max-w-3xl mb-6">{program.audience?.[locale]}</p>

        {program.intro?.[locale] && (
          <p className="text-body max-w-3xl mb-6 whitespace-pre-line">{program.intro[locale]}</p>
        )}

        {program.bullets?.length > 0 && (
          <ul className="max-w-3xl mb-8">
            {program.bullets.map((b, i) => (
              <li key={i} className="py-3 border-b border-line last:border-0 text-body">
                {b[locale]}
              </li>
            ))}
          </ul>
        )}

        {hasResources && (
          <>
            <Rule className="mb-6" />
            <h2 className="font-display text-md text-ink-soft mb-3">{t('resourcesHeading')}</h2>
            <div className="flex flex-col gap-2 mb-8">
              {interactive && (
                <a
                  href={interactive}
                  target="_blank"
                  rel="noreferrer"
                  className="text-saffron-deep font-medium"
                >
                  {t('interactiveLink')}
                </a>
              )}
              {videoPlaylist && (
                <a
                  href={videoPlaylist}
                  target="_blank"
                  rel="noreferrer"
                  className="text-saffron-deep font-medium"
                >
                  {t('videoPlaylistLink')}
                </a>
              )}
              {pdfUrl && (
                <a href={pdfUrl} target="_blank" rel="noreferrer" className="text-saffron-deep font-medium">
                  {t('pdfLink')}
                </a>
              )}
            </div>
          </>
        )}
      </Section>

      <Section tone="surface">
        <CertificateRequestForm programId={program._id} programTitle={program.title?.[locale]} />
      </Section>

      {program.slug === 'generate-your-business-idea' && (
        <Section>
          <ProposalRequestForm />
        </Section>
      )}
    </motion.div>
  );
}
