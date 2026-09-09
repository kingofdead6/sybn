import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Pill from '../components/ui/Pill';
import Rule from '../components/ui/Rule';
import SEO from '../components/SEO';
import Stars from '../components/courses/Stars';
import CertificateRequestForm from '../components/programs/CertificateRequestForm';

export default function CourseDetail() {
  const { slug } = useParams();
  const { locale } = useLocale();
  const { t } = useTranslation('courses');
  const prefix = locale === 'en' ? '/en' : '';
  const [course, setCourse] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    api
      .get(`/courses/${slug}`)
      .then(({ data }) => {
        if (!active) return;
        setCourse(data.data);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (status === 'loading') {
    return (
      <Section>
        <p className="text-muted">{t('loading')}</p>
      </Section>
    );
  }

  if (status === 'error' || !course) {
    return (
      <Section>
        <p className="text-error">{t('loadError')}</p>
        <Link to={`${prefix}/courses`} className="text-accent font-medium">
          {t('backToCourses')}
        </Link>
      </Section>
    );
  }

  const modules = course.modules || [];

  return (
    <>
      <SEO
        title={course.title?.[locale]}
        description={course.description?.[locale]}
        path={`/courses/${course.slug}`}
      />

      <Section label={course.code || undefined}>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-7">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-3">
              {course.code && <Pill tone="saffron">{course.code}</Pill>}
              {course.rating > 0 && <Stars value={course.rating} />}
            </div>
            <h1 className="font-display text-2xl md:text-3xl leading-tight text-ink mt-3">
              {course.title?.[locale]}
            </h1>
          </div>

          {course.category?.title?.[locale] && (
            <div className="lg:col-span-4 lg:border-s lg:border-rule lg:ps-7 flex flex-col gap-2 self-end">
              <h2 className="text-2xs caps-label text-muted">{t('categoryLabel')}</h2>
              <Link
                to={`${prefix}/courses?category=${encodeURIComponent(course.category.slug)}`}
                className="text-sm text-accent transition-colors duration-fast ease-out hover:text-accent-deep"
              >
                {course.category.title[locale]}
              </Link>
            </div>
          )}
        </div>

        {course.description?.[locale] && (
          <>
            <Rule className="my-7" />
            <p className="text-ink-soft leading-relaxed whitespace-pre-line max-w-prose lg:w-7/12">
              {course.description[locale]}
            </p>
          </>
        )}
      </Section>

      {modules.length > 0 && (
        <Section tone="surface" label={t('modulesHeading')}>
          <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-rule pb-4">
            <h2 className="font-display text-xl md:text-2xl text-ink">{t('modulesHeading')}</h2>
            <span className="numerals shrink-0 text-sm text-muted" aria-hidden="true">
              {modules.length}
            </span>
          </div>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m, i) => (
              <li key={i} className="flex flex-col gap-2 rounded-md border border-rule/60 bg-surface p-5 shadow-raised">
                <span className="numerals text-2xs font-semibold text-accent" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-md leading-snug text-ink">{m.title?.[locale]}</h3>
                {m.description?.[locale] && (
                  <p className="text-sm leading-relaxed text-muted">{m.description[locale]}</p>
                )}
              </li>
            ))}
          </ol>
        </Section>
      )}

      <Section>
        <CertificateRequestForm
          courseId={course._id}
          programTitle={course.title?.[locale]}
          program={course}
        />
      </Section>
    </>
  );
}
