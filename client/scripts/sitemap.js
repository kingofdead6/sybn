/**
 * sitemap.xml from the pages that were actually prerendered: both languages
 * of each, every entry naming its Arabic and English twins (hreflang) and the
 * x-default (Arabic).
 */
import { SITE_URL } from '../src/lib/site.js';
import { localePath } from './routes.js';

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const day = (d) => new Date(d).toISOString().slice(0, 10);

export function buildSitemap(routes, builtAt = new Date()) {
  const blocks = routes.flatMap((r) => {
    const ar = `${SITE_URL}${localePath(r.path, 'ar')}`;
    const en = `${SITE_URL}${localePath(r.path, 'en')}`;
    const alternates = `
    <xhtml:link rel="alternate" hreflang="ar" href="${escape(ar)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${escape(en)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${escape(ar)}"/>`;
    return [ar, en].map(
      (loc) => `  <url>
    <loc>${escape(loc)}</loc>
    <lastmod>${day(r.lastmod || builtAt)}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>${alternates}
  </url>`
    );
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${blocks.join('\n')}
</urlset>
`;
}
