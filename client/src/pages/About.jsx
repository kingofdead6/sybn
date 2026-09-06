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
          <p key={i} className="text-body max-w-3xl mb-4">
            {p[locale]}
          </p>
        ))}

        {content?.benefits && (
          <>
            <Rule className="my-8" />
            <h2 className="font-display text-xl text-ink mb-4">{content.benefits.heading?.[locale]}</h2>
            <ul className="max-w-3xl mb-4 flex flex-col gap-3">
              {content.benefits.items?.map((item, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg bg-surface-muted px-4 py-3 text-body">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
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
              <div key={i} className="border border-line rounded-lg shadow-sm p-5 bg-paper">
                <div className="font-display text-2xl text-saffron-deep">{item.value}</div>
                <div className="text-sm text-body mt-1">{item.label?.[locale]}</div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </motion.div>
  );
}
