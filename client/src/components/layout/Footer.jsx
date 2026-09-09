import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';

export default function Footer() {
  const { t } = useTranslation('common');
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';

  return (
    <footer className="bg-ink text-on-ink">
      <div className="h-[3px] bg-gradient-to-r from-accent-edge-from to-accent-edge-to" aria-hidden="true" />
      <div className="mx-auto max-w-[86rem] px-4 md:px-8 py-9 grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-display text-lg">{t('brandFull')}</p>
          <p className="mt-2 text-sm opacity-70">contact@abcet.net</p>
          <p className="text-sm opacity-70" dir="ltr">
            +213 699 067 381
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link to={`${prefix}/privacy`} className="opacity-70 transition-opacity duration-fast ease-out hover:opacity-100">
            {locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </Link>
          <Link to={`${prefix}/terms`} className="opacity-70 transition-opacity duration-fast ease-out hover:opacity-100">
            {locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
          </Link>
          <Link to={`${prefix}/contact`} className="opacity-70 transition-opacity duration-fast ease-out hover:opacity-100">
            {locale === 'ar' ? 'اتصل بنا' : 'Contact'}
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <a
            href="https://www.facebook.com/2290555824559951"
            target="_blank"
            rel="noreferrer"
            className="opacity-70 transition-opacity duration-fast ease-out hover:opacity-100"
          >
            Facebook
          </a>
          <a
            href="https://www.youtube.com/channel/UC_2J7AbvqCmpAIVSIZDrUmA"
            target="_blank"
            rel="noreferrer"
            className="opacity-70 transition-opacity duration-fast ease-out hover:opacity-100"
          >
            YouTube
          </a>
        </div>
      </div>
      <div className="border-t border-rule">
        <p className="mx-auto max-w-[86rem] px-4 md:px-8 py-5 text-xs opacity-60">{t('copyright')}</p>
      </div>
    </footer>
  );
}
