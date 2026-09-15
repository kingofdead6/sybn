/**
 * Track colours are CATEGORICAL, not decorative — see DESIGN.md §1. They
 * identify which programme track something belongs to and appear only as an
 * edge rule, a marker or a numeral, never as a full-bleed fill and never as a
 * button, link or focus state.
 */
export const TRACKS = {
  green: { text: 'text-track-gyb', bg: 'bg-track-gyb', border: 'border-track-gyb' },
  orange: { text: 'text-track-syb', bg: 'bg-track-syb', border: 'border-track-syb' },
  blue: { text: 'text-track-iyb', bg: 'bg-track-iyb', border: 'border-track-iyb' },
  slate: { text: 'text-track-neutral', bg: 'bg-track-neutral', border: 'border-track-neutral' },
  navy: { text: 'text-ink', bg: 'bg-ink', border: 'border-ink' },
};

/** The track palette for an accent name, falling back to the blue track. */
export function trackStyle(accent) {
  return TRACKS[accent] || TRACKS.blue;
}

const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/** Two-digit ordinal in the reader's numeral system. */
export function localeDigits(n, locale) {
  const s = String(n).padStart(2, '0');
  return locale === 'ar' ? s.replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]) : s;
}
