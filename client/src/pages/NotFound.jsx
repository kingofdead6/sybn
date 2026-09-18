import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';
import { useLocale } from '../context/LocaleContext';

export default function NotFound() {
  const { t } = useTranslation('common');
  const { locale } = useLocale();
  const isAr = locale === 'ar';
  const prefix = isAr ? '' : '/en';

  // Somewhere useful to go instead of a dead end.
  const links = [
    { to: prefix || '/', label: isAr ? 'الصفحة الرئيسية' : 'Home' },
    { to: `${prefix}/forums`, label: isAr ? 'الملتقيات' : 'Forums' },
    { to: `${prefix}/store`, label: isAr ? 'المتجر' : 'Store' },
    { to: `${prefix}/faq`, label: isAr ? 'الأسئلة الشائعة' : 'FAQ' },
    { to: `${prefix}/contact`, label: isAr ? 'اتصل بنا' : 'Contact' },
  ];

  return (
    <>
      {/* An error page must never be indexed. */}
      <SEO title={t('notFound')} noindex />

      <Section>
        <div className="mx-auto flex max-w-[52ch] flex-col items-center gap-5 py-10 text-center">
          <span className="numerals font-display text-4xl leading-none text-accent" aria-hidden="true">
            404
          </span>
          <h1 className="font-display text-2xl md:text-3xl leading-tight text-ink">
            {t('notFound')}
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            {isAr
              ? 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها. جرّب أحد الروابط التالية.'
              : 'The page you are looking for does not exist or has moved. Try one of the links below.'}
          </p>

          <Button as={Link} to={prefix || '/'} variant="primary">
            {t('backHome')}
          </Button>

          <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-accent transition-colors duration-fast ease-out hover:text-accent-deep"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
