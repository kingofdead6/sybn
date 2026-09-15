import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import { trackStyle } from '../../lib/tracks';
import { requestLead } from '../../lib/leadPreselect';
import Button from '../ui/Button';
import Reveal from '../motion/Reveal';

/**
 * The four entrepreneur tracks, stated by project stage — "where is your
 * project right now?" — rather than by programme code. A reader who does not
 * yet know what GYB or SYB mean can still place themselves.
 *
 * Laid out as an alternating 7/5 ladder rather than a uniform card grid
 * (DESIGN.md §5, §9): each stage gets a full row, the numeral carries the
 * track's categorical colour, and the facing column holds the outcomes.
 *
 * Content is admin-managed under the `home.productTracks` setting.
 */
export default function ProductTracks() {
  const { locale } = useLocale();
  const { t } = useTranslation('home');
  const prefix = locale === 'en' ? '/en' : '';
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    api
      .get('/settings/home.productTracks')
      .then((res) => {
        if (mounted) setData(res.data.data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const items = data?.items || [];
  if (!items.length) return null;

  const outcomesLabel = data.outcomesLabel?.[locale] || t('tracks.outcomes');
  const audienceLabel = data.audienceLabel?.[locale] || t('tracks.audience');

  return (
    <div id="product-tracks" className="md:col-span-6 flex flex-col gap-4 md:gap-5">
      {data.sub?.[locale] && (
        <Reveal className="max-w-prose text-md leading-relaxed text-ink-soft">
          {data.sub[locale]}
        </Reveal>
      )}

      <ol className="flex flex-col gap-4 md:gap-5">
        {items.map((item, i) => {
          const track = trackStyle(item.accent);
          const outcomes = (item.outcomes || []).map((o) => o?.[locale]).filter(Boolean);
          return (
            <Reveal
              as="li"
              key={item.key}
              from={i % 2 === 0 ? 'start' : 'end'}
              delay={0.05}
              lift
              className="group relative overflow-hidden rounded-lg border border-rule/60 bg-surface shadow-raised transition-shadow duration-base ease-out hover:shadow-md"
            >
              {/* Track edge — the categorical marker for this stage. */}
              <div
                aria-hidden="true"
                className={`absolute inset-y-0 start-0 w-1 ${track.bg}`}
              />

              <div className="grid gap-6 p-6 md:grid-cols-12 md:gap-8 md:p-8">
                <div className={`md:col-span-5 flex flex-col gap-3 ${i % 2 ? 'md:order-2' : ''}`}>
                  <span
                    className={`numerals font-display text-3xl leading-none ${track.text}`}
                    aria-hidden="true"
                  >
                    {item.number}
                  </span>

                  <h3 className="font-display text-lg md:text-xl leading-tight text-ink">
                    {item.title?.[locale]}
                  </h3>

                  {item.audience?.[locale] && (
                    <div className="flex flex-col gap-1.5">
                      <span className="caps-label text-2xs text-muted">{audienceLabel}</span>
                      <p className="text-sm leading-relaxed text-ink-soft">
                        {item.audience[locale]}
                      </p>
                    </div>
                  )}

                  {item.gameLevel && (
                    <span
                      className={`caps-label numerals self-start rounded-pill border px-2.5 py-1 text-2xs ${track.border} ${track.text}`}
                    >
                      {t('tracks.gameLevel', { level: item.gameLevel })}
                    </span>
                  )}
                </div>

                <div className={`md:col-span-7 flex flex-col gap-4 ${i % 2 ? 'md:order-1' : ''}`}>
                  <span className="caps-label text-2xs text-muted">{outcomesLabel}</span>

                  <ul className="flex flex-col gap-3">
                    {outcomes.map((o, oi) => (
                      <li
                        key={oi}
                        className="flex items-start gap-3 border-b border-rule pb-3 text-sm leading-relaxed text-ink-soft last:border-0 last:pb-0"
                      >
                        <span
                          aria-hidden="true"
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-pill ${track.bg}`}
                        />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      onClick={() => requestLead({ interest: 'entrepreneur', track: item.key })}
                      className="group/cta"
                    >
                      <span>{item.cta?.[locale] || t('tracks.register')}</span>
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-base ease-out group-hover/cta:translate-x-1 rtl:group-hover/cta:-translate-x-1"
                      >
                        →
                      </span>
                    </Button>

                    {item.program && (
                      <Link
                        to={`${prefix}/programs/${item.program}`}
                        className="text-sm text-accent transition-colors duration-fast ease-out hover:text-accent-deep"
                      >
                        {t('tracks.details')} →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}
