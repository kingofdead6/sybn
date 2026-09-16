# أبسط | SIYB Platform

Bilingual (Arabic/English) training & accreditation platform for the SIYB (Start and Improve Your Business) program, delivered under the برنامج "أبسط" brand.

## Stack

- **Client**: React 18 + Vite, React Router v6, Tailwind CSS v3, framer-motion, gsap, animejs, react-i18next, react-hook-form + zod, axios
- **Server**: Node.js + Express, MongoDB + Mongoose, JWT auth, Cloudinary uploads, nodemailer

## Repo layout

```
/client        React app (public site + admin panel)
/server        Express API
/server/seed   Seed scripts with all site content
```

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- A Cloudinary account (for uploads)

### Server

```bash
cd server
cp .env.example .env   # fill in your values
npm install
npm run seed            # populates the database with all site content
npm run dev              # starts on http://localhost:5000
```

### Client

```bash
cd client
cp .env.example .env
npm install
npm run dev              # starts on http://localhost:5173
```

## Environment variables

See `server/.env.example` and `client/.env.example`.

## Scripts

**server**
- `npm run dev` — start API with nodemon
- `npm start` — start API in production mode
- `npm run seed` — seed the database from `/server/seed` (needs `MONGO_URI`)
- `npm run seed:api` — seed the same content over the HTTP API (no database access needed)
- `npm run seed:check` — validate the seed data against the models without a database

### Seeding

`npm run seed` connects straight to MongoDB and **replaces** every content
collection. Use it locally, where you have the connection string.

`npm run seed:api` writes the same content through the admin HTTP API instead,
so it works against a deployed instance you only have admin credentials for:

```bash
SEED_API_URL=https://your-api.example.com/api/v1 \
SEED_ADMIN_EMAIL=you@example.com \
SEED_ADMIN_PASSWORD=... \
npm run seed:api
```

It **upserts** rather than wiping — matching each document on its natural key
(`slug`, `key` for settings, month+year for forums) — so content edited in the
admin panel survives and re-running is safe. Useful flags:

- `--dry-run` — report what would change, write nothing
- `--only=products,settings` — limit to certain collections
- `--replace --yes` — delete before writing, matching `npm run seed`'s semantics

Requests are paced to stay under the API's 300-request-per-minute limit and
back off if it pushes back. If a run does fail partway, it prints exactly which
collections were already written before exiting.

`npm run seed:check` needs no database or network at all: it validates every
seed document against its Mongoose schema (required fields, enums, types, slug
uniqueness, the course-to-category resolution) and is worth running before
either of the above.

**client**
- `npm run dev` — start Vite dev server
- `npm run build` — production build (client-rendered SPA only)
- `npm run prerender` — snapshot key public routes into static HTML after a build (see below)
- `npm run build:prerender` — build then prerender in one step
- `npm run preview` — preview production build

### Prerendering (SEO / no-JS content)

This app is a client-rendered React SPA (Vite, no server framework, per the project's stack constraints). That means a plain `vite build` produces an `index.html` with an empty `<div id="root">` — anything that fetches data client-side (the hero, program ladder, stats, forums, etc.) is invisible to crawlers and to browsers with JavaScript disabled until the bundle runs.

To satisfy "real content must be visible without JS" for the pages that matter for SEO and credibility, `npm run prerender` (via `client/scripts/prerender.js`) serves the built `dist/` folder locally, visits each public marketing/content route with headless Chromium, waits for the app's data fetches to resolve, and overwrites that route's `index.html` with the fully rendered DOM. The shipped JS bundle is untouched and still hydrates normally in the browser, so the site stays fully interactive — this only changes what the *initial* HTML response contains for search engines and no-JS clients.

Personalized or auth-gated routes (`/dashboard/*`, `/admin/*`, `/cart`, exam attempts) are intentionally excluded from prerendering, since their content is per-user and a static snapshot would be meaningless or stale.

Run `npm run build:prerender` instead of `npm run build` when deploying if you want this behavior; serve the resulting `dist/` folder as static files (each prerendered route has its own `index.html` in a matching subfolder, e.g. `dist/about/index.html`, `dist/en/about/index.html`) with a fallback to the root `index.html` for any route not in the prerender list, so client-side routing still works for everything else.

## Design system

All colors, spacing, radii and font stacks live in `client/src/styles/tokens.css` as CSS custom properties. No hex colors should appear anywhere else in `client/src`. Recoloring the site is done by editing that one file.

Visit `/styleguide` in the running client to see every base component in both languages and both themes.

## Deployment notes

- Build the client (`npm run build` in `/client`) and serve the `dist/` folder via any static host or through the Express server.
- Set `CLIENT_URL` on the server to the deployed client origin for CORS.
- Set `VITE_API_URL` on the client to the deployed API origin.
- Never commit `.env` files or real API keys.
