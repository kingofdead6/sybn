/**
 * Every public, indexable page of the site, as language-neutral paths
 * ('/courses/x'). Each one is prerendered and listed in the sitemap twice:
 * Arabic at the bare path, English under /en.
 *
 * Static pages are listed here; programs, categories, courses, resources and
 * network profiles come from the API, so anything published in the admin is
 * picked up on the next build.
 */

/** [path, priority, changefreq] */
const STATIC = [
  ['/', '1.0', 'weekly'],
  ['/about', '0.9', 'monthly'],
  ['/courses', '0.9', 'weekly'],
  ['/entrepreneurship', '0.8', 'monthly'],
  ['/forums', '0.8', 'weekly'],
  ['/ai', '0.7', 'monthly'],
  ['/worldwide', '0.7', 'monthly'],
  ['/network', '0.7', 'weekly'],
  ['/contact', '0.7', 'yearly'],
  ['/stories', '0.6', 'monthly'],
  ['/resources', '0.6', 'monthly'],
  ['/store', '0.6', 'weekly'],
  ['/verify', '0.6', 'yearly'],
  ['/faq', '0.6', 'monthly'],
  ['/numbers', '0.5', 'monthly'],
  ['/store/create-your-shop', '0.5', 'monthly'],
  ['/privacy', '0.2', 'yearly'],
  ['/terms', '0.2', 'yearly'],
];

async function list(api, endpoint) {
  const res = await fetch(`${api}${endpoint}`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(20000),
  });
  const type = res.headers.get('content-type') || '';
  if (!res.ok || !type.includes('json')) {
    throw new Error(`${endpoint} → HTTP ${res.status} (${type || 'no content type'})`);
  }
  return (await res.json()).data || [];
}

export async function getRoutes(api) {
  const [programs, categories, courses, resources, team] = await Promise.all(
    ['/programs', '/categories', '/courses', '/resources', '/team'].map((e) => list(api, e))
  );
  const entry = (path, item, priority, changefreq = 'monthly') => ({
    path,
    lastmod: item?.updatedAt,
    priority,
    changefreq,
  });

  const routes = [
    ...STATIC.map(([path, priority, changefreq]) => entry(path, null, priority, changefreq)),
    ...programs.map((p) =>
      entry(p.parent?.slug ? `/programs/${p.parent.slug}/${p.slug}` : `/programs/${p.slug}`, p, '0.8')
    ),
    ...categories.map((c) => entry(`/categories/${c.slug}`, c, '0.7')),
    ...courses.map((c) => entry(`/courses/${c.slug}`, c, '0.8')),
    ...resources.map((r) => entry(`/resources/${r.slug}`, r, '0.5')),
    ...team.map((m) => entry(`/network/${m.slug}`, m, '0.4')),
  ];
  return routes.filter((r) => r.path && !r.path.includes('undefined'));
}

/** The URL path of a language-neutral path in a language. */
export function localePath(path, locale) {
  if (locale === 'en') return path === '/' ? '/en' : `/en${path}`;
  return path;
}
