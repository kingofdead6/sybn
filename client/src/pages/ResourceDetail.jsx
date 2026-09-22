import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Pill from '../components/ui/Pill';
import SEO from '../components/SEO';
import Reveal from '../components/motion/Reveal';
import Button from '../components/ui/Button';

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
 * One resource in full.
 *
 * The page is built around a single decision — take the file or not — so it
 * leads with a masthead naming the thing, then runs the prose against a rail
 * carrying the download and the facts about it. The rail sticks on desktop so
 * the action stays reachable however long the description runs, and the other
 * resources close the page rather than leaving it to stop dead.
 */
export default function ResourceDetail() {
  const { slug } = useParams();
  const { locale } = useLocale();
  const { t } = useTranslation('resources');
  const reduceMotion = useReducedMotion();
  const prefix = locale === 'en' ? '/en' : '';
  const [item, setItem] = useState(null);
  const [siblings, setSiblings] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    api
      .get(`/resources/${slug}`)
      .then(({ data }) => {
        if (active) {
          setItem(data.data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    // The closing band needs the rest of the shelf; a failure here must not
    // take the page down, so it degrades to no band at all.
    api
      .get('/resources')
      .then(({ data }) => {
        if (active) setSiblings(data.data || []);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [slug]);

  const isAr = locale === 'ar';

  if (status === 'loading') {
    return (
      <Section>
        <p className="text-center text-muted">{t('loading')}</p>
      </Section>
    );
  }

  if (status === 'error' || !item) {
    return (
      <Section>
        <p className="text-center text-error">{t('notFound')}</p>
        <p className="mt-4 text-center">
          <Link to={`${prefix}/resources`} className="text-accent font-medium hover:underline">
            {t('backToResources')}
          </Link>
        </p>
      </Section>
    );
  }

  const title = item.title?.[locale] || item.title?.ar || '';
  const summary = item.summary?.[locale];
  const description = item.description?.[locale];
  const category = item.category?.[locale];

  const others = siblings.filter((s) => s.slug !== item.slug).slice(0, 3);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={`${title} | SIYB`}
        description={summary || description}
        path={`/resources/${item.slug}`}
      />

      {/* Masthead: the breadcrumb, the name of the thing, and its standfirst,
          on a tinted ground so the page opens with weight. */}
      <Section tone="surface" rhythm="tight">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            to={`${prefix}/resources`}
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
          >
            <span aria-hidden="true">{isAr ? '→' : '←'}</span>
            {t('backToResources')}
          </Link>
        </nav>

        <div className="flex flex-col gap-4">
          {category && <Pill tone="saffron" className="self-start">{category}</Pill>}

          <h1 className="font-display text-3xl md:text-4xl leading-[1.08] text-ink max-w-[22ch]">
            {title}
          </h1>

          {summary && (
            <p className="text-md leading-relaxed text-ink-soft max-w-[62ch]">{summary}</p>
          )}
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* The prose column. */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {description ? (
              <>
                <h2 className="text-2xs caps-label text-muted">{t('aboutHeading')}</h2>
                <p className="-mt-3 text-md leading-relaxed text-ink-soft whitespace-pre-line">
                  {description}
                </p>
              </>
            ) : (
              /* With no long description the column would sit empty beside a
                 tall rail, so the summary carries it instead of nothing. */
              summary && (
                <p className="text-md leading-relaxed text-ink-soft whitespace-pre-line">
                  {summary}
                </p>
              )
            )}
          </div>

          {/* The rail: cover art, the facts, and the action. */}
          <aside className="lg:col-span-5">
            <div className="flex flex-col gap-5 lg:sticky lg:top-28">
              <div className="relative w-full overflow-hidden rounded-lg border border-rule/60 bg-sunk pb-[70%] shadow-raised">
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-accent/30"
                  >
                    <DownloadIcon className="h-10 w-10" />
                    <span className="font-display text-lg">PDF</span>
                  </span>
                )}
              </div>

              <div className="rounded-lg border border-rule/60 bg-surface p-5 shadow-raised">
                <dl className="flex flex-col">
                  {category && (
                    <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-3">
                      <dt className="text-2xs caps-label text-muted">{t('metaType')}</dt>
                      <dd className="text-sm text-ink text-end">{category}</dd>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-2xs caps-label text-muted">{t('metaFormat')}</dt>
                    <dd className="text-sm text-ink text-end">
                      {item.pdfUrl ? 'PDF' : t('metaUnavailable')}
                    </dd>
                  </div>
                </dl>

                {item.pdfUrl ? (
                  <Button
                    as="a"
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    variant="primary"
                    size="lg"
                    className="mt-2 w-full"
                  >
                    <DownloadIcon />
                    {t('download')}
                  </Button>
                ) : (
                  <p className="mt-2 rounded-md bg-sunk px-4 py-3 text-sm text-muted">
                    {t('noFile')}
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* The rest of the shelf, so the page closes rather than stopping. */}
      {others.length > 0 && (
        <Section tone="surface" label={isAr ? 'مصادر أخرى' : 'More resources'}>
          <h2 className="mb-7 font-display text-xl md:text-2xl leading-tight text-ink">
            {t('moreResources')}
          </h2>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other, i) => {
              const otherTitle = other.title?.[locale] || other.title?.ar || '';
              const asDownload = other.directDownload && other.pdfUrl;

              return (
                <Reveal key={other._id} as="li" from="up" delay={i * 0.05}>
                  {(() => {
                    const inner = (
                      <>
                        <div className="relative w-full overflow-hidden bg-sunk pb-[52%]">
                          {other.image ? (
                            <img
                              src={other.image}
                              alt=""
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 flex items-center justify-center text-accent/30"
                            >
                              <DownloadIcon className="h-7 w-7" />
                            </span>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-2 p-4">
                          <h3 className="font-display text-md leading-snug text-ink">
                            {otherTitle}
                          </h3>
                          <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-accent">
                            {asDownload ? (
                              <>
                                <DownloadIcon className="h-3.5 w-3.5" />
                                {t('download')}
                              </>
                            ) : (
                              t('viewDetails')
                            )}
                          </span>
                        </div>
                      </>
                    );

                    const cls =
                      'group flex h-full flex-col overflow-hidden rounded-lg border border-rule/60 bg-bg shadow-raised transition-shadow duration-base ease-out hover:shadow-md';

                    return asDownload ? (
                      <a href={other.pdfUrl} target="_blank" rel="noreferrer" className={cls}>
                        {inner}
                      </a>
                    ) : (
                      <Link to={`${prefix}/resources/${other.slug}`} className={cls}>
                        {inner}
                      </Link>
                    );
                  })()}
                </Reveal>
              );
            })}
          </ul>
        </Section>
      )}
    </motion.div>
  );
}
