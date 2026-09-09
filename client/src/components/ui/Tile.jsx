/**
 * A cell in the bento grid (DESIGN.md §5). Tiles are the dashboard's unit of
 * composition: every one shares the same edge, radius and inner padding, so a
 * dense grid of them reads as one modular surface rather than a pile of cards.
 *
 * `span` picks the column/row footprint; `tone` picks the ground. Everything
 * else — headings, data, forms — is composed inside.
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
  ...props
}) {
  return (
    <Comp
      className={`flex min-w-0 flex-col gap-4 rounded-lg border border-rule/60 p-5 shadow-raised md:p-6 ${SPANS[span]} ${TONES[tone]} ${className}`}
      {...props}
    >
      {label && (
        <span className="caps-label text-2xs opacity-60">{label}</span>
      )}
      {children}
    </Comp>
  );
}
