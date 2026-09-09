import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Tile from '../ui/Tile';

/**
 * Upcoming forums as a live seat-availability panel: one row per forum, with
 * the seat count carried as the operative figure on the end.
 */
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
    <Tile span="md" label={content?.sectionTitle?.[locale] || t('forums.title')} className="md:min-h-[16rem]">
      {forums.length === 0 ? (
        <p className="text-sm text-muted">{t('forums.empty')}</p>
      ) : (
        <ul className="flex flex-col">
          {forums.slice(0, 4).map((forum) => {
            const seats = Math.max(0, (forum.seatsTotal || 0) - (forum.seatsTaken || 0));
            return (
              <li
                key={forum._id}
                className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5 last:border-0"
              >
                <span className="min-w-0 truncate text-sm text-ink">
                  {forum.city}
                  <span className="text-muted"> · {forum.month} {forum.year}</span>
                </span>
                <span className="numerals shrink-0 text-sm font-medium text-ink">
                  {seats}
                  <span className="caps-label ms-1.5 text-2xs font-normal text-muted">
                    {t('forums.seats')}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        to={`${prefix}/forums`}
        className="mt-auto text-sm text-accent transition-colors duration-fast ease-out hover:text-accent-deep"
      >
        {t('forums.full')} →
      </Link>
    </Tile>
  );
}
