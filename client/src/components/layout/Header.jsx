import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import NavDropdown from './NavDropdown';
import LangToggle from '../ui/LangToggle';
import ThemeToggle from '../ui/ThemeToggle';

const STATIC_LINKS = [
  ['home', ''],
  ['network', 'network'],
  ['stories', 'stories'],
  ['forums', 'forums'],
];

export default function Header() {
  const { t } = useTranslation('nav');
  const { locale } = useLocale();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const prefix = locale === 'en' ? '/en' : '';

  useEffect(() => {
    let mounted = true;
    Promise.all([api.get('/programs'), api.get('/categories')])
      .then(([p, c]) => {
        if (!mounted) return;
        setPrograms(p.data.data || []);
        setCategories(c.data.data || []);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const programItems = programs.map((p) => ({
    to: `${prefix}/programs/${p.slug}`,
    label: p.title?.[locale] || p.code,
  }));
  const categoryItems = categories.map((c) => ({
    to: `${prefix}/categories/${c.slug}`,
    label: c.title?.[locale],
  }));
  const aboutItems = [
    { to: `${prefix}/about`, label: t('about') },
    { to: `${prefix}/worldwide`, label: t('worldwide') },
    { to: `${prefix}/verify`, label: t('verify') },
  ];
  const storeItems = [
    { to: `${prefix}/store`, label: t('store') },
    { to: `${prefix}/contact`, label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ink shadow-lg">
      {/* Angular color-block decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-1/2 -end-1/4 h-[220%] w-2/3 bg-accent-green opacity-90"
          style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }}
        />
        <div
          className="absolute -top-1/2 -end-[5%] h-[220%] w-1/2 bg-saffron opacity-90"
          style={{ clipPath: 'polygon(45% 0, 100% 0, 100% 100%, 10% 100%)' }}
        />
        <div
          className="absolute -top-1/2 end-0 h-[220%] w-1/4 bg-accent-orange opacity-90"
          style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 20% 100%)' }}
        />
        <svg
          className="absolute inset-x-0 bottom-0 h-6 w-full text-ink"
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0 20 Q 150 0 300 20 T 600 20 T 900 20 T 1200 20 V40 H0 Z" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          <Link to={prefix || '/'} className="shrink-0 font-display text-lg font-bold text-on-ink">
            {locale === 'ar' ? 'أبسط' : 'ABCET · SIYB'}
          </Link>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
            <LangToggle variant="dark" />

            <NavDropdown label={t('about')} items={aboutItems} />
            <NavDropdown label={t('store')} items={storeItems} />

            {categoryItems.length > 0 && (
              <NavDropdown label={t('categories')} items={categoryItems} />
            )}

            {programItems.length > 0 && (
              <NavDropdown label={t('programs')} items={programItems} />
            )}

            {STATIC_LINKS.filter(([key]) => key !== 'home').map(([key, path]) => (
              <NavLink
                key={key}
                to={`${prefix}/${path}`}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-on-ink' : 'text-on-ink/80 hover:text-on-ink'}`
                }
              >
                {t(key)}
              </NavLink>
            ))}

            <ThemeToggle variant="dark" />
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to={`${prefix}/${user ? 'dashboard' : 'login'}`}
              className="rounded-full bg-surface px-6 py-2.5 text-sm font-semibold text-ink shadow-accent transition-transform hover:scale-105"
            >
              {t(user ? 'dashboard' : 'login')}
            </Link>

            <button
              type="button"
              className="lg:hidden rounded-full w-10 h-10 flex items-center justify-center text-on-ink border border-white/25"
              aria-expanded={open}
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden="true">{open ? '×' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav className="relative lg:hidden bg-surface px-4 py-4 flex flex-col gap-1 shadow-lg" aria-label="Primary">
          {STATIC_LINKS.map(([key, path]) => (
            <NavLink
              key={key}
              to={`${prefix}/${path}`}
              onClick={() => setOpen(false)}
              className="px-2 py-2.5 text-sm font-medium text-ink"
              end={path === ''}
            >
              {t(key)}
            </NavLink>
          ))}
          {[...aboutItems, ...storeItems, ...categoryItems, ...programItems].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="px-2 py-2.5 text-sm text-body"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-3 px-2">
            <LangToggle />
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
