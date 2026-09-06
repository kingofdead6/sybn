const TONES = {
  default: 'bg-surface-muted text-body border-line',
  saffron: 'bg-saffron-tint text-saffron-deep border-transparent',
  success: 'bg-success-tint text-success border-transparent',
  clay: 'bg-clay-tint text-clay border-transparent',
};

export default function Pill({ tone = 'default', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
