import { useEffect, useState } from 'react';
import { useLocale } from '../../context/LocaleContext';
import api from '../../lib/api';
import Section from '../../components/ui/Section';
import Pill from '../../components/ui/Pill';
import Table, { Tr, Td } from '../../components/ui/Table';
import SEO from '../../components/SEO';

export default function DashboardCertificates() {
  const { locale } = useLocale();
  const [items, setItems] = useState(null);

  useEffect(() => {
    api.get('/me/certificates').then(({ data }) => setItems(data.data));
  }, []);

  return (
    <Section>
      <SEO title={locale === 'ar' ? 'شهاداتي | أبسط' : 'My Certificates | ABCET'} path="/dashboard/certificates" />
      <h1 className="font-display text-2xl text-ink mb-6">{locale === 'ar' ? 'شهاداتي' : 'My Certificates'}</h1>
      {items === null ? (
        <p className="text-muted">…</p>
      ) : items.length === 0 ? (
        <p className="text-muted">{locale === 'ar' ? 'لا توجد شهادات بعد.' : 'No certificates yet.'}</p>
      ) : (
        <Table columns={[locale === 'ar' ? 'الرقم' : 'Number', locale === 'ar' ? 'البرنامج' : 'Program', locale === 'ar' ? 'التاريخ' : 'Date', locale === 'ar' ? 'الحالة' : 'Status']}>
          {items.map((c) => (
            <Tr key={c._id}>
              <Td dir="ltr">{c.number}</Td>
              <Td>{c.program?.title?.[locale]}</Td>
              <Td>{new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium' }).format(new Date(c.issuedAt))}</Td>
              <Td>
                <Pill tone={c.status === 'valid' ? 'success' : 'clay'}>
                  {c.status === 'valid' ? (locale === 'ar' ? 'صالحة' : 'Valid') : (locale === 'ar' ? 'ملغاة' : 'Revoked')}
                </Pill>
              </Td>
            </Tr>
          ))}
        </Table>
      )}
    </Section>
  );
}
