import { Helmet } from 'react-helmet-async';
import { useLocale } from '../context/LocaleContext';
import { SITE_NAME, BRAND, OG_IMAGE, OWNER, KEYWORDS, localeUrl } from '../lib/site';

export { localeUrl };

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

/** Collapses whitespace and cuts at a word boundary, with an ellipsis. */
export function clampText(text, max) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const atWord = cut.slice(0, cut.lastIndexOf(' ') > max * 0.6 ? cut.lastIndexOf(' ') : cut.length);
  return `${atWord.replace(/[\s,.،:;–—-]+$/, '')}…`;
}

/** "Topic | Brand", within the length search results show. A title that
    already names the brand is left as written. The topic gives way first, so
    the brand is never cut off. */
export function brandTitle(topic, locale) {
  const brand = BRAND[locale] || SITE_NAME;
  const clean = String(topic || '').replace(/\s+/g, ' ').trim();
  if (!clean) return brand;
  if (/SIYB/i.test(clean)) return clampText(clean, TITLE_MAX);
  const room = TITLE_MAX - brand.length - 3;
  return `${clampText(clean, room)} | ${brand}`;
}

/**
 * Per-page head tags.
 *
 * - `title` is the page topic; the brand is appended (see brandTitle).
 * - `path` is the language-neutral path ('/courses/x'); both language URLs,
 *   the canonical and the hreflang alternates are derived from it.
 * - `breadcrumbs` ([{ name, path }], Home excluded) adds a BreadcrumbList.
 * - `jsonLd` takes page-specific schema.org nodes (an object or an array).
 *   The site-wide graph (organisation, website) is already in index.html.
 */
export default function SEO({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  breadcrumbs,
  jsonLd,
}) {
  const { locale } = useLocale();
  const isAr = locale === 'ar';
  const url = localeUrl(path, locale);
  const fullTitle = brandTitle(title, locale);
  const desc = description ? clampText(description, DESCRIPTION_MAX) : '';
  const ogImage = image || OG_IMAGE;

  const nodes = [].concat(jsonLd || []);
  if (breadcrumbs?.length) {
    const trail = [{ name: isAr ? 'الرئيسية' : 'Home', path: '/' }, ...breadcrumbs];
    nodes.push({
      '@type': 'BreadcrumbList',
      itemListElement: trail.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        item: localeUrl(b.path, locale),
      })),
    });
  }
  const graph = nodes.length ? { '@context': 'https://schema.org', '@graph': nodes } : null;

  return (
    <Helmet>
      <html lang={locale} dir={isAr ? 'rtl' : 'ltr'} />
      <title>{fullTitle}</title>
      {desc && <meta name="description" content={desc} />}
      <meta name="author" content={isAr ? OWNER.nameAr : OWNER.name} />
      <meta name="keywords" content={KEYWORDS} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      {!noindex && <link rel="canonical" href={url} />}
      {!noindex && <link rel="alternate" hrefLang="ar" href={localeUrl(path, 'ar')} />}
      {!noindex && <link rel="alternate" hrefLang="en" href={localeUrl(path, 'en')} />}
      {/* x-default points at the Arabic original, the site's primary language. */}
      {!noindex && <link rel="alternate" hrefLang="x-default" href={localeUrl(path, 'ar')} />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={isAr ? 'ar_DZ' : 'en_US'} />
      <meta property="og:locale:alternate" content={isAr ? 'en_US' : 'ar_DZ'} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      {desc && <meta property="og:description" content={desc} />}
      <meta property="og:image" content={ogImage} />
      {!image && <meta property="og:image:width" content="1200" />}
      {!image && <meta property="og:image:height" content="630" />}
      <meta property="og:image:alt" content={fullTitle} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {desc && <meta name="twitter:description" content={desc} />}
      <meta name="twitter:image" content={ogImage} />
      {graph && <script type="application/ld+json">{JSON.stringify(graph)}</script>}
    </Helmet>
  );
}
