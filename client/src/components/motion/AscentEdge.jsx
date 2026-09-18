import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * The signature device (DESIGN.md §5) - a short gradient "growth tick" that
 * grows into place once scrolled into view, paired with an eyebrow label.
 *
 * `orientation` picks how the tick is drawn: the default "vertical" is the
 * upright growth tick beside a label; "horizontal" draws it as a rule above a
 * centred label, for mastheads where an upright tick would sit awkwardly.
 *
 * Mirrors correctly in RTL for free - the tick sits at the reading-direction
 * start of the label via flex row-reverse-free logical order, no transform
 * needed (unlike marginalia's rotate(180deg) override).
 */
export default function AscentEdge({
  label,
  className = '',
  labelClassName = 'text-muted',
  orientation = 'vertical',
  as: Comp = 'span',
}) {
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
  const horizontal = orientation === 'horizontal';

  // The tick grows along its own axis: downward when upright, outward from the
  // middle when it lies flat - centre-origin needs no RTL mirroring.
  const axis = horizontal ? 'scaleX' : 'scaleY';

  return (
    <Comp
      ref={ref}
      className={`inline-flex gap-3 ${
        horizontal ? 'flex-col items-center' : 'items-center'
      } ${className}`}
    >
      <motion.span
        aria-hidden="true"
        className={`block shrink-0 rounded-pill ${
          horizontal
            ? 'h-[3px] w-16 bg-gradient-to-r from-accent-edge-from to-accent-edge-to'
            : 'h-10 w-[3px] bg-gradient-to-b from-accent-edge-from to-accent-edge-to'
        }`}
        style={{ transformOrigin: horizontal ? 'center' : 'top' }}
        initial={reduce ? false : { [axis]: 0 }}
        animate={reduce ? undefined : { [axis]: shown ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
      />
      {label && (
        <span className={`caps-label text-2xs ${labelClassName}`}>{label}</span>
      )}
    </Comp>
  );
}
