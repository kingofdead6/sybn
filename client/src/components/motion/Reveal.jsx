import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/** Tailwind's `lg` — below it the columns stack, so sideways motion is wrong. */
const LG = '(min-width: 1024px)';

/* Distances are small on purpose: this is printed matter that settles into
   place, not content that flies in. See DESIGN.md §6. */
const OFFSET = {
  up: { y: 24, x: 0 },
  down: { y: -24, x: 0 },
  /* Logical, not physical: `start`/`end` follow the reading direction, so the
     motion mirrors correctly in RTL without a second set of variants. */
  start: { y: 0, x: -28 },
  end: { y: 0, x: 28 },
  none: { y: 0, x: 0 },
};

/**
 * Reveals its children once, when scrolled into view.
 *
 * Every scroll animation on the site goes through this component so the timing,
 * easing, distance and reduced-motion behaviour stay consistent. When the user
 * prefers reduced motion nothing animates and the content renders plainly —
 * never hidden, never faded, so the page is fully readable either way.
 */
export default function Reveal({
  children,
  as = 'div',
  from = 'up',
  delay = 0,
  duration = 0.5,
  /* Deliberately small: a tall block on a phone can be taller than the
     viewport, and a larger threshold would never be satisfied — the element
     would scroll past still hidden. `some` covers that case. */
  amount = 'some',
  className = '',
  ...props
}) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount });
  const Comp = motion[as] || motion.div;

  /* Safety net. An IntersectionObserver can miss an element entirely when the
     viewport jumps past it (anchor links, restored scroll position, a fast
     flick on a long page). The reveal is decoration; the content is not. So if
     the element is at or above the fold and still unrevealed, show it. This
     guarantees nothing can be permanently invisible because of an effect. */
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

  // Sideways reveals only make sense while the columns actually sit side by
  // side. Below `lg` they stack, and a horizontal offset would push the block
  // past the viewport edge — a real overflow, not just a wasted effect.
  const [wide, setWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(LG).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(LG);
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  if (reduce) {
    const Plain = as;
    return (
      <Plain className={className} {...props}>
        {children}
      </Plain>
    );
  }

  const dir = document?.documentElement?.dir === 'rtl' ? -1 : 1;
  const chosen = OFFSET[from] || OFFSET.up;
  // Stacked layout: fall back to a plain vertical settle.
  const { x, y } = wide ? chosen : { x: 0, y: chosen.x !== 0 ? 24 : chosen.y };

  return (
    <Comp
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: x * dir, y }}
      animate={shown ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{ duration, delay, ease: [0.2, 0, 0, 1] }}
      {...props}
    >
      {children}
    </Comp>
  );
}
