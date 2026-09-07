import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const VARIANTS = {
  light: `
    border-rule
    text-ink
    hover:border-accent
    hover:text-accent
    hover:bg-accent/5
  `,
  dark: `
    border-rule
    text-on-ink
    hover:border-on-ink
    hover:text-on-ink
    hover:bg-on-ink/5
  `,
};

export default function ThemeToggle({ variant = 'light' }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t(isDark ? 'lightMode' : 'darkMode')}
      className={`
        !w-9
        !h-9
        !min-w-0
        !max-w-9
        !p-0
        !m-0
        shrink-0
        flex
        items-center
        justify-center
        rounded-md
        border
        bg-transparent
        transition-all
        duration-200
        ${VARIANTS[variant]}
      `}
    >
      <span
        aria-hidden="true"
        className="text-base leading-none transition-transform duration-200 hover:scale-110"
      >
        {isDark ? '☀' : '☾'}
      </span>
    </button>
  );
}