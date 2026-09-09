import AscentEdge from '../motion/AscentEdge';

const TONES = {
  paper: 'bg-bg',
  surface: 'bg-sunk',
  ink: 'bg-ink text-on-ink',
};

/**
 * Section rhythm must vary — see DESIGN.md §4. `rhythm` picks the vertical
 * measure so the page has cadence instead of a uniform py-24 everywhere.
 */
const RHYTHM = {
  tight: 'py-8',
  base: 'py-9',
  loose: 'py-10',
};

export default function Section({
  tone = 'paper',
  rhythm = 'base',
  label,
  divider = false,
  className = '',
  children,
  as: Comp = 'section',
  ...props
}) {
  return (
    <Comp
      className={`relative ${divider ? 'border-b border-rule' : ''} ${TONES[tone]} ${RHYTHM[rhythm]} ${className}`}
      {...props}
    >
      <div className="mx-auto max-w-[86rem] px-4 md:px-8">
        {label && <AscentEdge label={label} className="mb-6" />}
        {children}
      </div>
    </Comp>
  );
}
