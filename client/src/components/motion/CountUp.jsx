import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/**
 * Counts a stat value up to its final figure when it scrolls into view.
 *
 * Values arrive from the CMS as display strings ("+25,000", "40"), so the
 * numeric part is animated and any prefix/suffix is preserved verbatim. If the
 * string has no number in it, or the user prefers reduced motion, the value is
 * printed as-is — the figure is content, and must never depend on an effect.
 */
export default function CountUp({ value = '', duration = 1300 }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 'some' });
  const [shown, setShown] = useState(value);

  // "+25,000 " -> prefix "+", digits "25,000", suffix ""
  const match = String(value).match(/^(\D*)([\d][\d,\s]*)(.*)$/s);
  const target = match ? parseInt(match[2].replace(/[,\s]/g, ''), 10) : NaN;

  useEffect(() => {
    if (reduce || !inView || !match || Number.isNaN(target)) {
      setShown(value);
      return undefined;
    }
    const [, prefix, , suffix] = match;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // easeOutExpo — fast to near-final, then settles.
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setShown(`${prefix}${Math.round(target * eased).toLocaleString('en-US')}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setShown(value); // land on the exact string the admin wrote
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value, duration, target]);

  return <span ref={ref}>{shown}</span>;
}
