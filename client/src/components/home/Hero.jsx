import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
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
 * The masthead. The proposition is set wide and centred above a full-bleed
 * video banner — the subtitle runs to ~400 characters, so it needs a real
 * measure to read as a paragraph rather than a narrow column of text.
 */
export default function Hero() {
  const { locale } = useLocale();
  const { t } = useTranslation('home');
  const reduceMotion = useReducedMotion();
  const [hero, setHero] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.get('/settings/home.hero').then((res) => {
      if (mounted) setHero(res.data.data);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  if (!hero) return null;

  const h1 = hero.h1?.[locale] || '';
  const sub = hero.sub?.[locale] || '';
  const cta = hero.cta?.[locale] || '';

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
        <motion.div
          variants={container}
          {...animProps}
          className="flex flex-col items-center gap-6 pt-10 text-center md:pt-14"
        >
          <motion.div variants={item}>
            <AscentEdge label="Start and Improve Your Business" />
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-3xl md:text-4xl text-ink leading-[1.03] max-w-[20ch]"
          >
            {h1}
          </motion.h1>

          <motion.p
            variants={item}
            className="text-md leading-relaxed text-ink-soft max-w-[62ch]"
          >
            {sub}
          </motion.p>

          <motion.div variants={item} className="mt-1 flex flex-wrap items-center justify-center gap-3">
            <Button as="a" href="#programs-ladder" variant="primary" size="lg">
              {cta}
            </Button>
            <Button as="a" href="#forum-registration" variant="secondary" size="lg">
              {t('hero.registerForum')}
            </Button>
          </motion.div>
        </motion.div>

        {/* The video banner: wide, cinematic, and the anchor of the masthead. */}
        <motion.div
          variants={item}
          {...animProps}
          className="relative mt-10 overflow-hidden rounded-lg bg-sunk shadow-overlay md:mt-12"
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
      </div>
    </section>
  );
}
