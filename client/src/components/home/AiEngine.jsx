import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { withDefaults } from '../../lib/homeDefaults';
import { useLocale } from '../../context/LocaleContext';
import Reveal from '../motion/Reveal';
import aiImage from '../../assets/AiImage.avif';
import aiVideo from '../../assets/aivideo.mp4';

/** A small robot glyph for the first card, matching the reference layout. */
function EngineIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-accent-wash text-accent"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a1 1 0 011 1v1.6h2.5A3.5 3.5 0 0119 8.1v7A3.5 3.5 0 0115.5 18.6h-7A3.5 3.5 0 015 15.1v-7A3.5 3.5 0 018.5 4.6H11V3a1 1 0 011-1zM9.25 9.6a1.35 1.35 0 100 2.7 1.35 1.35 0 000-2.7zm5.5 0a1.35 1.35 0 100 2.7 1.35 1.35 0 000-2.7zM9 14.6h6v1.5H9v-1.5zM3 10h1.2v4H3a1 1 0 01-1-1v-2a1 1 0 011-1zm16.8 0H21a1 1 0 011 1v2a1 1 0 01-1 1h-1.2v-4z" />
      </svg>
    </span>
  );
}

/**
 * The AI / business-simulation engine block. The first capability carries the
 * explainer video; the section is anchored by a tall arched still beside it.
 *
 * Copy is admin-managed under the `home.aiEngine` setting.
 */
export default function AiEngine() {
  const { locale } = useLocale();
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/settings/home.aiEngine')
      .then(({ data: res }) => {
        if (active) setData(res.data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const content = withDefaults('home.aiEngine', data, 'items');
  const items = content?.items || [];
  if (!items.length) return null;

  return (
    <section className="bg-bg py-10 md:py-[7rem]">
      <div className="mx-auto max-w-[86rem] px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Copy and capability cards */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <Reveal from="up" className="flex flex-col gap-4">
              <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink max-w-[22ch]">
                {content.heading?.[locale]}
              </h2>
              {content.intro?.[locale] && (
                <p className="text-md leading-relaxed text-ink-soft max-w-[58ch]">
                  {content.intro[locale]}
                </p>
              )}
            </Reveal>

            {items.map((item, i) => (
              <Reveal
                key={i}
                from="up"
                delay={Math.min(i, 4) * 0.06}
                className="rounded-lg border border-rule/60 bg-surface p-5 shadow-raised md:p-6"
              >
                <div className="flex items-start gap-4">
                  <EngineIcon />
                  <div className="min-w-0 flex flex-col gap-2">
                    <h3 className="font-display text-md md:text-lg leading-snug text-ink">
                      {item.title?.[locale]}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-soft">{item.body?.[locale]}</p>
                  </div>
                </div>

                {/* The first capability is the one the video demonstrates. */}
                {i === 0 && (
                  <div className="mt-5 overflow-hidden rounded-md bg-sunk">
                    <div className="relative w-full pb-[56.25%]">
                      <video
                        src={aiVideo}
                        className="absolute inset-0 h-full w-full object-cover"
                        controls
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                    </div>
                  </div>
                )}
              </Reveal>
            ))}
          </div>

          {/* The arched still, held alongside the cards on desktop. */}
          <Reveal from="end" delay={0.1} className="lg:col-span-5">
            <img
              src={aiImage}
              alt=""
              className="h-full max-h-[46rem] w-full rounded-t-[14rem] rounded-b-lg object-cover shadow-overlay"
              loading="lazy"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
