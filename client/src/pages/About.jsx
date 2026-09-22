import { useEffect, useState } from 'react';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Rule from '../components/ui/Rule';
import SEO from '../components/SEO';
import Reveal from '../components/motion/Reveal';
import { embedUrl } from '../lib/videoUrl';
import logoUrl from '../assets/Logo.png';
import aboutVideo from '../assets/HomeVideo.mp4';

export default function About() {
  const { locale } = useLocale();
  const reduceMotion = useReducedMotion();
  const [content, setContent] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/settings/about.content')
      .then(({ data }) => {
        if (active) setContent(data.data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const isAr = locale === 'ar';
  const paragraphs = content?.paragraphs || [];
  const [lead, ...rest] = paragraphs;

  const embed = embedUrl(content?.video);
  const videoSrc = embed ? null : content?.video || aboutVideo;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={isAr ? 'عن البرنامج | SIYB' : 'About the Program | SIYB'}
        description={content?.paragraphs?.[0]?.[locale]}
        path="/about"
      />

      <Section id="about" label={isAr ? 'عن البرنامج' : 'About'}>
        {/* The film leads the page. The link is admin-set on `about.content`
            and handled exactly as the home hero's: a YouTube or Vimeo URL is
            embedded, anything else plays as a file, and with nothing set the
            bundled film is used. */}
        <div className="relative overflow-hidden rounded-lg bg-sunk shadow-overlay">
          <div className="relative w-full pb-[56.25%] md:pb-[42%]">
            {embed ? (
              <iframe
                src={embed}
                title={isAr ? 'عن البرنامج' : 'About the Program'}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <video
                src={videoSrc}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                loop
                playsInline
                controls
                preload="metadata"
              />
            )}
          </div>
        </div>

        {/* Then the title and the standfirst, centred beneath it. */}
        <div className="mt-10 flex flex-col items-center gap-6 text-center md:mt-12">
          <h1 className="font-display text-3xl md:text-4xl leading-[1.08] text-ink max-w-[26ch]">
            {isAr ? 'عن البرنامج' : 'About the Program'}
          </h1>

          {lead?.[locale] && (
            <p className="text-md leading-relaxed text-ink-soft max-w-[62ch]">{lead[locale]}</p>
          )}
        </div>

        {/* The remaining prose runs beside the logo. The mark is pinned to the
            physical left and the text to the right in both languages, so the
            grid is forced LTR and the text block restores its own direction —
            otherwise RTL would mirror the two columns. */}
        {rest.length > 0 && (
          <>
            <Rule className="my-9" />
            <div
              dir="ltr"
              className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10"
            >
              <Reveal from="up" className="lg:col-span-5 flex justify-center">
                <img
                  src={logoUrl}
                  alt=""
                  className="h-44 w-auto object-contain md:h-64 lg:h-72"
                />
              </Reveal>

              <div
                dir={isAr ? 'rtl' : 'ltr'}
                className="lg:col-span-7 flex flex-col gap-5"
              >
                {rest.map((p, i) => (
                  <Reveal key={i} from="up" delay={i * 0.06}>
                    <p className="text-md text-ink-soft leading-relaxed">{p[locale]}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </>
        )}
      </Section>

    </motion.div>
  );
}
