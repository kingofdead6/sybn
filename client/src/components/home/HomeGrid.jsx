import AscentEdge from '../motion/AscentEdge';

/**
 * A band of the home page: a titled section holding one row-set of tiles.
 *
 * The page is a sequence of these rather than one continuous grid — each band
 * gets its own heading and generous vertical room, so the page reads long and
 * calm instead of cramming every tile into one dense screen.
 */
/* Section rhythm must vary so the page has cadence — see DESIGN.md §4. */
const RHYTHM = {
  base: 'py-8 md:py-10',
  loose: 'py-10 md:py-[7rem]',
};

export function HomeBand({ label, title, rhythm = 'base', children, className = '', ...props }) {
  return (
    <section className={`${RHYTHM[rhythm]} ${className}`} {...props}>
      <div className="mx-auto max-w-[86rem] px-4 md:px-8">
        {(label || title) && (
          <div className="mb-6 flex flex-col gap-3 md:mb-8">
            {label && <AscentEdge label={label} />}
            {title && (
              <h2 className="font-display text-xl md:text-2xl leading-tight text-ink max-w-[26ch]">
                {title}
              </h2>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 md:auto-rows-min md:grid-cols-6 md:gap-5">
          {children}
        </div>
      </div>
    </section>
  );
}

/** A plain full-width row of tiles with no heading. */
export default function HomeGrid({ children, className = '' }) {
  return (
    <div className={`mx-auto max-w-[86rem] px-4 md:px-8 ${className}`}>
      <div className="grid grid-cols-1 gap-4 md:auto-rows-min md:grid-cols-6 md:gap-5">
        {children}
      </div>
    </div>
  );
}
