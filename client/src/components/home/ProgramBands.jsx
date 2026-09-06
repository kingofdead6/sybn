import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';

const ACCENTS = {
  green: { band: 'bg-accent-green', cta: 'bg-accent-green', check: 'text-accent-green' },
  orange: { band: 'bg-accent-orange', cta: 'bg-accent-orange', check: 'text-accent-orange' },
  blue: { band: 'bg-accent-lightblue', cta: 'bg-accent-lightblue', check: 'text-accent-lightblue' },
  slate: { band: 'bg-accent-slate', cta: 'bg-accent-slate', check: 'text-accent-slate' },
  navy: { band: 'bg-ink', cta: 'bg-ink', check: 'text-ink' },
};

function accentOf(program) {
  return ACCENTS[program.accent] || ACCENTS.blue;
}

/** Torn-paper style wave used at the top and bottom edge of each colour band. */
function BandEdge({ className = '', flip = false }) {
  return (
    <svg
      className={`block w-full h-8 md:h-12 ${className}`}
      viewBox="0 0 1200 48"
      preserveAspectRatio="none"
      fill="currentColor"
      aria-hidden="true"
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
    >
      <path d="M0 24 C 150 0 300 44 450 26 C 600 8 750 44 900 26 C 1020 12 1120 30 1200 20 V48 H0 Z" />
    </svg>
  );
}

function CheckIcon({ className = '' }) {
  return (
    <svg className={`h-4 w-4 shrink-0 ${className}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ProgramBlock({ program, index, locale, prefix, t }) {
  const reduceMotion = useReducedMotion();
  const accent = accentOf(program);
  // Alternate which side the illustration sits on, like the reference site.
  const imageFirst = index % 2 === 0;

  const body = (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <motion.div
        className="grid gap-8 md:grid-cols-2 md:items-center py-10 md:py-14"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className={imageFirst ? 'md:order-1' : 'md:order-2'}>
          {program.image ? (
            <img
              src={program.image}
              alt={program.title?.[locale] || ''}
              className="w-full rounded-lg border border-line bg-surface shadow-md"
              loading="lazy"
            />
          ) : (
            <div className="aspect-[4/3] w-full rounded-lg border border-line bg-surface-muted shadow-sm" />
          )}
        </div>

        <div className={imageFirst ? 'md:order-2' : 'md:order-1'}>
          {!program.bandTitle && (
            <h3 className="font-display text-xl md:text-2xl font-bold text-ink mb-4">
              {program.title?.[locale]}
            </h3>
          )}

          {program.audience?.[locale] && (
            <p className="text-body leading-relaxed mb-5">{program.audience[locale]}</p>
          )}

          {program.bullets?.length > 0 && (
            <ul className="flex flex-col gap-2.5 mb-7">
              {program.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-body">
                  <CheckIcon className={`mt-0.5 ${accent.check}`} />
                  <span>{b[locale]}</span>
                </li>
              ))}
            </ul>
          )}

          <Link
            to={`${prefix}/programs/${program.slug}`}
            className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-on-saffron shadow-md transition-transform hover:scale-105 ${accent.cta}`}
          >
            {program.ctaLabel?.[locale] || t('bands.startNow')}
          </Link>
        </div>
      </motion.div>
    </div>
  );

  if (!program.bandTitle) return <div className="bg-paper">{body}</div>;

  const heading = program.bandHeading?.[locale] || program.title?.[locale];

  return (
    <div>
      <div className={`${accent.band} text-paper`}>
        <BandEdge className="text-paper" flip />
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-12">
          <h2 className="font-display text-xl md:text-2xl font-bold text-center text-on-saffron">
            {heading}
          </h2>
        </div>
        <BandEdge className="text-paper" />
      </div>
      <div className="bg-paper">{body}</div>
    </div>
  );
}

export default function ProgramBands() {
  const { t } = useTranslation('home');
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    let mounted = true;
    api
      .get('/programs')
      .then((res) => {
        if (mounted) setPrograms(res.data.data || []);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  if (!programs.length) return null;

  return (
    <section id="programs-ladder" aria-label={t('bands.title')}>
      {programs.map((program, i) => (
        <ProgramBlock
          key={program.slug}
          program={program}
          index={i}
          locale={locale}
          prefix={prefix}
          t={t}
        />
      ))}
    </section>
  );
}
