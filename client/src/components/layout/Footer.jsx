import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import logoUrl from '../../assets/Logo.png';
import { CONTACTS, SocialIcon } from '../../lib/contactInfo';

/* The footer's link columns, each under its own heading. */
const COLUMNS = [
  {
    heading: { ar: 'البرنامج', en: 'The program' },
    links: [
      { to: '/about', ar: 'عن البرنامج', en: 'About the program' },
      { to: '/forums', ar: 'رزنامة الملتقيات', en: 'Forums calendar' },
      { to: '/faq', ar: 'الأسئلة الشائعة', en: 'FAQ' },
      { to: '/contact', ar: 'اتصل بنا', en: 'Contact' },
    ],
  },
  {
    heading: { ar: 'المتجر', en: 'Store' },
    links: [
      { to: '/store', ar: 'المتجر', en: 'Store' },
      { to: '/store#request-item', ar: 'اطلب منتجًا', en: 'Request an item' },
      { to: '/store/create-your-shop', ar: 'نماذج المتاجر', en: 'Store examples' },
    ],
  },
  {
    heading: { ar: 'قانوني', en: 'Legal' },
    links: [
      { to: '/privacy', ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
      { to: '/terms', ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
    ],
  },
];

/* WhatsApp and email are the two ways to reach the team, so they get their
   own column; the rest are social profiles, shown as round icon buttons. */
const DIRECT = CONTACTS.filter((c) => c.key === 'whatsapp' || c.key === 'email');
// YouTube is left out of the footer; the Contact page still lists it.
const SOCIAL = CONTACTS.filter((c) => c.key !== 'youtube');

export default function Footer() {
  const { t } = useTranslation('common');
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const isAr = locale === 'ar';

  const linkClass =
    'group inline-flex items-center gap-2 opacity-70 transition-all duration-fast ease-out hover:opacity-100 hover:translate-x-0.5 rtl:hover:-translate-x-0.5';

  return (
    <footer className="relative overflow-hidden bg-ink text-on-ink">
      <div className="h-[3px] bg-gradient-to-r from-accent-edge-from to-accent-edge-to" aria-hidden="true" />

      {/* Atmosphere: a soft glow in the brand's edge colours and the name set
          huge and faint behind everything. Both are decoration only. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 start-1/2 h-80 w-[40rem] -translate-x-1/2 rtl:translate-x-1/2 rounded-full bg-gradient-to-r from-accent-edge-from to-accent-edge-to opacity-[0.12] blur-3xl" />
        <span
          dir="ltr"
          className="absolute -bottom-6 end-0 select-none font-display text-[clamp(6rem,18vw,16rem)] font-bold leading-none tracking-tight text-on-ink opacity-[0.035]"
        >
          SIYB
        </span>
      </div>

      <div className="relative mx-auto max-w-[86rem] px-4 md:px-8">
        {/* The forums' motto — the line the programme closes on — set as the
            footer's headline, with the one action beside it. */}
        <div className="flex flex-col gap-6 border-b border-[color-mix(in_srgb,var(--c-on-ink)_10%,transparent)] py-7 md:flex-row md:items-center md:justify-between md:py-8">
          <blockquote className="max-w-[44ch]">
            <span
              aria-hidden="true"
              className="block font-display text-3xl leading-none text-accent-edge-to opacity-80"
            >
              {isAr ? '”' : '“'}
            </span>
            <p className="font-display text-xl md:text-2xl leading-snug">
              {isAr
                ? 'لا يكتمل النجاح حتى يصبح سببا في نجاح الآخرين.'
                : 'Success is not complete until it becomes a cause for the success of others.'}
            </p>
          </blockquote>

          <Link
            to={`${prefix}/contact`}
            className="btn-label inline-flex shrink-0 items-center gap-2 self-start rounded-pill bg-on-ink px-5 py-3 text-sm text-ink shadow-raised transition-transform duration-base ease-out hover:-translate-y-0.5 md:self-auto"
          >
            {isAr ? 'تواصل معنا' : 'Get in touch'}
            <span aria-hidden="true">{isAr ? '←' : '→'}</span>
          </Link>
        </div>

        <div className="grid gap-7 py-7 md:py-8 lg:grid-cols-12 lg:gap-6">
          {/* Brand, with the social profiles as round buttons. */}
          <div className="flex flex-col gap-5 lg:col-span-3">
            <Link to={prefix || '/'} className="inline-flex self-start">
              {/* The artwork has a white ground, so it gets a light plate to
                  sit on rather than a dark halo against the ink band. */}
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
            <ul className="flex flex-wrap gap-2.5">
              {SOCIAL.map((c) => (
                <li key={c.key}>
                  <a
                    href={c.href}
                    target={c.key === 'email' ? undefined : '_blank'}
                    rel="noreferrer"
                    aria-label={c.name}
                    title={c.name}
                    className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--c-on-ink)_20%,transparent)] transition-all duration-base ease-out hover:-translate-y-0.5 hover:border-transparent hover:bg-on-ink hover:text-ink"
                  >
                    <SocialIcon name={c.key} className="h-[1.1rem] w-[1.1rem]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns. */}
          <nav
            className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:col-span-6"
            aria-label={isAr ? 'روابط' : 'Links'}
          >
            {COLUMNS.map((col) => (
              <div key={col.heading.en} className="flex flex-col gap-3">
                <h2 className="text-2xs caps-label opacity-50">{col.heading[locale]}</h2>
                <ul className="flex flex-col gap-2.5 text-sm">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link to={`${prefix}${l.to}`} className={linkClass}>
                        {l[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Direct contact. */}
          <div className="flex flex-col gap-3 lg:col-span-3">
            <h2 className="text-2xs caps-label opacity-50">{isAr ? 'تواصل' : 'Reach us'}</h2>
            <ul className="flex flex-col gap-3">
              {DIRECT.map((c) => (
                <li key={c.key}>
                  <a
                    href={c.href}
                    target={c.key === 'email' ? undefined : '_blank'}
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-md border border-[color-mix(in_srgb,var(--c-on-ink)_10%,transparent)] bg-[color-mix(in_srgb,var(--c-on-ink)_4%,transparent)] p-3 transition-colors duration-base ease-out hover:border-[color-mix(in_srgb,var(--c-on-ink)_25%,transparent)] hover:bg-[color-mix(in_srgb,var(--c-on-ink)_8%,transparent)]"
                  >
                    <span className="flex h-[2.25rem] w-[2.25rem] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-edge-from to-accent-edge-to text-on-accent">
                      <SocialIcon name={c.key} />
                    </span>
                    <span
                      dir={c.ltr ? 'ltr' : undefined}
                      className={`min-w-0 truncate text-sm ${c.key === 'whatsapp' ? 'numerals' : ''}`}
                    >
                      {c.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-[color-mix(in_srgb,var(--c-on-ink)_10%,transparent)]">
        <div className="mx-auto flex max-w-[86rem] items-center justify-between gap-4 px-4 py-5 md:px-8">
          <p className="text-xs opacity-60">{t('copyright')}</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex h-[2.25rem] w-[2.25rem] shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--c-on-ink)_20%,transparent)] transition-all duration-base ease-out hover:-translate-y-0.5 hover:bg-on-ink hover:text-ink"
            aria-label={isAr ? 'العودة إلى الأعلى' : 'Back to top'}
            title={isAr ? 'العودة إلى الأعلى' : 'Back to top'}
          >
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 10 10">
              <path d="M1 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
