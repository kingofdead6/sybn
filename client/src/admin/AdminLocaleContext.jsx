import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const AdminLocaleContext = createContext(null);
const STORAGE_KEY = 'siyb-admin-locale';

/**
 * The admin panel has no locale in its URL (unlike the public site), so the
 * chosen language is kept per-browser instead. It drives both the interface
 * strings and the direction of the admin chrome.
 */
export function AdminLocaleProvider({ children }) {
  const { i18n } = useTranslation();
  const [locale, setLocale] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'ar';
    } catch {
      return 'ar';
    }
  });

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    if (i18n.language !== locale) i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale, dir, i18n]);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  const value = useMemo(() => ({ locale, dir, setLocale, toggleLocale }), [locale, dir, toggleLocale]);

  return <AdminLocaleContext.Provider value={value}>{children}</AdminLocaleContext.Provider>;
}

export function useAdminLocale() {
  const ctx = useContext(AdminLocaleContext);
  if (!ctx) throw new Error('useAdminLocale must be used within AdminLocaleProvider');
  return ctx;
}
