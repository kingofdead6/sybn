import { useEffect, useState } from 'react';
import { useLocale } from '../context/LocaleContext';
import Button from './ui/Button';

const KEY = 'siyb-cookie-consent';

export function hasAnalyticsConsent() {
  try {
    return localStorage.getItem(KEY) === 'accepted';
  } catch {
    return false;
  }
}

export default function CookieConsent() {
  const { locale } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function choose(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={locale === 'ar' ? 'إشعار ملفات تعريف الارتباط' : 'Cookie notice'}
      className="fixed bottom-0 inset-x-0 z-50 border-t border-line bg-surface p-4 flex flex-col sm:flex-row items-center gap-3 justify-between"
    >
      <p className="text-sm text-body">
        {locale === 'ar'
          ? 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل استخدام الموقع. يمكنك قبولها أو رفضها.'
          : 'We use cookies to improve your experience and analyze site usage. You can accept or decline.'}
      </p>
      <div className="flex gap-2 shrink-0">
        <Button size="sm" variant="secondary" onClick={() => choose('declined')}>
          {locale === 'ar' ? 'رفض' : 'Decline'}
        </Button>
        <Button size="sm" onClick={() => choose('accepted')}>
          {locale === 'ar' ? 'قبول' : 'Accept'}
        </Button>
      </div>
    </div>
  );
}
