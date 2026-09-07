const TONES = {
  default: 'border-rule text-muted',
  saffron: 'border-accent text-accent',
  success: 'border-success text-success',
  clay: 'border-error text-error',
};

export default function Pill({ tone = 'default', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2.5 py-1 text-2xs caps-label ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
