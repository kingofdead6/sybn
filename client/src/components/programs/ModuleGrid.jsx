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

/**
 * The training packages of a program, rendered as the card grid from the
 * reference site: illustration, a solid title button, then the video / PDF /
 * exam resource buttons that the admin fills in per module.
 */
export default function ModuleGrid({ modules = [], accent = 'blue' }) {
  const { t } = useTranslation('programs');
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  if (!modules.length) return null;

  const accentBg = {
    green: 'bg-accent-green',
    orange: 'bg-accent-orange',
    blue: 'bg-accent-lightblue',
    slate: 'bg-accent-slate',
    navy: 'bg-ink',
  }[accent] || 'bg-accent-lightblue';

  const sorted = [...modules].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((m) => (
        <div
          key={m._id || m.title?.ar}
          className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          {m.image ? (
            <img
              src={m.image}
              alt={m.title?.[locale] || ''}
              className="w-full aspect-[4/3] rounded object-cover bg-surface-muted"
              loading="lazy"
            />
          ) : (
            <div className="w-full aspect-[4/3] rounded bg-surface-muted" />
          )}

          <span
            className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-on-saffron ${accentBg}`}
          >
            {m.title?.[locale]}
          </span>

          {(m.videoUrl || m.pdfUrl) && (
            <div className="grid grid-cols-2 gap-2">
              {m.videoUrl && (
                <a
                  href={m.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-3 py-2 text-xs font-medium text-ink transition-colors hover:border-saffron hover:text-saffron-deep"
                >
                  <VideoIcon />
                  {t('moduleVideo')}
                </a>
              )}
              {m.pdfUrl && (
                <a
                  href={m.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-3 py-2 text-xs font-medium text-ink transition-colors hover:border-saffron hover:text-saffron-deep"
                >
                  <PdfIcon />
                  {t('modulePdf')}
                </a>
              )}
            </div>
          )}

          {m.exam && (
            <Link
              to={`${prefix}/exams/${m.exam}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-3 py-2 text-xs font-medium text-ink transition-colors hover:border-saffron hover:text-saffron-deep"
            >
              <ExamIcon />
              {t('moduleExam')}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
