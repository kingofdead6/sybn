import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * The signature device (DESIGN.md §5) — a short gradient "growth tick" that
 * grows from its top edge once scrolled into view, paired with a horizontal
 * eyebrow label. Replaces the old rotated marginalia tag: this is an in-flow
 * horizontal element, not an absolutely-positioned outer-margin one.
 *
 * Mirrors correctly in RTL for free — the tick sits at the reading-direction
 * start of the label via flex row-reverse-free logical order, no transform
 * needed (unlike marginalia's rotate(180deg) override).
 */
export default function AscentEdge({ label, className = '', labelClassName = 'text-muted', as: Comp = 'span' }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 'some' });

  // Same safety net as Reveal: never leave the tick permanently invisible if
  // the observer never fires (anchor jump, restored scroll, fast flick).
  const [forced, setForced] = useState(false);
  useEffect(() => {
    if (inView || forced) return undefined;
    const check = () => {
      const el = ref.current;
      if (!el) return;
      if (el.getBoundingClientRect().top < window.innerHeight) setForced(true);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [inView, forced]);

  const shown = inView || forced;

  return (
    <Comp ref={ref} className={`inline-flex items-center gap-3 ${className}`}>
      <motion.span
        aria-hidden="true"
        className="block h-10 w-[3px] shrink-0 rounded-pill bg-gradient-to-b from-accent-edge-from to-accent-edge-to"
        style={{ transformOrigin: 'top' }}
        initial={reduce ? false : { scaleY: 0 }}
        animate={reduce ? undefined : { scaleY: shown ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
      />
      {label && (
        <span className={`caps-label text-2xs ${labelClassName}`}>{label}</span>
      )}
    </Comp>
  );
}
