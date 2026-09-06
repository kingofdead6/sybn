import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Program, Category, Story, TeamMember } from '../models/index.js';

const router = Router();

const STATIC_PATHS = [
  '', 'about', 'worldwide', 'network', 'stories', 'forums', 'store', 'verify', 'contact', 'privacy', 'terms',
];

router.get('/sitemap.xml', asyncHandler(async (req, res) => {
  const base = process.env.CLIENT_URL || 'http://localhost:5173';
  const [programs, categories, stories, team] = await Promise.all([
    Program.find({ published: true }).select('slug updatedAt'),
    Category.find().select('slug updatedAt'),
    Story.find().select('slug updatedAt'),
    TeamMember.find().select('slug updatedAt'),
  ]);

  const urls = [
    ...STATIC_PATHS.map((p) => ({ loc: `/${p}`, updatedAt: new Date() })),
    ...programs.map((p) => ({ loc: `/programs/${p.slug}`, updatedAt: p.updatedAt })),
    ...categories.map((c) => ({ loc: `/categories/${c.slug}`, updatedAt: c.updatedAt })),
    ...stories.map(() => null).filter(Boolean),
    ...team.map((m) => ({ loc: `/network/${m.slug}`, updatedAt: m.updatedAt })),
  ];

  const body = urls
    .map(
      (u) => `<url><loc>${base}${u.loc}</loc><lastmod>${new Date(u.updatedAt).toISOString()}</lastmod></url>
<url><loc>${base}/en${u.loc}</loc><lastmod>${new Date(u.updatedAt).toISOString()}</lastmod></url>`
    )
    .join('\n');

  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`);
}));

router.get('/robots.txt', (req, res) => {
  const base = process.env.CLIENT_URL || 'http://localhost:5173';
  res.type('text/plain').send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard

Sitemap: ${base}/sitemap.xml
`);
});

export default router;
