import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { withDefaults } from '../../lib/homeDefaults';
import { useLocale } from '../../context/LocaleContext';

/** Accepts a watch, youtu.be or embed URL and returns an embeddable one. */
function youtubeEmbedUrl(url) {
  if (!url) return '';
  const short = url.match(/youtu\.be\/([^?&/]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const long = url.match(/[?&]v=([^&]+)/);
  if (long) return `https://www.youtube.com/embed/${long[1]}`;
  return url;
}

/**
 * How the platform works: the numbered path a reader actually follows, from
 * account to accreditation, with the explainer video beside it when one is set.
 *
 * Everything is admin-managed under `home.howItWorks`. The steps carry the
 * section on their own, so it no longer disappears when no video is configured.
 */
export default function HowItWorks() {
  const { locale } = useLocale();
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/settings/home.howItWorks')
      .then(({ data: res }) => {
        if (active) setData(res.data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const content = withDefaults('home.howItWorks', data, 'steps');
  const embed = youtubeEmbedUrl(content?.video);
  const steps = (content?.steps || []).filter((s) => s?.title?.[locale] || s?.body?.[locale]);

  // Nothing configured at all — stay out of the way rather than render a
  // heading with an empty body beneath it.
  if (!embed && steps.length === 0) return null;

  return (
    <div className="md:col-span-6 flex flex-col items-center gap-7">
      {content?.sub?.[locale] && (
        <p className="text-md leading-relaxed text-ink-soft max-w-[62ch] text-center">
          {content.sub[locale]}
        </p>
      )}

      {steps.length > 0 && (
        <ol className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li
              key={i}
              className="flex flex-col gap-2 rounded-lg border border-rule/60 bg-surface p-5 shadow-raised"
            >
              {/* The number is the point of the section — it says this is a
                  sequence, not a menu of unrelated features. */}
              <span
                className="numerals font-display text-2xl leading-none text-accent"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {step.title?.[locale] && (
                <h3 className="font-display text-md leading-snug text-ink">
                  {step.title[locale]}
                </h3>
              )}

              {step.body?.[locale] && (
                <p className="text-sm leading-relaxed text-ink-soft">{step.body[locale]}</p>
              )}
            </li>
          ))}
        </ol>
      )}

      {embed && (
        <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-sunk shadow-md">
          <div className="relative w-full pb-[56.25%]">
            <iframe
              src={embed}
              title={content?.heading?.[locale] || ''}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
}
