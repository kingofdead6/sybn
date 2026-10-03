import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { SITE_GRAPH } from './src/lib/site.js';

/* Writes the site-wide schema.org graph into index.html, so the owner and
   organisation are in the raw HTML of every page, JavaScript or not. */
function siteJsonLd() {
  return {
    name: 'site-json-ld',
    transformIndexHtml: () => [
      {
        tag: 'script',
        attrs: { type: 'application/ld+json' },
        children: JSON.stringify(SITE_GRAPH).replace(/</g, '\\u003c'),
        injectTo: 'head',
      },
    ],
  };
}

export default defineConfig({
  plugins: [react(), siteJsonLd()],
  server: { port: 5173 },
});
