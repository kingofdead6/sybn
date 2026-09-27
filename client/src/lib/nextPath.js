/**
 * The `?next=` return address on the login and register pages — where to send
 * someone once they are signed in (back to the course they wanted, say).
 * Only a path on this site is accepted, so a crafted link cannot bounce a
 * freshly signed-in visitor off to another website.
 */
export function nextPath(search) {
  const next = new URLSearchParams(search).get('next') || '';
  return next.startsWith('/') && !next.startsWith('//') && !next.includes('\\') ? next : '';
}

/** `?next=…` for a link, carrying the return address along. */
export function nextQuery(next) {
  return next ? `?next=${encodeURIComponent(next)}` : '';
}
