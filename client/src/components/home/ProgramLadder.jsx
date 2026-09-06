import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Pill from '../ui/Pill';

if (!gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

function toLocaleDigits(n, locale) {
  const str = String(n);
  if (locale !== 'ar') return str;
  return str.replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);
}

export default function ProgramLadder() {
  const { t } = useTranslation('home');
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const [programs, setPrograms] = useState([]);
  const containerRef = useRef(null);
  const spineFillRef = useRef(null);
  const stepRefs = useRef([]);

  useEffect(() => {
    let mounted = true;
    api.get('/programs').then((res) => {
      if (mounted) setPrograms(res.data.data || []);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!programs.length) return undefined;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      if (spineFillRef.current) spineFillRef.current.style.height = '100%';
      stepRefs.current.forEach((el) => el && el.classList.add('is-active'));
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.to(spineFillRef.current, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      });

      stepRefs.current.forEach((el) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          toggleClass: { targets: el, className: 'is-active' },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [programs]);

  if (!programs.length) return null;

  return (
    <section id="programs-ladder" className="bg-paper py-9 md:py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="font-display text-xl md:text-2xl font-bold text-ink">{t('ladder.title')}</h2>
        <p className="mt-2 text-sm text-sage">{t('ladder.sub')}</p>

        <div ref={containerRef} className="relative mt-9">
          <div className="absolute top-0 bottom-0 start-5 w-px bg-line" aria-hidden="true" />
          <div
            ref={spineFillRef}
            className="absolute top-0 start-5 w-px bg-saffron"
            style={{ height: 0 }}
            aria-hidden="true"
          />

          <ol className="flex flex-col gap-9">
            {programs.map((program, idx) => (
              <li key={program.slug}>
                {program.intro?.[locale] && (
                  <p className="mb-3 ps-12 text-sm text-sage max-w-2xl">{program.intro[locale]}</p>
                )}
                <div
                  ref={(el) => { stepRefs.current[idx] = el; }}
                  className="ladder-step relative flex items-start gap-4 ps-0"
                >
                  <span
                    className="numerals ladder-num relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-sage font-display text-md transition-colors duration-300"
                  >
                    {toLocaleDigits(program.order, locale)}
                  </span>

                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {program.code && <Pill tone="default" className="ladder-badge">{program.code}</Pill>}
                      <h3 className="font-display text-lg font-bold text-ink">{program.title?.[locale]}</h3>
                    </div>
                    <p className="mt-1.5 text-sm text-body max-w-2xl truncate">{program.audience?.[locale]}</p>
                    <Link
                      to={`${prefix}/programs/${program.slug}`}
                      className="mt-2 inline-block text-sm font-medium text-saffron-deep hover:text-ink"
                    >
                      {t('ladder.details')}
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <style>{`
        .ladder-step.is-active .ladder-num {
          border-color: var(--c-saffron);
          background-color: var(--c-saffron);
          color: var(--c-on-saffron);
        }
        .ladder-step.is-active .ladder-badge {
          border-color: var(--c-saffron);
          color: var(--c-saffron-deep);
        }
      `}</style>
    </section>
  );
}
