import { Helmet } from 'react-helmet-async';
import { useLocale } from '../context/LocaleContext';

export default function SEO({ title, description, path = '', image, type = 'website', noindex = false }) {
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
      {/* x-default points crawlers at the Arabic original, which is the
          canonical version of every page on this site. */}
      <link rel="alternate" hrefLang="x-default" href={`${base}${arPath || '/'}`} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="SIYB" />
      <meta property="og:locale" content={locale === 'ar' ? 'ar_AR' : 'en_US'} />
      <meta property="og:url" content={`${base}${locale === 'en' ? enPath : arPath}`} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
