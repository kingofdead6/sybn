/* The site's identity for search engines: its public address, the
   organisation, the owner, and the schema.org JSON-LD built from them. Kept
   free of browser, JSX and Vite imports so the Node build scripts
   (scripts/prerender.js, scripts/routes.js) and vite.config.js can import it.

   Anything marked PLACEHOLDER is information the repo does not have; fill it
   in and rebuild. Empty values are left out of the structured data. */

// Mirrors contactInfo.jsx, which holds JSX and so cannot be imported from Node.
export const EMAIL = 'berrslim3@gmail.com';
export const WHATSAPP_NUMBER = '+213 770 31 34 48';
const TELEPHONE = WHATSAPP_NUMBER.replace(/\s/g, '');

/** The public origin, with no trailing slash. Canonical URLs, the sitemap and
    Open Graph tags are all built from it, never from window.location, so a
    prerender run on localhost still bakes in the real address. */
export const SITE_URL = 'https://syb-now.com';

/** The brand as it appears in titles. */
/** Absolute URL of a language-neutral path: ('/about', 'en') → '/en/about'.
    Arabic, the primary language, has no prefix; neither URL ends in '/'
    except the Arabic home page. */
export function localeUrl(path, locale) {
  const bare = path && path !== '/' ? path : '';
  if (locale === 'en') return `${SITE_URL}/en${bare}`;
  return `${SITE_URL}${bare || '/'}`;
}

export const SITE_NAME = 'SIYB';
export const BRAND = { ar: 'أبسط SIYB', en: 'SIYB' };

/** Shared-link preview image, served from /public. 1200×630. */
export const OG_IMAGE = `${SITE_URL}/og-image.png`;
export const LOGO = `${SITE_URL}/logo.png`;

export const ORGANIZATION = {
  name: 'SIYB',
  alternateNames: [
    'أبسط',
    'SIYB Algeria',
    'SIYB الجزائر',
    'Start and Improve Your Business',
    'إبدأ، حسن وطور أعمالك',
    'SYB Now',
  ],
  description: {
    en: 'ILO-accredited Start and Improve Your Business (SIYB) training, mentoring and trainer-accreditation programs for entrepreneurs in Algeria and the Arab world.',
    ar: 'برامج "أبسط" SIYB المعتمدة من المنظمة الدولية للعمل للتكوين والمرافقة واعتماد المدربين لرواد الأعمال في الجزائر والعالم العربي.',
  },
  address: {
    addressCountry: 'DZ',
    addressLocality: '', // PLACEHOLDER: city, e.g. 'Algiers'
    streetAddress: '', // PLACEHOLDER: street address
    postalCode: '', // PLACEHOLDER
  },
  /** The organisation's own profiles. PLACEHOLDER: add LinkedIn, YouTube, a
      page-level Facebook, etc. These two are the owner's, also used by the
      footer, until the organisation has its own. */
  sameAs: ['https://instagram.com/berrayah_slimane', 'https://www.facebook.com/berrslim'],
};

/** The site's owner. `alternateNames` lists every spelling people might
    search, so Google can match any of them to this site. */
export const OWNER = {
  name: 'Slimane Berrayah',
  nameAr: 'سليمان برايح', // PLACEHOLDER: confirm the Arabic spelling
  alternateNames: ['Berrayah Slimane', 'Berrayah Sliman', 'Sliman Berrayah', 'برايح سليمان'],
  jobTitle: { en: 'Founder of the SIYB platform', ar: 'مؤسس منصة أبسط SIYB' }, // PLACEHOLDER: confirm the title
  /** PLACEHOLDER: a portrait, at least 400×400, placed in client/public
      (e.g. '/owner.jpg'). Until then the About page shows a monogram and the
      Person schema has no image. */
  photo: '',
  /** PLACEHOLDER: a longer biography. The About page shows it when set. */
  bio: { en: '', ar: '' },
  sameAs: ['https://instagram.com/berrayah_slimane', 'https://www.facebook.com/berrslim'],
};

export const KEYWORDS = [
  OWNER.name,
  ...OWNER.alternateNames,
  OWNER.nameAr,
  'SIYB',
  'SIYB Algeria',
  'تكوين SIYB',
  'أبسط',
  'Start and Improve Your Business',
  'ILO',
  'المنظمة الدولية للعمل',
  'ريادة الأعمال',
  'تكوين ريادة الأعمال في الجزائر',
  'Entrepreneurship training in Algeria',
  'تدريب المدربين',
].join(', ');

export const ORG_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/#owner`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Drops empty strings, empty arrays and empty objects, recursively, so a
    blank placeholder never ships as an empty schema field. */
export function compact(value) {
  if (Array.isArray(value)) {
    const out = value.map(compact).filter((v) => v !== undefined);
    return out.length ? out : undefined;
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const c = compact(v);
      if (c !== undefined) out[k] = c;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return value === '' || value === null || value === undefined ? undefined : value;
}

export function personSchema(locale = 'en') {
  return compact({
    '@type': 'Person',
    '@id': PERSON_ID,
    name: OWNER.name,
    alternateName: [OWNER.nameAr, ...OWNER.alternateNames],
    jobTitle: OWNER.jobTitle[locale] || OWNER.jobTitle.en,
    description: OWNER.bio[locale] || OWNER.bio.en,
    image: OWNER.photo ? `${SITE_URL}${OWNER.photo}` : '',
    url: `${SITE_URL}${locale === 'en' ? '/en' : ''}/about`,
    email: `mailto:${EMAIL}`,
    telephone: TELEPHONE,
    sameAs: OWNER.sameAs,
    worksFor: { '@id': ORG_ID },
  });
}

/** The site-wide graph, in every page's HTML: the organisation and the
    website. The owner's full Person node lives on the About page; here the
    organisation only points at it. */
export const SITE_GRAPH = compact({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'EducationalOrganization'],
      '@id': ORG_ID,
      name: ORGANIZATION.name,
      alternateName: ORGANIZATION.alternateNames,
      description: ORGANIZATION.description.en,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: LOGO, width: 1076, height: 988 },
      image: OG_IMAGE,
      email: EMAIL,
      telephone: TELEPHONE,
      address: { '@type': 'PostalAddress', ...ORGANIZATION.address },
      areaServed: ['DZ', 'SA', 'TN', 'AE'],
      founder: { '@type': 'Person', '@id': PERSON_ID, name: OWNER.name, alternateName: OWNER.nameAr },
      sameAs: ORGANIZATION.sameAs,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: EMAIL,
        telephone: TELEPHONE,
        availableLanguage: ['Arabic', 'English'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: ORGANIZATION.name,
      alternateName: ['أبسط SIYB', 'SIYB Algeria'],
      url: `${SITE_URL}/`,
      inLanguage: ['ar', 'en'],
      publisher: { '@id': ORG_ID },
    },
  ],
});
