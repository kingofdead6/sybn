import worldMapUrl from '../../assets/worldimage.webp';

/**
 * The programme's reach, shown as a map.
 *
 * The bundled artwork is the default; `src` overrides it with an image
 * uploaded through the admin panel, so the map can be refreshed as coverage
 * changes without a deploy.
 *
 * The artwork has a transparent ground, so it is laid on the page rather than
 * boxed in a card — a framed map reads as a screenshot, an unframed one as
 * part of the page. `legend` draws the key in our own type and colours instead
 * of relying on the small baked-in one.
 */
export default function WorldMap({
  src,
  alt = '',
  caption,
  legend = [],
  className = '',
}) {
  return (
    <figure className={className}>
      {/* The artwork is drawn for a light ground — its uncovered countries are
          pale grey with dark outlines, which would all but vanish against the
          dark theme. So the map keeps its own near-white plate in both themes
          and is inset from it, rather than being painted on the page. */}
      <div className="rounded-lg bg-[#FBFCFD] p-4 shadow-raised md:p-7">
        <img
          src={src || worldMapUrl}
          alt={alt}
          loading="lazy"
          className="mx-auto w-full object-contain"
        />
      </div>

      {(legend.length > 0 || caption) && (
        <figcaption className="mt-5 flex flex-col items-center gap-3 text-center">
          {legend.length > 0 && (
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {legend.map((entry) => (
                <li key={entry.label} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 rounded-[3px]"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs caps-label text-ink-soft">{entry.label}</span>
                </li>
              ))}
            </ul>
          )}

          {caption && (
            <span className="text-sm leading-relaxed text-muted max-w-[62ch]">{caption}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
