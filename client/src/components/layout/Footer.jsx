import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import logoUrl from '../../assets/Logo.png';

/* Brand contact points. Kept here as one list so the markup below stays a
   single loop instead of five near-identical blocks. */
const WHATSAPP_NUMBER = '+213 770 31 34 48';
const WHATSAPP_DIGITS = '213770313448';
const EMAIL = 'berrslim3@gmail.com';

const ICONS = {
  whatsapp:
    'M17.5 14.4c-.6-.3-2.3-1.1-2.6-1.2-.4-.1-.6-.2-.9.2s-1 1.2-1.2 1.4c-.2.2-.4.3-.8.1-.6-.3-1.6-.6-2.7-1.7-1-.9-1.6-2-1.8-2.4-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.6.2-.2.2-.4.3-.6.1-.2.1-.4 0-.6-.1-.2-.9-2.1-1.2-2.9-.3-.7-.6-.6-.9-.6h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.1-1.2 2.6s1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.4 3 1.3 3 .9 3.5.8.5 0 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 00-8.6 15L2 22l5.1-1.3A10 10 0 1012 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2z',
  email: 'M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm9 8L4.2 7.4 4 7v.6l8 5.7 8-5.7V7l-.2.4L12 13z',
  instagram:
    'M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 3.3a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm0 10.7a4.2 4.2 0 110-8.4 4.2 4.2 0 010 8.4zm6.8-11a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z',
  facebook:
    'M13.5 21v-7.5H16l.4-3H13.5V8.4c0-.9.2-1.5 1.5-1.5h1.6V4.3c-.3 0-1.3-.1-2.5-.1-2.4 0-4 1.5-4 4.1v2.4H7.5v3H10V21h3.5z',
  youtube:
    'M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15.2V8.8l5.2 3.2-5.2 3.2z',
};

function SocialIcon({ name, className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

const SOCIALS = [
  { key: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_DIGITS}` },
  { key: 'instagram', label: '@berrayah_slimane', href: 'https://instagram.com/berrayah_slimane' },
  { key: 'facebook', label: 'Slimane Berrayah', href: 'https://www.facebook.com/2290555824559951' },
  {
    key: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/channel/UC_2J7AbvqCmpAIVSIZDrUmA',
  },
];

export default function Footer() {
  const { t } = useTranslation('common');
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const isAr = locale === 'ar';

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
        </nav>

        {/* Contact + socials */}
        <div className="flex flex-col gap-2.5 text-sm">
          <a href={`https://wa.me/${WHATSAPP_DIGITS}`} target="_blank" rel="noreferrer" className={linkClass}>
            <SocialIcon name="whatsapp" />
            <span dir="ltr" className="numerals">{WHATSAPP_NUMBER}</span>
          </a>
          <a href={`mailto:${EMAIL}`} className={linkClass}>
            <SocialIcon name="email" />
            <span dir="ltr">{EMAIL}</span>
          </a>
          {SOCIALS.filter((s) => s.key !== 'whatsapp').map((s) => (
            <a key={s.key} href={s.href} target="_blank" rel="noreferrer" className={linkClass}>
              <SocialIcon name={s.key} />
              <span dir={s.key === 'instagram' ? 'ltr' : undefined}>{s.label}</span>
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
