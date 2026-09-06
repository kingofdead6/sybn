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
      className="border border-line rounded-sm px-3 py-1.5 text-sm font-medium text-ink hover:border-saffron"
      aria-label={t(isDark ? 'lightMode' : 'darkMode')}
    >
      {isDark ? '☀' : '☾'}
    </button>
  );
}
