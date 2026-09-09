import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useAdminLocale } from './AdminLocaleContext';
import ThemeToggle from '../components/ui/ThemeToggle';

/** Sidebar groups, so 16 links read as four short lists instead of one long one. */
const NAV_GROUPS = [
  {
    key: 'sectionContent',
    items: ['programs', 'categories', 'courses', 'stories', 'products'],
  },
  {
    key: 'sectionPeople',
    items: ['team', 'users'],
  },
  {
    key: 'sectionRequests',
    items: ['certificate-requests', 'forum-registrations', 'proposal-requests', 'product-requests', 'enquiries', 'orders'],
  },
  {
    key: 'sectionSystem',
    items: ['certificates', 'exams'],
  },
];

function Icon({ name, className = 'h-4 w-4' }) {
  const paths = {
    dashboard: 'M3 3h7v7H3V3zm11 0h7v4h-7V3zM3 14h7v7H3v-7zm11-3h7v10h-7V11z',
    calendar: 'M7 2v2H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zM5 9h14v10H5V9z',
    settings: 'M12 8a4 4 0 100 8 4 4 0 000-8zm8.9 4a7 7 0 01-.1 1l2 1.6-2 3.4-2.4-1a7 7 0 01-1.7 1l-.4 2.6h-4l-.4-2.6a7 7 0 01-1.7-1l-2.4 1-2-3.4 2-1.6a7 7 0 010-2l-2-1.6 2-3.4 2.4 1a7 7 0 011.7-1L10 2h4l.4 2.6a7 7 0 011.7 1l2.4-1 2 3.4-2 1.6c.1.3.1.7.1 1z',
    doc: 'M6 2h8l4 4v16H6V2zm7 1.5V7h3.5L13 3.5z',
    grid: 'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z',
    users: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-8 9a8 8 0 0116 0H4z',
    inbox: 'M4 4h16v10h-5a3 3 0 01-6 0H4V4zm0 12h4.4a5 5 0 007.2 0H20v4H4v-4z',
    badge: 'M12 2l2.4 1.8 3-.4.9 2.9 2.5 1.7-1.6 2.6.6 3-2.9 1-1.4 2.7-3-.6-2.7 1.4-1.8-2.4-3-.9.4-3L2 12l2.2-2 .4-3 3 .4L9.6 3 12 2z',
  };
  const byResource = {
    programs: 'doc',
    categories: 'grid',
    courses: 'doc',
    stories: 'doc',
    products: 'grid',
    team: 'users',
    users: 'users',
    'certificate-requests': 'inbox',
    'forum-registrations': 'inbox',
    'proposal-requests': 'inbox',
    'product-requests': 'inbox',
    enquiries: 'inbox',
    orders: 'inbox',
    certificates: 'badge',
    exams: 'badge',
  };
  const d = paths[name] || paths[byResource[name]] || paths.doc;
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function navClass({ isActive }) {
  return [
    'flex items-center gap-3 rounded-sm px-3 py-1.5 text-sm transition-colors',
    isActive
      ? 'bg-accent-wash text-accent font-semibold'
      : 'text-ink-soft hover:bg-sunk hover:text-ink',
  ].join(' ');
}

export default function AdminLayout() {
  const { t } = useTranslation('admin');
  const { logout, user } = useAuth();
  const { locale, toggleLocale } = useAdminLocale();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function onLogout() {
    await logout();
    navigate('/admin/login');
  }

  const sidebar = (
    <>
      <div className="shrink-0 px-4 py-5 border-b border-rule">
        <p className="font-display text-md font-bold text-ink">{t('brand')}</p>
        {user && <p className="text-xs text-muted mt-1 truncate">{user.email}</p>}
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto p-3 flex flex-col gap-3.5">
        <div className="flex flex-col gap-1">
          <NavLink to="/admin" end className={navClass} onClick={() => setOpen(false)}>
            <Icon name="dashboard" />
            {t('dashboard')}
          </NavLink>
          <NavLink to="/admin/forums-grid" className={navClass} onClick={() => setOpen(false)}>
            <Icon name="calendar" />
            {t('forumsGrid')}
          </NavLink>
        </div>

        {NAV_GROUPS.map((group) => (
          <div key={group.key} className="flex flex-col gap-1">
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted">
              {t(group.key)}
            </p>
            {group.items.map((key) => (
              <NavLink key={key} to={`/admin/${key}`} className={navClass} onClick={() => setOpen(false)}>
                <Icon name={key} />
                {t(`resource.${key}`)}
              </NavLink>
            ))}
          </div>
        ))}

        <div className="flex flex-col gap-1">
          <NavLink to="/admin/settings" className={navClass} onClick={() => setOpen(false)}>
            <Icon name="settings" />
            {t('settings')}
          </NavLink>
        </div>
      </nav>

      <div className="shrink-0 border-t border-rule p-3 flex flex-col gap-1">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-ink-soft hover:bg-sunk hover:text-ink transition-colors"
        >
          {t('backToSite')}
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-error text-start hover:bg-error-wash transition-colors"
        >
          {t('logout')}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-sunk text-ink-soft">
      {/* Desktop sidebar */}
      <aside className="w-64 shrink-0 border-e border-rule bg-surface hidden md:flex flex-col sticky top-0 h-screen">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="relative w-72 max-w-[85%] bg-surface flex flex-col shadow-overlay">{sidebar}</aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-rule bg-bg px-4 py-3">
          <button
            type="button"
            className="md:hidden rounded-sm border border-rule w-9 h-9 flex items-center justify-center text-ink"
            aria-label={t('menu')}
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            ☰
          </button>

          <div className="flex items-center gap-2 ms-auto">
            <button
              type="button"
              onClick={toggleLocale}
              className="rounded-sm border border-rule px-3.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
              aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              {locale === 'ar' ? 'EN' : 'ع'}
            </button>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 min-w-0 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
