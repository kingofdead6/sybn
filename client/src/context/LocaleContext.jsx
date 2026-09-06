import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const LocaleContext = createContext(null);

export function localeFromPath(pathname) {
  return pathname.startsWith('/en') ? 'en' : 'ar';
}

export function stripLocalePrefix(pathname) {
  return pathname.startsWith('/en') ? pathname.slice(3) || '/' : pathname;
}

export function LocaleProvider({ children }) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const locale = localeFromPath(location.pathname);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    if (i18n.language !== locale) i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir, i18n]);

  const switchLocale = useCallback(
    (nextLocale) => {
      const bare = stripLocalePrefix(location.pathname);
      const nextPath = nextLocale === 'en' ? `/en${bare === '/' ? '' : bare}` : bare;
      navigate(`${nextPath}${location.search}`, { replace: false });
    },
    [location, navigate]
  );

  const value = useMemo(() => ({ locale, dir, switchLocale }), [locale, dir, switchLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
