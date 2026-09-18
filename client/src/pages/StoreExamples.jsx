import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import SEO from '../components/SEO';
import Reveal from '../components/motion/Reveal';

/**
 * A showcase of real storefronts built by graduates. Each card is an image and
 * a title that links out to the live shop; the entries are admin-managed.
 */
export default function StoreExamples() {
  const { locale } = useLocale();
  const [content, setContent] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get('/settings/store.examples').catch(() => ({ data: { data: null } })),
      api.get('/store-examples').catch(() => ({ data: { data: [] } })),
    ]).then(([c, e]) => {
      if (!active) return;
      setContent(c.data.data);
      setItems(e.data.data || []);
    });
    return () => {
      active = false;
    };
  }, []);

  const title = content?.title?.[locale] || '';
  const intro = content?.intro?.[locale] || '';

  return (
    <>
      <SEO title={title} description={intro} path="/store/examples" />

      <Section label={title}>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-7">
          <h1 className="lg:col-span-5 font-display text-2xl md:text-3xl leading-tight text-ink">
            {title}
          </h1>
          {intro && (
            <p className="lg:col-span-7 lg:border-s lg:border-rule lg:ps-7 text-md leading-relaxed text-ink-soft self-end">
              {intro}
            </p>
          )}
        </div>

        {items.length > 0 && (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((s, i) => (
              <Reveal key={s._id} as="li" from="up" delay={Math.min(i, 8) * 0.05}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-rule/60 bg-surface shadow-raised transition-shadow duration-base ease-out hover:shadow-md"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-sunk">
                    {s.image && (
                      <img src={s.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h2 className="font-display text-md leading-snug text-ink transition-colors group-hover:text-accent">
                      {s.title?.[locale]}
                    </h2>
                    {s.description?.[locale] && (
                      <p className="text-sm leading-relaxed text-muted">{s.description[locale]}</p>
                    )}
                    <span className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted">
                      {s.owner}
                      {s.country && <span>- {s.country}</span>}
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
