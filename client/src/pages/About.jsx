import { useEffect, useState } from 'react';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Rule from '../components/ui/Rule';
import SEO from '../components/SEO';
import { OWNER } from '../lib/site';
import { seoCopy } from '../lib/seoCopy';
import { aboutSchema } from '../lib/schema';
import Reveal from '../components/motion/Reveal';
import logoUrl from '../assets/Logo.png';
import aboutVideo from '../assets/HomeVideo2.mp4';

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

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        {...seoCopy('about', locale)}
        path="/about"
        type="profile"
        breadcrumbs={[{ name: isAr ? 'عن البرنامج' : 'About', path: '/about' }]}
        jsonLd={aboutSchema(locale)}
      />

      <Section id="about" label={isAr ? 'عن البرنامج' : 'About'}>
        {/* The film leads the page — the bundled one in assets, the same film
            as the home hero's. */}
        <div className="relative overflow-hidden rounded-lg bg-sunk shadow-overlay">
          {/* The frame takes the film's own proportions, so the whole picture
              shows edge to edge — nothing cropped, no bars. */}
          <video
            src={aboutVideo}
            className="block h-auto w-full"
            muted
            loop
            playsInline
            controls
            preload="metadata"
          />
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

        {/* The remaining prose runs beside the logo, the text leading and the
            mark closing the row: left/right in English, mirrored in Arabic.
            Ordering by grid column rather than source order keeps the text
            first for a screen reader in both directions.

            The prose is set in fluid type so it fills the column at any width
            instead of leaving the logo stranded beside a short measure. */}
        {rest.length > 0 && (
          <>
            <Rule className="my-9" />
            <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-8 lg:order-1 flex flex-col gap-5">
                {rest.map((p, i) => (
                  <Reveal key={i} from="up" delay={i * 0.06}>
                    <p className="text-[clamp(0.95rem,0.55rem+0.75vw,1.2rem)] text-ink-soft leading-relaxed">
                      {p[locale]}
                    </p>
                  </Reveal>
                ))}
              </div>

              <Reveal
                from="up"
                className="lg:col-span-4 lg:order-2 flex justify-center"
              >
                <img
                  src={logoUrl}
                  alt=""
                  className="h-32 w-auto max-w-full object-contain md:h-40 lg:h-48"
                />
              </Reveal>
            </div>
          </>
        )}
      </Section>

      <Founder isAr={isAr} locale={locale} />
    </motion.div>
  );
}

/**
 * The founder, named in both scripts as real text so a search for either
 * spelling finds this page. Details come from OWNER in lib/site.js; the
 * portrait and the longer bio appear once they are filled in there.
 */
function Founder({ isAr, locale }) {
  const name = isAr ? OWNER.nameAr : OWNER.name;
  const otherName = isAr ? OWNER.name : OWNER.nameAr;
  const bio = OWNER.bio[locale];
  const initials = isAr ? 'س ب' : 'SB';

  return (
    <Section id="founder" tone="surface" label={isAr ? 'المؤسس' : 'Founder'}>
      <div className="grid items-center gap-8 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-4 flex justify-center">
          {OWNER.photo ? (
            <img
              src={OWNER.photo}
              alt={isAr ? `${OWNER.nameAr}، ${OWNER.jobTitle.ar}` : `${OWNER.name}, ${OWNER.jobTitle.en}`}
              width="320"
              height="320"
              loading="lazy"
              decoding="async"
              className="h-56 w-56 rounded-lg object-cover shadow-raised md:h-64 md:w-64"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-56 w-56 items-center justify-center rounded-lg bg-gradient-to-br from-accent-edge-from to-accent-edge-to font-display text-5xl text-on-ink shadow-raised md:h-64 md:w-64"
            >
              {initials}
            </span>
          )}
        </div>

        <div className="md:col-span-8 flex flex-col gap-4">
          <h2 className="font-display text-2xl md:text-3xl leading-tight text-ink">{name}</h2>
          <p lang={isAr ? 'en' : 'ar'} dir={isAr ? 'ltr' : 'rtl'} className="text-md text-muted">
            {otherName}
          </p>
          <p className="text-sm caps-label text-accent">{OWNER.jobTitle[locale]}</p>
          {bio && <p className="text-md leading-relaxed text-ink-soft max-w-[62ch]">{bio}</p>}
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {OWNER.sameAs.map((href) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-sm text-accent transition-colors duration-fast ease-out hover:text-accent-deep"
                >
                  {href.includes('instagram') ? 'Instagram' : 'Facebook'}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
