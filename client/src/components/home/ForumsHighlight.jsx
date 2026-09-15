import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import { requestLead } from '../../lib/leadPreselect';
import Button from '../ui/Button';
import Reveal from '../motion/Reveal';

/** YouTube links arrive in several shapes; normalise them to an embed URL. */
function embedUrl(url = '') {
  const s = String(url).trim();
  if (!s) return '';
  if (s.includes('/embed/')) return s;
  const short = s.match(/youtu\.be\/([\w-]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const watch = s.match(/[?&]v=([\w-]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  const list = s.match(/[?&]list=([\w-]+)/);
  if (list) return `https://www.youtube.com/embed/videoseries?list=${list[1]}`;
  return s;
}

/**
 * The forums in the spotlight — what the accreditation forums are for, the
 * clips that show one running, and the fact that decides whether someone acts
 * now: the seats are capped to keep the simulation workshops working.
 *
 * Content is admin-managed under the `forums.highlight` setting; when no clips
 * are set it falls back to the video and playlist already on `forums.content`
 * rather than rendering empty frames.
 */
export default function ForumsHighlight() {
  const { locale } = useLocale();
  const { t } = useTranslation('home');
  const prefix = locale === 'en' ? '/en' : '';
  const [data, setData] = useState(null);
  const [fallback, setFallback] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get('/settings/forums.highlight').catch(() => ({ data: { data: null } })),
      api.get('/settings/forums.content').catch(() => ({ data: { data: null } })),
    ]).then(([h, c]) => {
      if (!mounted) return;
      setData(h.data.data);
      setFallback(c.data.data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!data) return null;

  const videos = (data.videos?.length ? data.videos : [fallback?.video, fallback?.playlist])
    .map(embedUrl)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div id="forums-spotlight" className="md:col-span-6 grid gap-4 md:grid-cols-12 md:gap-5">
      <Reveal
        from="start"
        className="md:col-span-5 flex flex-col gap-4 rounded-lg border border-rule/60 bg-surface p-6 shadow-raised md:p-8"
      >
        {data.heading?.[locale] && (
          <h3 className="font-display text-lg md:text-xl leading-tight text-ink">
            {data.heading[locale]}
          </h3>
        )}

        {data.body?.[locale] && (
          <p className="text-sm leading-relaxed text-ink-soft">{data.body[locale]}</p>
        )}

        {data.seatsNote?.[locale] && (
          <p className="flex items-start gap-2.5 rounded-md bg-sunk px-4 py-3 text-sm leading-relaxed text-warning">
            <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-pill bg-warning" />
            <span>{data.seatsNote[locale]}</span>
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          <Button
            type="button"
            onClick={() => requestLead({ interest: 'entrepreneur' })}
            className="group/cta"
          >
            <span>{data.cta?.[locale] || t('forums.book')}</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-base ease-out group-hover/cta:translate-x-1 rtl:group-hover/cta:-translate-x-1"
            >
              →
            </span>
          </Button>
          <Link
            to={`${prefix}/forums`}
            className="text-sm text-accent transition-colors duration-fast ease-out hover:text-accent-deep"
          >
            {t('forums.full')} →
          </Link>
        </div>
      </Reveal>

      {videos.length > 0 && (
        <div className="md:col-span-7 grid gap-4 sm:grid-cols-2 md:gap-5">
          {videos.map((url, i) => (
            <Reveal
              key={url}
              from="end"
              delay={0.08 * i}
              className={`overflow-hidden rounded-lg border border-rule/60 bg-sunk shadow-raised transition-shadow duration-base ease-out hover:shadow-md ${
                videos.length === 3 && i === 0 ? 'sm:col-span-2' : ''
              }`}
            >
              <div className="relative w-full pb-[56.25%]">
                <iframe
                  src={url}
                  title={`${data.heading?.[locale] || t('forums.title')} — ${i + 1}`}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
