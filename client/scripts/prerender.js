/**
 * Post-build prerender step.
 *
 * `vite build` produces a pure client-rendered SPA (dist/index.html has an
 * empty #root). That means crawlers and no-JS clients see nothing, which
 * fails the acceptance requirement that key content (hero, stats, program
 * ladder, verification) be present in the served HTML.
 *
 * This script serves the built dist/ folder locally, visits a fixed list of
 * routes with headless Chromium, waits for the app to fetch its data and
 * render, then overwrites each route's HTML file with the fully-rendered
 * DOM snapshot. The client bundle is left untouched and still hydrates
 * normally in the browser for full interactivity — this only changes what
 * the *initial* HTML response contains.
 *
 * Routes that are inherently personalized or require auth (dashboard,
 * admin, cart, checkout) are intentionally NOT prerendered.
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;

const ROUTES = [
  '/',
  '/about',
  '/worldwide',
  '/network',
  '/stories',
  '/forums',
  '/store',
  '/verify',
  '/contact',
  '/privacy',
  '/terms',
  '/en',
  '/en/about',
  '/en/worldwide',
  '/en/network',
  '/en/stories',
  '/en/forums',
  '/en/store',
  '/en/verify',
  '/en/contact',
  '/en/privacy',
  '/en/terms',
];

function startStaticServer() {
  return new Promise((resolve, reject) => {
    const bin = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const child = spawn(bin, ['serve', '-s', 'dist', '-l', String(PORT)], { cwd: root, shell: true });
    let ready = false;
    const onData = (data) => {
      const text = data.toString();
      if (!ready && (text.includes('Accepting connections') || text.includes(String(PORT)))) {
        ready = true;
        resolve(child);
      }
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('error', reject);
    setTimeout(() => {
      if (!ready) {
        ready = true;
        resolve(child);
      }
    }, 4000);
  });
}

async function prerenderRoute(browser, routePath) {
  console.log(`  visiting ${routePath} ...`);
  const page = await browser.newPage();
  try {
    await page.goto(`${BASE}${routePath}`, { waitUntil: 'networkidle2', timeout: 20000 });
  } catch (err) {
    console.warn(`    navigation for ${routePath} did not settle (${err.message}), snapshotting current state anyway`);
  }
  // Give React a moment past network-idle to finish any state-driven re-render.
  await new Promise((r) => setTimeout(r, 500));
  const html = await page.content();
  await page.close();

  const outDir = routePath === '/' ? distDir : path.join(distDir, routePath.replace(/^\//, ''));
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'index.html'), html, 'utf-8');
  console.log(`  prerendered ${routePath}`);
}

async function main() {
  if (!existsSync(distDir)) {
    console.error('dist/ not found — run `npm run build` first.');
    process.exit(1);
  }

  console.log('Starting static server...');
  const server = await startStaticServer();

  console.log('Launching headless browser...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

  try {
    for (const route of ROUTES) {
      try {
        await prerenderRoute(browser, route);
      } catch (err) {
        console.error(`  FAILED to prerender ${route}:`, err.message);
      }
    }
  } finally {
    await browser.close();
    server.kill();
  }

  console.log(`\nPrerendered ${ROUTES.length} routes into dist/.`);
}

main().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
