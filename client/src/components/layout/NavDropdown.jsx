import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Hover/focus dropdown for the dark navbar. `items` is [{ to, label }].
 * Closes on mouse-leave (with a short delay so moving from trigger to
 * panel doesn't flicker it shut) and on blur leaving the whole group.
 */
export default function NavDropdown({ label, items, active }) {
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
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
          active ? 'text-on-ink' : 'text-on-ink/80 hover:text-on-ink'
        }`}
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
        <div className="absolute top-full pt-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-50 w-72">
          <div className="rounded-lg bg-surface shadow-lg border border-line py-2 max-h-96 overflow-y-auto">
            {items.map((item) => (
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
        </div>
      )}
    </div>
  );
}
