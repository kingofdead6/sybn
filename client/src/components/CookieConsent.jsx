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

  /*
   * The banner is fixed to the bottom of the viewport, so it covers whatever
   * the page has put there — it was silently swallowing clicks on the Create
   * Account button, among others. Padding the document while it is on screen
   * shifts the real layout up by its height, so nothing is ever underneath it
   * at any scroll position. The padding is removed the moment it is dismissed.
   */
  useEffect(() => {
    if (!visible) return undefined;
    const el = document.body;
    const previous = el.style.paddingBottom;
    el.style.paddingBottom = '7.5rem';
    const mq = window.matchMedia('(min-width: 640px)');
    const fit = () => { el.style.paddingBottom = mq.matches ? '5rem' : '7.5rem'; };
    fit();
    mq.addEventListener('change', fit);
    return () => {
      el.style.paddingBottom = previous;
      mq.removeEventListener('change', fit);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={locale === 'ar' ? 'إشعار ملفات تعريف الارتباط' : 'Cookie notice'}
      className="fixed bottom-0 inset-x-0 z-50 border-t border-rule bg-surface p-4 flex flex-col sm:flex-row items-center gap-3 justify-between"
    >
      <p className="text-sm text-ink-soft">
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
