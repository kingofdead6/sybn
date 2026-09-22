/**
 * Where a program lives.
 *
 * A program nested beneath another is reached at `/programs/<parent>/<child>`,
 * which is its canonical address; a top-level one at `/programs/<slug>`. The
 * rule is here rather than inlined so the menu, the cards, the breadcrumbs and
 * the redirect cannot drift apart.
 */

/** The parent's slug, whether the API populated the link or not. */
export function parentSlugOf(program) {
  const parent = program?.parent;
  if (!parent || typeof parent !== 'object') return null;
  return parent.slug || null;
}

/** The canonical path of a program, honouring its nesting. */
export function programPath(prefix, program) {
  const parentSlug = parentSlugOf(program);
  return parentSlug
    ? `${prefix}/programs/${parentSlug}/${program.slug}`
    : `${prefix}/programs/${program.slug}`;
}
