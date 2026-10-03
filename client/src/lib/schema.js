/* Page-level schema.org nodes, built from CMS records. They reference the
   site-wide organisation by @id, so each page's graph links into the one in
   index.html. Only fields the records really have are emitted. */
import { ORG_ID, ORGANIZATION, SITE_URL, compact, personSchema, localeUrl } from './site';

const IN_LANGUAGE = { ar: 'ar', en: 'en' };

const provider = { '@type': 'Organization', '@id': ORG_ID, name: ORGANIZATION.name, sameAs: SITE_URL };

/** A course or a training program, as a schema.org Course. */
export function courseSchema({ name, description, code, image, path, locale, category, modules = [] }) {
  return compact({
    '@type': 'Course',
    '@id': `${localeUrl(path, locale)}#course`,
    name,
    description,
    courseCode: code,
    url: localeUrl(path, locale),
    image,
    inLanguage: IN_LANGUAGE[locale],
    provider,
    about: category,
    syllabusSections: modules
      .filter((m) => m.title?.[locale])
      .map((m) => compact({ '@type': 'Syllabus', name: m.title[locale], description: m.description?.[locale] })),
  });
}

/** A FAQPage from the CMS question/answer list. */
export function faqSchema(items, locale) {
  const entries = items
    .filter((i) => i.question?.[locale] && i.answer?.[locale])
    .map((i) => ({
      '@type': 'Question',
      name: i.question[locale],
      acceptedAnswer: { '@type': 'Answer', text: i.answer[locale] },
    }));
  return entries.length ? { '@type': 'FAQPage', '@id': `${localeUrl('/faq', locale)}#faq`, mainEntity: entries } : null;
}

/** The About page: an AboutPage whose main entity is the owner. */
export function aboutSchema(locale) {
  return [
    {
      '@type': 'AboutPage',
      '@id': `${localeUrl('/about', locale)}#page`,
      url: localeUrl('/about', locale),
      inLanguage: IN_LANGUAGE[locale],
      about: { '@id': ORG_ID },
      mainEntity: { '@id': personSchema(locale)['@id'] },
    },
    personSchema(locale),
  ];
}

/** A network member's profile: a person or a partner organisation. */
export function memberSchema(member, locale, path) {
  const isOrg = member.type && /org|company|institution|partner/i.test(member.type);
  return compact({
    '@type': isOrg ? 'Organization' : 'Person',
    name: member.name?.[locale],
    alternateName: member.name?.[locale === 'ar' ? 'en' : 'ar'],
    [isOrg ? 'description' : 'jobTitle']: member.role?.[locale],
    image: member.photo,
    url: localeUrl(path, locale),
    [isOrg ? 'memberOf' : 'affiliation']: { '@id': ORG_ID },
  });
}
