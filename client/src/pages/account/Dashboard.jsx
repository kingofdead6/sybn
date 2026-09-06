import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import Section from '../../components/ui/Section';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SEO from '../../components/SEO';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  if (!user) {
    return (
      <Section>
        <p className="text-body">
          {locale === 'ar' ? 'يرجى ' : 'Please '}
          <Link to={`${prefix}/login`} className="text-saffron-deep font-medium">
            {locale === 'ar' ? 'تسجيل الدخول' : 'log in'}
          </Link>
        </p>
      </Section>
    );
  }

  return (
    <Section>
      <SEO title={locale === 'ar' ? 'لوحتي | أبسط' : 'My Dashboard | ABCET'} path="/dashboard" />
      <h1 className="font-display text-2xl text-ink mb-2">{locale === 'ar' ? 'مرحبا' : 'Welcome'}, {user.name}</h1>
      <p className="text-sage mb-8">{user.email}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="font-display text-lg text-ink mb-2">{locale === 'ar' ? 'شهاداتي' : 'My Certificates'}</h2>
          <Button as={Link} to={`${prefix}/dashboard/certificates`} variant="secondary" size="sm">
            {locale === 'ar' ? 'عرض الشهادات' : 'View certificates'}
          </Button>
        </Card>
        <Card>
          <h2 className="font-display text-lg text-ink mb-2">{locale === 'ar' ? 'حجوزاتي' : 'My Bookings'}</h2>
          <Button as={Link} to={`${prefix}/dashboard/bookings`} variant="secondary" size="sm">
            {locale === 'ar' ? 'عرض الحجوزات' : 'View bookings'}
          </Button>
        </Card>
      </div>

      <Button variant="ghost" size="sm" className="mt-8" onClick={logout}>
        {locale === 'ar' ? 'تسجيل الخروج' : 'Log out'}
      </Button>
    </Section>
  );
}
