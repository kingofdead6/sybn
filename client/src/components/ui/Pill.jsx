const TONES = {
  default: 'border-line text-body',
  saffron: 'border-saffron text-saffron-deep',
  success: 'border-success text-success',
  clay: 'border-clay text-clay',
};

export default function Pill({ tone = 'default', className = '', children }) {
  return (
    <span className={`inline-flex items-center rounded border px-2.5 py-1 text-xs font-medium ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}
