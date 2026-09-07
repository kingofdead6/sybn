import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import ForumRegistrationForm from '../forums/ForumRegistrationForm';

/**
 * Closing band of the home page: the Taybah forum registration form, set against a
 * factual rail (tagline, location, the next open forum, seats left) so the reader is
 * told what they are signing up for before the fields ask for it.
 *
 * Everything here is admin-managed — the rail reads `forums.content` and the open
 * forums themselves; photographs come from the `forums.gallery` setting. When the
 * gallery is empty the strip is simply omitted rather than showing broken frames.
 */
export default function ForumRegistrationBand() {
  const { t } = useTranslation('forums');
  const { t: th } = useTranslation('home');
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
  const next = forums[0];
  const seatsLeft = next
    ? Math.max(0, (next.seatsTotal || 0) - (next.seatsTaken || 0))
    : null;

  // The rail carries only facts that already exist in the CMS — no invented copy.
  const facts = next
    ? [
        { label: th('forums.month'), value: `${next.month} ${next.year}` },
        { label: th('forums.city'), value: next.city },
        { label: th('forums.seats'), value: seatsLeft, numeric: true },
      ].filter((f) => f.value !== undefined && f.value !== null && f.value !== '')
    : [];

  return (
    <section id="forum-registration" className="relative border-b border-rule bg-sunk py-9 md:py-10">
      <span className="marginalia" aria-hidden="true">
        {t('registrationHeading')}
      </span>

      <div className="mx-auto max-w-[86rem] px-4 md:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-7">
          {/* Rail — what this forum is, before the form asks for a commitment. */}
          <div className="lg:col-span-4 flex flex-col gap-5 lg:border-e lg:border-rule lg:pe-7">
            <h2 className="font-display text-xl md:text-2xl leading-tight text-ink">
              {t('registrationHeading')}
            </h2>

            {content?.tagline?.[locale] && (
              <p className="text-sm leading-relaxed text-ink-soft max-w-prose">
                {content.tagline[locale]}
              </p>
            )}

            {content?.location?.[locale] && (
              <p className="text-sm leading-relaxed text-muted max-w-prose">
                {content.location[locale]}
              </p>
            )}

            {facts.length > 0 && (
              <dl className="mt-1 border-t border-rule">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5"
                  >
                    <dt className="text-2xs caps-label text-muted">{f.label}</dt>
                    <dd
                      className={`text-sm text-ink text-end ${f.numeric ? 'numerals font-medium' : ''}`}
                    >
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {hasGallery && (
              <ul className="mt-1 grid grid-cols-2 gap-3">
                {gallery.slice(0, 4).map((img, i) => (
                  <li key={img.url || i}>
                    <img
                      src={img.url || img}
                      alt={img.alt?.[locale] || ''}
                      className="aspect-[4/3] w-full border border-rule object-cover"
                      loading="lazy"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-8">
            <ForumRegistrationForm
              openForums={forums}
              fieldLabels={content?.registrationFields}
              showHeading={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
