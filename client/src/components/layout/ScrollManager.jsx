import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { stripLocalePrefix } from '../../context/LocaleContext';

/**
 * Scroll position on navigation, which a single-page app does not get for free.
 *
 * A new page opens at the top. A link carrying a `#section` scrolls to that
 * section instead — but pages load lazily and fetch their content, so the
 * target may not exist yet: it is looked for until it appears (or a few
 * seconds pass), then scrolled to. Sections set their own `scroll-mt-*`, so
 * they land clear of the sticky header.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  // Switching language swaps the `/en` prefix on the same page; that keeps
  // the reader's place rather than jumping them to the top.
  const page = stripLocalePrefix(pathname);
  const lastPage = useRef(page);

  useEffect(() => {
    const samePage = lastPage.current === page;
    lastPage.current = page;

    if (!hash) {
      if (!samePage) window.scrollTo(0, 0);
      return undefined;
    }

    // Content above the target (images, fetched lists) can still arrive after
    // the target does and push it down, so it is re-aligned for a short while
    // — until the reader scrolls on their own, which ends it at once.
    const id = decodeURIComponent(hash.slice(1));
    let ticks = 0;
    let found = 0;
    let stopped = false;
    const stop = () => {
      stopped = true;
    };
    const events = ['wheel', 'touchstart', 'keydown', 'mousedown'];
    events.forEach((e) => window.addEventListener(e, stop, { passive: true }));

    const timer = setInterval(() => {
      ticks += 1;
      const el = document.getElementById(id);
      if (el && !stopped) {
        el.scrollIntoView({ block: 'start' });
        found += 1;
      }
      // Give up after ~4s looking, or ~1.5s after it was first found.
      if (stopped || ticks > 40 || found > 15) clearInterval(timer);
    }, 100);

    return () => {
      clearInterval(timer);
      events.forEach((e) => window.removeEventListener(e, stop));
    };
  }, [page, pathname, hash]);

  return null;
}
