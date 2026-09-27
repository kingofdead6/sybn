import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import siybLogoUrl from '../../assets/siybLogo.jpg';
import symbolLogoUrl from '../../assets/SymbolLogo.png';
import iloLogoUrl from '../../assets/ILOLogo.png';
import writingLogoUrl from '../../assets/WritingLogo.png';
import { CONTACTS, SocialIcon } from '../../lib/contactInfo';

/* The footer's link columns, each under its own heading. */
const COLUMNS = [
  {
    heading: { ar: 'البرنامج', en: 'The program' },
    links: [
      { to: '/about', ar: 'عن البرنامج', en: 'About the program' },
      { to: '/courses', ar: 'الدورات التخصصية', en: 'Specialized courses' },
      { to: '/forums', ar: 'رزنامة الملتقيات', en: 'Forums calendar' },
      { to: '/faq', ar: 'الأسئلة الشائعة', en: 'FAQ' },
      { to: '/contact', ar: 'اتصل بنا', en: 'Contact' },
    ],
  },
  {
    heading: { ar: 'المتجر', en: 'Store' },
    links: [
      { to: '/store', ar: 'المتجر', en: 'Store' },
      { to: '/store/create-your-shop', ar: 'نماذج المتاجر', en: 'Store examples' },
      { to: '/store/create-your-shop#request-shop', ar: 'اطلب متجرًا', en: 'Request a shop' },
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

/* Every way to reach the team, in the "Reach us" column. */
const DIRECT = CONTACTS;

/* Each channel's tile in its own network's colour, with a soft glow of the
   same; email, which has none, takes the site's accent. */
const CHANNEL_TILE = {
  whatsapp: 'bg-[#25D366] shadow-[0_6px_14px_-6px_#25D366]',
  email: 'bg-gradient-to-br from-accent-edge-from to-accent-edge-to shadow-[0_6px_14px_-6px_var(--c-accent-edge-to)]',
  instagram: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] shadow-[0_6px_14px_-6px_#DD2A7B]',
  facebook: 'bg-[#1877F2] shadow-[0_6px_14px_-6px_#1877F2]',
};

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
          <blockquote className="min-w-0 flex-1">
            <span
              aria-hidden="true"
              className="block font-display text-3xl leading-none text-accent-edge-to opacity-80"
            >
              {isAr ? '”' : '“'}
            </span>
            <p className="font-display text-xl leading-snug xl:whitespace-nowrap xl:text-[clamp(1.25rem,1.75vw,1.75rem)]">
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

        <div className="grid gap-7 py-7 md:grid-cols-2 md:py-8 min-[1360px]:grid-cols-12 min-[1360px]:gap-6">
          {/* Brand: the three marks side by side — SIYB, the platform, the
              ILO — with the platform's wordmark beneath, then the
              tagline. The artwork is coloured on light (the white ILO mark is
              recoloured ILO blue), so the marks share a white
              card that reads the same in either theme. The row keeps its
              left-to-right order in Arabic too: it is an arrangement of
              logos, not text. */}
          <div className="flex flex-col gap-5 min-[1360px]:col-span-3">
            <Link
              to={prefix || '/'}
              className="flex flex-col items-center gap-3 rounded-lg bg-white p-4 shadow-raised transition-transform duration-base ease-out hover:-translate-y-0.5"
            >
              <span dir="ltr" className="grid w-full grid-cols-3 items-center gap-3">
                {/* The artwork has an off-white ground; a touch of brightness lifts it
                    to the card's white without shifting the colours. */}
                <img src={siybLogoUrl} alt="SIYB" className="h-12 w-full object-contain [filter:brightness(1.07)]" />
                <img src={symbolLogoUrl} alt="" className="h-14 w-full object-contain" />
                {/* The ILO artwork is white; used as a mask over ILO blue it
                    reads blue on the card's white, like the other two. */}
                <span
                  role="img"
                  aria-label="ILO"
                  className="block h-12 w-full bg-[#1E2DBE]"
                  style={{
                    WebkitMaskImage: `url(${iloLogoUrl})`,
                    maskImage: `url(${iloLogoUrl})`,
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                  }}
                />
              </span>
              <img src={writingLogoUrl} alt="" className="h-8 w-auto max-w-full object-contain" />
              <span className="sr-only">{t('brandFull')}</span>
            </Link>

            <p className="-mt-3 text-center text-md leading-relaxed opacity-80">
              {isAr
                ? 'برامج تدريب ومرافقة معتمدة من المنظمة الدولية للعمل.'
                : 'ILO-accredited training and mentoring programs.'}
            </p>
          </div>

          {/* Link columns. */}
          <nav
            className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:order-last md:col-span-2 min-[1360px]:order-none min-[1360px]:col-span-5"
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

          {/* Direct contact: one panel, a row per channel, each marked in its
              own network's colour so it is recognised before it is read. */}
          <div className="flex flex-col gap-3 min-[1360px]:col-span-4">
            <h2 className="text-2xs caps-label opacity-50">{isAr ? 'تواصل' : 'Reach us'}</h2>
            {/* A compact 2×2 of small cards: the channel's icon, glowing
                softly in its own colour, beside its name and value. Each
                card is kept wide enough for its value on one line; where
                two will not fit side by side, they stack. */}
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(11.75rem,1fr))] gap-2">
              {DIRECT.map((c) => (
                <li key={c.key}>
                  <a
                    href={c.href}
                    target={c.key === 'email' ? undefined : '_blank'}
                    rel="noreferrer"
                    className="group flex h-full items-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--c-on-ink)_10%,transparent)] bg-[color-mix(in_srgb,var(--c-on-ink)_4%,transparent)] p-2 ps-2.5 transition-all duration-base ease-out hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--c-on-ink)_22%,transparent)] hover:bg-[color-mix(in_srgb,var(--c-on-ink)_7%,transparent)]"
                  >
                    <span
                      className={`flex h-[2rem] w-[2rem] shrink-0 items-center justify-center rounded-md text-white transition-transform duration-base ease-out group-hover:scale-110 ${CHANNEL_TILE[c.key]}`}
                    >
                      <SocialIcon name={c.key} className="h-[0.95rem] w-[0.95rem]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-2xs leading-tight opacity-55">
                        {isAr ? c.nameAr : c.name}
                      </span>
                      <span
                        dir={c.ltr ? 'ltr' : undefined}
                        title={c.label}
                        className={`block whitespace-nowrap text-[0.75rem] font-medium leading-snug ${isAr && c.ltr ? 'text-end' : ''} ${c.key === 'whatsapp' ? 'numerals' : ''}`}
                      >
                        {c.label}
                      </span>
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
