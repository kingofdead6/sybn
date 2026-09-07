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
  className = '',
  children,
  as: Comp = 'section',
  ...props
}) {
  return (
    <Comp className={`relative border-b border-rule ${TONES[tone]} ${RHYTHM[rhythm]} ${className}`} {...props}>
      {label && (
        <span className="marginalia" aria-hidden="true">
          {label}
        </span>
      )}
      <div className="mx-auto max-w-[86rem] px-4 md:px-8">{children}</div>
    </Comp>
  );
}
