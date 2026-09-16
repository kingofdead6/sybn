/**
 * Seeds the site's content over the HTTP API instead of connecting to MongoDB.
 *
 * `seed/index.js` needs a database connection string, which you do not have
 * when the API is deployed somewhere like Render. This script signs in as an
 * admin and writes the same content through `/admin/*`, so it works against any
 * running instance you have credentials for.
 *
 *   SEED_API_URL=https://example.com/api/v1 \
 *   SEED_ADMIN_EMAIL=you@example.com \
 *   SEED_ADMIN_PASSWORD=... \
 *   npm run seed:api
 *
 * Flags:
 *   --dry-run          report what would change, write nothing
 *   --only=a,b         limit to these collections
 *   --replace          delete existing documents first (matches `npm run seed`)
 *   --yes              required alongside --replace, which is destructive
 *
 * Default behaviour is an UPSERT, matched on each collection's natural key. It
 * does not delete anything, so content edited in the admin panel survives and
 * re-running is safe. `npm run seed` wipes each collection; `--replace` is the
 * opt-in equivalent here.
 */
import 'dotenv/config';

import programs from './data/programs.js';
import categories from './data/categories.js';
import team from './data/team.js';
import stories from './data/stories.js';
import forums from './data/forums.js';
import products from './data/products.js';
import settings from './data/settings.js';
import courses from './data/courses.js';

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const valueOf = (name) => {
  const hit = args.find((a) => a.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) : '';
};

const DRY_RUN = has('--dry-run');
const REPLACE = has('--replace');
const ONLY = valueOf('--only').split(',').filter(Boolean);

const BASE = (process.env.SEED_API_URL || '').replace(/\/+$/, '');
const EMAIL = process.env.SEED_ADMIN_EMAIL;
const PASSWORD = process.env.SEED_ADMIN_PASSWORD;

/* The API rate-limits /api to 300 requests per minute. Seeding is ~170 requests
   in the default upsert and ~320 with --replace, so requests are paced to stay
   comfortably under that rather than tripping it halfway through a run. */
const MIN_REQUEST_GAP_MS = Number(process.env.SEED_API_GAP_MS || 240);

/* Collections in dependency order: categories must exist before courses, which
   reference them by id. Each entry names the natural key used to decide whether
   a document already exists. */
const COLLECTIONS = [
  { name: 'categories', data: categories, key: 'slug' },
  { name: 'programs', data: programs, key: 'slug' },
  { name: 'team', data: team, key: 'slug' },
  { name: 'stories', data: stories, key: 'slug' },
  // A Forum has no slug — month plus year is what actually identifies one.
  { name: 'forums', data: forums, key: (d) => `${d.month}|${d.year}` },
  { name: 'products', data: products, key: 'slug' },
  { name: 'settings', data: settings, key: 'key' },
  { name: 'courses', data: courses, key: 'slug' },
];

let cookie = '';
let lastRequestAt = 0;

/* What has actually been written so far. A run that dies partway (a limiter it
   cannot ride out, a dropped connection) has still changed the database, and
   the operator needs to know how far it got. */
const progress = [];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function request(method, path, body, attempt = 0) {
  const gap = Date.now() - lastRequestAt;
  if (gap < MIN_REQUEST_GAP_MS) await sleep(MIN_REQUEST_GAP_MS - gap);
  lastRequestAt = Date.now();

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  // Back off and retry when the limiter or a cold instance pushes back, rather
  // than aborting a half-written run.
  // The limiter's window is a full minute, so the blind backoff has to be able
  // to ride out that long: express-rate-limit sends Retry-After, but a proxy in
  // front of it may not pass it through.
  if ((res.status === 429 || res.status >= 500) && attempt < 6) {
    const retryAfter = Number(res.headers.get('retry-after'));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? Math.min(retryAfter, 90) * 1000
      : Math.min(2000 * 2 ** attempt, 30_000);
    console.log(`    ${res.status} from ${method} ${path} — waiting ${Math.round(waitMs / 1000)}s`);
    await sleep(waitMs);
    return request(method, path, body, attempt + 1);
  }

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // A non-JSON body means we are almost certainly not talking to the API
    // (a proxy error page, an HTML 404). Say so rather than "undefined".
    throw new Error(
      `${method} ${path} returned ${res.status} with a non-JSON body — is SEED_API_URL the API root (…/api/v1)?`
    );
  }
  if (!res.ok) {
    throw new Error(`${method} ${path} failed (${res.status}): ${json?.error || text}`);
  }
  return { json, res };
}

async function login() {
  const { json, res } = await request('POST', '/auth/login', { email: EMAIL, password: PASSWORD });
  // The token comes back only as an httpOnly cookie; the body is the user.
  const setCookie = res.headers.getSetCookie?.() || [];
  const token = setCookie.map((c) => c.split(';')[0]).find((c) => c.startsWith('token='));
  if (!token) throw new Error('Login succeeded but returned no token cookie.');
  cookie = token;

  const role = json?.data?.role;
  if (!['admin', 'editor'].includes(role)) {
    throw new Error(`Signed in as "${EMAIL}" but its role is "${role}" — admin or editor is required.`);
  }
  console.log(`Signed in as ${EMAIL} (${role})\n`);
}

/** Every document in a collection, following pagination. */
async function listAll(resource) {
  const out = [];
  for (let page = 1; ; page += 1) {
    const { json } = await request('GET', `/admin/${resource}?page=${page}&limit=100`);
    const items = json.data || [];
    out.push(...items);
    const total = json.meta?.total ?? out.length;
    if (out.length >= total || items.length === 0) break;
  }
  return out;
}

const keyOf = (key, doc) => (typeof key === 'function' ? key(doc) : doc[key]);

/** Category slugs the seed defines, used to validate course references. */
const seedCategorySlugs = new Set(categories.map((c) => c.slug));

async function seedCollection({ name, data, key }, context) {
  if (ONLY.length && !ONLY.includes(name)) return null;

  let docs = data;
  if (name === 'courses') {
    // Courses carry a category slug; swap it for the real id, exactly as
    // seed/index.js does after the categories are written.
    docs = data.map(({ category, ...rest }) => {
      const id = context.categoryIds.get(category);
      if (id) return { ...rest, category: id };
      // A dry run writes no categories, so on an empty database there are no
      // ids to resolve against yet. Only a slug the seed itself does not
      // define is a real error; anything else would exist by the time a real
      // run reached this point.
      if (DRY_RUN && seedCategorySlugs.has(category)) {
        return { ...rest, category: null };
      }
      throw new Error(`Course "${rest.slug}" references unknown category "${category}"`);
    });
  }

  const existing = await listAll(name);
  const byKey = new Map(existing.map((d) => [keyOf(key, d), d]));

  let created = 0;
  let updated = 0;
  let deleted = 0;

  if (REPLACE) {
    for (const doc of existing) {
      if (!DRY_RUN) await request('DELETE', `/admin/${name}/${doc._id}`);
      deleted += 1;
    }
    byKey.clear();
  }

  for (const doc of docs) {
    const match = byKey.get(keyOf(key, doc));
    if (match) {
      if (!DRY_RUN) await request('PUT', `/admin/${name}/${match._id}`, doc);
      updated += 1;
    } else {
      if (!DRY_RUN) await request('POST', `/admin/${name}`, doc);
      created += 1;
    }
  }

  progress.push({ name, created, updated, deleted });
  console.log(
    `  ${name.padEnd(12)} ${String(created).padStart(3)} created  ${String(updated).padStart(3)} updated` +
      (REPLACE ? `  ${String(deleted).padStart(3)} deleted` : '')
  );

  // Categories were just written, so re-read them for the course ids.
  if (name === 'categories') {
    const fresh = await listAll('categories');
    context.categoryIds = new Map(fresh.map((c) => [c.slug, c._id]));
  }

  return { created, updated, deleted };
}

async function main() {
  const missing = [
    !BASE && 'SEED_API_URL',
    !EMAIL && 'SEED_ADMIN_EMAIL',
    !PASSWORD && 'SEED_ADMIN_PASSWORD',
  ].filter(Boolean);
  if (missing.length) {
    console.error(`\nMissing required environment variable(s): ${missing.join(', ')}\n`);
    console.error('  SEED_API_URL=https://your-api.example.com/api/v1 \\');
    console.error('  SEED_ADMIN_EMAIL=you@example.com \\');
    console.error('  SEED_ADMIN_PASSWORD=... \\');
    console.error('  npm run seed:api\n');
    process.exit(1);
  }
  if (REPLACE && !has('--yes')) {
    console.error('\n--replace deletes every existing document in the targeted collections.');
    console.error('Re-run with --yes if that is what you want.\n');
    process.exit(1);
  }

  console.log(`\nSeeding ${BASE}${DRY_RUN ? '  (dry run — nothing will be written)' : ''}\n`);

  await login();

  // Courses need the category ids; seeded collections fill this in.
  const context = { categoryIds: new Map() };

  // A --only run that skips categories still needs their ids for courses.
  if (ONLY.length && ONLY.includes('courses') && !ONLY.includes('categories')) {
    const fresh = await listAll('categories');
    context.categoryIds = new Map(fresh.map((c) => [c.slug, c._id]));
  }

  for (const collection of COLLECTIONS) {
    await seedCollection(collection, context);
  }

  console.log(
    DRY_RUN
      ? '\nDry run complete — nothing was written.\n'
      : '\nSeeding complete.\n'
  );
}

main().catch((err) => {
  console.error(`\nSeeding failed: ${err.message}`);

  if (!DRY_RUN) {
    const done = progress.filter((p) => p.created || p.updated || p.deleted);
    if (done.length) {
      console.error('\nThe database was already changed before this failed:');
      for (const p of done) {
        console.error(
          `  ${p.name.padEnd(12)} ${p.created} created, ${p.updated} updated` +
            (p.deleted ? `, ${p.deleted} deleted` : '')
        );
      }
      console.error(
        '\nCollections not listed above were not reached. Re-running is safe:' +
          '\nthe default mode upserts on each collection\'s natural key, so' +
          '\nfinished work is rewritten rather than duplicated.'
      );
    } else {
      console.error('\nNothing was written.');
    }
  }
  console.error('');
  process.exit(1);
});
