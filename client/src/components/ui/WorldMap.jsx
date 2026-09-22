/**
 * The programme's reach, shown as a map.
 *
 * The artwork itself is supplied rather than drawn: `src` points at an image
 * uploaded through the admin panel (stored on the `about.map` / `worldwide.map`
 * settings keys). Until one is set the component renders a labelled placeholder
 * at the same aspect ratio, so the band keeps its shape and the gap reads as
 * "artwork pending" rather than as a broken image.
 */
export default function WorldMap({ src, alt = '', caption, className = '' }) {
  return (
    <figure className={className}>
      <div className="relative overflow-hidden rounded-lg border border-rule bg-sunk">
        <div className="relative w-full pb-[52%]">
          {src ? (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
              <svg
                aria-hidden="true"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                className="text-muted/50"
              >
                <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.25" />
                <path
                  d="M2.75 12h18.5M12 2.75c2.5 2.7 2.5 15.8 0 18.5-2.5-2.7-2.5-15.8 0-18.5Z"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
              </svg>
              <span className="text-2xs caps-label text-muted">{alt || 'Map'}</span>
            </div>
          )}
        </div>
      </div>

      {caption && (
        <figcaption className="mt-3 text-sm leading-relaxed text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}
