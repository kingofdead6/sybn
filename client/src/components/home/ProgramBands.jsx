import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Reveal from '../motion/Reveal';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';

/**
 * Track colours are CATEGORICAL, not decorative — see DESIGN.md §1. They only
 * identify which programme track a block belongs to, and appear as an edge rule
 * and a numeral, never as a full-bleed fill or on a button.
 */
const TRACKS = {
  green: { rule: 'border-s-track-gyb', text: 'text-track-gyb' },
  orange: { rule: 'border-s-track-syb', text: 'text-track-syb' },
  blue: { rule: 'border-s-track-iyb', text: 'text-track-iyb' },
  slate: { rule: 'border-s-track-neutral', text: 'text-track-neutral' },
  navy: { rule: 'border-s-ink', text: 'text-ink' },
};

const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

function localeDigits(n, locale) {
  const s = String(n).padStart(2, '0');
  return locale === 'ar' ? s.replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]) : s;
}

function trackOf(program) {
  return TRACKS[program.accent] || TRACKS.blue;
}

function ProgramBlock({ program, index, locale, prefix, t }) {
  const track = trackOf(program);
  // Alternate which side the media sits on so the rhythm varies down the page.
  const mediaFirst = index % 2 === 0;

  return (
    <div className="border-b border-rule last:border-b-0">
      <div className="mx-auto max-w-[86rem] px-4 md:px-8">
        <div className="grid gap-0 lg:grid-cols-12">
          <Reveal
            from={mediaFirst ? 'start' : 'end'}
            className={`lg:col-span-7 border-s-2 ${track.rule} ps-5 py-8 lg:py-9 ${
              mediaFirst ? 'lg:order-1' : 'lg:order-2'
            }`}
          >
            {/* Numeral — the counting device. The ladder is a real sequence. */}
            <span
              className={`numerals font-display text-xl leading-none ${track.text} block mb-3`}
              aria-hidden="true"
            >
              {localeDigits(program.order, locale)}
            </span>

            {program.code && (
              <span className="text-2xs caps-label text-muted">{program.code}</span>
            )}

            <h3 className="font-display text-lg md:text-xl text-ink mt-2 leading-tight">
              {program.bandHeading?.[locale] || program.title?.[locale]}
            </h3>

            {program.audience?.[locale] && (
              <p className="mt-4 text-sm text-ink-soft leading-relaxed max-w-prose">
                {program.audience[locale]}
              </p>
            )}

            {program.bullets?.length > 0 && (
              <ul className="mt-5 flex flex-col gap-2">
                {program.bullets.map((b, i) => (
                  <li key={i} className="flex items-baseline gap-3 text-sm text-ink-soft">
                    <span className={`shrink-0 text-2xs ${track.text}`} aria-hidden="true">
                      —
                    </span>
                    <span>{b[locale]}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6">
              <Link
                to={`${prefix}/programs/${program.slug}`}
                className="inline-block border-b border-accent pb-0.5 text-sm text-accent transition-colors duration-fast ease-out hover:text-accent-deep hover:border-accent-deep"
              >
                {program.ctaLabel?.[locale] || t('bands.startNow')}
              </Link>
            </div>
          </Reveal>

          <Reveal
            from={mediaFirst ? 'end' : 'start'}
            delay={0.08}
            className={`lg:col-span-5 py-8 lg:py-9 lg:ps-8 self-center ${mediaFirst ? 'lg:order-2' : 'lg:order-1'}`}
          >
            {program.image ? (
              <img
                src={program.image}
                alt={program.title?.[locale] || ''}
                className="w-full border border-rule"
                loading="lazy"
              />
            ) : (
              <div className="aspect-[4/3] w-full border border-rule bg-sunk" aria-hidden="true" />
            )}
          </Reveal>
        </div>
      </div>
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
    <section id="programs-ladder" aria-label={t('bands.title')} className="relative border-b border-rule bg-bg">
      <span className="marginalia" aria-hidden="true">
        {t('bands.title')}
      </span>
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
