import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Section from '../../components/ui/Section';
import SEO from '../../components/SEO';

export default function Register() {
  const { locale } = useLocale();
  const { register } = useAuth();
  const navigate = useNavigate();
  const prefix = locale === 'en' ? '/en' : '';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...form, locale });
      navigate(`${prefix}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.error || (locale === 'ar' ? 'فشل إنشاء الحساب' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section>
      <SEO
        title={locale === 'ar' ? 'إنشاء حساب | أبسط' : 'Create Account | ABCET'}
        description={locale === 'ar' ? 'أنشئ حسابك الجديد' : 'Create your new account'}
        path="/register"
      />
      <div className="max-w-sm mx-auto py-6">
        <h1 className="font-display text-2xl text-ink mb-6">{locale === 'ar' ? 'إنشاء حساب' : 'Create Account'}</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input
            label={locale === 'ar' ? 'الإسم الكامل' : 'Full name'}
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label={locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            label={locale === 'ar' ? 'كلمة المرور' : 'Password'}
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? '…' : (locale === 'ar' ? 'إنشاء الحساب' : 'Create Account')}
          </Button>
        </form>
        <p className="text-sm text-muted mt-4">
          {locale === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
          <Link to={`${prefix}/login`} className="text-accent font-medium">
            {locale === 'ar' ? 'سجل الدخول' : 'Log in'}
          </Link>
        </p>
      </div>
    </Section>
  );
}
