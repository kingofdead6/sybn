const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Renders a number (or numeric string) using Arabic-Indic digits when
 * locale === 'ar'; otherwise returns the value as a plain string.
 * Non-digit characters (commas, +, spaces, etc.) are preserved as-is.
 */
export function toLocaleDigits(value, locale) {
  const str = String(value);
  if (locale !== 'ar') return str;
  return str.replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);
}

/**
 * Formats a date per locale using Intl.DateTimeFormat.
 */
export function formatDate(date, locale, options = { dateStyle: 'long' }) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', options).format(d);
}

/**
 * Extracts a YouTube video id from a watch/short/embed/youtu.be URL.
 */
export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return '';
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return '';
}

export function youTubeThumbnail(url) {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

export function youTubeEmbedUrl(url) {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : '';
}
