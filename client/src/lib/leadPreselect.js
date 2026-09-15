/**
 * Lets a "register now" button anywhere on the page hand its track straight to
 * the quick-registration form further down, so the visitor does not have to
 * re-state a choice they already made by clicking that particular card.
 *
 * A one-line event bus rather than a context provider: the two ends sit in
 * unrelated branches of the tree, and nothing else needs to observe this.
 */
export const LEAD_PRESELECT_EVENT = 'siyb:lead-preselect';
export const LEAD_ANCHOR_ID = 'lead-capture';

/** Fire the choice and scroll the form into view. */
export function requestLead({ interest, track = '' } = {}) {
  window.dispatchEvent(
    new CustomEvent(LEAD_PRESELECT_EVENT, { detail: { interest, track } })
  );
  const el = document.getElementById(LEAD_ANCHOR_ID);
  if (!el) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

/** Subscribe to preselect requests. Returns an unsubscribe function. */
export function onLeadPreselect(handler) {
  const listener = (e) => handler(e.detail || {});
  window.addEventListener(LEAD_PRESELECT_EVENT, listener);
  return () => window.removeEventListener(LEAD_PRESELECT_EVENT, listener);
}
