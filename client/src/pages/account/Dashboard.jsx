import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import api from '../../lib/api';
import Section from '../../components/ui/Section';
import Button from '../../components/ui/Button';
import Pill from '../../components/ui/Pill';
import SEO from '../../components/SEO';

/** Request status → the pill tone that reads right for it. */
const STATUS_TONE = {
  pending: 'default',
  paid: 'saffron',
  issued: 'success',
  rejected: 'clay',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const isAr = locale === 'ar';

  const [certificates, setCertificates] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return undefined;
    let active = true;

    // Each strand is optional: one failing must not blank the dashboard.
    Promise.all([
      api.get('/me/certificates').catch(() => ({ data: { data: [] } })),
      api.get('/me/bookings').catch(() => ({ data: { data: [] } })),
      api.get('/me/requests').catch(() => ({ data: { data: [] } })),
    ])
      .then(([c, b, r]) => {
        if (!active) return;
        setCertificates(c.data.data || []);
        setBookings(b.data.data || []);
        setRequests(r.data.data || []);
      })
      .finally(() => {
        if (active) setLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [user]);

  if (!user) {
    return (
      <Section>
        <p className="text-center text-ink-soft">
          {isAr ? 'يرجى ' : 'Please '}
          <Link to={`${prefix}/login`} className="text-accent font-medium hover:underline">
            {isAr ? 'تسجيل الدخول' : 'log in'}
          </Link>
        </p>
      </Section>
    );
  }

  const tiles = [
    {
      label: isAr ? 'شهاداتي' : 'Certificates',
      value: certificates.length,
      to: `${prefix}/dashboard/certificates`,
    },
    {
      label: isAr ? 'حجوزاتي' : 'Bookings',
      value: bookings.length,
      to: `${prefix}/dashboard/bookings`,
    },
    {
      label: isAr ? 'طلباتي' : 'Requests',
      value: requests.length,
      to: null,
    },
  ];

  return (
    <>
      <SEO title={isAr ? 'لوحتي | SIYB' : 'My Dashboard | SIYB'} path="/dashboard" />

      <Section tone="surface">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl leading-tight text-ink">
              {isAr ? 'مرحبا' : 'Welcome'}, {user.name}
            </h1>
            {/* The account's address — the one every form and notification
                on the site now uses. */}
            <p dir="ltr" className="mt-2 text-md text-muted">
              {user.email}
            </p>
          </div>

          <Button variant="ghost" size="sm" onClick={logout}>
            {isAr ? 'تسجيل الخروج' : 'Log out'}
          </Button>
        </div>

        {/* What the account actually holds, counted rather than implied. */}
        <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-rule bg-rule">
          {tiles.map((tile) => {
            const body = (
              <>
                <dd className="numerals font-display text-2xl md:text-3xl leading-none text-accent">
                  {loaded ? tile.value : '—'}
                </dd>
                <dt className="mt-2 text-2xs caps-label text-muted">{tile.label}</dt>
              </>
            );
            return tile.to ? (
              <Link
                key={tile.label}
                to={tile.to}
                className="bg-bg p-5 text-center transition-colors hover:bg-sunk"
              >
                {body}
              </Link>
            ) : (
              <div key={tile.label} className="bg-bg p-5 text-center">
                {body}
              </div>
            );
          })}
        </dl>
      </Section>

      {/* Certificate requests, with where each one has got to. */}
      <Section label={isAr ? 'طلباتي' : 'My requests'}>
        <h2 className="mb-6 font-display text-xl md:text-2xl leading-tight text-ink">
          {isAr ? 'طلبات الشهادات' : 'Certificate requests'}
        </h2>

        {!loaded && <p className="text-muted">{isAr ? 'جاري التحميل...' : 'Loading...'}</p>}

        {loaded && requests.length === 0 && (
          <p className="text-muted">
            {isAr
              ? 'لم تقدّم أي طلب بعد. تصفّح البرامج للبدء.'
              : 'You have not made any requests yet. Browse the programs to get started.'}
          </p>
        )}

        {requests.length > 0 && (
          <ul className="flex flex-col border-t border-rule">
            {requests.map((r) => {
              const subject = r.program || r.course;
              return (
                <li
                  key={r._id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-rule py-4"
                >
                  <div className="min-w-0">
                    <p className="font-display text-md leading-snug text-ink">
                      {subject?.title?.[locale] || subject?.code || '—'}
                    </p>
                    <p className="mt-1 text-2xs caps-label text-muted">
                      {new Date(r.createdAt).toLocaleDateString(isAr ? 'ar' : 'en-GB')}
                    </p>
                  </div>

                  <Pill tone={STATUS_TONE[r.status] || 'default'}>
                    {isAr
                      ? { pending: 'قيد المراجعة', paid: 'مدفوع', issued: 'صدرت', rejected: 'مرفوض' }[
                          r.status
                        ] || r.status
                      : r.status}
                  </Pill>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </>
  );
}
