import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * The "Our Programs" nav item. The panel lists the three branches of the
 * offering - trainers (TOT), entrepreneurship, and AI - and hovering or
 * focusing a branch opens a flyout with the programs inside it.
 *
 * `groups` is [{ key, label, items: [{ to, label }] }].
 */
export default function ProgramsMegaMenu({ label, groups = [] }) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const closeTimer = useRef(null);
  const subCloseTimer = useRef(null);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeSoon() {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setOpenGroup(null);
    }, 120);
  }

  function openSubNow(key) {
    if (subCloseTimer.current) clearTimeout(subCloseTimer.current);
    setOpenGroup(key);
  }

  function closeSubSoon() {
    subCloseTimer.current = setTimeout(() => setOpenGroup(null), 120);
  }

  function closeAll() {
    setOpen(false);
    setOpenGroup(null);
  }

  // A branch with no programmes of its own is still shown when it names a
  // destination — a single link rather than an empty flyout.
  const visible = groups.filter((g) => g.items?.length || g.to);
  if (!visible.length) return null;

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) closeAll();
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
          <div className="relative w-72 rounded-lg bg-surface shadow-overlay border border-rule/60 py-2">
            {visible.map((group) => (
              <div
                key={group.key}
                className="relative"
                onMouseEnter={() => openSubNow(group.key)}
                onMouseLeave={closeSubSoon}
                onFocus={() => openSubNow(group.key)}
              >
                {/* A branch with a destination but nothing beneath it is just
                    a link — no chevron, no flyout to open. */}
                {group.to && !group.items?.length ? (
                  <Link
                    to={group.to}
                    onClick={closeAll}
                    className="block px-4 py-2.5 text-sm font-semibold text-ink hover:bg-sunk hover:text-accent transition-colors"
                  >
                    {group.label}
                  </Link>
                ) : /* A branch may name a landing programme of its own (`to`).
                       Then the label navigates there and the chevron alone
                       opens the flyout, so it is one click away. */
                group.to ? (
                  <div className="flex items-center hover:bg-sunk transition-colors">
                    <Link
                      to={group.to}
                      onClick={closeAll}
                      className="flex-1 px-4 py-2.5 text-sm font-semibold text-ink hover:text-accent transition-colors"
                    >
                      {group.label}
                    </Link>
                    <button
                      type="button"
                      className="shrink-0 px-3 py-2.5 text-ink hover:text-accent transition-colors"
                      aria-expanded={openGroup === group.key}
                      aria-haspopup="true"
                      aria-label={group.label}
                      onClick={() => setOpenGroup((v) => (v === group.key ? null : group.key))}
                    >
                      <svg
                        aria-hidden="true"
                        width="8"
                        height="8"
                        viewBox="0 0 10 10"
                        className="shrink-0 rotate-90 rtl:-rotate-90"
                      >
                        <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                ) : (
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-sm font-semibold text-ink hover:bg-sunk transition-colors"
                  aria-expanded={openGroup === group.key}
                  aria-haspopup="true"
                  onClick={() => setOpenGroup((v) => (v === group.key ? null : group.key))}
                >
                  {group.label}
                  <svg
                    aria-hidden="true"
                    width="8"
                    height="8"
                    viewBox="0 0 10 10"
                    className="shrink-0 rotate-90 rtl:-rotate-90"
                  >
                    <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </button>
                )}

                {openGroup === group.key && group.items?.length > 0 && (
                  <div className="absolute top-0 start-full ps-2 z-50">
                    <div className="w-72 rounded-lg bg-surface shadow-overlay border border-rule/60 py-2 max-h-96 overflow-y-auto">
                      <div className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-ink border-b border-rule mb-1">
                        <svg
                          aria-hidden="true"
                          width="8"
                          height="8"
                          viewBox="0 0 10 10"
                          className="shrink-0 -rotate-90 rtl:rotate-90"
                        >
                          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </svg>
                        {group.label}
                      </div>
                      {/* A programme nested under the one above it is inset
                          and marked, so the list reads as a hierarchy rather
                          than as one flat run of equal entries. */}
                      {group.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={closeAll}
                          className={`block py-2.5 pe-4 text-sm transition-colors hover:bg-sunk hover:text-accent ${
                            item.nested
                              ? 'ps-9 text-ink-soft before:me-2 before:text-muted before:content-["—"]'
                              : 'ps-4 text-ink'
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
}
