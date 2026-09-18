import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Reveal from '../motion/Reveal';
import AscentEdge from '../motion/AscentEdge';

/**
 * Worked examples from the idea generator, as a grid of tagged opportunity
 * cards. Content is admin-managed under the `home.ideaExamples` setting.
 */
export default function IdeaExamples() {
  const { locale } = useLocale();
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/settings/home.ideaExamples')
      .then(({ data: res }) => {
        if (active) setData(res.data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const items = data?.items || [];
  if (!items.length) return null;

  return (
    <section className="bg-sunk py-10 md:py-[7rem]">
      <div className="mx-auto max-w-[86rem] px-4 md:px-8">
        <Reveal from="up" className="flex flex-col gap-4">
          {data.eyebrow?.[locale] && <AscentEdge label={data.eyebrow[locale]} />}
          <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink max-w-[26ch]">
            {data.heading?.[locale]}
          </h2>
          {data.intro?.[locale] && (
            <p className="text-md leading-relaxed text-ink-soft max-w-[62ch]">
              {data.intro[locale]}
            </p>
          )}
        </Reveal>

        <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal
              key={i}
              as="li"
              from="up"
              delay={Math.min(i, 6) * 0.05}
              className="flex h-full flex-col gap-3 rounded-lg border border-rule/60 bg-surface p-5 shadow-raised transition-shadow duration-base ease-out hover:shadow-md md:p-6"
            >
              {item.tag?.[locale] && (
                <span className="caps-label self-start rounded-pill border border-rule px-2.5 py-1 text-2xs text-accent">
                  {item.tag[locale]}
                </span>
              )}
              <h3 className="font-display text-md leading-snug text-ink">
                {item.title?.[locale]}
              </h3>
              <p className="text-sm leading-relaxed text-ink-soft">{item.body?.[locale]}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
