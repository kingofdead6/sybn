import { useEffect, useState } from 'react';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Rule from '../components/ui/Rule';
import SEO from '../components/SEO';

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

      <Section>
        <h1 className="font-display text-2xl md:text-3xl text-ink mb-6">
          {isAr ? 'عن البرنامج' : 'About the Program'}
        </h1>

        {content?.paragraphs?.map((p, i) => (
          <p key={i} className="text-ink-soft max-w-3xl mb-4">
            {p[locale]}
          </p>
        ))}

        {content?.benefits && (
          <>
            <Rule className="my-8" />
            <h2 className="font-display text-xl text-ink mb-4">{content.benefits.heading?.[locale]}</h2>
            <ul className="max-w-prose mb-4 flex flex-col gap-2">
              {content.benefits.items?.map((item, i) => (
                <li key={i} className="flex items-baseline gap-3 text-ink-soft">
                  <span className="shrink-0 text-2xs text-accent" aria-hidden="true">
                    —
                  </span>
                  <span>{item[locale]}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>

      {stats && (
        <Section tone="surface">
          <h2 className="font-display text-xl text-ink mb-6">{stats.heading?.[locale]}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {stats.items?.map((item, i) => (
              <div key={i} className="border border-rule rounded-sm p-5 bg-bg">
                <div className="font-display text-2xl text-accent">{item.value}</div>
                <div className="text-sm text-ink-soft mt-1">{item.label?.[locale]}</div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </motion.div>
  );
}
