import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { useAdminLocale } from './AdminLocaleContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Pill from '../components/ui/Pill';
import Pagination from '../components/ui/Pagination';

const LIMIT = 20;
const STATUSES = ['pending', 'accepted', 'rejected', 'completed'];
const TONE = { pending: 'default', accepted: 'saffron', rejected: 'clay', completed: 'success' };

/**
 * The actions that make sense from each status. Each is a target status; the
 * admin confirms it with an optional note the student sees in their account.
 */
const ACTIONS = {
  pending: ['accepted', 'rejected'],
  accepted: ['completed', 'rejected'],
  rejected: ['accepted'],
  completed: ['accepted'],
};

const titleOf = (c, locale) => c?.title?.[locale] || c?.title?.ar || c?.title?.en || c?.code || '';

/**
 * Course registrations: students sign up for a course from their account;
 * here the admin accepts or rejects them, and marks the course done — one
 * student at a time, or everyone accepted onto a course at once. Completing
 * opens the certificate request and the course evaluation in the student's
 * account.
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
  const [open, setOpen] = useState(null); // { id, target, note }
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [bulkCourse, setBulkCourse] = useState('');

  useEffect(() => {
    api.get('/admin/courses', { params: { limit: 100 } }).then(({ data: d }) => setCourses(d.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => setPage(1), [status, course, debouncedQ]);

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

  async function decide() {
    setBusy(true);
    setNotice(null);
    try {
      await api.post(`/admin/course-enrollments/decision/${open.id}`, { status: open.target, adminNote: open.note });
      setNotice({ tone: 'success', text: t(`enrollments.done.${open.target}`) });
      setOpen(null);
      load();
    } catch (err) {
      setNotice({ tone: 'error', text: err.response?.data?.error || t('form.saveFailed') });
    } finally {
      setBusy(false);
    }
  }

  async function completeCourse() {
    const c = courses.find((x) => x._id === bulkCourse);
    if (!c || !window.confirm(t('enrollments.completeConfirm', { course: titleOf(c, locale) }))) return;
    setBusy(true);
    setNotice(null);
    try {
      const { data: d } = await api.post(`/admin/course-enrollments/complete-course/${bulkCourse}`);
      setNotice({ tone: 'success', text: t('enrollments.completedCount', { count: d.data.completed }) });
      load();
    } catch (err) {
      setNotice({ tone: 'error', text: err.response?.data?.error || t('form.saveFailed') });
    } finally {
      setBusy(false);
    }
  }

  const all = STATUSES.reduce((s, k) => s + (data.counts[k] || 0), 0);

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">{t('resource.course-enrollments')}</h1>
        <p className="mt-1 max-w-[70ch] text-sm text-muted">{t('enrollments.intro')}</p>
      </div>

      {/* Marking a course done for everyone accepted onto it. */}
      <section className="mb-6 flex flex-wrap items-end gap-3 rounded-md border border-rule bg-surface p-4">
        <div className="min-w-[16rem] flex-1">
          <Select label={t('enrollments.completeCourse')} value={bulkCourse} onChange={(e) => setBulkCourse(e.target.value)}>
            <option value="">{t('enrollments.chooseCourse')}</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {titleOf(c, locale)}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={completeCourse} disabled={!bulkCourse || busy}>
          {t('enrollments.markCourseDone')}
        </Button>
        <p className="w-full text-xs text-muted">{t('enrollments.completeCourseHint')}</p>
      </section>

      {notice && (
        <p
          className={`mb-5 rounded-sm px-4 py-2 text-sm ${notice.tone === 'error' ? 'bg-error-wash text-error' : 'bg-success-wash text-success'}`}
          role="status"
        >
          {notice.text}
        </p>
      )}

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div className="flex flex-wrap gap-2">
          {[...STATUSES, 'all'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              aria-pressed={status === s}
              className={`flex items-center gap-2 rounded-pill border px-4 py-1.5 text-sm font-medium transition-colors ${
                status === s ? 'border-accent bg-accent text-on-accent' : 'border-rule bg-surface text-ink-soft hover:border-accent hover:text-accent'
              }`}
            >
              {s === 'all' ? t('list.allTypes') : t(`value.status.${s}`)}
              <span className="numerals text-2xs opacity-75">{s === 'all' ? all : data.counts[s] || 0}</span>
            </button>
          ))}
        </div>
        <div className="ms-auto flex flex-wrap items-end gap-3">
          <div className="min-w-[14rem]">
            <Select label={t('field.course')} value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="">{t('enrollments.allCourses')}</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {titleOf(c, locale)}
                </option>
              ))}
            </Select>
          </div>
          <Input label={t('list.search')} placeholder={t('enrollments.searchHint')} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <p className="text-muted">{t('list.loading')}</p>
      ) : data.items.length === 0 ? (
        <div className="rounded-sm border border-rule bg-surface p-10 text-center">
          <p className="font-medium text-ink">{t('enrollments.empty')}</p>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {data.items.map((e) => {
              const isOpen = open?.id === e._id;
              // A completed registration with a certificate request or an
              // evaluation can no longer be taken back.
              const locked = e.status === 'completed' && (e.certificateRequest || e.feedback);
              return (
                <li key={e._id} className="rounded-md border border-rule bg-surface p-4">
                  <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
                    <div className="min-w-[12rem] flex-1">
                      <p className="font-medium text-ink">{e.user?.name || '—'}</p>
                      <p dir="ltr" className="text-sm text-muted text-start">{e.user?.email}</p>
                    </div>
                    <div className="min-w-[14rem] flex-[2]">
                      <p className="text-sm text-ink">{titleOf(e.course, locale) || t('value.source.missing')}</p>
                      <p className="text-xs text-muted">
                        {t('enrollments.registeredOn', {
                          date: new Date(e.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { dateStyle: 'medium' }),
                        })}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone={TONE[e.status]}>{t(`value.status.${e.status}`)}</Pill>
                      {e.certificateRequest && (
                        <Pill tone={e.certificateRequest.status === 'issued' ? 'success' : 'default'}>
                          {e.certificateRequest.certificate?.number || t('enrollments.certRequested')}
                        </Pill>
                      )}
                      {e.feedback && (
                        <Pill tone="saffron">
                          {t('enrollments.rated')}
                          {typeof e.feedback.score === 'number' ? ` · ${e.feedback.score.toFixed(1)}★` : ''}
                        </Pill>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {!locked &&
                        ACTIONS[e.status].map((target) => (
                          <Button
                            key={target}
                            size="sm"
                            variant={target === 'rejected' ? 'ghost' : target === 'accepted' && e.status !== 'pending' ? 'secondary' : 'primary'}
                            onClick={() => setOpen({ id: e._id, target, note: e.adminNote || '' })}
                          >
                            {t(`enrollments.action.${e.status === 'completed' ? 'reopen' : target}`)}
                          </Button>
                        ))}
                    </div>
                  </div>

                  {e.message && (
                    <p className="mt-3 whitespace-pre-line rounded-sm bg-sunk px-3 py-2 text-sm text-ink-soft">
                      <span className="me-1 text-2xs caps-label text-muted">{t('enrollments.studentMessage')}</span>
                      {e.message}
                    </p>
                  )}
                  {e.adminNote && !isOpen && (
                    <p className="mt-2 text-sm text-muted">
                      <span className="me-1 text-2xs caps-label">{t('enrollments.yourNote')}</span>
                      {e.adminNote}
                    </p>
                  )}

                  {isOpen && (
                    <div className="mt-4 flex flex-col gap-3 border-t border-rule pt-4">
                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs caps-label text-muted">{t('enrollments.noteLabel')}</span>
                        <textarea
                          rows={2}
                          maxLength={1000}
                          value={open.note}
                          onChange={(ev) => setOpen({ ...open, note: ev.target.value })}
                          placeholder={t('enrollments.notePlaceholder')}
                          className="w-full rounded-md border border-rule bg-bg px-3.5 py-2.5 text-sm text-ink focus-visible:border-accent"
                        />
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" onClick={decide} disabled={busy}>
                          {busy ? t('list.working') : t(`enrollments.confirm.${e.status === 'completed' ? 'reopen' : open.target}`)}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setOpen(null)}>
                          {t('enrollments.cancel')}
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <Pagination page={page} limit={LIMIT} total={data.total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
