import { useEffect, useState } from 'react';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Rule from '../components/ui/Rule';
import SEO from '../components/SEO';
import Reveal from '../components/motion/Reveal';
import CountUp from '../components/motion/CountUp';

export default function About() {
  const { locale } = useLocale();
  const reduceMotion = useReducedMotion();
  const [content, setContent] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all([api.get('/settings/about.content'), api.get('/settings/about.stats')])
      .then(([a, b]) => {
        if (!active) return;
        setContent(a.data.data);
        setStats(b.data.data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const isAr = locale === 'ar';
  const paragraphs = content?.paragraphs || [];
  const [lead, ...rest] = paragraphs;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={isAr ? 'عن البرنامج | أبسط' : 'About the Program | ABCET'}
        description={content?.paragraphs?.[0]?.[locale]}
        path="/about"
      />

      <Section label={isAr ? 'عن البرنامج' : 'About'}>
        {/* Masthead: title holds the wide column, the lead paragraph sits opposite
            it as a standfirst rather than starting a single ragged stack. */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-7">
          <h1 className="lg:col-span-5 font-display text-2xl md:text-3xl leading-tight text-ink">
            {isAr ? 'عن البرنامج' : 'About the Program'}
          </h1>
          {lead?.[locale] && (
            <p className="lg:col-span-7 lg:border-s lg:border-rule lg:ps-7 text-md leading-relaxed text-ink-soft self-end">
              {lead[locale]}
            </p>
          )}
        </div>

        {rest.length > 0 && (
          <>
            <Rule className="my-7" />
            {/* Remaining prose runs in two columns so it reads as a spread, not
                one long measure with half the band empty. */}
            <div className="grid gap-6 md:grid-cols-2 lg:gap-7">
              {rest.map((p, i) => (
                <Reveal key={i} from="up" delay={i * 0.06}>
                  <p className="text-ink-soft leading-relaxed max-w-prose">{p[locale]}</p>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </Section>

      {/* The numbers are the headline claim of this page — they get their own
          full band, set large and tabular, counting up as they arrive. */}
      {stats && (
        <Section tone="surface" label={stats.heading?.[locale]}>
          <div className="mb-7 flex items-baseline justify-between gap-4 border-b border-rule pb-4">
            <h2 className="font-display text-xl md:text-2xl text-ink">{stats.heading?.[locale]}</h2>
            <span className="numerals shrink-0 text-sm text-muted" aria-hidden="true">
              {stats.items?.length}
            </span>
          </div>

          <dl className="grid grid-cols-2 md:grid-cols-3 border-s border-t border-rule">
            {stats.items?.map((item, i) => (
              <Reveal
                key={i}
                from="up"
                delay={Math.min(i, 6) * 0.05}
                className="border-e border-b border-rule bg-bg p-5 md:p-6"
              >
                <dt className="text-2xs caps-label text-muted">{item.label?.[locale]}</dt>
                <dd className="numerals font-display text-2xl md:text-3xl leading-none text-ink mt-2">
                  <CountUp value={item.value} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </Section>
      )}

      {content?.benefits && (
        <Section label={content.benefits.heading?.[locale]}>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-7">
            <h2 className="lg:col-span-4 font-display text-xl md:text-2xl leading-tight text-ink">
              {content.benefits.heading?.[locale]}
            </h2>

            {/* A numbered ledger — the benefits are a countable list, so they are
                set as one, matching the programme pages. */}
            <ol className="lg:col-span-8 flex flex-col">
              {content.benefits.items?.map((item, i) => (
                <Reveal
                  key={i}
                  as="li"
                  from="up"
                  delay={Math.min(i, 6) * 0.05}
                  className="flex items-baseline gap-4 border-b border-rule py-3.5 first:border-t"
                >
                  <span className="numerals shrink-0 text-2xs text-accent" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm leading-relaxed text-ink-soft">{item[locale]}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </Section>
      )}
    </motion.div>
  );
}
