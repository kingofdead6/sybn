import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import { nextQuery } from '../../lib/nextPath';
import Button from '../ui/Button';
import Pill from '../ui/Pill';

/** A registration's status → the pill tone that reads right for it. */
export const ENROLLMENT_TONE = {
  pending: 'default',
  accepted: 'saffron',
  rejected: 'clay',
  completed: 'success',
};

/**
 * Registering for a course, on the course's own page.
 *
 * A visitor who is signed out is asked to sign in (and brought back here
 * after); a signed-in one registers in one step, then sees where their
 * registration stands — the same status their account's "My courses" shows.
 */
export default function EnrollmentPanel({ course }) {
  const { t } = useTranslation('courses');
  const { user, loading: authLoading } = useAuth();
  const { locale } = useLocale();
  const { pathname } = useLocation();
  const prefix = locale === 'en' ? '/en' : '';

  const [enrollment, setEnrollment] = useState(undefined); // undefined = loading
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setEnrollment(null);
      return undefined;
    }
    let active = true;
    api
      .get(`/me/enrollments/course/${course._id}`)
      .then(({ data }) => active && setEnrollment(data.data))
      .catch(() => active && setEnrollment(null));
    return () => {
      active = false;
    };
  }, [user, course._id]);

  async function register() {
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post('/me/enrollments', { courseId: course._id, message });
      setEnrollment(data.data);
      setMessage('');
    } catch {
      setError(t('enroll.error'));
    } finally {
      setBusy(false);
    }
  }

  async function withdraw() {
    if (!window.confirm(t('enroll.withdrawConfirm'))) return;
    setBusy(true);
    setError('');
    try {
      await api.delete(`/me/enrollments/${enrollment._id}`);
      setEnrollment(null);
    } catch {
      setError(t('enroll.error'));
    } finally {
      setBusy(false);
    }
  }

  const loading = authLoading || enrollment === undefined;
  const status = enrollment?.status;
  const canRegister = user && (!enrollment || status === 'rejected');

  return (
    <div className="rounded-lg border border-rule/60 bg-surface p-6 shadow-raised md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl text-ink">{t('enroll.heading')}</h2>
        {status && <Pill tone={ENROLLMENT_TONE[status]}>{t(`status.${status}`)}</Pill>}
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-muted">{t('loading')}</p>
      ) : !user ? (
        // Signed out: an account is needed, and they come straight back here.
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-ink-soft">{t('enroll.intro')}</p>
          <p className="text-sm font-medium text-ink">{t('enroll.needAccount')}</p>
          <div className="flex flex-wrap gap-3">
            <Button as={Link} to={`${prefix}/login${nextQuery(pathname)}`}>
              {t('enroll.login')}
            </Button>
            <Button as={Link} to={`${prefix}/register${nextQuery(pathname)}`} variant="secondary">
              {t('enroll.createAccount')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-ink-soft">{status ? t(`statusText.${status}`) : t('enroll.intro')}</p>

          {enrollment?.adminNote && (
            <div className="rounded-md border-s-4 border-accent bg-accent-wash px-4 py-3">
              <p className="text-2xs caps-label text-muted">{t('adminNote')}</p>
              <p className="mt-1 whitespace-pre-line text-sm text-ink">{enrollment.adminNote}</p>
            </div>
          )}

          {canRegister && (
            <label className="flex flex-col gap-1.5">
              <span className="text-xs caps-label text-muted">{t('enroll.messageLabel')}</span>
              <textarea
                rows={3}
                value={message}
                maxLength={1000}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('enroll.messagePlaceholder')}
                className="w-full rounded-md border border-rule bg-bg px-3.5 py-2.5 text-sm text-ink transition-colors focus-visible:border-accent"
              />
            </label>
          )}

          {error && (
            <p className="rounded-sm bg-error-wash px-4 py-2 text-sm text-error" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {canRegister && (
              <Button onClick={register} disabled={busy}>
                {busy ? t('loading') : status === 'rejected' ? t('enroll.reapply') : t('enroll.submit')}
              </Button>
            )}
            {status === 'pending' && (
              <Button variant="ghost" onClick={withdraw} disabled={busy}>
                {t('enroll.withdraw')}
              </Button>
            )}
            {status && status !== 'rejected' && (
              <Button as={Link} to={`${prefix}/dashboard/courses`} variant={status === 'completed' ? 'primary' : 'secondary'}>
                {t('enroll.goToMyCourses')}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
