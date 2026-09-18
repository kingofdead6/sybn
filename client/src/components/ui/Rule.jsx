/**
 * A divider between stacked blocks. Drawn as a short vertical accent bar at the
 * reading-direction start rather than a full-width horizontal line, so the
 * separation cue reads vertically.
 */
export default function Rule({ className = '' }) {
  return (
    <div className={`flex ${className}`} role="presentation">
      <span
        aria-hidden="true"
        className="block h-[3px] w-full rounded-pill bg-gradient-to-r from-accent-edge-from to-accent-edge-to"
      />
    </div>
  );
}
