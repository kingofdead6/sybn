import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';

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
        setMembers((res.data.data || []).slice(0, 8));
        setLoaded(true);
      }
    }).catch(() => setLoaded(true));
    return () => { mounted = false; };
  }, []);

  if (!loaded || members.length === 0) return null;

  return (
    <section className="bg-paper py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-xl md:text-2xl font-bold text-ink">{t('network.title')}</h2>
          <Link to={`${prefix}/network`} className="text-sm font-medium text-saffron-deep hover:text-ink">
            {t('network.full')}
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {members.map((member) => (
            <div key={member._id} className="flex flex-col items-center text-center gap-2">
              <img
                src={member.photo}
                alt={member.name?.[locale] || member.name?.ar || ''}
                className="h-20 w-20 rounded-full shadow-md ring-4 ring-surface object-cover bg-surface-muted"
              />
              <span className="text-sm font-medium text-ink">{member.name?.[locale]}</span>
              <span className="text-xs text-sage">{member.role?.[locale]}</span>
              {member.country && <span className="text-xs text-sage">{member.country}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
