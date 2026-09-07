import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../../context/LocaleContext';
import Stars from './Stars';

/**
 * One course in the catalogue grid: cover, rating, title, and the enrol action.
 * The whole card is not a single link — the title carries the navigation so the
 * accessible name is the course name rather than the entire card's text.
 */
export default function CourseCard({ course }) {
  const { locale } = useLocale();
  const { t } = useTranslation('courses');
  const prefix = locale === 'en' ? '/en' : '';
  const to = `${prefix}/courses/${course.slug}`;

  return (
    <article className="flex h-full flex-col rounded-sm border border-rule bg-surface">
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-rule bg-sunk">
        {course.image ? (
          <img src={course.image} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          /* No cover set. A course code stands in where there is one; otherwise
             the category name does, since a clipped title fragment reads as
             broken rather than as a placeholder. */
          <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-display text-lg text-muted">
            {course.code || course.category?.title?.[locale] || ''}
          </span>
        )}
        {course.code && course.image && (
          <span className="absolute bottom-2 start-2 rounded-sm bg-ink/80 px-2 py-1 text-2xs font-medium text-on-ink">
            {course.code}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {course.rating > 0 && <Stars value={course.rating} />}

        <h3 className="font-display text-md leading-snug text-ink">
          <Link
            to={to}
            className="transition-colors duration-fast ease-out hover:text-accent focus-visible:text-accent"
          >
            {course.title?.[locale]}
          </Link>
        </h3>

        {course.category?.title?.[locale] && (
          <p className="text-2xs caps-label text-muted">{course.category.title[locale]}</p>
        )}

        {/* Visual affordance only: the title above is the real link, so this is
            hidden from assistive tech rather than repeating the destination. */}
        <span
          aria-hidden="true"
          className="btn-label mt-auto inline-flex items-center justify-center rounded-sm border border-rule px-4 py-2.5 text-xs font-medium text-ink"
        >
          {t('enrol')}
        </span>
      </div>
    </article>
  );
}
