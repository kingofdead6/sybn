import { Link, useLocation } from 'react-router-dom';
import { useLocale, stripLocalePrefix } from '../../context/LocaleContext';

const VARIANTS = {
  light: 'border-rule text-ink hover:border-accent hover:text-accent',
  dark: 'border-rule text-on-ink hover:border-on-ink hover:text-on-ink',
};

/** The same page in the other language — a real link, so crawlers follow it. */
export function localizedPath(pathname, nextLocale) {
  const bare = stripLocalePrefix(pathname);
  return nextLocale === 'en' ? `/en${bare === '/' ? '' : bare}` : bare;
}

export default function LangToggle({ variant = 'light' }) {
  const { locale } = useLocale();
  const location = useLocation();
  const next = locale === 'ar' ? 'en' : 'ar';

  return (
    <Link
      to={`${localizedPath(location.pathname, next)}${location.search}`}
      hrefLang={next}
      lang={next}
      className={`inline-block border rounded-pill px-3.5 py-1.5 text-sm font-semibold transition-colors ${VARIANTS[variant]}`}
      aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {locale === 'ar' ? '🇬🇧 EN' : 'ع'}
    </Link>
  );
}
