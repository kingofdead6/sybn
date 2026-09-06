import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark =
    theme === 'dark' || (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="border border-line rounded-full w-9 h-9 flex items-center justify-center text-ink transition-colors hover:border-saffron hover:text-saffron-deep"
      aria-label={t(isDark ? 'lightMode' : 'darkMode')}
    >
      {isDark ? '☀' : '☾'}
    </button>
  );
}
