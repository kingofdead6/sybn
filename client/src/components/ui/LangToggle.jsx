import { useLocale } from '../../context/LocaleContext';

export default function LangToggle() {
  const { locale, switchLocale } = useLocale();
  const next = locale === 'ar' ? 'en' : 'ar';

  return (
    <button
      type="button"
      onClick={() => switchLocale(next)}
      className="border border-line rounded-sm px-3 py-1.5 text-sm font-medium text-ink hover:border-saffron"
      aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {locale === 'ar' ? 'EN' : 'ع'}
    </button>
  );
}
