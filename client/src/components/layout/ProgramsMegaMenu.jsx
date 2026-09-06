import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * The "برامجنا" nav item: a two-panel flyout, both panels shown together
 * on hover/focus, matching the reference site. The first panel lists the
 * 8 SIYB programs plus the guide download; the second panel is headed
 * "ريادة الأعمال" with a back caret and lists the 6 course categories.
 */
export default function ProgramsMegaMenu({ label, programs, categories, categoriesLabel, guideUrl, guideLabel }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        className="flex items-center gap-1.5 text-sm font-medium text-on-ink/80 transition-colors hover:text-on-ink"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <svg
          aria-hidden="true"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full pt-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-50">
          <div className="flex items-start">
            <div className="w-72 rounded-lg bg-surface shadow-lg border border-line py-2">
              {programs.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm text-ink hover:bg-surface-muted hover:text-saffron-deep transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              {guideUrl && (
                <a
                  href={guideUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block px-4 py-2.5 text-sm text-saffron-deep font-medium border-t border-line mt-1 pt-3 hover:bg-surface-muted transition-colors"
                >
                  {guideLabel}
                </a>
              )}
            </div>

            {categories.length > 0 && (
              <div className="w-72 rounded-lg bg-surface shadow-lg border border-line ms-2 py-2">
                <div className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-ink border-b border-line mb-1">
                  <svg aria-hidden="true" width="8" height="8" viewBox="0 0 10 10" className="shrink-0 rotate-90 rtl:-rotate-90">
                    <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                  {categoriesLabel}
                </div>
                {categories.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 text-sm text-ink hover:bg-surface-muted hover:text-saffron-deep transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
