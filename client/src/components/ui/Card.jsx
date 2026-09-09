const RADII = {
  md: 'rounded-md',
  lg: 'rounded-lg',
};

export default function Card({ className = '', radius = 'md', hoverable = false, children, ...props }) {
  // Defined by its shadow now, not its rule. See DESIGN.md §4.
  return (
    <div
      className={`border border-rule/60 bg-surface p-5 shadow-raised ${RADII[radius]} ${
        hoverable ? 'transition-shadow duration-base ease-out hover:shadow-md' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
