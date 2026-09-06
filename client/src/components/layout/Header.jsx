import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useAuth } from '../../context/AuthContext';
import LangToggle from '../ui/LangToggle';
import ThemeToggle from '../ui/ThemeToggle';

const LINKS = [
  ['home', ''],
  ['programs', 'programs'],
  ['categories', 'categories'],
  ['network', 'network'],
  ['stories', 'stories'],
  ['forums', 'forums'],
  ['store', 'store'],
  ['about', 'about'],
];

export default function Header() {
  const { t } = useTranslation('nav');
  const { locale } = useLocale();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const prefix = locale === 'en' ? '/en' : '';

  return (
    <header className="border-b border-line bg-surface/90 backdrop-blur sticky top-0 z-40 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 md:px-6 flex items-center justify-between h-16">
        <Link to={prefix || '/'} className="font-display text-lg font-bold text-ink">
          {locale === 'ar' ? 'أبسط' : 'ABCET · SIYB'}
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Primary">
          {LINKS.map(([key, path]) => (
            <NavLink
              key={key}
              to={`${prefix}/${path}`}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-saffron-deep' : 'text-ink hover:text-saffron-deep'}`
              }
              end={path === ''}
            >
              {t(key)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LangToggle />
          <ThemeToggle />
          <Link
            to={`${prefix}/${user ? 'dashboard' : 'login'}`}
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-on-saffron shadow-accent transition-all hover:brightness-110"
          >
            {t(user ? 'dashboard' : 'login')}
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden border border-line rounded-full w-10 h-10 flex items-center justify-center text-ink"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true">{open ? '×' : '☰'}</span>
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-line bg-surface px-4 py-4 flex flex-col gap-3" aria-label="Primary">
          {LINKS.map(([key, path]) => (
            <NavLink
              key={key}
              to={`${prefix}/${path}`}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-ink"
              end={path === ''}
            >
              {t(key)}
            </NavLink>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <LangToggle />
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
