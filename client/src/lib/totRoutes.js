/**
 * Training of Trainers is the one programme with a section of its own rather
 * than a single page, so its slug is referenced from several places — the
 * landing page, its nested sub-pages, and the redirect that keeps the old flat
 * programme URLs working. It lives here so none of those has to import a page
 * component (and drag it into an unrelated bundle) just to read a string.
 */
export const TOT_SLUG = 'training-of-trainers';

/** The canonical path of a programme listed beneath TOT. */
export const totResourcePath = (prefix, slug) => `${prefix}/${TOT_SLUG}/${slug}`;
