import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Table, { Tr, Td } from '../ui/Table';

export default function ForumsTeaser() {
  const { t } = useTranslation('home');
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const [content, setContent] = useState(null);
  const [forums, setForums] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get('/settings/forums.content').catch(() => ({ data: { data: null } })),
      api.get('/forums', { params: { status: 'open' } }).catch(() => ({ data: { data: [] } })),
    ]).then(([contentRes, forumsRes]) => {
      if (!mounted) return;
      setContent(contentRes.data.data);
      setForums(forumsRes.data.data || []);
      setLoaded(true);
    });
    return () => { mounted = false; };
  }, []);

  if (!loaded) return null;

  return (
    <section className="bg-surface-muted py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-xl md:text-2xl font-bold text-ink max-w-3xl">
            {content?.sectionTitle?.[locale] || t('forums.title')}
          </h2>
          <Link to={`${prefix}/forums`} className="text-sm font-medium text-saffron-deep hover:text-ink shrink-0">
            {t('forums.full')}
          </Link>
        </div>

        {forums.length === 0 ? (
          <p className="mt-6 text-sm text-sage">{t('forums.empty')}</p>
        ) : (
          <div className="mt-6">
            <Table
              columns={[
                { key: 'month', label: t('forums.month') },
                { key: 'city', label: t('forums.city') },
                { key: 'seats', label: t('forums.seats') },
              ]}
            >
              {forums.map((forum) => (
                <Tr key={forum._id}>
                  <Td>{forum.month} {forum.year}</Td>
                  <Td>{forum.city}</Td>
                  <Td>{Math.max(0, (forum.seatsTotal || 0) - (forum.seatsTaken || 0))}</Td>
                </Tr>
              ))}
            </Table>
          </div>
        )}
      </div>
    </section>
  );
}
