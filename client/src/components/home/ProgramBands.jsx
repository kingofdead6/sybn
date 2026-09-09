import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Button from '../ui/Button';

/**
 * Track colours are CATEGORICAL, not decorative — see DESIGN.md §1. They
 * identify which programme track a step belongs to, and appear as an edge rule,
 * a marker or a numeral, never as a full-bleed fill.
 */
const TRACKS = {
  green: { text: 'text-track-gyb', bg: 'bg-track-gyb', border: 'border-track-gyb' },
  orange: { text: 'text-track-syb', bg: 'bg-track-syb', border: 'border-track-syb' },
  blue: { text: 'text-track-iyb', bg: 'bg-track-iyb', border: 'border-track-iyb' },
  slate: { text: 'text-track-neutral', bg: 'bg-track-neutral', border: 'border-track-neutral' },
  navy: { text: 'text-ink', bg: 'bg-ink', border: 'border-ink' },
};

const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

function localeDigits(n, locale) {
  const s = String(n).padStart(2, '0');
  return locale === 'ar' ? s.replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]) : s;
}

function trackOf(program) {
  return TRACKS[program.accent] || TRACKS.blue;
}

/**
 * Rail label. Most programmes carry a short code (GYB, SYB…); the few that
 * don't fall back to the first two words of the title — never a raw character
 * slice, which cuts Arabic mid-word and renders a broken glyph.
 */
function railLabel(program, locale) {
  const code = (program.code || '').trim();
  if (code) return code;
  const title = (program.title?.[locale] || '').trim();
  return title.split(/\s+/).slice(0, 2).join(' ');
}

/**
 * The programme ladder as a walkable journey: a horizontal step rail of all
 * nine programmes, and a large panel showing the selected one in full. The
 * sequence is the real structure of the offering, so the rail makes it legible
 * at a glance while the panel gives each step room to speak.
 */
export default function ProgramBands() {
  const { t } = useTranslation('home');
  const { locale } = useLocale();
  const reduceMotion = useReducedMotion();
  const prefix = locale === 'en' ? '/en' : '';
  const [programs, setPrograms] = useState([]);
  const [activeSlug, setActiveSlug] = useState(null);

  useEffect(() => {
    let mounted = true;
    api
      .get('/programs')
      .then((res) => {
        if (!mounted) return;
        const list = res.data.data || [];
        setPrograms(list);
        if (list.length) setActiveSlug(list[0].slug);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const active = useMemo(
    () => programs.find((p) => p.slug === activeSlug) || programs[0],
    [programs, activeSlug]
  );

  if (!programs.length || !active) return null;

  const track = trackOf(active);
  const bullets = (active.bullets || []).map((b) => b?.[locale]).filter(Boolean);

  return (
    <section
      id="programs-ladder"
      aria-label={t('bands.title')}
      className="md:col-span-6 flex flex-col gap-6"
    >
      {/* The rail: every programme at once, in sequence. */}
      <ol className="flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-9 md:gap-3 md:overflow-visible md:pb-0">
        {programs.map((program) => {
          const pt = trackOf(program);
          const selected = program.slug === active.slug;
          return (
            <li key={program.slug} className="shrink-0 md:shrink">
              <button
                type="button"
                onClick={() => setActiveSlug(program.slug)}
                aria-current={selected ? 'step' : undefined}
                className={`group flex w-32 flex-col gap-2 rounded-md border p-3 text-start transition-all duration-base ease-out md:w-full ${
                  selected
                    ? `${pt.border} bg-surface shadow-md`
                    : 'border-rule/60 bg-surface/60 hover:border-rule-strong hover:shadow-raised'
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className={`numerals font-display text-sm leading-none ${pt.text}`}>
                    {localeDigits(program.order, locale)}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-pill transition-opacity ${pt.bg} ${
                      selected ? 'opacity-100' : 'opacity-30'
                    }`}
                  />
                </span>

                <span
                  className={`caps-label text-2xs leading-tight ${
                    selected ? 'text-ink' : 'text-muted'
                  }`}
                >
                  {railLabel(program, locale)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* The panel: the selected programme, with room to actually read it. */}
      <AnimatePresence mode="wait">
        <motion.article
          key={active.slug}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
          className="rounded-lg border border-rule/60 bg-surface shadow-raised overflow-hidden"
        >
          {/* Track edge — the categorical marker for this programme. */}
          <div className={`h-1 w-full ${track.bg}`} aria-hidden="true" />

          <div className="grid gap-6 p-6 md:grid-cols-12 md:gap-8 md:p-8">
            {/* The programme's picture. Most programmes have no image set yet,
                so the frame falls back to a track-coloured plate carrying the
                code rather than showing an empty or broken box. */}
            <div className="md:col-span-4">
              {active.image ? (
                <img
                  src={active.image}
                  alt={active.title?.[locale] || ''}
                  className="aspect-[4/3] w-full rounded-md object-cover shadow-raised md:aspect-[3/4]"
                  loading="lazy"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className={`flex aspect-[4/3] w-full items-center justify-center rounded-md border ${track.border} bg-sunk md:aspect-[3/4]`}
                >
                  <span className={`font-display text-2xl md:text-3xl ${track.text}`}>
                    {railLabel(active, locale)}
                  </span>
                </div>
              )}
            </div>

            <div className="md:col-span-8 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`numerals font-display text-2xl leading-none ${track.text}`}
                  aria-hidden="true"
                >
                  {localeDigits(active.order, locale)}
                </span>
                {active.code && (
                  <span
                    className={`caps-label rounded-pill border px-2.5 py-1 text-2xs ${track.border} ${track.text}`}
                  >
                    {active.code}
                  </span>
                )}
              </div>

              <h3 className="font-display text-xl md:text-2xl leading-tight text-ink">
                {active.bandHeading?.[locale] || active.title?.[locale]}
              </h3>

              {active.audience?.[locale] && (
                <p className="text-sm leading-relaxed text-ink-soft max-w-prose">
                  {active.audience[locale]}
                </p>
              )}

              {bullets.length > 0 && (
                <ul className="mt-1 grid gap-2.5 border-t border-rule pt-4 sm:grid-cols-2">
                  {bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                      <span
                        aria-hidden="true"
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-pill ${track.bg}`}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-2">
                <Button as={Link} to={`${prefix}/programs/${active.slug}`} variant="primary">
                  {active.ctaLabel?.[locale] || t('bands.startNow')}
                </Button>
              </div>
            </div>
          </div>
        </motion.article>
      </AnimatePresence>
    </section>
  );
}
