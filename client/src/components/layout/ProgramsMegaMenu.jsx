import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * The "برامجنا" nav item. The first panel lists the six course categories plus
 * the guide download. That panel also has a "ريادة الأعمال" row with a caret —
 * hovering/focusing it opens a nested panel listing the eight SIYB programs.
 * The nested panel is closed by default and only appears while that row (or the
 * panel itself) is hovered/focused.
 *
 * `nested` is the flyout list; `items` is the flat list in the first panel.
 */
export default function ProgramsMegaMenu({ label, items, nested, nestedLabel, guideUrl, guideLabel }) {
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const closeTimer = useRef(null);
  const subCloseTimer = useRef(null);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeSoon() {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setSubOpen(false);
    }, 120);
  }

  function openSubNow() {
    if (subCloseTimer.current) clearTimeout(subCloseTimer.current);
    setSubOpen(true);
  }

  function closeSubSoon() {
    subCloseTimer.current = setTimeout(() => setSubOpen(false), 120);
  }

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOpen(false);
          setSubOpen(false);
        }
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
          <div className="relative w-72 rounded-sm bg-surface shadow-overlay border border-rule py-2">
            {nested.length > 0 && (
              <div
                className="relative"
                onMouseEnter={openSubNow}
                onMouseLeave={closeSubSoon}
                onFocus={openSubNow}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-sm font-semibold text-ink border-b border-rule mb-1 hover:bg-sunk transition-colors"
                  aria-expanded={subOpen}
                  aria-haspopup="true"
                  onClick={() => setSubOpen((v) => !v)}
                >
                  {nestedLabel}
                  <svg aria-hidden="true" width="8" height="8" viewBox="0 0 10 10" className="shrink-0 rotate-90 rtl:-rotate-90">
                    <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </button>

                {subOpen && (
                  <div className="absolute top-0 start-full ps-2 z-50">
                    <div className="w-72 rounded-sm bg-surface shadow-overlay border border-rule py-2">
                      <div className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-ink border-b border-rule mb-1">
                        <svg aria-hidden="true" width="8" height="8" viewBox="0 0 10 10" className="shrink-0 -rotate-90 rtl:rotate-90">
                          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </svg>
                        {nestedLabel}
                      </div>
                      {nested.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => {
                            setOpen(false);
                            setSubOpen(false);
                          }}
                          className="block px-4 py-2.5 text-sm text-ink hover:bg-sunk hover:text-accent transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-ink hover:bg-sunk hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {guideUrl && (
              <a
                href={guideUrl}
                target="_blank"
                rel="noreferrer"
                className="block px-4 py-2.5 text-sm text-accent font-medium border-t border-rule mt-1 pt-3 hover:bg-sunk transition-colors"
              >
                {guideLabel}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
