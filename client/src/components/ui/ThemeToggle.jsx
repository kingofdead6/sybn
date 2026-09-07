import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const VARIANTS = {
  light: 'border-rule text-ink hover:border-accent hover:text-accent',
  dark: 'border-rule text-on-ink hover:border-on-ink hover:text-on-ink',
};

export default function ThemeToggle({ variant = 'light' }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark =
    theme === 'dark' || (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`border rounded-sm w-9 h-9 flex items-center justify-center transition-colors ${VARIANTS[variant]}`}
      aria-label={t(isDark ? 'lightMode' : 'darkMode')}
    >
      {isDark ? '☀' : '☾'}
    </button>
  );
}
