import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { useAdminLocale } from './AdminLocaleContext';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Pill from '../components/ui/Pill';
import Modal from '../components/ui/Modal';
import Avatar from '../components/ui/Avatar';
import Pagination from '../components/ui/Pagination';

const LIMIT = 20;
const STATUSES = ['pending', 'accepted', 'rejected', 'completed'];
const TONE = { pending: 'default', accepted: 'saffron', rejected: 'clay', completed: 'success' };

/** Each status's accent: a top rule on its card, and a dot beside its name. */
const ACCENT = {
  pending: 'bg-warning',
  accepted: 'bg-accent',
  rejected: 'bg-error',
  completed: 'bg-success',
};

/** The moves that make sense from each status. */
const ACTIONS = {
  pending: ['accepted', 'rejected'],
  accepted: ['completed', 'rejected'],
  rejected: ['accepted'],
  completed: ['accepted'],
};

const titleOf = (c, locale) => c?.title?.[locale] || c?.title?.ar || c?.title?.en || c?.code || '';
const dateOf = (d, locale, opts = { dateStyle: 'medium' }) =>
  d ? new Date(d).toLocaleDateString(locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB', opts) : '';

/** "3 days ago" in the panel's language. */
function ago(d, locale) {
  if (!d) return '';
  const days = Math.round((Date.now() - new Date(d).getTime()) / 86400000);
  const rtf = new Intl.RelativeTimeFormat(locale === 'ar' ? 'ar-u-nu-latn' : 'en', { numeric: 'auto' });
  if (Math.abs(days) < 1) return rtf.format(0, 'day');
  if (Math.abs(days) < 30) return rtf.format(-days, 'day');
  if (Math.abs(days) < 365) return rtf.format(-Math.round(days / 30), 'month');
  return rtf.format(-Math.round(days / 365), 'year');
}

/** Whether a registration can still be moved: a completion that was used can't. */
const lockedOf = (e) => e.status === 'completed' && (e.certificateRequest || e.feedback);

function Icon({ d, className = 'h-[1rem] w-[1rem]' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const ICONS = {
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35',
  chevron: 'M6 9l6 6 6-6',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  flag: 'M4 22V4a1 1 0 011-1h11l-1.5 4L16 11H5',
  undo: 'M3 7v6h6M3.5 13A9 9 0 1012 3a9 9 0 00-6.4 2.6L3 8',
  award: 'M12 15a7 7 0 100-14 7 7 0 000 14zM8.2 13.9L7 23l5-3 5 3-1.2-9.1',
  star: 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z',
  message: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
};
const ACTION_ICON = { accepted: ICONS.check, rejected: ICONS.x, completed: ICONS.flag, reopen: ICONS.undo };

// ---------------------------------------------------------------------------
// Decision dialog
// ---------------------------------------------------------------------------

/**
 * Confirms a decision for one registration or several. It says exactly who
 * and what, shows the student's own message, and takes a note — with a few
 * ready-made ones to click in — that the student sees in their account.
 */
function DecisionDialog({ decision, onClose, onDone }) {
  const { t } = useTranslation('admin');
  const { locale } = useAdminLocale();
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setNote(decision?.items.length === 1 ? decision.items[0].adminNote || '' : '');
    setError('');
  }, [decision]);

  if (!decision) return <Modal open={false} onClose={onClose} />;
  const { items, target } = decision;
  const single = items.length === 1 ? items[0] : null;
  const kind = single?.status === 'completed' ? 'reopen' : target;
  const presets = t(`enrollments.presets.${target}`, { returnObjects: true });

  async function confirm() {
    setBusy(true);
    setError('');
    try {
      if (single) {
        await api.post(`/admin/course-enrollments/decision/${single._id}`, { status: target, adminNote: note });
        onDone({ tone: 'success', text: t(`enrollments.done.${target}`) });
      } else {
        const { data } = await api.post('/admin/course-enrollments/bulk-decision', {
          ids: items.map((e) => e._id),
          status: target,
          adminNote: note,
        });
        const { updated, skipped } = data.data;
        onDone({
          tone: skipped.length ? 'warning' : 'success',
          text: skipped.length
            ? t('enrollments.bulkPartial', { updated, skipped: skipped.length })
            : t('enrollments.bulkDone', { count: updated }),
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || t('form.saveFailed'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={t(`enrollments.dialog.${kind}`, { count: items.length })}>
      <div className="flex flex-col gap-5">
        {/* Who and what */}
        {single ? (
          <div className="flex items-center gap-3 rounded-md border border-rule bg-sunk p-3.5">
            <Avatar name={single.user?.name || ''} className="h-[2.75rem] w-[2.75rem] text-sm" rounded="rounded-full" />
            <div className="min-w-0">
              <p className="font-medium text-ink">{single.user?.name}</p>
              <p dir="ltr" className="truncate text-xs text-muted text-start">{single.user?.email}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{titleOf(single.course, locale)}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-rule bg-sunk p-3.5">
            <p className="text-sm text-ink">{t('enrollments.dialog.bulkSummary', { count: items.length })}</p>
            <p className="mt-1 line-clamp-2 text-xs text-muted">
              {items.slice(0, 6).map((e) => e.user?.name).join('، ')}
              {items.length > 6 ? ` +${items.length - 6}` : ''}
            </p>
          </div>
        )}

        {single?.message && (
          <blockquote className="border-s-4 border-accent ps-3.5 text-sm italic text-ink-soft">
            <span className="mb-1 block text-2xs not-italic caps-label text-muted">{t('enrollments.studentMessage')}</span>
            {single.message}
          </blockquote>
        )}

        <p className="text-sm text-ink-soft">{t(`enrollments.explain.${kind}`)}</p>

        {/* The note */}
        <div className="flex flex-col gap-2">
          <label htmlFor="decision-note" className="text-xs caps-label text-muted">
            {t('enrollments.noteLabel')}
          </label>
          {Array.isArray(presets) && presets.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNote((n) => (n ? `${n}\n${p}` : p))}
                  className="rounded-pill border border-rule px-3 py-1 text-xs text-ink-soft transition-colors hover:border-accent hover:text-accent"
                >
                  + {p}
                </button>
              ))}
            </div>
          )}
          <textarea
            id="decision-note"
            rows={3}
            maxLength={1000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('enrollments.notePlaceholder')}
            className="w-full rounded-md border border-rule bg-bg px-3.5 py-2.5 text-sm text-ink transition-colors focus-visible:border-accent"
          />
          <p className="flex justify-between gap-3 text-2xs text-muted">
            <span>{t('enrollments.noteHint')}</span>
            <span className="numerals shrink-0">{note.length}/1000</span>
          </p>
        </div>

        {error && (
          <p className="rounded-sm bg-error-wash px-4 py-2 text-sm text-error" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-2 border-t border-rule pt-4">
          <Button variant="ghost" onClick={onClose}>
            {t('enrollments.cancel')}
          </Button>
          <Button variant={target === 'rejected' ? 'danger' : 'primary'} onClick={confirm} disabled={busy}>
            <Icon d={ACTION_ICON[kind]} />
            {busy ? t('list.working') : t(`enrollments.confirm.${kind}`)}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Completing a whole course
// ---------------------------------------------------------------------------

function CompleteCourseDialog({ open, courses, onClose, onDone }) {
  const { t } = useTranslation('admin');
  const { locale } = useAdminLocale();
  const [course, setCourse] = useState('');
  const [accepted, setAccepted] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setCourse('');
      setAccepted(null);
      setError('');
    }
  }, [open]);

  // How many students this will affect, before the admin commits.
  useEffect(() => {
    if (!course) {
      setAccepted(null);
      return;
    }
    setAccepted(undefined);
    api
      .get('/admin/course-enrollments', { params: { course, status: 'accepted', limit: 1 } })
      .then(({ data }) => setAccepted(data.meta?.total || 0))
      .catch(() => setAccepted(null));
  }, [course]);

  async function confirm() {
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post(`/admin/course-enrollments/complete-course/${course}`);
      onDone({ tone: 'success', text: t('enrollments.completedCount', { count: data.data.completed }) });
    } catch (err) {
      setError(err.response?.data?.error || t('form.saveFailed'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t('enrollments.completeCourse')}>
      <div className="flex flex-col gap-5">
        <p className="text-sm text-ink-soft">{t('enrollments.completeCourseHint')}</p>
        <Select label={t('field.course')} value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="">{t('enrollments.chooseCourse')}</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {titleOf(c, locale)}
            </option>
          ))}
        </Select>

        {course && (
          <div
            className={`flex items-center gap-3 rounded-md border p-4 ${
              accepted ? 'border-[color-mix(in_srgb,var(--c-success)_40%,transparent)] bg-success-wash' : 'border-rule bg-sunk'
            }`}
          >
            <span className="numerals font-display text-3xl text-ink">{accepted === undefined ? '…' : accepted ?? '—'}</span>
            <span className="text-sm text-ink-soft">
              {accepted === 0 ? t('enrollments.noneAccepted') : t('enrollments.willComplete', { count: accepted || 0 })}
            </span>
          </div>
        )}

        {error && (
          <p className="rounded-sm bg-error-wash px-4 py-2 text-sm text-error" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-2 border-t border-rule pt-4">
          <Button variant="ghost" onClick={onClose}>
            {t('enrollments.cancel')}
          </Button>
          <Button onClick={confirm} disabled={!course || !accepted || busy}>
            <Icon d={ICONS.flag} />
            {busy ? t('list.working') : t('enrollments.markCourseDone')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// A row's details
// ---------------------------------------------------------------------------

function Details({ e }) {
  const { t } = useTranslation('admin');
  const { locale } = useAdminLocale();
  const steps = [
    { key: 'registered', at: e.createdAt, done: true },
    {
      key: e.status === 'rejected' ? 'rejected' : 'accepted',
      at: e.decidedAt,
      done: !!e.decidedAt,
      bad: e.status === 'rejected',
    },
    { key: 'completed', at: e.completedAt, done: e.status === 'completed' },
  ];
  return (
    <div className="grid gap-5 border-t border-rule bg-sunk px-5 py-5 md:grid-cols-3">
      {/* Timeline */}
      <ol className="flex flex-col gap-3">
        {steps.map((s) => (
          <li key={s.key} className="flex items-start gap-3">
            <span
              className={`mt-1 h-[0.625rem] w-[0.625rem] shrink-0 rounded-full ${
                s.bad ? 'bg-error' : s.done ? 'bg-success' : 'border border-rule-strong'
              }`}
            />
            <span className="text-sm">
              <span className={s.done ? 'text-ink' : 'text-muted'}>{t(`enrollments.timeline.${s.key}`)}</span>
              {s.at && <span className="block text-xs text-muted">{dateOf(s.at, locale, { dateStyle: 'long' })}</span>}
            </span>
          </li>
        ))}
      </ol>

      {/* Words exchanged */}
      <div className="flex flex-col gap-3">
        <div>
          <p className="mb-1 text-2xs caps-label text-muted">{t('enrollments.studentMessage')}</p>
          <p className="whitespace-pre-line text-sm text-ink-soft">{e.message || '—'}</p>
        </div>
        <div>
          <p className="mb-1 text-2xs caps-label text-muted">{t('enrollments.yourNote')}</p>
          <p className="whitespace-pre-line text-sm text-ink-soft">{e.adminNote || '—'}</p>
        </div>
      </div>

      {/* The answers to the course's own registration fields. */}
      {Object.keys(e.answers || {}).length > 0 && (
        <dl className="grid gap-x-6 gap-y-3 rounded-md border border-rule bg-surface p-4 sm:grid-cols-2 md:order-last md:col-span-3">
          {Object.entries(e.answers).map(([name, value]) => {
            const field = (e.course?.formFields || []).find((f) => f.name === name);
            const option = field?.options?.find((o) => o.value === value);
            const label = field?.label?.[locale] || field?.label?.ar || name;
            const shown =
              field?.type === 'checkbox' ? t('yes') : option ? option.label?.[locale] || option.label?.ar || value : value;
            return (
              <div key={name}>
                <dt className="text-2xs caps-label text-muted">{label}</dt>
                {/* Numbers, emails and Latin text read left to right even in Arabic. */}
                <dd dir={/[\u0600-\u06FF]/.test(shown) ? undefined : 'ltr'} className="whitespace-pre-line text-sm text-ink text-start">
                  {shown}
                </dd>
              </div>
            );
          })}
        </dl>
      )}

      {/* After completion */}
      <div className="flex flex-col gap-3">
        <div>
          <p className="mb-1 text-2xs caps-label text-muted">{t('enrollments.certificate')}</p>
          <p className="text-sm text-ink-soft">
            {e.certificateRequest
              ? e.certificateRequest.certificate?.number
                ? t('enrollments.certIssued', { number: e.certificateRequest.certificate.number })
                : t('enrollments.certPending')
              : e.status === 'completed'
                ? t('enrollments.certNotYet')
                : '—'}
          </p>
        </div>
        <div>
          <p className="mb-1 text-2xs caps-label text-muted">{t('enrollments.rating')}</p>
          <p className="text-sm text-ink-soft">
            {e.feedback
              ? typeof e.feedback.score === 'number'
                ? t('enrollments.ratedScore', { score: e.feedback.score.toFixed(1) })
                : t('enrollments.rated')
              : e.status === 'completed'
                ? t('enrollments.notRatedYet')
                : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/**
 * Course registrations: students sign up for a course from their account;
 * here the admin accepts or rejects them, and marks the course done — one
 * student, a selection, or everyone accepted onto a course at once.
 * Completing opens the certificate request and the course evaluation in the
 * student's account.
 */
export default function AdminCourseEnrollments() {
  const { t } = useTranslation('admin');
  const { locale } = useAdminLocale();

  const [status, setStatus] = useState('pending');
  const [course, setCourse] = useState('');
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, counts: {} });
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [expanded, setExpanded] = useState(null);
  const [decision, setDecision] = useState(null); // { items, target }
  const [completeOpen, setCompleteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get('/admin/courses', { params: { limit: 100 } }).then(({ data: d }) => setCourses(d.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [status, course, debouncedQ]);

  // Toasts fade on their own.
  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(id);
  }, [toast]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: d } = await api.get('/admin/course-enrollments', {
        params: { page, limit: LIMIT, status: status === 'all' ? undefined : status, course: course || undefined, q: debouncedQ || undefined },
      });
      setData({ items: d.data || [], total: d.meta?.total || 0, counts: d.meta?.counts || {} });
    } finally {
      setLoading(false);
    }
  }, [page, status, course, debouncedQ]);

  useEffect(() => {
    load();
  }, [load]);

  function finish(result) {
    setDecision(null);
    setCompleteOpen(false);
    setSelected(new Set());
    setToast(result);
    load();
  }

  const all = STATUSES.reduce((s, k) => s + (data.counts[k] || 0), 0);
  const selectable = data.items.filter((e) => !lockedOf(e));
  const chosen = data.items.filter((e) => selected.has(e._id));
  // Bulk actions offered are those every selected registration allows.
  const bulkTargets = useMemo(() => {
    if (!chosen.length) return [];
    // The forward move leads; rejecting always comes last.
    return ['accepted', 'completed', 'rejected'].filter((target) =>
      chosen.every((e) => ACTIONS[e.status].includes(target) && e.status !== 'completed')
    );
  }, [chosen]);
  const filtered = course || debouncedQ;

  const toggle = (id) =>
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const allChecked = selectable.length > 0 && selectable.every((e) => selected.has(e._id));

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{t('resource.course-enrollments')}</h1>
          <p className="mt-1 max-w-[64ch] text-sm text-muted">{t('enrollments.introShort')}</p>
        </div>
        <Button variant="secondary" onClick={() => setCompleteOpen(true)}>
          <Icon d={ICONS.flag} />
          {t('enrollments.completeCourse')}
        </Button>
      </div>

      {/* Status cards — also the filter */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            aria-pressed={status === s}
            className={`relative overflow-hidden rounded-md border bg-surface p-4 text-start transition-all ${
              status === s ? 'border-accent shadow-raised ring-1 ring-accent' : 'border-rule hover:border-rule-strong'
            }`}
          >
            <span className={`absolute inset-x-0 top-0 h-[3px] ${ACCENT[s]}`} aria-hidden="true" />
            <span className="block text-xs text-muted">{t(`enrollments.statusCard.${s}`)}</span>
            <span className="numerals mt-1 block font-display text-3xl leading-none text-ink">{data.counts[s] || 0}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-md border border-rule bg-surface p-3">
        <label className="relative min-w-[14rem] flex-1">
          <span className="sr-only">{t('list.search')}</span>
          <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-muted">
            <Icon d={ICONS.search} />
          </span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('enrollments.searchHint')}
            className="w-full rounded-md border border-rule bg-bg py-2 pe-3 ps-9 text-sm text-ink transition-colors focus-visible:border-accent"
          />
        </label>
        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          aria-label={t('field.course')}
          className="min-w-[14rem] max-w-full rounded-md border border-rule bg-bg px-3 py-2 text-sm text-ink focus-visible:border-accent"
        >
          <option value="">{t('enrollments.allCourses')}</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {titleOf(c, locale)}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setStatus('all')}
          aria-pressed={status === 'all'}
          className={`rounded-md border px-3 py-2 text-sm transition-colors ${
            status === 'all' ? 'border-accent text-accent' : 'border-rule text-ink-soft hover:border-accent'
          }`}
        >
          {t('enrollments.showAll')} <span className="numerals text-xs opacity-70">{all}</span>
        </button>
        {filtered && (
          <button type="button" onClick={() => { setQ(''); setCourse(''); }} className="text-sm text-accent hover:underline">
            {t('enrollments.clearFilters')}
          </button>
        )}
        <span className="ms-auto text-xs text-muted">{t('enrollments.resultCount', { count: data.total })}</span>
      </div>

      {/* Bulk bar */}
      {chosen.length > 0 && (
        <div className="sticky top-16 z-20 mb-4 flex flex-wrap items-center gap-3 rounded-md border border-accent bg-accent-wash px-4 py-3 shadow-raised">
          <span className="text-sm font-medium text-ink">{t('enrollments.selected', { count: chosen.length })}</span>
          <div className="flex flex-wrap gap-2">
            {bulkTargets.map((target) => (
              <Button key={target} size="sm" variant={target === 'rejected' ? 'ghost' : 'primary'} onClick={() => setDecision({ items: chosen, target })}>
                <Icon d={ACTION_ICON[target]} />
                {t(`enrollments.action.${target}`)}
              </Button>
            ))}
            {!bulkTargets.length && <span className="text-xs text-muted">{t('enrollments.noCommonAction')}</span>}
          </div>
          <button type="button" onClick={() => setSelected(new Set())} className="ms-auto text-sm text-accent hover:underline">
            {t('enrollments.clearSelection')}
          </button>
        </div>
      )}

      {/* The list */}
      {loading && !data.items.length ? (
        <p className="py-7 text-center text-muted">{t('list.loading')}</p>
      ) : data.items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-rule bg-surface px-6 py-14 text-center">
          <span className="text-muted">
            <Icon d={ICONS.message} className="h-[2rem] w-[2rem]" />
          </span>
          <p className="font-medium text-ink">{t(`enrollments.emptyState.${filtered ? 'filtered' : status}`)}</p>
        </div>
      ) : (
        <div className={`overflow-hidden rounded-md border border-rule bg-surface transition-opacity ${loading ? 'opacity-60' : ''}`}>
          <table className="w-full border-collapse text-sm">
            <thead className="hidden bg-sunk text-2xs caps-label text-muted md:table-header-group">
              <tr>
                <th className="w-[2.75rem] px-4 py-3 text-start">
                  <input
                    type="checkbox"
                    className="h-[1rem] w-[1rem] align-middle"
                    checked={allChecked}
                    onChange={() => setSelected(allChecked ? new Set() : new Set(selectable.map((e) => e._id)))}
                    aria-label={t('enrollments.selectAll')}
                  />
                </th>
                <th className="px-3 py-3 text-start font-medium">{t('enrollments.col.student')}</th>
                <th className="px-3 py-3 text-start font-medium">{t('field.course')}</th>
                <th className="px-3 py-3 text-start font-medium">{t('enrollments.col.registered')}</th>
                <th className="px-3 py-3 text-start font-medium">{t('field.status')}</th>
                <th className="px-4 py-3 text-end font-medium">{t('list.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((e) => {
                const locked = lockedOf(e);
                const open = expanded === e._id;
                return (
                  <Fragment key={e._id}>
                    <tr className={`border-t border-rule align-middle transition-colors ${selected.has(e._id) ? 'bg-accent-wash' : 'hover:bg-sunk'} max-md:flex max-md:flex-wrap max-md:items-center max-md:gap-x-3 max-md:gap-y-2 max-md:px-4 max-md:py-3`}>
                      <td className="px-4 py-3 max-md:p-0">
                        <input
                          type="checkbox"
                          className="h-[1rem] w-[1rem] align-middle disabled:opacity-30"
                          checked={selected.has(e._id)}
                          disabled={!!locked}
                          onChange={() => toggle(e._id)}
                          aria-label={e.user?.name}
                        />
                      </td>
                      <td className="px-3 py-3 max-md:flex-1 max-md:p-0">
                        <div className="flex items-center gap-3">
                          <Avatar name={e.user?.name || ''} className="h-[2.25rem] w-[2.25rem] text-xs" rounded="rounded-full" />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-ink">{e.user?.name || '—'}</p>
                            <p dir="ltr" className="truncate text-xs text-muted text-start">{e.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 max-md:w-full max-md:p-0">
                        <p className="text-ink">{titleOf(e.course, locale) || t('value.source.missing')}</p>
                        <p className="flex items-center gap-2 text-xs text-muted">
                          {e.course?.code && <span>{e.course.code}</span>}
                          {e.message && (
                            <span className="inline-flex items-center gap-1 text-accent" title={e.message}>
                              <Icon d={ICONS.message} className="h-[0.8rem] w-[0.8rem]" />
                              {t('enrollments.hasMessage')}
                            </span>
                          )}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-ink-soft max-md:p-0">
                        <span title={dateOf(e.createdAt, locale, { dateStyle: 'long' })}>{ago(e.createdAt, locale)}</span>
                      </td>
                      <td className="px-3 py-3 max-md:p-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Pill tone={TONE[e.status]}>{t(`value.status.${e.status}`)}</Pill>
                          {e.certificateRequest && (
                            <span title={t('enrollments.certificate')} className={e.certificateRequest.certificate ? 'text-success' : 'text-muted'}>
                              <Icon d={ICONS.award} />
                            </span>
                          )}
                          {e.feedback && (
                            <span title={t('enrollments.rating')} className="inline-flex items-center gap-0.5 text-xs text-warning">
                              <Icon d={ICONS.star} className="h-[0.85rem] w-[0.85rem]" />
                              {typeof e.feedback.score === 'number' && e.feedback.score.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-md:ms-auto max-md:p-0">
                        <div className="flex items-center justify-end gap-1.5">
                          {!locked &&
                            ACTIONS[e.status].map((target) => {
                              const kind = e.status === 'completed' ? 'reopen' : target;
                              const primary = (e.status === 'pending' && target === 'accepted') || (e.status === 'accepted' && target === 'completed');
                              return (
                                <button
                                  key={target}
                                  type="button"
                                  onClick={() => setDecision({ items: [e], target })}
                                  title={t(`enrollments.action.${kind}`)}
                                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                    primary
                                      ? 'border-accent bg-accent text-on-accent hover:bg-accent-deep'
                                      : target === 'rejected'
                                        ? 'border-rule text-error hover:border-error hover:bg-error-wash'
                                        : 'border-rule text-ink-soft hover:border-accent hover:text-accent'
                                  }`}
                                >
                                  <Icon d={ACTION_ICON[kind]} className="h-[0.85rem] w-[0.85rem]" />
                                  <span className="max-lg:sr-only">{t(`enrollments.action.${kind}`)}</span>
                                </button>
                              );
                            })}
                          <button
                            type="button"
                            onClick={() => setExpanded(open ? null : e._id)}
                            aria-expanded={open}
                            aria-label={t('enrollments.details')}
                            title={t('enrollments.details')}
                            className="rounded-md border border-rule p-1.5 text-muted transition-colors hover:border-accent hover:text-accent"
                          >
                            <Icon d={ICONS.chevron} className={`h-[0.9rem] w-[0.9rem] transition-transform ${open ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {open && (
                      <tr className="max-md:block">
                        <td colSpan={6} className="p-0 max-md:block">
                          <Details e={e} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} limit={LIMIT} total={data.total} onPageChange={setPage} />

      <DecisionDialog decision={decision} onClose={() => setDecision(null)} onDone={finish} />
      <CompleteCourseDialog open={completeOpen} courses={courses} onClose={() => setCompleteOpen(false)} onDone={finish} />

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 end-5 z-50 flex max-w-sm items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-overlay ${
            toast.tone === 'error'
              ? 'border-[color-mix(in_srgb,var(--c-error)_40%,transparent)] bg-error-wash text-error'
              : toast.tone === 'warning'
                ? 'border-[color-mix(in_srgb,var(--c-warning)_40%,transparent)] bg-surface text-ink'
                : 'border-[color-mix(in_srgb,var(--c-success)_40%,transparent)] bg-success-wash text-success'
          }`}
        >
          <Icon d={toast.tone === 'error' ? ICONS.x : ICONS.check} className="mt-0.5 h-[1rem] w-[1rem] shrink-0" />
          <span className="flex-1">{toast.text}</span>
          <button type="button" onClick={() => setToast(null)} aria-label={t('enrollments.cancel')} className="opacity-60 hover:opacity-100">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
