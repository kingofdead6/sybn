import { useEffect, useState } from 'react';
import api from '../../lib/api';
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
 * The explainer video: a short walkthrough of how the platform works. The
 * link is admin-managed, and the whole section stays hidden until one is set.
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

  const embed = youtubeEmbedUrl(data?.video);
  if (!embed) return null;

  return (
    <div className="md:col-span-6 flex flex-col gap-5">
      {data?.sub?.[locale] && (
        <p className="text-md leading-relaxed text-ink-soft max-w-[62ch]">{data.sub[locale]}</p>
      )}
      <div className="overflow-hidden rounded-lg bg-sunk shadow-md">
        <div className="relative w-full pb-[56.25%]">
          <iframe
            src={embed}
            title={data?.heading?.[locale] || ''}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
