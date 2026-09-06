import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';

export default function Footer() {
  const { t } = useTranslation('common');
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  return (
    <footer className="bg-ink text-on-ink">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-9 grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">{t('brandFull')}</p>
          <p className="mt-2 text-sm opacity-80">contact@abcet.net</p>
          <p className="text-sm opacity-80" dir="ltr">
            +213 699 067 381
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link to={`${prefix}/privacy`} className="opacity-80 hover:opacity-100">
            {locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </Link>
          <Link to={`${prefix}/terms`} className="opacity-80 hover:opacity-100">
            {locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
          </Link>
          <Link to={`${prefix}/contact`} className="opacity-80 hover:opacity-100">
            {locale === 'ar' ? 'اتصل بنا' : 'Contact'}
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <a
            href="https://www.facebook.com/2290555824559951"
            target="_blank"
            rel="noreferrer"
            className="opacity-80 hover:opacity-100"
          >
            Facebook
          </a>
          <a
            href="https://www.youtube.com/channel/UC_2J7AbvqCmpAIVSIZDrUmA"
            target="_blank"
            rel="noreferrer"
            className="opacity-80 hover:opacity-100"
          >
            YouTube
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 md:px-6 py-4 text-xs opacity-70">{t('copyright')}</p>
      </div>
    </footer>
  );
}
