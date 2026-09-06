import { useLocale } from '../../context/LocaleContext';

export default function LangToggle() {
  const { locale, switchLocale } = useLocale();
  const next = locale === 'ar' ? 'en' : 'ar';

  return (
    <button
      type="button"
      onClick={() => switchLocale(next)}
      className="border border-line rounded-full px-3.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-saffron hover:text-saffron-deep"
      aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {locale === 'ar' ? 'EN' : 'ع'}
    </button>
  );
}
