import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { withDefaults } from '../../lib/homeDefaults';
import { useLocale } from '../../context/LocaleContext';
import Button from '../ui/Button';
import AscentEdge from '../motion/AscentEdge';
import heroVideo from '../../assets/HomeVideo.mp4';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0, 0, 1] } },
};

/**
 * The masthead. The film leads — it is the first thing on the page — and the
 * proposition is set wide and centred beneath it. The subtitle runs to ~400
 * characters, so it needs a real measure to read as a paragraph rather than a
 * narrow column of text.
 *
 * Every string here comes from the `home.hero` setting so the admin panel can
 * rewrite the masthead without a deploy; the bundled MP4 is only the fallback
 * for when no `video` URL has been set.
 */
export default function Hero() {
  const { locale } = useLocale();
  const { t } = useTranslation('home');
  const reduceMotion = useReducedMotion();
  const [hero, setHero] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    api
      .get('/settings/home.hero')
      .then((res) => {
        if (mounted) setHero(res.data.data);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoaded(true);
      });
    return () => { mounted = false; };
  }, []);

  // Hold the masthead back until the request settles, so a configured hero is
  // never replaced mid-paint by the built-in copy. Once settled, a missing or
  // failed setting falls back rather than leaving the page headless.
  if (!loaded) return null;

  const content = withDefaults('home.hero', hero);

  const h1 = content.h1?.[locale] || '';
  const sub = content.sub?.[locale] || '';
  const sub2 = content.sub2?.[locale] || '';
  const cta = content.cta?.[locale] || '';
  const eyebrow = content.eyebrow?.[locale] || '';
  const ctaHref = content.ctaHref || '#programs-ladder';
  const cta2 = content.cta2?.[locale] || t('hero.registerForum');
  const cta2Href = content.cta2Href || '#forum-registration';

  const animProps = reduceMotion
    ? { initial: 'show', animate: 'show' }
    : { initial: 'hidden', animate: 'show' };

  return (
    <section className="relative overflow-hidden bg-bg">
      {/* A single soft accent wash behind the masthead — the one atmospheric
          moment on the page, kept flat and static. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-accent-wash to-transparent"
      />

      <div className="relative mx-auto max-w-[86rem] px-4 md:px-8">
        {/* The film leads the page: wide, cinematic, and the first thing seen.
            It is the bundled one in assets, shared with the About page. */}
        <motion.div
          variants={item}
          {...animProps}
          className="relative mt-8 overflow-hidden rounded-lg bg-sunk shadow-overlay md:mt-10"
        >
          <div className="relative w-full pb-[56.25%] md:pb-[42%]">
            <video
              src={heroVideo}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
            />
          </div>
        </motion.div>

        <motion.div
          variants={container}
          {...animProps}
          className="flex flex-col items-center gap-6 pt-10 pb-2 text-center md:pt-12"
        >
          {eyebrow && (
            <motion.div variants={item}>
              <AscentEdge label={eyebrow} />
            </motion.div>
          )}

          <motion.h1
            variants={item}
            className="font-display text-3xl md:text-4xl text-ink leading-[1.08] max-w-[26ch]"
          >
            {h1}
          </motion.h1>

          <motion.p
            variants={item}
            className="text-md leading-relaxed text-ink-soft max-w-[62ch]"
          >
            {sub}
          </motion.p>

          {sub2 && (
            <motion.p
              variants={item}
              className="text-base leading-relaxed text-muted max-w-[58ch]"
            >
              {sub2}
            </motion.p>
          )}

          <motion.div variants={item} className="mt-1 flex flex-wrap items-center justify-center gap-3">
            {cta && (
              <Button as="a" href={ctaHref} variant="primary" size="lg">
                {cta}
              </Button>
            )}
            {cta2 && (
              <Button as="a" href={cta2Href} variant="secondary" size="lg">
                {cta2}
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
