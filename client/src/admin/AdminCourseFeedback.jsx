import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { useAdminLocale } from './AdminLocaleContext';

const titleOf = (c, locale) => c?.title?.[locale] || c?.title?.ar || c?.title?.en || c?.code || '';
const fmt = (n) => (typeof n === 'number' ? n.toFixed(1) : '—');
const pct = (n, total) => (total ? Math.round((n / total) * 100) : 0);

function Stars({ value }) {
  const full = Math.round(value || 0);
  return (
    <span className="tracking-wider text-warning" aria-hidden="true">
      {'★'.repeat(full)}
      <span className="text-muted">{'★'.repeat(5 - full)}</span>
    </span>
  );
}

/** A horizontal bar: label, bar, count. */
function Bar({ label, count, total, tone = 'bg-accent' }) {
  const p = pct(count, total);
  return (
    <div className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3 text-sm">
      <span className="truncate text-ink-soft">{label}</span>
      <span className="h-2.5 overflow-hidden rounded-pill bg-sunk">
        <span className={`block h-full rounded-pill ${tone}`} style={{ width: `${p}%` }} />
      </span>
      <span className="numerals text-end text-muted">
        {count} <span className="text-2xs">({p}%)</span>
      </span>
    </div>
  );
}

function QuestionResult({ q, locale }) {
  const { t } = useTranslation('admin');
  const label = q.label?.[locale] || q.label?.ar || q.label?.en;
  return (
    <li className="flex flex-col gap-4 rounded-md border border-rule bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-ink">{label}</p>
          <p className="text-xs text-muted">
            {t(`questions.types.${q.type}`)} · {t('results.answers', { count: q.count })}
          </p>
        </div>
        {q.type === 'rating' && (
          <p className="flex items-center gap-2">
            <span className="numerals font-display text-2xl text-ink">{fmt(q.average)}</span>
            <Stars value={q.average} />
          </p>
        )}
      </div>

      {q.type === 'rating' && (
        <div className="flex flex-col gap-1.5">
          {[5, 4, 3, 2, 1].map((n) => (
            <Bar key={n} label={`${n} ★`} count={q.distribution[n - 1]} total={q.count} tone="bg-warning" />
          ))}
        </div>
      )}

      {q.type === 'choice' && (
        <div className="flex flex-col gap-1.5">
          {q.choices.map((c) => (
            <Bar key={c.index} label={c.label?.[locale] || c.label?.ar} count={c.count} total={q.count} />
          ))}
        </div>
      )}

      {q.type === 'text' && (
        <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
          {q.texts.length === 0 && <li className="text-sm text-muted">—</li>}
          {q.texts.map((a, i) => (
            <li key={i} className="rounded-sm bg-sunk px-3 py-2 text-sm">
              <p className="whitespace-pre-line text-ink">{a.text}</p>
              <p className="mt-1 text-2xs text-muted">
                {a.name} · {new Date(a.at).toLocaleDateString(locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { dateStyle: 'medium' })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * Course evaluation results: which courses have been rated and how, then one
 * course in full — its average, and each question's answers summarised.
 */
export default function AdminCourseFeedback() {
  const { t } = useTranslation('admin');
  const { locale } = useAdminLocale();
  const [overview, setOverview] = useState(null);
  const [selected, setSelected] = useState('');
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api
      .get('/admin/course-feedback/overview')
      .then(({ data }) => {
        const rows = (data.data || []).filter((r) => r.course);
        setOverview(rows);
        if (rows[0]) setSelected(rows[0].course._id);
      })
      .catch(() => setOverview([]));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setSummary(null);
    api
      .get(`/admin/course-feedback/summary/${selected}`)
      .then(({ data }) => setSummary(data.data))
      .catch(() => setSummary(false));
  }, [selected]);

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">{t('resource.course-feedback')}</h1>
        <p className="mt-1 max-w-[70ch] text-sm text-muted">{t('results.intro')}</p>
      </div>

      {overview === null ? (
        <p className="text-muted">{t('list.loading')}</p>
      ) : overview.length === 0 ? (
        <div className="rounded-sm border border-rule bg-surface p-10 text-center">
          <p className="font-medium text-ink">{t('results.empty')}</p>
          <p className="mt-1 text-sm text-muted">{t('results.emptyHint')}</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          {/* Courses with evaluations */}
          <ul className="flex flex-col gap-2 lg:sticky lg:top-20 lg:self-start">
            {overview.map((r) => (
              <li key={r.course._id}>
                <button
                  type="button"
                  onClick={() => setSelected(r.course._id)}
                  className={`flex w-full flex-col gap-1 rounded-md border p-3 text-start transition-colors ${
                    selected === r.course._id ? 'border-accent bg-accent-wash' : 'border-rule bg-surface hover:border-accent'
                  }`}
                >
                  <span className="text-sm font-medium text-ink">{titleOf(r.course, locale)}</span>
                  <span className="flex items-center gap-2 text-xs text-muted">
                    <Stars value={r.average} />
                    <span className="numerals">{fmt(r.average)}</span>·<span>{t('results.responses', { count: r.responses })}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* One course in full */}
          <div>
            {summary === null ? (
              <p className="text-muted">{t('list.loading')}</p>
            ) : summary === false ? (
              <p className="text-error">{t('form.loadFailed')}</p>
            ) : (
              <>
                <div className="mb-5 grid gap-px overflow-hidden rounded-md border border-rule bg-rule sm:grid-cols-3">
                  <div className="bg-surface p-5">
                    <p className="text-2xs caps-label text-muted">{t('results.responsesLabel')}</p>
                    <p className="numerals mt-1 font-display text-3xl text-ink">{summary.responses}</p>
                  </div>
                  <div className="bg-surface p-5">
                    <p className="text-2xs caps-label text-muted">{t('results.average')}</p>
                    <p className="mt-1 flex items-center gap-2">
                      <span className="numerals font-display text-3xl text-ink">{fmt(summary.average)}</span>
                      <Stars value={summary.average} />
                    </p>
                  </div>
                  <div className="bg-surface p-5">
                    <p className="text-2xs caps-label text-muted">{t('results.cardRating')}</p>
                    <p className="numerals mt-1 font-display text-3xl text-ink">{fmt(summary.course.rating)}</p>
                    <p className="text-xs text-muted">{t('results.cardRatingHint')}</p>
                  </div>
                </div>
                <ol className="flex flex-col gap-4">
                  {summary.questions.map((q) => (
                    <QuestionResult key={String(q.question || q.label?.ar)} q={q} locale={locale} />
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
