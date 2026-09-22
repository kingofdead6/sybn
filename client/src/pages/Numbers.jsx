import { useEffect, useState } from 'react';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import SEO from '../components/SEO';
import Reveal from '../components/motion/Reveal';
import CountUp from '../components/motion/CountUp';

/**
 * "SIYB in Numbers" — the programme's figures and nothing else.
 *
 * Every figure comes from the `about.stats` setting, so the admin adds,
 * removes, reorders and rewrites them freely without a deploy. The page
 * renders whatever is in that list rather than a fixed set of slots.
 */
export default function Numbers() {
  const { locale } = useLocale();
  const reduceMotion = useReducedMotion();
  const [stats, setStats] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get('/settings/about.stats')
      .then(({ data }) => {
        if (active) setStats(data.data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const isAr = locale === 'ar';
  const heading = stats?.heading?.[locale] || (isAr ? 'البرنامج بلغة الأرقام' : 'SIYB in Numbers');
  const items = (stats?.items || []).filter((i) => i?.value || i?.label?.[locale]);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={`${heading} | SIYB`}
        description={stats?.intro?.[locale]}
        path="/numbers"
      />

      <Section label={isAr ? 'بالأرقام' : 'In Numbers'}>
        <div className="flex flex-col items-center gap-5 text-center">
          <h1 className="font-display text-3xl md:text-4xl leading-[1.08] text-ink max-w-[26ch]">
            {heading}
          </h1>
          {stats?.intro?.[locale] && (
            <p className="text-md leading-relaxed text-ink-soft max-w-[62ch]">
              {stats.intro[locale]}
            </p>
          )}
        </div>

        {/* The figures. The grid is capped at three columns so a long list
            wraps into even rows instead of thinning out across the band. */}
        {items.length > 0 && (
          <dl className="mt-10 grid grid-cols-2 border-t border-rule md:mt-12 md:grid-cols-3">
            {items.map((item, i) => (
              <Reveal
                key={i}
                from="up"
                delay={Math.min(i, 6) * 0.05}
                className="border-b border-rule bg-surface p-6 text-center md:p-8"
              >
                <dd className="numerals font-display text-3xl md:text-4xl leading-none text-accent">
                  <CountUp value={item.value} />
                </dd>
                <dt className="mt-3 text-xs caps-label text-muted">{item.label?.[locale]}</dt>
              </Reveal>
            ))}
          </dl>
        )}

        {loaded && items.length === 0 && (
          <p className="mt-10 text-center text-muted">
            {isAr ? 'لم تُضف أرقام بعد.' : 'No figures have been added yet.'}
          </p>
        )}
      </Section>
    </motion.div>
  );
}
