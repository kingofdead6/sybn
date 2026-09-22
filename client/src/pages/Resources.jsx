import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import SEO from '../components/SEO';
import Reveal from '../components/motion/Reveal';

/** The download glyph, shared by the card and the detail page's button. */
function DownloadIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v11m0 0l-4-4m4 4l4-4M4 19h16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Key Resources: the guides, manuals and templates behind the programme,
 * each a card with its cover art and the PDF behind it.
 *
 * A resource either downloads on click or opens its own page — the admin
 * decides per item via `directDownload`, so a one-page form goes straight to
 * the file while a manual that needs explaining gets room to explain itself.
 */
export default function Resources() {
  const { locale } = useLocale();
  const { t } = useTranslation('resources');
  const reduceMotion = useReducedMotion();
  const prefix = locale === 'en' ? '/en' : '';
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    api
      .get('/resources')
      .then(({ data }) => {
        if (active) {
          setItems(data.data || []);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, []);

  const isAr = locale === 'ar';

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO title={`${t('title')} | SIYB`} description={t('intro')} path="/resources" />

      <Section label={isAr ? 'المصادر' : 'Resources'}>
        <div className="flex flex-col items-center gap-5 text-center">
          <h1 className="font-display text-3xl md:text-4xl leading-[1.08] text-ink max-w-[26ch]">
            {t('title')}
          </h1>
          <p className="text-md leading-relaxed text-ink-soft max-w-[62ch]">{t('intro')}</p>
        </div>

        {status === 'loading' && <p className="mt-10 text-center text-muted">{t('loading')}</p>}
        {status === 'error' && <p className="mt-10 text-center text-error">{t('loadError')}</p>}

        {status === 'ready' && items.length === 0 && (
          <p className="mt-10 text-center text-muted">{t('empty')}</p>
        )}

        {items.length > 0 && (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-12">
            {items.map((item, i) => {
              const title = item.title?.[locale] || item.title?.ar || '';
              const summary = item.summary?.[locale];
              const category = item.category?.[locale];

              // A direct-download card is an anchor to the file; otherwise it
              // is a link into the resource's own page. Either way the whole
              // card is the target, so there is one obvious thing to click.
              const asDownload = item.directDownload && item.pdfUrl;
              const linkProps = asDownload
                ? { as: 'a', href: item.pdfUrl, target: '_blank', rel: 'noreferrer' }
                : { as: Link, to: `${prefix}/resources/${item.slug}` };
              const Comp = linkProps.as;
              const { as: _omit, ...rest } = linkProps;

              return (
                <Reveal key={item._id} as="li" from="up" delay={Math.min(i, 6) * 0.05}>
                  <Comp
                    {...rest}
                    className="group flex h-full flex-col overflow-hidden rounded-lg border border-rule/60 bg-surface shadow-raised transition-shadow duration-base ease-out hover:shadow-md"
                  >
                    {/* Cover art. Without an image the frame falls back to a
                        tinted plate rather than showing a broken box. */}
                    <div className="relative w-full overflow-hidden bg-sunk pb-[62%]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-base ease-out group-hover:scale-[1.03]"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 flex items-center justify-center text-accent/30"
                        >
                          <DownloadIcon className="h-10 w-10" />
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-2.5 p-5">
                      {category && (
                        <span className="caps-label self-start rounded-pill border border-rule px-2.5 py-1 text-2xs text-accent">
                          {category}
                        </span>
                      )}

                      <h2 className="font-display text-md leading-snug text-ink">{title}</h2>

                      {summary && (
                        <p className="text-sm leading-relaxed text-ink-soft line-clamp-3">
                          {summary}
                        </p>
                      )}

                      <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-medium text-accent">
                        {asDownload ? (
                          <>
                            <DownloadIcon />
                            {t('download')}
                          </>
                        ) : (
                          t('viewDetails')
                        )}
                      </span>
                    </div>
                  </Comp>
                </Reveal>
              );
            })}
          </ul>
        )}
      </Section>
    </motion.div>
  );
}
