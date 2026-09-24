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
import { programPath } from '../../lib/programRoutes';
import symbolLogoUrl from '../../assets/SymbolLogo.png';
import writingLogoUrl from '../../assets/WritingLogo.png';

/**
 * A collapsible group in the mobile panel, mirroring a desktop dropdown.
 *
 * An entry in `items` is either a plain link or a group of its own — one with
 * its own `items` — so the panel opens a level at a time rather than dumping
 * every descendant at once: Our Programs reveals its branches, and a branch
 * then reveals the programmes inside it.
 *
 * When `to` is given the label itself navigates there and only the chevron
 * expands, so a branch that is also a destination stays one tap away.
 */
function MobileGroup({ label, items = [], count, to, onNavigate, depth = 0 }) {
  const [expanded, setExpanded] = useState(false);
  if (!items.length && !to) return null;

  // Each level is inset one step further, so depth is legible at a glance.
  const indent = ['px-2', 'ps-5 pe-2', 'ps-8 pe-2'][Math.min(depth, 2)];
  const textTone = depth === 0 ? 'text-ink' : 'text-ink-soft';

  // A group with a destination but nothing beneath it is a plain link, with
  // no expander to open onto an empty list.
  if (!items.length) {
    return (
      <Link
        to={to}
        onClick={onNavigate}
        className={`flex min-h-[44px] items-center border-b border-rule text-sm font-semibold transition-colors hover:bg-sunk hover:text-accent ${indent} ${textTone}`}
      >
        {label}
      </Link>
    );
  }

  const heading = (
    <span className="flex items-baseline gap-2">
      {label}
      <span className="numerals text-2xs font-normal text-muted">{count ?? items.length}</span>
    </span>
  );

  return (
    <div className={depth === 0 ? 'border-b border-rule' : ''}>
      <div className="flex items-center">
        {to && (
          <Link
            to={to}
            onClick={onNavigate}
            className={`flex min-h-[44px] flex-1 items-center text-sm font-semibold transition-colors hover:text-accent ${indent} ${textTone}`}
          >
            {heading}
          </Link>
        )}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={to ? label : undefined}
          className={`flex min-h-[44px] items-center justify-between gap-3 text-sm font-semibold transition-colors hover:text-accent ${indent} ${textTone} ${
            to ? 'shrink-0' : 'w-full'
          }`}
        >
          {!to && heading}
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
      </div>

      {expanded && (
        <ul className="pb-2">
          {items.map((item) =>
            // A child carrying its own items is a group, and opens in turn.
            item.items?.length ? (
              <li key={item.key || item.to || item.label}>
                <MobileGroup
                  label={item.label}
                  items={item.items}
                  to={item.to}
                  onNavigate={onNavigate}
                  depth={depth + 1}
                />
              </li>
            ) : (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  className={`flex min-h-[44px] items-center rounded-md pe-2 text-sm text-ink-soft transition-colors hover:bg-sunk hover:text-accent ${
                    depth === 0 ? 'ps-5' : 'ps-8'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
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

  const prefix = locale === 'en' ? '/en' : '';

  useEffect(() => {
    let mounted = true;

    api
      .get('/programs')
      .then(({ data }) => {
        if (mounted) setPrograms(data.data || []);
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

  // A nested programme is linked at its canonical address, beneath its parent.
  const toItem = (p) => ({
    to: programPath(prefix, p),
    label: p.title?.[locale] || p.code,
  });

  /** The parent's id, whether the API populated the link or not. */
  const parentIdOf = (p) =>
    typeof p.parent === 'object' && p.parent !== null ? p.parent._id : p.parent;

  // Programs are grouped by the branch of the offering they belong to. The
  // `track` field drives this; anything untagged falls back to entrepreneurship
  // so a newly added program is never silently dropped from the menu.
  //
  // Within a branch a parent leads and its own programmes follow it, so the
  // entry programme is always the first thing in the list and the ones built
  // on it read as belonging to it. `programs` arrives sorted by `order`, so
  // both the parents and each parent's children keep their admin order.
  const byTrack = (track) => {
    const inTrack = programs.filter((p) => (p.track || 'entrepreneurship') === track);
    const ids = new Set(inTrack.map((p) => String(p._id)));

    // A programme whose parent is in another branch is shown here on its own
    // rather than dropped, since its parent will not carry it.
    const roots = inTrack.filter((p) => {
      const parentId = parentIdOf(p);
      return !parentId || !ids.has(String(parentId));
    });

    return roots.flatMap((root) => [
      toItem(root),
      ...inTrack
        .filter((p) => String(parentIdOf(p) || '') === String(root._id))
        .map((child) => ({ ...toItem(child), nested: true })),
    ]);
  };

  // The AI branch is a single destination: its page carries the capabilities,
  // the film and any programmes on the track, so the menu needs no sublist.
  // The store is already a top-level item, so it is not repeated here.

  // The trainers branch leads with TOT: it is the first entry in the list and
  // the group label links straight to it, so the entry programme is one click
  // away while the programmes built on it follow beneath. Which programme
  // leads follows the `order` field rather than a hardcoded slug, so
  // reordering the branch in the admin panel does not break the link.
  const trainerItems = byTrack('trainers');
  const programGroups = [
    {
      key: 'trainers',
      label: t('trainers'),
      to: trainerItems[0]?.to,
      items: trainerItems,
    },
    {
      key: 'entrepreneurship',
      label: t('entrepreneurship'),
      to: `${prefix}/entrepreneurship`,
      items: byTrack('entrepreneurship'),
    },
    { key: 'ai', label: t('aiTrack'), to: `${prefix}/ai`, items: [] },
  ];

  // "About the Program" leads, then the figures on their own page, then the
  // worldwide reach — the order the programme is meant to be read in.
  const aboutItems = [
    { to: `${prefix}/about`, label: t('about') },
    { to: `${prefix}/numbers`, label: t('aboutStats') },
    { to: `${prefix}/worldwide`, label: t('worldwide') },
    { to: `${prefix}/resources`, label: t('keyResources') },
  ];

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`sticky top-0 z-40 bg-bg transition-shadow duration-base ease-out ${
        scrolled ? 'shadow-raised' : 'border-b border-rule'
      }`}
    >
      {/* Desktop / Main Header */}
      <div className="relative mx-auto max-w-[86rem] px-4 md:px-8">
        <div className="flex h-[4.5rem] items-center justify-between md:h-[5rem]">
          {/* Logo — the symbol and the wordmark are separate artwork set side
              by side as one lockup. The wordmark is the taller-looking of the
              two at equal height, so the symbol is given more room to make
              them read as optically matched rather than measured-equal.
              On narrow screens the wordmark drops and the symbol stands alone,
              which is what it is for. */}
          <Link
            to={prefix || '/'}
            className="flex shrink-0 items-center -gap-20 py-2 text-ink"
            aria-label={t('brandFull', { ns: 'common' })}
          >
            <img
              src={symbolLogoUrl}
              alt=""
              className="h-[2.25rem] w-auto shrink-0 object-contain md:h-[2.75rem]"
            />
            <img
              src={writingLogoUrl}
              alt=""
              className="hidden h-[2rem] w-auto shrink-0 object-contain sm:block md:h-[2rem]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden h-[4.5rem] items-center gap-7 lg:flex md:h-[5rem]"
            aria-label="Primary"
          >
            <NavDropdown
              label={t('about')}
              items={aboutItems}
            />

            <ProgramsMegaMenu
              label={t('programs')}
              groups={programGroups}
            />

            <NavDropdown
              label={t('store')}
              items={[
                { to: `${prefix}/store`, label: t('eStore') },
                { to: `${prefix}/store/create-your-shop`, label: t('createShop') },
              ]}
            />

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
          /* Capped to the space below the header so a long programme list
             scrolls inside the panel rather than running off the screen.
             overscroll-contain stops the scroll chaining to the locked body. */
          className="
            relative
            flex flex-col gap-0.5
            max-h-[calc(100dvh-4.5rem)]
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
          {/* The same three menus as the desktop bar, in the same order and
              carrying the same items — the two navigations are one menu shown
              two ways, so anything reachable on one is reachable on the other.
              Groups are collapsed by default so the full list does not arrive
              as one undifferentiated wall. */}
          <MobileGroup label={t('about')} items={aboutItems} onNavigate={closeMenu} />

          {/* "Our Programs" is a single menu on the desktop bar, so its
              branches nest inside one group here. Opening it reveals the
              branches; opening a branch reveals the programmes inside it —
              the same two steps as hovering the desktop flyout. */}
          <MobileGroup
            label={t('programs')}
            items={programGroups}
            count={programGroups.length}
            onNavigate={closeMenu}
          />

          <MobileGroup
            label={t('store')}
            items={[
              { to: `${prefix}/store`, label: t('eStore') },
              { to: `${prefix}/store/create-your-shop`, label: t('createShop') },
            ]}
            onNavigate={closeMenu}
          />

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