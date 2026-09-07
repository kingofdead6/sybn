import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';

function VideoIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M2 5.5A1.5 1.5 0 013.5 4h9A1.5 1.5 0 0114 5.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 14.5v-9zM15.5 7.5l3-1.75v8.5l-3-1.75v-5z" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M3 3.5A1.5 1.5 0 014.5 2H10v5h5v10.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 013 17.5v-14zM11.5 2.5L15.5 6.5H11.5v-4z" />
    </svg>
  );
}

function ExamIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 1.5l2.09 1.52 2.53-.36.79 2.44 2.16 1.4-1.4 2.16.36 2.53-2.44.79-1.52 2.09L10 13.2l-2.57.87-1.52-2.09-2.44-.79.36-2.53L2.43 6.5l2.16-1.4.79-2.44 2.53.36L10 1.5z" />
      <path d="M6.5 14l-1.2 4.5L10 16.8l4.7 1.7L13.5 14" />
    </svg>
  );
}

/* Track colours are categorical only — an edge rule and a numeral, never a
   background fill. See DESIGN.md §1. */
const TRACKS = {
  green: { rule: 'border-s-track-gyb', text: 'text-track-gyb' },
  orange: { rule: 'border-s-track-syb', text: 'text-track-syb' },
  blue: { rule: 'border-s-track-iyb', text: 'text-track-iyb' },
  slate: { rule: 'border-s-track-neutral', text: 'text-track-neutral' },
  navy: { rule: 'border-s-ink', text: 'text-ink' },
};

const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

function localeDigits(n, locale) {
  const s = String(n).padStart(2, '0');
  return locale === 'ar' ? s.replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]) : s;
}

const linkClass =
  'inline-flex items-center justify-center gap-2 rounded-sm border border-rule px-3 py-2 text-xs font-medium text-ink transition-colors duration-fast ease-out hover:border-accent hover:text-accent';

/**
 * The training packages of a program, as a numbered ledger of cards.
 *
 * Modules usually carry only a title and an order — images are optional and in
 * practice rarely set — so the card leads with its sequence numeral and title.
 * An illustration is rendered when one exists; when it does not, the card simply
 * closes up rather than reserving a large empty frame.
 */
export default function ModuleGrid({ modules = [], accent = 'blue' }) {
  const { t } = useTranslation('programs');
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  if (!modules.length) return null;

  const track = TRACKS[accent] || TRACKS.blue;
  const sorted = [...modules].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((m, i) => {
        const links = [
          m.videoUrl && { key: 'v', href: m.videoUrl, icon: <VideoIcon />, label: t('moduleVideo') },
          m.pdfUrl && { key: 'p', href: m.pdfUrl, icon: <PdfIcon />, label: t('modulePdf') },
        ].filter(Boolean);

        return (
          <li
            key={m._id || m.title?.ar || i}
            className={`flex flex-col gap-3 rounded-sm border border-rule border-s-2 ${track.rule} bg-surface p-5`}
          >
            <div className="flex items-baseline gap-3">
              <span
                className={`numerals shrink-0 text-2xs font-semibold ${track.text}`}
                aria-hidden="true"
              >
                {localeDigits(m.order || i + 1, locale)}
              </span>
              <h3 className="font-display text-md leading-snug text-ink">{m.title?.[locale]}</h3>
            </div>

            {m.image && (
              <img
                src={m.image}
                alt=""
                className="w-full aspect-[4/3] rounded-sm border border-rule object-cover"
                loading="lazy"
              />
            )}

            {(links.length > 0 || m.exam) && (
              <div className="mt-auto flex flex-wrap gap-2 border-t border-rule pt-3">
                {links.map((l) => (
                  <a key={l.key} href={l.href} target="_blank" rel="noreferrer" className={linkClass}>
                    {l.icon}
                    {l.label}
                  </a>
                ))}
                {m.exam && (
                  <Link to={`${prefix}/exams/${m.exam}`} className={linkClass}>
                    <ExamIcon />
                    {t('moduleExam')}
                  </Link>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
