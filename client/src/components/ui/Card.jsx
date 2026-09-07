export default function Card({ className = '', children, ...props }) {
  // Defined by its rule, not a shadow. See DESIGN.md §4.
  return (
    <div className={`border border-rule bg-surface p-5 rounded-sm ${className}`} {...props}>
      {children}
    </div>
  );
}
