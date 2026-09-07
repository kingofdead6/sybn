import { useTranslation } from 'react-i18next';

function Star({ filled }) {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.51L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.81L10 1.6z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Five-star editorial score. Rendered as a single labelled group rather than
 * five separate images, so a screen reader announces "4 out of 5" once.
 */
export default function Stars({ value = 0, max = 5 }) {
  const { t } = useTranslation('courses');
  const rounded = Math.round(value);
  return (
    <p className="flex items-center gap-0.5 text-warning" role="img" aria-label={t('rating', { value: rounded, max })}>
      {Array.from({ length: max }, (_, i) => (
        <Star key={i} filled={i < rounded} />
      ))}
    </p>
  );
}
