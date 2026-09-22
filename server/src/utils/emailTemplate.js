/**
 * Placeholder substitution for trainer emails.
 *
 * A template is written once and sent to many people; each recipient's own
 * details are substituted in as it goes out.
 */

/** The placeholders a template may use, and where each reads from. */
export const PLACEHOLDERS = [
  'name',
  'email',
  'country',
  'program',
  'certifiedAt',
  'brandName',
  'brandPhone',
];

/** HTML-escapes a value. */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * The values for one trainer.
 *
 * Everything is reduced to a string here, so substitution never injects
 * `[object Object]` or `undefined` into a message someone receives.
 */
export function valuesFor(trainer, brand = {}, locale = 'ar') {
  const program = trainer.program;
  const programTitle =
    (program && typeof program === 'object' ? program.title?.[locale] || program.title?.ar : '') ||
    (program && typeof program === 'object' ? program.code : '') ||
    '';

  return {
    name: trainer.name || '',
    email: trainer.email || '',
    country: trainer.country || '',
    program: programTitle,
    certifiedAt: trainer.certifiedAt
      ? new Date(trainer.certifiedAt).toLocaleDateString(locale === 'en' ? 'en-GB' : 'ar')
      : '',
    brandName: brand.name?.[locale] || brand.name?.ar || '',
    brandPhone: brand.phone || '',
  };
}

/**
 * Replaces `{{placeholder}}` throughout `body`.
 *
 * `escape` must be true whenever the result is HTML: a trainer's name is data
 * the admin typed, and dropping it into markup unescaped would let a stray
 * angle bracket — or a deliberate one — break or hijack the message.
 *
 * An unknown placeholder is left exactly as written rather than blanked, so a
 * typo is visible in the preview instead of silently vanishing.
 */
export function render(body, values, { escape = false } = {}) {
  if (!body) return '';
  return String(body).replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    if (!(key in values)) return match;
    const value = values[key] ?? '';
    return escape ? escapeHtml(value) : String(value);
  });
}

/** Renders a whole template for one trainer. */
export function renderTemplate(template, trainer, brand, locale = 'ar') {
  const values = valuesFor(trainer, brand, locale);
  return {
    subject: render(template.subject, values),
    html: render(template.html, values, { escape: true }),
    text: render(template.text, values),
  };
}
