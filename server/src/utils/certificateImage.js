import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';

/**
 * Renders a certificate template to a PNG.
 *
 * The template is laid out as SVG — a background (colour, an uploaded design,
 * an optional frame) with lines of text over it — and rasterised by resvg with
 * the site's own fonts, so Arabic joins and runs right to left exactly as it
 * does on the website. The same function draws the admin's live preview and
 * the image that is emailed, so what the admin sees is what is sent.
 */

const FONT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../assets/fonts');
const FONT_FILES = fs
  .readdirSync(FONT_DIR)
  .filter((f) => f.endsWith('.ttf'))
  .map((f) => path.join(FONT_DIR, f));

/** The placeholders a template's text may use, for the admin editor to list. */
export const CERTIFICATE_PLACEHOLDERS = ['name', 'email', 'program', 'number', 'date', 'country'];

/** Stand-in values for previewing a template before anyone is certified. */
export const SAMPLE_DATA = {
  ar: {
    name: 'محمد أمين بن علي',
    email: 'mohamed@example.com',
    program: 'برنامج توليد فكرة مشروعك',
    number: 'SIYB-2026-00001',
    date: new Date(),
    country: 'الجزائر',
  },
  en: {
    name: 'Mohamed Amine Benali',
    email: 'mohamed@example.com',
    program: 'Generate Your Business Idea',
    number: 'SIYB-2026-00001',
    date: new Date(),
    country: 'Algeria',
  },
};

const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
const LATIN = /[A-Za-z]/;

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(date, language) {
  const d = date instanceof Date ? date : new Date(date || Date.now());
  // Arabic month names with Western digits, as the site writes dates.
  return d.toLocaleDateString(language === 'ar' ? 'ar-u-nu-latn' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function fillPlaceholders(text, data, language) {
  return String(text || '').replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    if (key === 'date') return formatDate(data.date, language);
    return data[key] ?? match;
  });
}

/**
 * A line whose first strong character is Arabic is isolated as right-to-left,
 * so a mixed line ("رقم الشهادة: SIYB-2026-00012") reads in the right order;
 * resvg otherwise lays every line out left to right.
 */
function orderLine(line) {
  const firstArabic = line.search(ARABIC);
  const firstLatin = line.search(LATIN);
  const rtl = firstArabic !== -1 && (firstLatin === -1 || firstArabic < firstLatin);
  return rtl ? `⁧${line}⁩` : line;
}

/** Fetches an uploaded background and inlines it, since resvg loads nothing itself. */
async function inlineImage(url) {
  if (!url) return null;
  if (url.startsWith('data:')) return url;
  if (!/^https?:\/\//.test(url)) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) return null;
    const type = res.headers.get('content-type') || 'image/png';
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

export async function buildSvg(template, data) {
  const width = Math.round(template.width || 2000);
  const height = Math.round(template.height || 1414);
  const language = template.language === 'en' ? 'en' : 'ar';
  const background = await inlineImage(template.backgroundImage);

  const parts = [
    `<rect width="${width}" height="${height}" fill="${escapeXml(template.backgroundColor || '#FFFFFF')}"/>`,
  ];

  if (background) {
    parts.push(
      `<image href="${background}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>`
    );
  }

  if (template.frameColor) {
    // A heavy outer rule and a fine inner one — the classic certificate border.
    const c = escapeXml(template.frameColor);
    const m = Math.round(width * 0.025);
    const s = Math.max(4, Math.round(width * 0.006));
    parts.push(
      `<rect x="${m}" y="${m}" width="${width - 2 * m}" height="${height - 2 * m}" fill="none" stroke="${c}" stroke-width="${s}"/>`,
      `<rect x="${m + s * 3}" y="${m + s * 3}" width="${width - 2 * (m + s * 3)}" height="${height - 2 * (m + s * 3)}" fill="none" stroke="${c}" stroke-width="${Math.max(1, Math.round(s / 3))}"/>`
    );
  }

  for (const el of template.elements || []) {
    const text = fillPlaceholders(el.text, data, language);
    if (!text.trim()) continue;
    const size = Number(el.fontSize) || 48;
    const x = ((Number(el.x) || 0) / 100) * width;
    const y = ((Number(el.y) || 0) / 100) * height;
    const anchor = ['start', 'middle', 'end'].includes(el.align) ? el.align : 'middle';
    const lines = text.split(/\r?\n/);
    const tspans = lines
      .map(
        (line, i) =>
          `<tspan x="${x.toFixed(1)}" ${i ? `dy="${(size * 1.35).toFixed(1)}"` : ''}>${escapeXml(orderLine(line))}</tspan>`
      )
      .join('');
    parts.push(
      `<text y="${y.toFixed(1)}" font-family="${el.font === 'Inter' ? 'Inter' : 'Cairo'}" font-size="${size}" font-weight="${el.bold ? 700 : 400}" fill="${escapeXml(el.color || '#10151F')}" text-anchor="${anchor}" dominant-baseline="middle">${tspans}</text>`
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${parts.join('')}</svg>`;
}

/**
 * Renders the template for one person. `data` holds the placeholder values;
 * `scale` shrinks the output (the editor's preview is drawn at half size).
 */
export async function renderCertificate(template, data, { scale = 1 } = {}) {
  const svg = await buildSvg(template, data);
  const resvg = new Resvg(svg, {
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Cairo' },
    fitTo: scale === 1 ? { mode: 'original' } : { mode: 'zoom', value: scale },
  });
  return resvg.render().asPng();
}
