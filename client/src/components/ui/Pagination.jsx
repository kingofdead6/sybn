import { useTranslation } from 'react-i18next';

export default function Pagination({ page, limit, total, onPageChange }) {
  const { i18n } = useTranslation();
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  if (totalPages <= 1) return null;

  const format = (n) => (i18n.language === 'ar' ? n.toLocaleString('ar-EG') : n);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 pt-6">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="border border-line rounded-full w-9 h-9 flex items-center justify-center text-sm text-ink shadow-sm transition-colors hover:border-saffron disabled:opacity-40"
      >
        {i18n.dir() === 'rtl' ? '›' : '‹'}
      </button>
      <span className="text-sm text-body numerals">
        {format(page)} / {format(totalPages)}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="border border-line rounded-full w-9 h-9 flex items-center justify-center text-sm text-ink shadow-sm transition-colors hover:border-saffron disabled:opacity-40"
      >
        {i18n.dir() === 'rtl' ? '‹' : '›'}
      </button>
    </nav>
  );
}
