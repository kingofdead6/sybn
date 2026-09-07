import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import SEO from '../components/SEO';
import CourseCard from '../components/courses/CourseCard';

const SORTS = ['newest', 'oldest', 'rating'];

/**
 * The specialized-course catalogue: a category filter rail beside a card grid,
 * with search and sort. Filter state lives in the URL so a filtered view can be
 * linked and survives a reload.
 */
export default function Courses() {
  const { locale } = useLocale();
  const { t } = useTranslation('courses');
  const [params, setParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');

  const selected = useMemo(() => params.getAll('category'), [params]);
  const q = params.get('q') || '';
  const sort = SORTS.includes(params.get('sort')) ? params.get('sort') : 'newest';

  // Search is typed locally and pushed to the URL on a debounce, so every
  // keystroke doesn't become a history entry or a request.
  const [draft, setDraft] = useState(q);
  useEffect(() => setDraft(q), [q]);
  useEffect(() => {
    if (draft === q) return;
    const id = setTimeout(() => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        if (draft) next.set('q', draft);
        else next.delete('q');
        return next;
      });
    }, 300);
    return () => clearTimeout(id);
  }, [draft, q, setParams]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    api
      .get('/courses', { params: { category: selected, q: q || undefined, sort } })
      .then(({ data }) => {
        if (!active) return;
        setCourses(data.data || []);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [selected, q, sort]);

  const toggleCategory = useCallback(
    (slug) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        const current = next.getAll('category');
        next.delete('category');
        const after = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
        after.forEach((s) => next.append('category', s));
        return next;
      });
    },
    [setParams]
  );

  const hasFilters = selected.length > 0 || !!q;

  return (
    <>
      <SEO title={t('title')} description={t('subtitle')} path="/courses" />

      <Section label={t('title')}>
        <div className="flex flex-col gap-4 border-b border-rule pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-2xl md:text-3xl leading-tight text-ink">{t('title')}</h1>
            <p className="mt-2 text-sm text-muted max-w-prose">{t('subtitle')}</p>
          </div>
          <p className="numerals shrink-0 text-sm text-muted">
            {t('count', { count: courses.length })}
          </p>
        </div>

        <div className="mt-6 grid gap-7 lg:grid-cols-12 lg:gap-7">
          {/* Filter rail */}
          <aside className="lg:col-span-3 lg:border-e lg:border-rule lg:pe-7">
            <div className="flex flex-col gap-5">
              <Input
                label={t('search')}
                type="search"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t('searchPlaceholder')}
              />

              <Select
                label={t('sort')}
                value={sort}
                onChange={(e) =>
                  setParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set('sort', e.target.value);
                    return next;
                  })
                }
              >
                {SORTS.map((s) => (
                  <option key={s} value={s}>
                    {t(`sortBy.${s}`)}
                  </option>
                ))}
              </Select>

              <fieldset className="border-t border-rule pt-4">
                <legend className="text-2xs caps-label text-muted">{t('filterHeading')}</legend>
                <ul className="mt-3 flex flex-col">
                  {categories.map((c) => (
                    <li key={c.slug} className="border-b border-rule">
                      <label className="flex cursor-pointer items-center justify-between gap-3 py-2.5 text-sm text-ink-soft transition-colors duration-fast ease-out hover:text-ink">
                        <span>{c.title?.[locale]}</span>
                        <input
                          type="checkbox"
                          className="h-4 w-4 shrink-0"
                          checked={selected.includes(c.slug)}
                          onChange={() => toggleCategory(c.slug)}
                        />
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>

              {hasFilters && (
                <button
                  type="button"
                  onClick={() => setParams(new URLSearchParams())}
                  className="self-start text-sm text-accent transition-colors duration-fast ease-out hover:text-accent-deep"
                >
                  {t('clearFilters')}
                </button>
              )}
            </div>
          </aside>

          {/* Catalogue */}
          <div className="lg:col-span-9">
            {status === 'loading' && <p className="text-muted">{t('loading')}</p>}
            {status === 'error' && <p className="text-error">{t('loadError')}</p>}
            {status === 'ready' && courses.length === 0 && <p className="text-muted">{t('empty')}</p>}

            {status === 'ready' && courses.length > 0 && (
              <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {courses.map((c) => (
                  <li key={c._id}>
                    <CourseCard course={c} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
