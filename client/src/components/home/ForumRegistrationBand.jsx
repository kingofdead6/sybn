import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import ForumRegistrationForm from '../forums/ForumRegistrationForm';

/**
 * Closing band of the home page: the Taybah forum registration form paired with
 * photographs from past forums. Photos come from the `forums.gallery` setting so
 * the admin can change them; when it is empty the band simply runs form-only
 * rather than showing broken frames.
 */
export default function ForumRegistrationBand() {
  const { t } = useTranslation('forums');
  const { locale } = useLocale();
  const [content, setContent] = useState(null);
  const [forums, setForums] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get('/settings/forums.content').catch(() => ({ data: { data: null } })),
      api.get('/forums', { params: { status: 'open' } }).catch(() => ({ data: { data: [] } })),
      api.get('/settings/forums.gallery').catch(() => ({ data: { data: null } })),
    ])
      .then(([c, f, g]) => {
        if (!mounted) return;
        setContent(c.data.data);
        setForums(f.data.data || []);
        setGallery(Array.isArray(g.data.data) ? g.data.data : []);
        setLoaded(true);
      })
      .catch(() => {
        if (mounted) setLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Nothing to register for and nothing to show — stay out of the way.
  if (!loaded || (forums.length === 0 && gallery.length === 0)) return null;

  const hasGallery = gallery.length > 0;

  return (
    <section className="relative border-b border-rule bg-sunk py-9 md:py-10">
      <span className="marginalia" aria-hidden="true">
        {t('registrationHeading')}
      </span>

      <div className="mx-auto max-w-[86rem] px-4 md:px-8">
        <div className={`grid gap-8 ${hasGallery ? 'lg:grid-cols-12' : ''}`}>
          {hasGallery && (
            <div className="lg:col-span-5 flex flex-col gap-4">
              {gallery.slice(0, 2).map((img, i) => (
                <img
                  key={img.url || i}
                  src={img.url || img}
                  alt={img.alt?.[locale] || ''}
                  className="w-full border border-rule object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          )}

          <div className={hasGallery ? 'lg:col-span-7' : ''}>
            <ForumRegistrationForm
              openForums={forums}
              fieldLabels={content?.registrationFields}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
