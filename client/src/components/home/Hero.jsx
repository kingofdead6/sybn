import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Button from '../ui/Button';

function youtubeEmbedUrl(url) {
  if (!url) return '';
  const short = url.match(/youtu\.be\/([^?]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const long = url.match(/[?&]v=([^&]+)/);
  if (long) return `https://www.youtube.com/embed/${long[1]}`;
  return url;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Hero() {
  const { locale } = useLocale();
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
  const embedUrl = youtubeEmbedUrl(hero.video);

  const animProps = reduceMotion
    ? { initial: 'show', animate: 'show' }
    : { initial: 'hidden', animate: 'show' };

  return (
    <section className="relative border-b border-rule bg-bg">
      <span className="marginalia" aria-hidden="true">
        SIYB — 01
      </span>

      <div className="mx-auto max-w-[86rem] px-4 md:px-8">
        <motion.div variants={container} {...animProps} className="grid gap-0 lg:grid-cols-12 lg:items-stretch">
          {/* Text column spans 7 of 12 — deliberately not half, deliberately not centred */}
          <div className="lg:col-span-7 border-b border-rule py-9 lg:border-b-0 lg:border-e lg:py-10 lg:pe-8">
            <motion.h1
              variants={item}
              className="font-display text-3xl md:text-4xl text-ink leading-[1.05] max-w-[16ch]"
            >
              {h1}
            </motion.h1>

            <motion.div variants={item} className="mt-6 flex items-start gap-4 max-w-prose">
              <span className="mt-3 h-px w-8 shrink-0 bg-accent" aria-hidden="true" />
              <p className="text-ink-soft text-md leading-relaxed">{sub}</p>
            </motion.div>

            <motion.div variants={item} className="mt-7">
              <Button as="a" href="#programs-ladder" variant="primary" size="lg">
                {cta}
              </Button>
            </motion.div>
          </div>

          {/* Video sits in the remaining 5 columns, flush to the rule, no floating frame */}
          <motion.div variants={item} className="lg:col-span-5 self-center py-9 lg:py-10 lg:ps-8">
            {embedUrl && (
              <div className="relative w-full border border-rule bg-sunk" style={{ paddingBlockEnd: '56.25%' }}>
                <iframe
                  src={embedUrl}
                  title={h1}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
