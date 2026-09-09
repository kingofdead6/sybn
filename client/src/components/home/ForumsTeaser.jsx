import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Table, { Tr, Td } from '../ui/Table';
import Reveal from '../motion/Reveal';

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
    <section className="relative bg-sunk py-9 md:py-10">
      <div className="mx-auto max-w-[86rem] px-4 md:px-8">
        <Reveal from="up" className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-xl md:text-2xl text-ink max-w-[24ch]">
            {content?.sectionTitle?.[locale] || t('forums.title')}
          </h2>
          <Link to={`${prefix}/forums`} className="text-sm text-accent border-b border-accent pb-0.5 shrink-0 transition-colors duration-fast ease-out hover:text-accent-deep hover:border-accent-deep">
            {t('forums.full')}
          </Link>
        </Reveal>

        {forums.length === 0 ? (
          <p className="mt-6 text-sm text-muted">{t('forums.empty')}</p>
        ) : (
          <Reveal from="up" delay={0.08} className="mt-6">
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
          </Reveal>
        )}
      </div>
    </section>
  );
}
