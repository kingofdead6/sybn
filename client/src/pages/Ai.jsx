import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { withDefaults } from '../lib/homeDefaults';
import { useLocale } from '../context/LocaleContext';
import { programPath } from '../lib/programRoutes';
import Section from '../components/ui/Section';
import Pill from '../components/ui/Pill';
import SEO from '../components/SEO';
import Reveal from '../components/motion/Reveal';
import Button from '../components/ui/Button';
import IdeaChat from '../components/ai/IdeaChat';
import { embedUrl } from '../lib/videoUrl';
import aiImage from '../assets/AiImage.avif';
import aiVideo from '../assets/aivideo.mp4';

/** The robot glyph that marks each capability. */
function EngineIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a1 1 0 011 1v1.6h2.5A3.5 3.5 0 0119 8.1v7A3.5 3.5 0 0115.5 18.6h-7A3.5 3.5 0 015 15.1v-7A3.5 3.5 0 018.5 4.6H11V3a1 1 0 011-1zM9.25 9.6a1.35 1.35 0 100 2.7 1.35 1.35 0 000-2.7zm5.5 0a1.35 1.35 0 100 2.7 1.35 1.35 0 000-2.7zM9 14.6h6v1.5H9v-1.5zM3 10h1.2v4H3a1 1 0 01-1-1v-2a1 1 0 011-1zm16.8 0H21a1 1 0 011 1v2a1 1 0 01-1 1h-1.2v-4z" />
    </svg>
  );
}

/**
 * The AI and business-simulation page.
 *
 * Built from the same admin-managed `home.aiEngine` record as the home-page
 * section, so the two never contradict each other and the copy is edited in
 * one place. Here it gets the room the home band cannot give it: the
 * capabilities are their own section, the film its own, and the AI-track
 * programmes are listed beneath.
 */
export default function Ai() {
  const { locale } = useLocale();
  const { t } = useTranslation('programs');
  const reduceMotion = useReducedMotion();
  const prefix = locale === 'en' ? '/en' : '';

  const [data, setData] = useState(null);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    let active = true;

    api
      .get('/settings/home.aiEngine')
      .then(({ data: res }) => {
        if (active) setData(res.data);
      })
      .catch(() => {});

    // The programmes on this track, if any have been added.
    api
      .get('/programs')
      .then(({ data: res }) => {
        if (active) setPrograms((res.data || []).filter((p) => p.track === 'ai'));
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const isAr = locale === 'ar';
  const content = withDefaults('home.aiEngine', data, 'items');
  const items = content?.items || [];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={`${content?.heading?.[locale] || 'AI'} | SIYB`}
        description={content?.intro?.[locale]}
        path="/ai"
      />

      {/* 1 — Masthead, with the arched still beside it. */}
      <Section tone="surface">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7 flex flex-col gap-5">
            <h1 className="font-display text-3xl md:text-4xl leading-[1.08] text-ink max-w-[22ch]">
              {content?.heading?.[locale]}
            </h1>

            {content?.intro?.[locale] && (
              <p className="text-md leading-relaxed text-ink-soft max-w-[58ch]">
                {content.intro[locale]}
              </p>
            )}

            <div className="mt-2 flex flex-wrap gap-3">
              <Button as="a" href="#capabilities" variant="primary" size="lg">
                {t('aiCapabilities')}
              </Button>
              <Button as={Link} to={`${prefix}/store`} variant="secondary" size="lg">
                {t('aiVisitStore')}
              </Button>
            </div>
          </div>

          <Reveal from="end" delay={0.1} className="lg:col-span-5">
            <img
              src={aiImage}
              alt=""
              className="h-full max-h-[34rem] w-full rounded-t-[11rem] rounded-b-lg object-cover shadow-overlay"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section>

      {/* 2 — Each capability is its own band: the copy, then whatever it
          carries — a film, or the assistant itself. Bands alternate grounds so
          one reads as separate from the next. */}
      {items.map((item, i) => {
        const isChatbot = item.kind === 'chatbot';
        const embed = embedUrl(item.video);
        // A capability with nothing declared still gets its section; only the
        // first one falls back to the bundled film.
        const showVideoSlot = item.kind === 'video' || (!item.kind && i === 0);

        return (
          <Section
            key={i}
            id={i === 0 ? 'capabilities' : undefined}
            tone={i % 2 === 0 ? 'paper' : 'surface'}
            label={t('aiCapabilities')}
            className={i === 0 ? 'scroll-mt-28' : undefined}
          >
            <div className="mx-auto flex max-w-[70ch] flex-col items-center gap-4 text-center">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-pill bg-accent-wash text-accent"
              >
                <EngineIcon className="h-6 w-6" />
              </span>

              <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">
                {item.title?.[locale]}
              </h2>

              <p className="text-md leading-relaxed text-ink-soft">{item.body?.[locale]}</p>
            </div>

            {isChatbot && (
              <div className="mx-auto mt-9 max-w-3xl">
                <IdeaChat />
              </div>
            )}

            {showVideoSlot && (
              <div className="mx-auto mt-9 max-w-4xl">
                {embed ? (
                  <div className="overflow-hidden rounded-lg bg-sunk shadow-overlay">
                    <div className="relative w-full pb-[56.25%]">
                      <iframe
                        src={embed}
                        title={item.title?.[locale] || ''}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  </div>
                ) : item.video ? (
                  <div className="overflow-hidden rounded-lg bg-sunk shadow-overlay">
                    <div className="relative w-full pb-[56.25%]">
                      <video
                        src={item.video}
                        className="absolute inset-0 h-full w-full object-cover"
                        controls
                        playsInline
                        preload="metadata"
                      />
                    </div>
                  </div>
                ) : i === 0 ? (
                  /* The bundled film stands in for the first capability until
                     its own link is set. */
                  <div className="overflow-hidden rounded-lg bg-sunk shadow-overlay">
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
                ) : (
                  /* Video pending: the band keeps its shape so the page does
                     not reflow once the link is added. */
                  <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-rule bg-sunk text-center">
                    <svg
                      aria-hidden="true"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-muted/50"
                    >
                      <rect x="2.75" y="5.75" width="18.5" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.25" />
                      <path d="M10.5 9.5l4.5 2.5-4.5 2.5v-5z" fill="currentColor" />
                    </svg>
                    <span className="text-2xs caps-label text-muted">{t('aiVideoPending')}</span>
                  </div>
                )}
              </div>
            )}
          </Section>
        );
      })}

      {/* 4 — The programmes on this track, when any exist. */}
      {programs.length > 0 && (
        <Section label={t('aiPrograms')}>
          <div className="mb-8 border-b border-rule pb-5 text-center">
            <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">
              {t('aiPrograms')}
            </h2>
          </div>

          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((p, i) => (
              <Reveal key={p._id || p.slug} as="li" from="up" delay={Math.min(i, 6) * 0.05}>
                <Link
                  to={programPath(prefix, p)}
                  className="group flex h-full flex-col gap-3 rounded-lg border border-rule/60 bg-surface p-6 shadow-raised transition-shadow duration-base ease-out hover:shadow-md"
                >
                  {p.code && <Pill tone="saffron" className="self-start">{p.code}</Pill>}

                  <h3 className="font-display text-md leading-snug text-ink">
                    {p.title?.[locale]}
                  </h3>

                  {p.audience?.[locale] && (
                    <p className="text-sm leading-relaxed text-ink-soft line-clamp-3">
                      {p.audience[locale]}
                    </p>
                  )}

                  <span className="mt-auto pt-2 text-sm font-medium text-accent">
                    {t('viewProgram')} {isAr ? '←' : '→'}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}
    </motion.div>
  );
}
