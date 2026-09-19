import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';

/**
 * Things waiting on the admin. These are the queues that actually need
 * clearing, so they lead the page and a zero count is visibly "done" rather
 * than just another number.
 */
const QUEUES = [
  { key: 'pendingCertRequests', to: '/admin/certificate-requests' },
  { key: 'pendingForumRegs', to: '/admin/forum-registrations' },
  { key: 'pendingProductRequests', to: '/admin/product-requests' },
  { key: 'unhandledEnquiries', to: '/admin/enquiries' },
  { key: 'pendingOrders', to: '/admin/orders' },
];

/* Where the admin most often goes to add or edit content. */
const SHORTCUTS = ['programs', 'courses', 'forums', 'team', 'stories', 'products'];

export default function AdminDashboard() {
  const { t } = useTranslation('admin');
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
  const waiting = QUEUES.filter((q) => (stats?.[q.key] ?? 0) > 0);
  const allClear = !loading && waiting.length === 0;

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl font-bold text-ink mb-1">{t('dashboard')}</h1>
      <p className="text-sm text-muted mb-8">{t('dashboard.welcome')}</p>

      {/* Needs attention */}
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
        {t('dashboard.needsAttention')}
      </h2>

      {allClear ? (
        <p className="rounded-md border border-rule bg-success-wash px-5 py-4 text-sm font-medium text-success">
          {t('dashboard.allClear')}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {(loading ? QUEUES : waiting).map(({ key, to }) => {
            const count = stats?.[key] ?? 0;
            return (
              <li key={key}>
                <Link
                  to={to}
                  className="flex items-center justify-between gap-4 rounded-md border border-rule bg-surface px-5 py-3.5 transition-colors hover:border-accent"
                >
                  <span className="text-sm font-medium text-ink">{t(`stats.${key}`)}</span>
                  <span className="numerals rounded-pill bg-accent-wash px-3 py-1 text-xs font-semibold text-accent">
                    {loading ? '…' : count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {/* Certificates issued is a running total, not a queue - kept apart. */}
      {!loading && (
        <p className="mt-4 text-sm text-muted">
          {t('stats.totalCertificates')}:{' '}
          <Link to="/admin/certificates" className="numerals font-medium text-accent hover:underline">
            {stats.totalCertificates ?? 0}
          </Link>
        </p>
      )}

      <h2 className="mb-3 mt-10 text-xs font-semibold uppercase tracking-wide text-muted">
        {t('dashboard.quickLinks')}
      </h2>
      <div className="flex flex-wrap gap-2">
        {SHORTCUTS.map((key) => (
          <Link
            key={key}
            to={`/admin/${key}`}
            className="rounded-md border border-rule bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {t(`resource.${key}`)}
          </Link>
        ))}
      </div>
    </div>
  );
}
