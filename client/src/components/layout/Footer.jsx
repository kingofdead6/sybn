import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import api from '../../lib/api';
import logoUrl from '../../assets/Logo.png';
import { CONTACTS, SocialIcon } from '../../lib/contactInfo';

export default function Footer() {
  const { t } = useTranslation('common');
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const isAr = locale === 'ar';

  // The guide download link is admin-managed under the `brand` setting.
  const [brand, setBrand] = useState(null);
  useEffect(() => {
    let mounted = true;
    api
      .get('/settings/brand')
      .then((res) => {
        if (mounted) setBrand(res.data.data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const linkClass =
    'inline-flex items-center gap-2.5 opacity-70 transition-opacity duration-fast ease-out hover:opacity-100';

  return (
    <footer className="bg-ink text-on-ink">
      <div className="h-[3px] bg-gradient-to-r from-accent-edge-from to-accent-edge-to" aria-hidden="true" />

      <div className="mx-auto max-w-[86rem] px-4 md:px-8 py-9 grid gap-8 md:grid-cols-3">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link to={prefix || '/'} className="inline-flex items-center gap-3">
            {/* The artwork has a white ground, so it gets a light plate to sit
                on rather than a dark halo against the ink band. */}
            <img
              src={logoUrl}
              alt=""
              className="h-14 w-auto shrink-0 rounded-md bg-on-ink px-2 py-1.5"
            />
            <span className="sr-only">{t('brandFull')}</span>
          </Link>
          <p className="text-sm leading-relaxed opacity-70 max-w-[34ch]">
            {isAr
              ? 'برامج تدريب ومرافقة معتمدة من المنظمة الدولية للعمل.'
              : 'ILO-accredited training and mentoring programs.'}
          </p>
          {/* The forums' motto — the line the programme closes on. */}
          <p className="text-sm italic leading-relaxed opacity-90 max-w-[34ch]">
            {isAr
              ? 'لا يكتمل النجاح حتى يصبح سببا في نجاح الآخرين.'
              : 'Success is not complete until it becomes a cause for the success of others.'}
          </p>
        </div>

        {/* Pages */}
        <nav className="flex flex-col gap-2.5 text-sm" aria-label={isAr ? 'روابط' : 'Links'}>
          <Link to={`${prefix}/privacy`} className={linkClass}>
            {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </Link>
          <Link to={`${prefix}/terms`} className={linkClass}>
            {isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}
          </Link>
          <Link to={`${prefix}/contact`} className={linkClass}>
            {isAr ? 'اتصل بنا' : 'Contact'}
          </Link>
          <Link to={`${prefix}/store`} className={linkClass}>
            {isAr ? 'المتجر' : 'Store'}
          </Link>
          <Link to={`${prefix}/store#request-item`} className={linkClass}>
            {isAr ? 'اطلب منتجًا' : 'Request an item'}
          </Link>
          <Link to={`${prefix}/store/examples`} className={linkClass}>
            {isAr ? 'نماذج المتاجر' : 'Store examples'}
          </Link>
          <Link to={`${prefix}/faq`} className={linkClass}>
            {isAr ? 'الأسئلة الشائعة' : 'FAQ'}
          </Link>
          <Link to={`${prefix}/forums`} className={linkClass}>
            {isAr ? 'رزنامة الملتقيات' : 'Forums calendar'}
          </Link>
          {brand?.guidePdf && (
            <a href={brand.guidePdf} target="_blank" rel="noreferrer" className={linkClass}>
              {isAr ? 'تحميل الدليل التعريفي' : 'Download the guide'}
            </a>
          )}
        </nav>

        {/* Contact + socials */}
        <div className="flex flex-col gap-2.5 text-sm">
          {CONTACTS.map((c) => (
            <a
              key={c.key}
              href={c.href}
              target={c.key === 'email' ? undefined : '_blank'}
              rel="noreferrer"
              className={linkClass}
            >
              <SocialIcon name={c.key} />
              <span dir={c.ltr ? 'ltr' : undefined} className={c.key === 'whatsapp' ? 'numerals' : undefined}>
                {c.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-rule">
        <p className="mx-auto max-w-[86rem] px-4 md:px-8 py-5 text-xs opacity-60">{t('copyright')}</p>
      </div>
    </footer>
  );
}
