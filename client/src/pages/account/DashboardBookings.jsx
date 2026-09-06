import { useEffect, useState } from 'react';
import { useLocale } from '../../context/LocaleContext';
import api from '../../lib/api';
import Section from '../../components/ui/Section';
import Pill from '../../components/ui/Pill';
import Table, { Tr, Td } from '../../components/ui/Table';
import SEO from '../../components/SEO';

const STATUS_TONE = { pending: 'default', confirmed: 'success', cancelled: 'clay' };

export default function DashboardBookings() {
  const { locale } = useLocale();
  const [items, setItems] = useState(null);

  useEffect(() => {
    api.get('/me/bookings').then(({ data }) => setItems(data.data));
  }, []);

  return (
    <Section>
      <SEO title={locale === 'ar' ? 'حجوزاتي | أبسط' : 'My Bookings | ABCET'} path="/dashboard/bookings" />
      <h1 className="font-display text-2xl text-ink mb-6">{locale === 'ar' ? 'حجوزاتي' : 'My Bookings'}</h1>
      {items === null ? (
        <p className="text-sage">…</p>
      ) : items.length === 0 ? (
        <p className="text-sage">{locale === 'ar' ? 'لا توجد حجوزات بعد.' : 'No bookings yet.'}</p>
      ) : (
        <Table columns={[locale === 'ar' ? 'الملتقى' : 'Forum', locale === 'ar' ? 'المدينة' : 'City', locale === 'ar' ? 'الحالة' : 'Status']}>
          {items.map((b) => (
            <Tr key={b._id}>
              <Td>{b.forum ? `${b.forum.month} ${b.forum.year}` : '—'}</Td>
              <Td>{b.forum?.city}</Td>
              <Td>
                <Pill tone={STATUS_TONE[b.status] || 'default'}>{b.status}</Pill>
              </Td>
            </Tr>
          ))}
        </Table>
      )}
    </Section>
  );
}
