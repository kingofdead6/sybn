import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import { requestLead } from '../../lib/leadPreselect';
import Button from '../ui/Button';
import Reveal from '../motion/Reveal';

/**
 * The trainer/expert route — "from local expertise to international trainer".
 * The first card is the accreditation itself and carries the dark ground, so
 * the page's second audience gets a visibly different weight from the
 * entrepreneur ladder above it rather than reading as more of the same.
 *
 * Content is admin-managed under the `home.eliteTracks` setting.
 */
export default function EliteTracks() {
  const { locale } = useLocale();
  const { t } = useTranslation('home');
  const prefix = locale === 'en' ? '/en' : '';
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    api
      .get('/settings/home.eliteTracks')
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

  return (
    <div id="elite-tracks" className="md:col-span-6 flex flex-col gap-6 md:gap-8">
      {(data.kicker?.[locale] || data.sub?.[locale]) && (
        <Reveal className="flex flex-col gap-3">
          {data.kicker?.[locale] && (
            <h3 className="font-display text-xl md:text-2xl leading-tight text-ink max-w-[22ch]">
              {data.kicker[locale]}
            </h3>
          )}
          {data.sub?.[locale] && (
            <p className="max-w-prose text-md leading-relaxed text-ink-soft">
              {data.sub[locale]}
            </p>
          )}
        </Reveal>
      )}

      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {items.map((item, i) => {
          const dark = i === 0;
          const bullets = (item.bullets || []).map((b) => b?.[locale]).filter(Boolean);
          return (
            <Reveal
              key={item.key}
              from={i === 0 ? 'start' : 'end'}
              delay={i * 0.08}
              lift
              className={`flex flex-col gap-4 rounded-lg border p-6 shadow-raised transition-shadow duration-base ease-out hover:shadow-md md:p-8 ${
                dark ? 'border-ink bg-ink text-on-ink' : 'border-rule/60 bg-surface text-ink'
              }`}
            >
              {item.code && (
                <span
                  className={`caps-label self-start rounded-pill border px-2.5 py-1 text-2xs ${
                    dark ? 'border-on-ink/40 text-on-ink' : 'border-rule-strong text-muted'
                  }`}
                >
                  {item.code}
                </span>
              )}

              <h4
                className={`font-display text-lg md:text-xl leading-tight ${
                  dark ? 'text-on-ink' : 'text-ink'
                }`}
              >
                {item.title?.[locale]}
              </h4>

              {item.tagline?.[locale] && (
                <p
                  className={`text-sm leading-relaxed ${
                    dark ? 'text-on-ink opacity-80' : 'text-ink-soft'
                  }`}
                >
                  {item.tagline[locale]}
                </p>
              )}

              {bullets.length > 0 && (
                <ul
                  className={`flex flex-col gap-2.5 border-t pt-4 ${
                    dark ? 'border-on-ink/20' : 'border-rule'
                  }`}
                >
                  {bullets.map((b, bi) => (
                    <li
                      key={bi}
                      className={`flex items-start gap-3 text-sm leading-relaxed ${
                        dark ? 'text-on-ink opacity-80' : 'text-ink-soft'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-pill ${
                          dark ? 'bg-on-ink' : 'bg-accent'
                        }`}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant={dark ? 'secondary' : 'primary'}
                  onClick={() => requestLead({ interest: 'trainer', track: item.code || 'TOT' })}
                  className={`group/cta ${
                    dark ? '!border-on-ink !text-on-ink hover:!bg-on-ink/10' : ''
                  }`}
                >
                  <span>{data.cta?.[locale] || t('elite.cta')}</span>
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
                    className={`text-sm transition-colors duration-fast ease-out ${
                      dark
                        ? 'text-on-ink opacity-70 hover:opacity-100'
                        : 'text-accent hover:text-accent-deep'
                    }`}
                  >
                    {t('tracks.details')} →
                  </Link>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
