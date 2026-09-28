import readXlsxFile from 'read-excel-file/browser';

/**
 * Reading a list of people from a CSV or Excel file, for a one-off send.
 *
 * Everything happens in the browser: the file is never uploaded or stored,
 * and the list lives only as long as the page does.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Header text reduced to a comparable form: lower case, one alef, no marks. */
function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[ً-ْـ]/g, '') // Arabic diacritics and tatweel
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[_\-.:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The column names each field is recognised by, in Arabic, English and French. */
const ALIASES = {
  name: ['name', 'full name', 'fullname', 'student', 'trainer', 'nom', 'nom complet', 'الاسم', 'الاسم الكامل', 'الاسم واللقب', 'اسم', 'المتدرب', 'المدرب'],
  email: ['email', 'e mail', 'mail', 'email address', 'courriel', 'البريد', 'البريد الالكتروني', 'الايميل', 'بريد', 'البريد الإلكتروني'],
  country: ['country', 'pays', 'nationality', 'البلد', 'الدوله', 'بلد الاقامه', 'الجنسيه'],
  year: ['year', 'certification year', 'year of certification', 'certified', 'certified at', 'certified year', 'annee', 'année', 'السنه', 'سنه', 'سنه الاعتماد', 'سنه الشهاده', 'تاريخ الاعتماد', 'تاريخ الشهاده'],
  program: ['program', 'programme', 'course', 'track', 'البرنامج', 'الدوره', 'المسار'],
};
const ALIAS_INDEX = Object.fromEntries(
  Object.entries(ALIASES).flatMap(([field, names]) => names.map((n) => [normalize(n), field]))
);

/** Parses CSV text, with quoted fields and either , ; or tab between them. */
export function parseCsv(text) {
  const src = String(text).replace(/^﻿/, '');
  const firstLine = src.split(/\r?\n/, 1)[0] || '';
  const delimiter = [',', ';', '\t'].reduce((best, d) =>
    firstLine.split(d).length > firstLine.split(best).length ? d : best
  );

  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"' && cell === '') {
      quoted = true;
    } else if (ch === delimiter) {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }
  if (cell !== '' || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => String(c).trim() !== ''));
}

/** A year from whatever the cell holds: a date, a number, or text with a year in it. */
function yearOf(v) {
  if (v instanceof Date && !Number.isNaN(v.getTime())) return String(v.getFullYear());
  const m = String(v ?? '').match(/(19|20)\d{2}/);
  return m ? m[0] : '';
}

const text = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? '').trim());

/**
 * Turns rows (the first being the headers) into recipients.
 * Returns the recipients plus what happened: rows read, rows skipped for a
 * missing or invalid email, duplicates removed, which column became which
 * field, and the extra columns now usable as {{placeholders}}.
 */
export function rowsToRecipients(rows) {
  if (!rows.length) return { recipients: [], read: 0, invalid: 0, duplicates: 0, columns: {}, extras: [] };
  const headers = rows[0].map((h) => text(h));
  const columns = {};
  headers.forEach((h, i) => {
    const field = ALIAS_INDEX[normalize(h)];
    if (field && columns[field] === undefined) columns[field] = i;
  });

  // No recognisable email heading: take the column whose values look like emails.
  if (columns.email === undefined) {
    const sample = rows.slice(1, 30);
    const best = headers
      .map((_, i) => ({ i, hits: sample.filter((r) => EMAIL.test(text(r[i]))).length }))
      .sort((a, b) => b.hits - a.hits)[0];
    if (best?.hits) columns.email = best.i;
  }

  const used = new Set(Object.values(columns));
  const extras = headers
    .map((label, i) => ({ label, i }))
    .filter(({ i, label }) => !used.has(i) && label)
    .map(({ label, i }) => {
      const ascii = normalize(label).replace(/[^a-z0-9 ]/g, '').trim().replace(/ /g, '_');
      return { key: ascii && /^[a-z]/.test(ascii) ? ascii.slice(0, 40) : `col${i + 1}`, label, i };
    });

  const seen = new Set();
  const recipients = [];
  let invalid = 0;
  let duplicates = 0;
  for (const r of rows.slice(1)) {
    const email = text(r[columns.email]).toLowerCase();
    if (!EMAIL.test(email)) {
      invalid += 1;
      continue;
    }
    if (seen.has(email)) {
      duplicates += 1;
      continue;
    }
    seen.add(email);
    recipients.push({
      email,
      name: columns.name !== undefined ? text(r[columns.name]) : '',
      country: columns.country !== undefined ? text(r[columns.country]) : '',
      year: columns.year !== undefined ? yearOf(r[columns.year]) : '',
      program: columns.program !== undefined ? text(r[columns.program]) : '',
      extra: Object.fromEntries(extras.map((x) => [x.key, text(r[x.i])])),
    });
  }
  return { recipients, read: rows.length - 1, invalid, duplicates, columns, headers, extras };
}

/**
 * Reads a .csv or .xlsx file into one list per non-empty sheet.
 * Resolves to [{ name, ...rowsToRecipients() }].
 */
export async function readRecipientFile(file) {
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.csv') || lower.endsWith('.txt')) {
    return [{ name: file.name, ...rowsToRecipients(parseCsv(await file.text())) }];
  }
  if (lower.endsWith('.xlsx')) {
    const sheets = await readXlsxFile(file);
    return sheets
      .filter((s) => s.data?.length > 1)
      .map((s) => ({ name: sheets.length > 1 ? `${file.name} · ${s.sheet}` : file.name, ...rowsToRecipients(s.data) }));
  }
  const err = new Error('unsupported');
  err.code = 'unsupported';
  throw err;
}
