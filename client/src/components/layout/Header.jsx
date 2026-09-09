import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import NavDropdown from './NavDropdown';
import ProgramsMegaMenu from './ProgramsMegaMenu';
import LangToggle from '../ui/LangToggle';
import ThemeToggle from '../ui/ThemeToggle';

/** A collapsible group in the mobile panel. Mirrors a desktop dropdown. */
function MobileGroup({ label, items, count, onNavigate }) {
  const [expanded, setExpanded] = useState(false);
  if (!items.length) return null;

  return (
    <div className="border-b border-rule">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex min-h-[44px] w-full items-center justify-between gap-3 px-2 text-sm font-semibold text-ink transition-colors hover:text-accent"
      >
        <span className="flex items-baseline gap-2">
          {label}
          <span className="numerals text-2xs font-normal text-muted">{count ?? items.length}</span>
        </span>
        <svg
          aria-hidden="true"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`shrink-0 transition-transform duration-fast ${expanded ? 'rotate-180' : ''}`}
        >
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      {expanded && (
        <ul className="pb-2">
          {items.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onNavigate}
                className="flex min-h-[44px] items-center rounded-md ps-5 pe-2 text-sm text-ink-soft transition-colors hover:bg-sunk hover:text-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Header() {
  const { t } = useTranslation('nav');
  const { locale } = useLocale();
  const { user, isAdmin } = useAuth();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);
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

  // While the panel is open it owns the screen: the page behind must not
  // scroll, Escape must close it, and focus must not wander behind it.
  useEffect(() => {
    if (!open) return undefined;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);

    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // Resizing up to the desktop breakpoint hides the panel via CSS, which would
  // otherwise leave the body scroll-locked with no visible way to unlock it.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener('change', close);
    return () => mq.removeEventListener('change', close);
  }, []);

  // The header lifts off the page once content sits beneath it — a real
  // elevation cue instead of an always-on flat rule (DESIGN.md §3).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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

  const closeMenu = () => setOpen(false);

  const storeItems = storeCategories.map((c) => ({
    to: `${prefix}/store?category=${encodeURIComponent(c[locale])}`,
    label: c[locale],
  }));

  return (
    <header
      className={`sticky top-0 z-40 bg-bg transition-shadow duration-base ease-out ${
        scrolled ? 'shadow-raised' : 'border-b border-rule'
      }`}
    >
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
                rounded-md
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
            {/* 44px square: the iOS/WCAG minimum touch target. */}
            <button
              ref={toggleRef}
              type="button"
              className="
                flex
                h-11 w-11
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
              aria-controls="mobile-nav"
              aria-label={t(open ? 'closeMenu' : 'openMenu')}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden="true" className="text-lg leading-none">
                {open ? '×' : '☰'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <nav
          id="mobile-nav"
          /* The list runs to ~25 items once programmes and store categories
             load, so the panel is capped to the space below the 64px header
             and scrolls inside itself instead of running off the screen.
             overscroll-contain stops the scroll chaining to the locked body. */
          className="
            relative
            flex flex-col gap-0.5
            max-h-[calc(100dvh-4rem)]
            overflow-y-auto
            overscroll-contain
            rounded-b-lg
            shadow-overlay
            bg-surface
            px-4 py-3
            lg:hidden
          "
          aria-label="Primary"
        >
          {/* Direct destinations first — the things people open the menu for. */}
          <div className="border-b border-rule pb-2">
            {[
              ['home', ''],
              ['forums', 'forums'],
              ['verify', 'verify'],
              ['contact', 'contact'],
            ].map(([key, path]) => (
              <Link
                key={key}
                to={path ? `${prefix}/${path}` : prefix || '/'}
                onClick={closeMenu}
                className="flex min-h-[44px] items-center rounded-md px-2 text-sm font-medium text-ink transition-colors hover:bg-sunk hover:text-accent"
              >
                {t(key)}
              </Link>
            ))}
          </div>

          {/* The three dropdowns from the desktop bar, collapsed by default so
              ~29 links do not arrive as one undifferentiated wall. */}
          <MobileGroup
            label={t('entrepreneurship')}
            items={programItems}
            onNavigate={closeMenu}
          />
          <MobileGroup
            label={t('categories')}
            items={categoryItems}
            onNavigate={closeMenu}
          />
          <MobileGroup label={t('about')} items={aboutItems} onNavigate={closeMenu} />
          <MobileGroup label={t('store')} items={storeItems} onNavigate={closeMenu} />

          {/* The guide download lives in the desktop programmes panel; without
              it here the mobile menu would silently drop a real destination. */}
          {brand?.guidePdf && (
            <a
              href={brand.guidePdf}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              className="flex min-h-[44px] items-center border-b border-rule px-2 text-sm font-medium text-accent transition-colors hover:bg-sunk"
            >
              {t('downloadGuide')}
            </a>
          )}

          {/* Controls sit last, spaced away from the link list. The toggles are
              35px to pair with each other in the desktop bar, so the row gives
              them a 44px tap area here rather than resizing the shared parts. */}
          <div className="mt-3 flex min-h-[44px] items-center gap-3 px-2 [&_button]:min-h-[44px]">
            <LangToggle />
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}