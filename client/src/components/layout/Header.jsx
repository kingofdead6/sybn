import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import NavDropdown from './NavDropdown';
import ProgramsMegaMenu from './ProgramsMegaMenu';
import LangToggle from '../ui/LangToggle';
import ThemeToggle from '../ui/ThemeToggle';

export default function Header() {
  const { t } = useTranslation('nav');
  const { locale } = useLocale();
  const { user, isAdmin } = useAuth();

  const [open, setOpen] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [storeCategories, setStoreCategories] = useState([]);
  const [brand, setBrand] = useState(null);

  const prefix = locale === 'en' ? '/en' : '';

  useEffect(() => {
    let mounted = true;

    Promise.all([
      api.get('/programs'),
      api.get('/categories'),
      api
        .get('/settings/store.content')
        .catch(() => ({ data: { data: null } })),
      api
        .get('/settings/brand')
        .catch(() => ({ data: { data: null } })),
    ])
      .then(([p, c, store, b]) => {
        if (!mounted) return;

        setPrograms(p.data.data || []);
        setCategories(c.data.data || []);
        setStoreCategories(store.data.data?.categories || []);
        setBrand(b.data.data);
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

  // Categories open the course catalogue pre-filtered to that category.
  const categoryItems = categories.map((c) => ({
    to: `${prefix}/courses?category=${encodeURIComponent(c.slug)}`,
    label: c.title?.[locale],
  }));

  const aboutItems = [
    { to: `${prefix}/about`, label: t('aboutStats') },
    { to: `${prefix}/worldwide`, label: t('worldwide') },
    { to: `${prefix}/stories`, label: t('stories') },
    { to: `${prefix}/network`, label: t('network') },
  ];

  const storeItems = storeCategories.map((c) => ({
    to: `${prefix}/store?category=${encodeURIComponent(c[locale])}`,
    label: c[locale],
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-bg">
      {/* Desktop / Main Header */}
      <div className="relative mx-auto max-w-[86rem] px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to={prefix || '/'}
            className="shrink-0 font-display text-lg text-ink"
          >
            {locale === 'ar' ? 'أبسط' : 'ABCET · SIYB'}
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden h-16 items-center gap-7 lg:flex"
            aria-label="Primary"
          >
            {(categoryItems.length > 0 || programItems.length > 0) && (
              <ProgramsMegaMenu
                label={t('programs')}
                items={categoryItems}
                nested={programItems}
                nestedLabel={t('entrepreneurship')}
                guideUrl={brand?.guidePdf}
                guideLabel={t('downloadGuide')}
              />
            )}

            <NavDropdown
              label={t('about')}
              items={aboutItems}
            />

            {storeItems.length > 0 && (
              <NavDropdown
                label={t('store')}
                items={storeItems}
              />
            )}

            {/* Language + Theme */}
            <div className="flex items-center gap-3">
              <LangToggle />
              <ThemeToggle />
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <Link
              to={
                isAdmin
                  ? '/admin'
                  : `${prefix}/${user ? 'dashboard' : 'login'}`
              }
              className="
                btn-label
                rounded-sm
                border border-accent
                bg-accent
                px-5 py-2
                text-xs text-on-accent
                transition-colors
                duration-base
                ease-out
                hover:border-accent-deep
                hover:bg-accent-deep
              "
            >
              {isAdmin
                ? t('admin')
                : t(user ? 'dashboard' : 'login')}
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="
                flex
                h-9 w-9
                shrink-0
                items-center justify-center
                rounded-md
                border border-rule
                text-ink
                transition-colors
                hover:border-accent
                hover:text-accent
                lg:hidden
              "
              aria-expanded={open}
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span
                aria-hidden="true"
                className="text-lg leading-none"
              >
                {open ? '×' : '☰'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <nav
          className="
            relative
            flex flex-col gap-1
            border-t border-rule
            bg-surface
            px-4 py-4
            lg:hidden
          "
          aria-label="Primary"
        >
          {/* Home */}
          <Link
            to={prefix || '/'}
            onClick={() => setOpen(false)}
            className="
              px-2 py-2.5
              text-sm text-ink
              transition-colors
              hover:text-accent
            "
          >
            {t('home')}
          </Link>

          {/* Static Links */}
          {[
            ['forums', 'forums'],
            ['verify', 'verify'],
            ['contact', 'contact'],
          ].map(([key, path]) => (
            <Link
              key={key}
              to={`${prefix}/${path}`}
              onClick={() => setOpen(false)}
              className="
                px-2 py-2.5
                text-sm text-ink
                transition-colors
                hover:text-accent
              "
            >
              {t(key)}
            </Link>
          ))}

          {/* Dynamic Links */}
          {[
            ...programItems,
            ...categoryItems,
            ...aboutItems,
            ...storeItems,
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="
                px-2 py-2.5
                text-sm text-ink-soft
                transition-colors
                hover:text-accent
              "
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile Controls */}
          <div className="flex items-center gap-3 px-2 pt-3">
            <LangToggle />
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}