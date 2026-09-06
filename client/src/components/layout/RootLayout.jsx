import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import CookieConsent from '../CookieConsent';

export default function RootLayout() {
  const { t } = useTranslation('common');
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        {t('skipToContent')}
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
