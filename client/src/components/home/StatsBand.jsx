import { useEffect, useRef, useState } from 'react';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Tile from '../ui/Tile';

/** One KPI cell. Counts up once when it first scrolls into view. */
function StatItem({ item, locale }) {
  const ref = useRef(null);
  const wrapRef = useRef(null);
  const animated = useRef(false);
  const value = item.value;

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof window === 'undefined' || !window.requestAnimationFrame) return undefined;
    if (!wrapRef.current) return undefined;

    const match = value.match(/^([\d,]+)(.*)$/);
    if (!match) return undefined;
    const numeric = parseInt(match[1].replace(/,/g, ''), 10);
    if (Number.isNaN(numeric)) return undefined;
    const suffix = match[2] || '';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          import('animejs').then(({ default: anime }) => {
            anime({
              targets: { val: 0 },
              val: numeric,
              round: 1,
              duration: 1400,
              easing: 'easeOutExpo',
              update: (anim) => {
                const current = Math.round(anim.animations[0].currentValue);
                if (ref.current) {
                  ref.current.textContent = `${current.toLocaleString('en-US')}${suffix}`;
                }
              },
              complete: () => {
                if (ref.current) ref.current.textContent = value;
              },
            });
          });
        }
      });
    }, { threshold: 0.4 });

    observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={wrapRef} className="flex flex-col gap-1">
      <span ref={ref} className="numerals font-display text-2xl md:text-3xl leading-none text-ink">
        {value}
      </span>
      <span className="caps-label text-2xs text-muted">{item.label?.[locale]}</span>
    </div>
  );
}

/**
 * The measures rail: each figure is its own tile, so the grid reads as a set
 * of instruments rather than a single boxed table.
 */
export default function StatsBand() {
  const { locale } = useLocale();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.get('/settings/about.stats').then((res) => {
      if (mounted) setStats(res.data.data);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  if (!stats) return null;

  return (
    <>
      {stats.items.map((item, idx) => (
        <Tile key={idx} span="sm" className="md:py-8">
          <StatItem item={item} locale={locale} />
        </Tile>
      ))}
    </>
  );
}
