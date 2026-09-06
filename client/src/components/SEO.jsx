import { Helmet } from 'react-helmet-async';
import { useLocale } from '../context/LocaleContext';

export default function SEO({ title, description, path = '' }) {
  const { locale } = useLocale();
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const arPath = path;
  const enPath = `/en${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} />
      <link rel="canonical" href={`${base}${locale === 'en' ? enPath : arPath}`} />
      <link rel="alternate" hrefLang="ar" href={`${base}${arPath || '/'}`} />
      <link rel="alternate" hrefLang="en" href={`${base}${enPath}`} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
