import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Tile from '../ui/Tile';

/** The partner network, as a compact roster tile. */
export default function NetworkPreview() {
  const { t } = useTranslation('home');
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const [members, setMembers] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.get('/team').then((res) => {
      if (mounted) {
        setMembers((res.data.data || []).slice(0, 6));
        setLoaded(true);
      }
    }).catch(() => setLoaded(true));
    return () => { mounted = false; };
  }, []);

  if (!loaded || members.length === 0) return null;

  return (
    <Tile span="md" label={t('network.title')}>
      <ul className="grid grid-cols-3 gap-4">
        {members.map((member) => (
          <li key={member._id} className="flex flex-col items-center gap-2 text-center">
            <img
              src={member.photo}
              alt={member.name?.[locale] || member.name?.ar || ''}
              className="h-14 w-14 rounded-pill bg-sunk object-cover shadow-raised"
              loading="lazy"
            />
            <span className="min-w-0 truncate text-xs text-ink w-full">
              {member.name?.[locale]}
            </span>
          </li>
        ))}
      </ul>

      <Link
        to={`${prefix}/network`}
        className="mt-auto text-sm text-accent transition-colors duration-fast ease-out hover:text-accent-deep"
      >
        {t('network.full')} →
      </Link>
    </Tile>
  );
}
