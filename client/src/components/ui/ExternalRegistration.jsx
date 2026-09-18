/**
 * Shown on a training that is hosted elsewhere. The platform's own form stays
 * available underneath - this is an additional route to the organiser, never a
 * replacement for registering here.
 */
export default function ExternalRegistration({ url, provider, note, label, className = '' }) {
  if (!url) return null;

  return (
    <div className={`rounded-md border-s-2 border-s-accent bg-accent-wash px-5 py-4 ${className}`}>
      {note && <p className="text-sm leading-relaxed text-ink-soft">{note}</p>}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors duration-fast ease-out hover:text-accent-deep"
      >
        {label}
        {provider && <span className="text-muted">- {provider}</span>}
        <span aria-hidden="true">-&gt;</span>
      </a>
    </div>
  );
}
