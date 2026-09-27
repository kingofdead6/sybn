import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import Section from '../../components/ui/Section';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Pill from '../../components/ui/Pill';
import SEO from '../../components/SEO';
import { ENROLLMENT_TONE } from '../../components/courses/EnrollmentPanel';

const STEPS = ['registered', 'accepted', 'completed', 'certificate'];

/** How far along a registration is, as a count of steps done (0–4). */
function progressOf(e) {
  if (e.status === 'rejected') return 1;
  if (e.certificateRequest?.status === 'issued') return 4;
  return { pending: 1, accepted: 2, completed: 3 }[e.status] || 1;
}

function StepTracker({ enrollment }) {
  const { t } = useTranslation('courses');
  const done = progressOf(enrollment);
  const rejected = enrollment.status === 'rejected';
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label={t(`status.${enrollment.status}`)}>
      {STEPS.map((step, i) => {
        const reached = i < done;
        const failed = rejected && i === 1;
        return (
          <li key={step} className="flex flex-col gap-1.5">
            <span
              className={`h-1.5 rounded-pill ${
                failed ? 'bg-error' : reached ? 'bg-success' : 'bg-[color-mix(in_srgb,var(--c-ink)_12%,transparent)]'
              }`}
            />
            <span className={`text-2xs ${reached || failed ? 'text-ink' : 'text-muted'}`}>
              {failed ? t('status.rejected') : t(`steps.${step}`)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// Evaluation
// ---------------------------------------------------------------------------

function StarInput({ value, onChange, label }) {
  const { t } = useTranslation('courses');
  const [hover, setHover] = useState(0);
  const shown = hover || value || 0;
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label={label} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={t('feedback.stars', { n })}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className={`rounded-sm p-0.5 transition-transform duration-fast hover:scale-110 ${n <= shown ? 'text-warning' : 'text-muted'}`}
        >
          <svg viewBox="0 0 20 20" className="h-[1.75rem] w-[1.75rem]" aria-hidden="true">
            <path
              d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.51L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.81L10 1.6z"
              fill={n <= shown ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
      {value > 0 && <span className="ms-2 text-sm text-muted numerals">{t('feedback.stars', { n: value })}</span>}
    </div>
  );
}

function FeedbackForm({ enrollment, onDone }) {
  const { t } = useTranslation('courses');
  const { locale } = useLocale();
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [missing, setMissing] = useState(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/me/enrollments/${enrollment._id}/feedback-form`)
      .then(({ data }) => setQuestions(data.data.questions || []))
      .catch(() => setQuestions([]));
  }, [enrollment._id]);

  const label = (q) => q.label?.[locale] || q.label?.ar || q.label?.en;
  const set = (id, v) => {
    setAnswers((a) => ({ ...a, [id]: v }));
    setMissing((m) => {
      const next = new Set(m);
      next.delete(id);
      return next;
    });
  };

  async function submit(e) {
    e.preventDefault();
    const gaps = new Set(
      questions.filter((q) => q.required && (answers[q._id] === undefined || String(answers[q._id]).trim() === '')).map((q) => q._id)
    );
    setMissing(gaps);
    if (gaps.size) {
      setError(t('feedback.missing'));
      document.getElementById(`q-${[...gaps][0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setBusy(true);
    setError('');
    try {
      await api.post(`/me/enrollments/${enrollment._id}/feedback`, { answers });
      onDone();
    } catch (err) {
      setError(err.response?.data?.error || t('enroll.error'));
    } finally {
      setBusy(false);
    }
  }

  if (questions === null) return <p className="text-sm text-muted">{t('loading')}</p>;
  if (!questions.length) return <p className="text-sm text-muted">{t('feedback.noQuestions')}</p>;

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      {questions.map((q, i) => (
        <fieldset
          key={q._id}
          id={`q-${q._id}`}
          className={`flex flex-col gap-2.5 rounded-md border p-4 transition-colors ${
            missing.has(q._id) ? 'border-error bg-error-wash' : 'border-rule bg-bg'
          }`}
        >
          <legend className="sr-only">{label(q)}</legend>
          <p className="flex items-start gap-2 text-sm font-medium text-ink">
            <span className="numerals text-muted">{i + 1}.</span>
            <span className="flex-1">
              {label(q)}
              {q.required && <span className="ms-1 text-error" aria-label={t('feedback.required')}>*</span>}
            </span>
          </p>
          {(q.help?.[locale] || q.help?.ar) && <p className="-mt-1 text-xs text-muted">{q.help[locale] || q.help.ar}</p>}

          {q.type === 'rating' && <StarInput value={answers[q._id]} onChange={(n) => set(q._id, n)} label={label(q)} />}

          {q.type === 'choice' && (
            <div className="flex flex-wrap gap-2">
              {q.options.map((o, oi) => (
                <label
                  key={oi}
                  className={`cursor-pointer rounded-pill border px-4 py-1.5 text-sm transition-colors ${
                    answers[q._id] === oi ? 'border-accent bg-accent text-on-accent' : 'border-rule text-ink-soft hover:border-accent'
                  }`}
                >
                  <input type="radio" name={q._id} className="sr-only" checked={answers[q._id] === oi} onChange={() => set(q._id, oi)} />
                  {o[locale] || o.ar || o.en}
                </label>
              ))}
            </div>
          )}

          {q.type === 'text' && (
            <textarea
              rows={3}
              maxLength={3000}
              value={answers[q._id] || ''}
              onChange={(e) => set(q._id, e.target.value)}
              placeholder={t('feedback.textPlaceholder')}
              className="w-full rounded-md border border-rule bg-surface px-3.5 py-2.5 text-sm text-ink focus-visible:border-accent"
            />
          )}
        </fieldset>
      ))}

      {error && (
        <p className="rounded-sm bg-error-wash px-4 py-2 text-sm text-error" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy} className="self-start">
        {busy ? t('loading') : t('feedback.submit')}
      </Button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Certificate request
// ---------------------------------------------------------------------------

function CertificateRequest({ enrollment, onDone }) {
  const { t } = useTranslation('courses');
  const { user } = useAuth();
  const [form, setForm] = useState({ fullName: user?.name || '', whatsapp: '', country: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const request = enrollment.certificateRequest;

  if (request) {
    const status = request.status === 'issued' ? 'issued' : request.status === 'rejected' ? 'rejected' : 'pending';
    return (
      <p
        className={`rounded-md px-4 py-3 text-sm ${
          status === 'issued' ? 'bg-success-wash text-success' : status === 'rejected' ? 'bg-error-wash text-error' : 'bg-sunk text-ink-soft'
        }`}
        role="status"
      >
        {t(`certReq.${status}`, { number: request.certificate?.number || '' })}
      </p>
    );
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.fullName.trim() || !form.whatsapp.trim() || !form.country.trim()) {
      setError(t('certReq.required'));
      return;
    }
    setBusy(true);
    setError('');
    try {
      await api.post(`/me/enrollments/${enrollment._id}/certificate-request`, form);
      onDone();
    } catch (err) {
      setError(err.response?.data?.error || t('enroll.error'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <p className="text-sm text-ink-soft">
        {t('certReq.intro', { email: '' })}
        {/* On its own line, so the address never breaks in the middle. */}
        <span dir="ltr" className="mt-0.5 block break-all font-medium text-ink text-start">
          {user?.email}
        </span>
      </p>
      <Input label={t('certReq.name')} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
      <Input label={t('certReq.whatsapp')} dir="ltr" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
      <Input label={t('certReq.country')} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
      {error && (
        <p className="rounded-sm bg-error-wash px-4 py-2 text-sm text-error" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy} className="self-start">
        {busy ? t('loading') : t('certReq.submit')}
      </Button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function EnrollmentCard({ enrollment, onChange }) {
  const { t } = useTranslation('courses');
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const course = enrollment.course || {};
  const completed = enrollment.status === 'completed';
  const date = new Date(enrollment.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <li className="overflow-hidden rounded-lg border border-rule/60 bg-surface shadow-raised">
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {course.code && <p className="text-2xs caps-label text-muted">{course.code}</p>}
            <h2 className="font-display text-lg leading-snug text-ink">
              {course.slug ? (
                <Link to={`${prefix}/courses/${course.slug}`} className="hover:text-accent">
                  {course.title?.[locale] || course.title?.ar}
                </Link>
              ) : (
                course.title?.[locale] || course.title?.ar
              )}
            </h2>
            <p className="mt-1 text-xs text-muted">{t('myCourses.registeredOn', { date })}</p>
          </div>
          <Pill tone={ENROLLMENT_TONE[enrollment.status]}>{t(`status.${enrollment.status}`)}</Pill>
        </div>

        <StepTracker enrollment={enrollment} />

        <p className="text-sm text-ink-soft">{t(`statusText.${enrollment.status}`)}</p>

        {enrollment.adminNote && (
          <div className="rounded-md border-s-4 border-accent bg-accent-wash px-4 py-3">
            <p className="text-2xs caps-label text-muted">{t('adminNote')}</p>
            <p className="mt-1 whitespace-pre-line text-sm text-ink">{enrollment.adminNote}</p>
          </div>
        )}
      </div>

      {/* Once the course is done: the certificate and the evaluation. */}
      {completed && (
        <div className="grid gap-px border-t border-rule bg-rule lg:grid-cols-2">
          <section className="flex flex-col gap-4 bg-surface p-6">
            <h3 className="font-display text-md text-ink">{t('certReq.heading')}</h3>
            <CertificateRequest enrollment={enrollment} onDone={onChange} />
          </section>
          <section className="flex flex-col gap-4 bg-surface p-6">
            <h3 className="font-display text-md text-ink">{t('feedback.heading')}</h3>
            {enrollment.feedback ? (
              <p className="rounded-md bg-success-wash px-4 py-3 text-sm text-success" role="status">
                {t('feedback.thanks')}
              </p>
            ) : (
              <>
                <p className="text-sm text-ink-soft">{t('feedback.intro')}</p>
                <FeedbackForm enrollment={enrollment} onDone={onChange} />
              </>
            )}
          </section>
        </div>
      )}
    </li>
  );
}

export default function DashboardCourses() {
  const { t } = useTranslation('courses');
  const { user, loading: authLoading } = useAuth();
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const [items, setItems] = useState(null);

  const load = useCallback(() => {
    api
      .get('/me/enrollments')
      .then(({ data }) => setItems(data.data || []))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  if (!authLoading && !user) {
    return (
      <Section>
        <p className="text-center text-ink-soft">
          <Link to={`${prefix}/login?next=${encodeURIComponent(`${prefix}/dashboard/courses`)}`} className="font-medium text-accent hover:underline">
            {t('enroll.login')}
          </Link>
        </p>
      </Section>
    );
  }

  return (
    <Section>
      <SEO title={`${t('myCourses.title')} | SIYB`} path="/dashboard/courses" />
      <div className="mb-7 border-b border-rule pb-5">
        <h1 className="font-display text-2xl md:text-3xl leading-tight text-ink">{t('myCourses.title')}</h1>
        <p className="mt-2 max-w-[62ch] text-sm text-muted">{t('myCourses.intro')}</p>
      </div>

      {items === null ? (
        <p className="text-muted">{t('loading')}</p>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-rule bg-surface p-10 text-center">
          <p className="text-ink-soft">{t('myCourses.empty')}</p>
          <Button as={Link} to={`${prefix}/courses`} className="mt-5">
            {t('myCourses.browse')}
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-6">
          {items.map((e) => (
            <EnrollmentCard key={e._id} enrollment={e} onChange={load} />
          ))}
        </ul>
      )}
    </Section>
  );
}
