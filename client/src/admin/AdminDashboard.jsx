import { useEffect, useState } from 'react';
import api from '../lib/api';

const CARDS = [
  ['pendingCertRequests', 'Pending certificate requests'],
  ['pendingForumRegs', 'Pending forum registrations'],
  ['unhandledEnquiries', 'Unhandled enquiries'],
  ['pendingOrders', 'Orders awaiting action'],
  ['totalCertificates', 'Certificates issued (total)'],
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data.data));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(([key, label]) => (
          <div key={key} className="border border-line bg-surface rounded p-5">
            <p className="text-3xl font-display text-saffron-deep">{stats ? stats[key] : '…'}</p>
            <p className="text-sm text-body mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
