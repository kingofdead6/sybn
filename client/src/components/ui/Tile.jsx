import Reveal from '../motion/Reveal';

/**
 * A cell in the bento grid (DESIGN.md §5). Tiles are the dashboard's unit of
 * composition: every one shares the same edge, radius and inner padding, so a
 * dense grid of them reads as one modular surface rather than a pile of cards.
 *
 * `span` picks the column/row footprint; `tone` picks the ground. Everything
 * else — headings, data, forms — is composed inside.
 *
 * A tile is a section-sized block, so it settles into place on scroll by
 * default (DESIGN.md §6) through `Reveal` — which carries the reduced-motion
 * and never-stay-hidden guarantees. Pass `reveal={false}` for a tile that is
 * already inside an animating parent, and `delay` to pair a tile with the one
 * it faces rather than giving each its own timer.
 */
const SPANS = {
  sm: 'md:col-span-2',
  md: 'md:col-span-3',
  lg: 'md:col-span-4',
  xl: 'md:col-span-6',
  full: 'md:col-span-6',
  tall: 'md:col-span-2 md:row-span-2',
  wide: 'md:col-span-4 md:row-span-2',
};

const TONES = {
  surface: 'bg-surface text-ink',
  sunk: 'bg-sunk text-ink',
  ink: 'bg-ink text-on-ink',
  accent: 'bg-accent text-on-accent',
};

export default function Tile({
  span = 'md',
  tone = 'surface',
  label,
  className = '',
  children,
  as: Comp = 'div',
  reveal = true,
  from = 'up',
  delay = 0,
  lift = false,
  ...props
}) {
  const classes = `flex min-w-0 flex-col gap-4 rounded-lg border border-rule/60 p-5 shadow-raised md:p-6 ${SPANS[span]} ${TONES[tone]} ${className}`;

  const body = (
    <>
      {label && <span className="caps-label text-2xs opacity-60">{label}</span>}
      {children}
    </>
  );

  if (!reveal) {
    return (
      <Comp className={classes} {...props}>
        {body}
      </Comp>
    );
  }

  return (
    <Reveal as={Comp} from={from} delay={delay} lift={lift} className={classes} {...props}>
      {body}
    </Reveal>
  );
}
