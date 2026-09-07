import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';

const CARDS = [
  { key: 'pendingCertRequests', to: '/admin/certificate-requests', tone: 'saffron' },
  { key: 'pendingForumRegs', to: '/admin/forum-registrations', tone: 'saffron' },
  { key: 'unhandledEnquiries', to: '/admin/enquiries', tone: 'clay' },
  { key: 'pendingOrders', to: '/admin/orders', tone: 'clay' },
  { key: 'totalCertificates', to: '/admin/certificates', tone: 'success' },
];

const TONES = {
  saffron: 'text-accent bg-accent-wash',
  clay: 'text-error bg-error-wash',
  success: 'text-success bg-success-wash',
};

const QUICK_LINKS = ['programs', 'team', 'stories', 'forum-registrations'];

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

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">{t('dashboard')}</h1>
      <p className="text-sm text-muted mb-8">{t('dashboard.welcome')}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(({ key, to, tone }) => (
          <Link
            key={key}
            to={to}
            className="rounded-sm border border-rule bg-surface p-5 transition-colors hover:"
          >
            <span
              className={`inline-flex items-center justify-center rounded-sm px-3 py-1 text-xs font-semibold ${TONES[tone]}`}
            >
              {stats ? stats[key] ?? 0 : '…'}
            </span>
            <p className="mt-3 text-sm font-medium text-ink">{t(`stats.${key}`)}</p>
          </Link>
        ))}
      </div>

      <h2 className="font-display text-lg font-bold text-ink mt-10 mb-4">{t('dashboard.quickLinks')}</h2>
      <div className="flex flex-wrap gap-3">
        {QUICK_LINKS.map((key) => (
          <Link
            key={key}
            to={`/admin/${key}`}
            className="rounded-sm border border-rule bg-surface px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {t(`resource.${key}`)}
          </Link>
        ))}
      </div>
    </div>
  );
}
