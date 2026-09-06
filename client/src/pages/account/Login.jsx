import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Section from '../../components/ui/Section';
import SEO from '../../components/SEO';

export default function Login() {
  const { t } = useTranslation('common');
  const { locale } = useLocale();
  const { login } = useAuth();
  const navigate = useNavigate();
  const prefix = locale === 'en' ? '/en' : '';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(`${prefix}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.error || (locale === 'ar' ? 'فشل تسجيل الدخول' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section>
      <SEO
        title={locale === 'ar' ? 'تسجيل الدخول | أبسط' : 'Log In | ABCET'}
        description={locale === 'ar' ? 'سجل الدخول إلى حسابك' : 'Log in to your account'}
        path="/login"
      />
      <div className="max-w-sm mx-auto py-6">
        <h1 className="font-display text-2xl text-ink mb-6">{t('brand') && (locale === 'ar' ? 'تسجيل الدخول' : 'Log In')}</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input
            label={t('email')}
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            label={locale === 'ar' ? 'كلمة المرور' : 'Password'}
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
          {error && <p className="text-sm text-clay">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? '…' : (locale === 'ar' ? 'دخول' : 'Log In')}
          </Button>
        </form>
        <p className="text-sm text-sage mt-4">
          {locale === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
          <Link to={`${prefix}/register`} className="text-saffron-deep font-medium">
            {locale === 'ar' ? 'أنشئ حسابا' : 'Create one'}
          </Link>
        </p>
      </div>
    </Section>
  );
}
