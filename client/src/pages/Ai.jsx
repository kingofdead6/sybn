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
import AscentEdge from '../components/motion/AscentEdge';
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

      {/* 1 — Masthead, with the arched still beside it. A soft wash sits
          behind it, the one atmospheric moment on the page. */}
      <Section tone="surface" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-gradient-to-b from-accent-wash to-transparent"
        />

        <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7 flex flex-col gap-5">
            <AscentEdge label={t('aiEyebrow')} />

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
              className="max-h-[30rem] w-full rounded-t-[10rem] rounded-b-lg object-cover shadow-overlay"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section>

      {/* 2 — A contents rail: the three capabilities named up front, so the
          page states its shape before asking anyone to scroll through it. */}
      {items.length > 1 && (
        <Section id="capabilities" rhythm="tight" className="scroll-mt-28">
          <ol className="grid gap-px overflow-hidden rounded-lg border border-rule bg-rule md:grid-cols-3">
            {items.map((item, i) => (
              <li key={i}>
                <a
                  href={`#capability-${i}`}
                  className="group flex h-full items-start gap-4 bg-bg p-5 transition-colors hover:bg-sunk"
                >
                  <span
                    className="numerals shrink-0 font-display text-lg leading-none text-accent"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-sm leading-snug text-ink transition-colors group-hover:text-accent">
                      {item.title?.[locale]}
                    </span>
                    <span className="mt-1 block text-2xs caps-label text-muted">
                      {item.kind === 'chatbot' ? t('aiKindAssistant') : t('aiKindVideo')}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* 3 — Each capability is its own band. The copy and its media sit side
          by side and swap sides down the page, so three sections read as three
          rather than as one template repeated. The assistant is the exception:
          it is the thing to use, not to read about, so it runs full width. */}
      {items.map((item, i) => {
        const isChatbot = item.kind === 'chatbot';
        const embed = embedUrl(item.video);
        const showVideoSlot = item.kind === 'video' || (!item.kind && i === 0);
        // Media leads on alternate bands; the copy keeps the reading order.
        const mediaFirst = i % 2 === 1;

        const media = showVideoSlot ? (
          embed ? (
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
            /* The bundled film stands in for the first capability until its
               own link is set. */
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
            /* Video pending: the slot keeps the band's shape so the page does
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
          )
        ) : null;

        const copy = (centered = false) => (
          <div className={`flex flex-col gap-4 ${centered ? 'items-center text-center' : ''}`}>
            <div className="flex items-center gap-3">
              <span
                className="numerals font-display text-2xl leading-none text-accent/40"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-2xs caps-label text-muted">
                {isChatbot ? t('aiKindAssistant') : t('aiKindVideo')}
              </span>
            </div>

            <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">
              {item.title?.[locale]}
            </h2>

            <p className="text-md leading-relaxed text-ink-soft">{item.body?.[locale]}</p>
          </div>
        );

        return (
          <Section
            key={i}
            id={`capability-${i}`}
            tone={i % 2 === 0 ? 'paper' : 'surface'}
            className="scroll-mt-28"
          >
            {isChatbot ? (
              <>
                <div className="mx-auto max-w-[62ch]">{copy(true)}</div>
                <div className="mx-auto mt-9 max-w-3xl">
                  <IdeaChat />
                </div>
              </>
            ) : media ? (
              <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                <div className={`lg:col-span-5 ${mediaFirst ? 'lg:order-2' : ''}`}>
                  {copy()}
                </div>
                <Reveal
                  from="up"
                  className={`lg:col-span-7 ${mediaFirst ? 'lg:order-1' : ''}`}
                >
                  {media}
                </Reveal>
              </div>
            ) : (
              <div className="mx-auto max-w-[70ch]">{copy()}</div>
            )}
          </Section>
        );
      })}

      {/* 4 — The programmes on this track, when any exist. */}
      {/* The tone continues the alternation the capability bands set, so the
          page never puts two grounds of the same colour next to each other. */}
      {programs.length > 0 && (
        <Section tone={items.length % 2 === 0 ? 'paper' : 'surface'} label={t('aiPrograms')}>
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
