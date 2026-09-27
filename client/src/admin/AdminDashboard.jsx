import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { useAdminLocale } from './AdminLocaleContext';

/**
 * Things waiting on the admin. These are the queues that actually need
 * clearing, so they lead the page, each linking straight to its list filtered
 * to what is waiting — and a zero reads as "done" rather than another number.
 */
const QUEUES = [
  { key: 'pendingEnrollments', to: '/admin/course-enrollments' },
  { key: 'pendingCertRequests', to: '/admin/certificate-requests?status=pending' },
  { key: 'pendingForumRegs', to: '/admin/forum-registrations?status=pending' },
  { key: 'unhandledEnquiries', to: '/admin/enquiries?status=false' },
];

/* Where the admin most often goes to add or edit content. */
const SHORTCUTS = [
  { key: 'courses', icon: 'M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5zM4 19.5A2.5 2.5 0 006.5 22H20v-5' },
  { key: 'programs', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
  { key: 'forums', icon: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z' },
  { key: 'certificate-templates', icon: 'M12 15a7 7 0 100-14 7 7 0 000 14zM8.2 13.9L7 23l5-3 5 3-1.2-9.1' },
  { key: 'feedback-questions', icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11' },
  { key: 'course-feedback', icon: 'M18 20V10M12 20V4M6 20v-6' },
  { key: 'products', icon: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0' },
  { key: 'users', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
];

function Icon({ d, className = 'h-[1.25rem] w-[1.25rem]' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function AdminDashboard() {
  const { t } = useTranslation('admin');
  const { locale } = useAdminLocale();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let mounted = true;
    api
      .get('/admin/stats')
      .then(({ data }) => {
        if (mounted) setStats(data.data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const loading = !stats;
  const waitingTotal = QUEUES.reduce((s, q) => s + (stats?.[q.key] || 0), 0);
  const today = new Date().toLocaleDateString(locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <p className="text-sm text-muted">{today}</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink">{t('dashboard')}</h1>
        <p className="mt-1 text-sm text-muted">
          {loading ? t('dashboard.welcome') : waitingTotal ? t('dashboard.waitingSummary', { count: waitingTotal }) : t('dashboard.allClear')}
        </p>
      </div>

      {/* Needs attention */}
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{t('dashboard.needsAttention')}</h2>
      <div className="mb-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUEUES.map(({ key, to }) => {
          const count = stats?.[key] ?? 0;
          const waiting = count > 0;
          return (
            <Link
              key={key}
              to={to}
              className={`group relative flex flex-col gap-3 overflow-hidden rounded-md border bg-surface p-5 transition-all hover:shadow-raised ${
                waiting ? 'border-accent' : 'border-rule'
              }`}
            >
              <span className={`absolute inset-x-0 top-0 h-[3px] ${waiting ? 'bg-accent' : 'bg-success'}`} aria-hidden="true" />
              <span className="text-sm text-ink-soft">{t(`stats.${key}`)}</span>
              <span className="flex items-end justify-between gap-2">
                <span className={`numerals font-display text-4xl leading-none ${waiting ? 'text-ink' : 'text-muted'}`}>{loading ? '…' : count}</span>
                <span className={`text-xs ${waiting ? 'text-accent' : 'text-success'}`}>
                  {loading ? '' : waiting ? `${t('dashboard.review')} ${locale === 'ar' ? '←' : '→'}` : t('dashboard.done')}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      {/* Running total */}
      <div className="mb-7 grid gap-3 sm:grid-cols-2">
        <Link to="/admin/certificates" className="flex items-center gap-4 rounded-md border border-rule bg-surface p-5 transition-all hover:border-accent hover:shadow-raised">
          <span className="flex h-[3rem] w-[3rem] shrink-0 items-center justify-center rounded-md bg-accent-wash text-accent">
            <Icon d="M12 15a7 7 0 100-14 7 7 0 000 14zM8.2 13.9L7 23l5-3 5 3-1.2-9.1" />
          </span>
          <span>
            <span className="block text-sm text-ink-soft">{t('stats.totalCertificates')}</span>
            <span className="numerals font-display text-2xl text-ink">{loading ? '…' : stats.totalCertificates ?? 0}</span>
          </span>
        </Link>
        <Link to="/admin/course-feedback" className="flex items-center gap-4 rounded-md border border-rule bg-surface p-5 transition-all hover:border-accent hover:shadow-raised">
          <span className="flex h-[3rem] w-[3rem] shrink-0 items-center justify-center rounded-md bg-accent-wash text-accent">
            <Icon d="M18 20V10M12 20V4M6 20v-6" />
          </span>
          <span>
            <span className="block text-sm text-ink-soft">{t('resource.course-feedback')}</span>
            <span className="text-sm text-muted">{t('dashboard.resultsHint')}</span>
          </span>
        </Link>
      </div>

      {/* Quick links */}
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{t('dashboard.quickLinks')}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SHORTCUTS.map(({ key, icon }) => (
          <Link
            key={key}
            to={`/admin/${key}`}
            className="flex items-center gap-3 rounded-md border border-rule bg-surface px-4 py-3.5 text-sm font-medium text-ink transition-all hover:border-accent hover:text-accent hover:shadow-raised"
          >
            <span className="text-muted">
              <Icon d={icon} />
            </span>
            {t(`resource.${key}`)}
          </Link>
        ))}
      </div>
    </div>
  );
}
