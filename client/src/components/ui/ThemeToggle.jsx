import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

/* Matches LangToggle's shape so the two sit as a pair in the header. */
const VARIANTS = {
  light: 'border-rule text-ink hover:border-accent hover:text-accent',
  dark: 'border-rule text-on-ink hover:border-on-ink',
};

export default function ThemeToggle({ variant = 'light' }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t(isDark ? 'lightMode' : 'darkMode')}
      className={`inline-flex shrink-0 items-center justify-center rounded-pill border px-3 py-1.5 text-sm font-semibold transition-colors ${VARIANTS[variant]}`}
    >
      {/* Fixed 21px line box: the sun/moon glyphs have taller metrics than
          Latin text, so without this the button outgrows the language toggle
          sitting beside it. */}
      <span aria-hidden="true" className="block h-[21px] w-4 overflow-hidden leading-[21px]">
        {isDark ? '☀' : '☾'}
      </span>
    </button>
  );
}
