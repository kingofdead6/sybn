/**
 * Post-build prerender step (part of `npm run build`).
 *
 * `vite build` alone produces a client-rendered SPA: dist/index.html has an
 * empty #root, so crawlers that read the raw HTML see nothing. This script
 * snapshots every public page into static HTML:
 *
 *   1. keeps the untouched SPA shell as dist/200.html (the fallback for
 *      account/admin screens and for content published after the build);
 *   2. asks the API for every program, category, course, resource and
 *      network profile, and adds them to the fixed pages (scripts/routes.js);
 *   3. opens each page, in Arabic and in English, in headless Chromium with
 *      reduced motion on, so nothing is mid-animation or held at opacity 0;
 *   4. checks each snapshot (one <h1>, a title, a canonical, indexable) and
 *      writes it to dist/<path>/index.html;
 *   5. writes dist/404.html and dist/sitemap.xml from the pages that passed.
 *
 * API calls made by the pages are answered from Node rather than by the
 * browser: the live API only allows the real site origin (CORS), and its host
 * may challenge automated traffic. Set PRERENDER_API to read from elsewhere,
 * e.g. a local copy of the backend on the same database:
 *
 *   PRERENDER_API=http://localhost:5001/api/v1 npm run build
 *
 * Nothing is written to the API: any non-GET request is answered locally.
 * The shipped JS bundle is untouched; in the browser the app mounts over the
 * snapshot exactly as before (see main.jsx).
 */
import http from 'node:http';
import { mkdir, writeFile, readFile, copyFile } from 'node:fs/promises';
import { existsSync, createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { getRoutes, localePath } from './routes.js';
import { buildSitemap } from './sitemap.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const PORT = Number(process.env.PRERENDER_PORT || 4173);
const BASE = `http://localhost:${PORT}`;
const DATA_API = (process.env.PRERENDER_API || 'https://syb-now.com/backend/api/v1').replace(/\/$/, '');
const CONCURRENCY = Number(process.env.PRERENDER_CONCURRENCY || 4);
const LOCALES = ['ar', 'en'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webmanifest': 'application/manifest+json',
};

/** Serves dist/, answering every page URL with the pristine SPA shell. */
function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, BASE).pathname);
    const ext = path.extname(urlPath);
    const file = ext ? path.join(distDir, urlPath) : path.join(distDir, '200.html');
    if (!file.startsWith(distDir) || !existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

/* Every page asks for the same settings (header, footer, …), and the API is
   rate limited, so each GET is fetched once per run and shared. A 429 is
   retried after a pause. */
const apiCache = new Map();
function apiGet(endpoint) {
  if (!apiCache.has(endpoint)) {
    const load = async (attempt = 0) => {
      const res = await fetch(`${DATA_API}${endpoint}`, { headers: { Accept: 'application/json' } });
      if (res.status === 429 && attempt < 6) {
        await new Promise((r) => setTimeout(r, 5000 * (attempt + 1)));
        return load(attempt + 1);
      }
      return { status: res.status, type: res.headers.get('content-type') || 'application/json', body: await res.text() };
    };
    const pending = load();
    // A failure is not cached, so a later page can try again.
    pending.catch(() => apiCache.delete(endpoint));
    apiCache.set(endpoint, pending);
  }
  return apiCache.get(endpoint);
}

/** Answers the page's API calls from Node (see the header comment). */
async function handleRequest(req) {
  const url = req.url();
  const api = url.match(/\/api\/v1(\/[^#]*)$/);
  if (api && !url.startsWith(BASE)) {
    const cors = {
      'Access-Control-Allow-Origin': BASE,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    if (req.method() !== 'GET') {
      return req.respond({ status: req.method() === 'OPTIONS' ? 204 : 200, headers: cors, contentType: 'application/json', body: '{}' });
    }
    try {
      const { status, type, body } = await apiGet(api[1]);
      return req.respond({ status, headers: cors, contentType: type, body });
    } catch (err) {
      return req.respond({ status: 502, headers: cors, contentType: 'application/json', body: JSON.stringify({ message: err.message }) });
    }
  }
  // Pixels and third-party frames have no bearing on the HTML; skip them.
  const type = req.resourceType();
  if (type === 'image' || type === 'media' || type === 'font') return req.abort();
  if (type === 'document' && !url.startsWith(BASE)) return req.abort();
  return req.continue();
}

/** Makes the snapshot safe to serve as-is. */
function finalize(html) {
  return (
    html
      // Belt and braces: an animation's starting state must never ship.
      .replace(/(style="[^"]*?)\bopacity:\s*0(?:\.0+)?;?\s*/g, '$1')
      .replace(/\sstyle="\s*"/g, '')
      // Lets main.jsx hide the snapshot for visitors with JavaScript the
      // moment before the app takes over (see index.html).
      .replace('<div id="root">', '<div id="root" data-prerendered="">')
      // Set by index.html's inline script in the headless browser; a no-JS
      // visitor must not inherit it, or the snapshot would stay hidden.
      .replace(/(<html[^>]*?)\sdata-js=""/, '$1')
  );
}

async function snapshot(browser, urlPath, { expectIndexable = true } = {}) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1280, height: 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.evaluateOnNewDocument(() => {
      // No consent banner in the snapshots.
      localStorage.setItem('siyb-cookie-consent', 'accepted');
    });
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      handleRequest(req).catch(() => {});
    });

    await page.goto(`${BASE}${urlPath}`, { waitUntil: 'networkidle0', timeout: 45000 });
    await page
      .waitForFunction(
        // The page's heading, and its head tags (Helmet writes those a frame
        // later), or the noindex of an error state.
        () =>
          (document.querySelector('#main-content h1') && document.querySelector('link[rel="canonical"]')) ||
          document.querySelector('meta[name="robots"][content*="noindex"]'),
        { timeout: 30000 }
      )
      .catch(async (err) => {
        const seen = await page.evaluate(() => ({
          h1: document.querySelectorAll('h1').length,
          canonical: !!document.querySelector('link[rel="canonical"]'),
          text: document.querySelector('#main-content')?.innerText.slice(0, 80) || '(empty)',
        }));
        throw new Error(`${err.message} — saw ${JSON.stringify(seen)}`);
      });
    await new Promise((r) => setTimeout(r, 300));

    const check = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      title: document.title,
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
      noindex: !!document.querySelector('meta[name="robots"][content*="noindex"]'),
      lang: document.documentElement.lang,
    }));
    const problems = [];
    if (expectIndexable) {
      if (check.noindex) problems.push('page is noindex (error or not-found state)');
      if (check.h1 !== 1) problems.push(`${check.h1} <h1> elements`);
      if (!check.title) problems.push('no <title>');
      if (!check.canonical) problems.push('no canonical');
    }
    return { html: finalize(await page.content()), check, problems };
  } finally {
    await page.close();
  }
}

function outFile(urlPath) {
  return urlPath === '/' ? path.join(distDir, 'index.html') : path.join(distDir, urlPath.slice(1), 'index.html');
}

async function main() {
  if (!existsSync(path.join(distDir, 'index.html'))) {
    console.error('dist/ not found — run `vite build` first.');
    process.exit(1);
  }

  // The untouched shell. On a re-run index.html is already a snapshot, so the
  // shell saved by the first run is kept.
  const index = await readFile(path.join(distDir, 'index.html'), 'utf-8');
  if (index.includes('<div id="root"></div>')) await copyFile(path.join(distDir, 'index.html'), path.join(distDir, '200.html'));

  console.log(`Reading routes from ${DATA_API} ...`);
  let routes;
  try {
    routes = await getRoutes(DATA_API);
  } catch (err) {
    console.error(`\nCould not read the API: ${err.message}`);
    console.error('If the live host is blocking this machine, run a local copy of the backend and set');
    console.error('PRERENDER_API=http://localhost:<port>/api/v1 (see the comment at the top of this file).');
    process.exit(1);
  }

  // PRERENDER_ONLY=/about,/faq limits a run to some pages (for debugging);
  // such a run leaves the sitemap alone.
  const only = process.env.PRERENDER_ONLY?.split(',').map((p) => p.trim());
  if (only) routes = routes.filter((r) => only.includes(r.path));

  const jobs = routes.flatMap((r) => LOCALES.map((locale) => ({ route: r, locale, urlPath: localePath(r.path, locale) })));
  console.log(`Prerendering ${jobs.length} pages (${routes.length} routes × ${LOCALES.length} languages) ...`);

  const server = await startServer();
  // One browser per worker, so each page is the foreground tab: Chromium
  // pauses requestAnimationFrame in background tabs, and Helmet writes the
  // head tags in an animation frame.
  const launch = () =>
    puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'],
    });
  const browsers = await Promise.all(Array.from({ length: CONCURRENCY }, launch));
  const failed = [];
  const ok = new Set();

  try {
    let next = 0;
    const worker = async (browser) => {
      while (next < jobs.length) {
        const job = jobs[next++];
        try {
          const { html, problems } = await snapshot(browser, job.urlPath);
          if (problems.length) {
            failed.push({ path: job.urlPath, reason: problems.join('; ') });
            continue;
          }
          const file = outFile(job.urlPath);
          await mkdir(path.dirname(file), { recursive: true });
          await writeFile(file, html, 'utf-8');
          ok.add(job.urlPath);
          process.stdout.write('.');
        } catch (err) {
          failed.push({ path: job.urlPath, reason: err.message.split('\n')[0] });
        }
      }
    };
    await Promise.all(browsers.map(worker));

    // The not-found page, served by the host with status 404.
    const nf = await snapshot(browsers[0], '/__page-not-found__', { expectIndexable: false });
    await writeFile(path.join(distDir, '404.html'), nf.html, 'utf-8');
  } finally {
    await Promise.all(browsers.map((b) => b.close()));
    server.close();
  }

  // A route goes in the sitemap only if both of its languages rendered.
  const listed = routes.filter((r) => LOCALES.every((l) => ok.has(localePath(r.path, l))));
  if (!only) await writeFile(path.join(distDir, 'sitemap.xml'), buildSitemap(listed), 'utf-8');

  console.log(`\n\nPrerendered ${ok.size}/${jobs.length} pages; sitemap lists ${listed.length * 2} URLs.`);
  if (failed.length) {
    console.error(`\n${failed.length} page(s) failed:`);
    for (const f of failed) console.error(`  ${f.path} — ${f.reason}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
