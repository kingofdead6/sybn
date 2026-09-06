import { useLocale } from '../../context/LocaleContext';

const VARIANTS = {
  light: 'border-line text-ink hover:border-saffron hover:text-saffron-deep',
  dark: 'border-white/30 text-on-ink hover:border-white hover:text-on-ink',
};

export default function LangToggle({ variant = 'light' }) {
  const { locale, switchLocale } = useLocale();
  const next = locale === 'ar' ? 'en' : 'ar';

  return (
    <button
      type="button"
      onClick={() => switchLocale(next)}
      className={`border rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${VARIANTS[variant]}`}
      aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {locale === 'ar' ? '🇬🇧 EN' : 'ع'}
    </button>
  );
}
