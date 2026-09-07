import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useAdminLocale } from './AdminLocaleContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function AdminLogin() {
  const { login } = useAuth();
  const { t } = useTranslation('admin');
  const { locale, toggleLocale } = useAdminLocale();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== 'admin' && user.role !== 'editor') {
        setError(t('login.noAccess'));
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || t('login.failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={toggleLocale}
            className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-saffron hover:text-saffron-deep"
            aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            {locale === 'ar' ? 'EN' : 'ع'}
          </button>
        </div>

        <form onSubmit={onSubmit} className="rounded-lg border border-line bg-surface p-8 shadow-lg">
          <h1 className="font-display text-xl font-bold text-ink mb-1">{t('brand')}</h1>
          <p className="text-sm text-sage mb-6">{t('login.title')}</p>

          <div className="flex flex-col gap-4">
            <Input
              label={t('login.email')}
              type="email"
              dir="ltr"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
            <Input
              label={t('login.password')}
              type="password"
              dir="ltr"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
            />
            {error && (
              <p className="rounded-lg bg-clay-tint px-4 py-3 text-sm text-clay" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? '…' : t('login.submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
