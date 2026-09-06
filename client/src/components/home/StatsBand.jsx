import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';

function StatItem({ item, locale }) {
  const { t } = useTranslation('home');
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
    <div ref={wrapRef} className="flex flex-col items-center gap-2 px-4 py-6 text-center">
      <span ref={ref} className="numerals font-display text-2xl md:text-3xl font-bold text-saffron">
        {value}
      </span>
      <span className="text-sm text-sage">{item.label?.[locale]}</span>
    </div>
  );
}

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
    <section className="bg-paper py-9 md:py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="font-display text-xl md:text-2xl font-bold text-ink text-center">
          {stats.heading?.[locale]}
        </h2>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-line border border-line rtl:divide-x-reverse">
          {stats.items.map((item, idx) => (
            <StatItem key={idx} item={item} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
