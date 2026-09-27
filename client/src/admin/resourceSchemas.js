/**
 * Field definitions per admin resource, driving the generic AdminList/AdminForm.
 * type: 'text' | 'textarea' | 'number' | 'checkbox' | 'select' | 'bilingual' | 'bilingual-textarea' | 'bulletlist-bilingual' | 'image'
 */
export const RESOURCE_SCHEMAS = {
  programs: {
    label: 'Programs',
    listColumns: ['order', 'code', 'track', 'slug', 'published'],
    orderable: true,
    // Splits the list into tabs so each programme type is its own view.
    filterBy: { field: 'track', options: ['entrepreneurship', 'trainers', 'ai'] },
    fields: [
      { name: 'slug', type: 'text', required: true, group: 'publish' },
      { name: 'order', type: 'number', required: true, group: 'presentation' },
      { name: 'code', type: 'text', group: 'presentation' },
      { name: 'level', type: 'text', group: 'presentation' },
      { name: 'title', type: 'bilingual', required: true, group: 'content' },
      { name: 'audience', type: 'bilingual-textarea', required: true, group: 'content' },
      { name: 'intro', type: 'bilingual-textarea', group: 'content' },
      { name: 'bullets', type: 'bulletlist-bilingual', group: 'content' },
      { name: 'modules', type: 'modulelist', group: 'content' },
      { name: 'resources.interactive', type: 'text', group: 'media' },
      { name: 'resources.videoPlaylist', type: 'text', group: 'media' },
      { name: 'resources.pdfUrl', type: 'text', group: 'media' },
      { name: 'image', type: 'image', group: 'media' },
      { name: 'category', type: 'text', group: 'presentation' },
      { name: 'track', type: 'select', options: ['entrepreneurship', 'trainers', 'ai'], group: 'presentation' },
      { name: 'accent', type: 'select', options: ['green', 'orange', 'blue', 'slate', 'navy'], group: 'presentation' },
      // Nests this program beneath another: it is then listed on that
      // program's page and reached at /programs/<parent>/<this>.
      { name: 'parent', type: 'reference', resource: 'programs', group: 'presentation' },
      { name: 'bandTitle', type: 'checkbox', group: 'presentation' },
      { name: 'bandHeading', type: 'bilingual', group: 'content' },
      { name: 'ctaLabel', type: 'bilingual', group: 'presentation' },
      { name: 'formHeading', type: 'bilingual', group: 'registration' },
      { name: 'formIntro', type: 'bilingual-textarea', group: 'registration' },
      { name: 'formNote', type: 'bilingual-textarea', group: 'registration' },
      { name: 'formFields', type: 'formbuilder', group: 'registration' },
      { name: 'published', type: 'checkbox', group: 'publish' },
    ],
  },
  categories: {
    label: 'Categories',
    listColumns: ['slug', 'order'],
    orderable: true,
    fields: [
      { name: 'slug', type: 'text', required: true, group: 'publish' },
      { name: 'title', type: 'bilingual', required: true, group: 'content' },
      { name: 'description', type: 'bilingual-textarea', group: 'content' },
      { name: 'order', type: 'number', group: 'presentation' },
      { name: 'image', type: 'image', group: 'media' },
    ],
  },
  courses: {
    label: 'Courses',
    listColumns: ['slug', 'code', 'rating', 'order', 'published'],
    orderable: true,
    fields: [
      { name: 'slug', type: 'text', required: true, group: 'publish' },
      { name: 'title', type: 'bilingual', required: true, group: 'content' },
      { name: 'code', type: 'text', group: 'presentation' },
      { name: 'category', type: 'reference', resource: 'categories', group: 'presentation' },
      { name: 'description', type: 'bilingual-textarea', group: 'content' },
      { name: 'image', type: 'image', group: 'media' },
      { name: 'rating', type: 'number', group: 'presentation' },
      { name: 'order', type: 'number', group: 'presentation' },
      // Registration: open or closed, how many seats, and whether to ask
      // for the free-text message — then the course's own form.
      { name: 'enrollmentOpen', type: 'checkbox', group: 'registration' },
      { name: 'capacity', type: 'number', group: 'registration' },
      { name: 'askMessage', type: 'checkbox', group: 'registration' },
      { name: 'formHeading', type: 'bilingual', group: 'registration' },
      { name: 'formIntro', type: 'bilingual-textarea', group: 'registration' },
      { name: 'formNote', type: 'bilingual-textarea', group: 'registration' },
      { name: 'formFields', type: 'formbuilder', group: 'registration' },
      { name: 'registrationType', type: 'select', options: ['internal', 'external'], group: 'registration' },
      { name: 'externalUrl', type: 'text', group: 'registration' },
      { name: 'externalProvider', type: 'text', group: 'registration' },
      { name: 'published', type: 'checkbox', group: 'publish' },
    ],
  },
  stories: {
    label: 'Stories',
    listColumns: ['slug', 'country', 'category'],
    orderable: true,
    fields: [
      { name: 'slug', type: 'text', required: true, group: 'publish' },
      { name: 'country', type: 'text', required: true, group: 'basics' },
      { name: 'videoUrl', type: 'text', required: true, group: 'media' },
      { name: 'thumbnail', type: 'image', group: 'media' },
      { name: 'category', type: 'select', required: true, options: ['lead-trainers', 'trainer-consultants', 'entrepreneurs', 'organizations'], group: 'presentation' },
      { name: 'title', type: 'bilingual', group: 'content' },
      { name: 'excerpt', type: 'bilingual-textarea', group: 'content' },
      { name: 'order', type: 'number', group: 'presentation' },
    ],
  },
  products: {
    label: 'Products',
    listColumns: ['slug', 'published'],
    // A product is a shop window, not a checkout: a name, a picture, and the
    // link out to wherever it is actually sold.
    fields: [
      { name: 'slug', type: 'text', required: true, group: 'publish' },
      { name: 'title', type: 'bilingual', required: true, group: 'content' },
      { name: 'image', type: 'image', group: 'media' },
      { name: 'url', type: 'text', required: true, group: 'media' },
      { name: 'published', type: 'checkbox', group: 'publish' },
    ],
  },
  forums: {
    label: 'Forums',
    listColumns: ['month', 'year', 'city', 'status'],
    fields: [
      { name: 'month', type: 'text', required: true, group: 'registration' },
      { name: 'year', type: 'number', required: true, group: 'registration' },
      { name: 'city', type: 'text', required: true, group: 'registration' },
      { name: 'status', type: 'select', options: ['open', 'full', 'announced-soon'], group: 'registration' },
      // The home page picks the "next" forum by start date, so it has to be
      // settable here rather than only in the seed.
      { name: 'startDate', type: 'date', group: 'registration' },
      { name: 'seatsTotal', type: 'number', group: 'registration' },
      { name: 'seatsTaken', type: 'number', group: 'registration' },
      { name: 'notes', type: 'bilingual-textarea', group: 'content' },
      { name: 'agreementUrl', type: 'text', group: 'media' },
      { name: 'partnershipUrl', type: 'text', group: 'media' },
      { name: 'registrationType', type: 'select', options: ['internal', 'external'], group: 'registration' },
      { name: 'externalUrl', type: 'text', group: 'registration' },
      { name: 'externalProvider', type: 'text', group: 'registration' },
    ],
  },
  'store-examples': {
    label: 'Store Examples',
    listColumns: ['owner', 'country', 'order', 'published'],
    orderable: true,
    fields: [
      { name: 'title', type: 'bilingual', required: true, group: 'content' },
      { name: 'description', type: 'bilingual-textarea', group: 'content' },
      { name: 'image', type: 'image', group: 'media' },
      { name: 'url', type: 'text', required: true, group: 'media' },
      { name: 'owner', type: 'text', group: 'basics' },
      { name: 'country', type: 'text', group: 'basics' },
      { name: 'order', type: 'number', group: 'presentation' },
      { name: 'published', type: 'checkbox', group: 'publish' },
    ],
  },
  resources: {
    label: 'Key Resources',
    listColumns: ['order', 'slug', 'directDownload', 'published'],
    orderable: true,
    fields: [
      { name: 'slug', type: 'text', required: true, group: 'publish' },
      { name: 'order', type: 'number', group: 'presentation' },
      { name: 'title', type: 'bilingual', required: true, group: 'content' },
      { name: 'category', type: 'bilingual', group: 'presentation' },
      { name: 'summary', type: 'bilingual-textarea', group: 'content' },
      { name: 'description', type: 'bilingual-textarea', group: 'content' },
      { name: 'image', type: 'image', group: 'media' },
      { name: 'pdfUrl', type: 'text', group: 'media' },
      // Ticked, the card links straight to the PDF; unticked it opens the
      // resource's own page, where the download is a button.
      { name: 'directDownload', type: 'checkbox', group: 'presentation' },
      { name: 'published', type: 'checkbox', group: 'publish' },
    ],
  },
  'certificate-requests': {
    label: 'Certificate Requests',
    listColumns: ['fullName', 'email', 'source', 'status'],
    // What the applicant submitted is a record, not something the admin
    // rewrites; only the decision fields are editable. "source" is the
    // program or course the request came from.
    readOnlyFields: ['source', 'fullName', 'email', 'whatsapp', 'country'],
    // Certifying issues the certificate from the program's (or course's)
    // template, with this person's name and email, and emails it to them.
    // Hidden once issued: a request is certified once.
    rowAction: { key: 'certify', endpoint: '/admin/trainers/certify', hideWhen: (item) => item.status === 'issued' },
    fields: [
      { name: 'status', type: 'select', options: ['pending', 'issued', 'rejected'], group: 'publish' },
    ],
  },
  'forum-registrations': {
    label: 'Forum Registrations',
    listColumns: ['fullName', 'email', 'country', 'status'],
    // What the registrant submitted is a record of what they said, so it is
    // shown but not rewritten; the admin decides the status.
    readOnlyFields: ['fullName', 'email', 'whatsapp', 'country'],
    fields: [
      { name: 'fullName', type: 'text', group: 'content' },
      { name: 'email', type: 'text', group: 'basics' },
      { name: 'whatsapp', type: 'text', group: 'basics' },
      { name: 'country', type: 'text', group: 'basics' },
      { name: 'status', type: 'select', options: ['pending', 'confirmed', 'cancelled'], group: 'publish' },
    ],
  },
  'proposal-requests': {
    label: 'Proposal Requests',
    listColumns: ['fullName', 'email', 'targetCountry', 'tab'],
    readOnlyFields: ['fullName', 'email', 'whatsapp', 'targetCountry', 'field', 'tab'],
    fields: [
      { name: 'fullName', type: 'text', group: 'content' },
      { name: 'email', type: 'text', group: 'basics' },
      { name: 'whatsapp', type: 'text', group: 'basics' },
      { name: 'targetCountry', type: 'text', group: 'basics' },
      { name: 'field', type: 'text', group: 'content' },
      { name: 'tab', type: 'select', options: ['investments', 'employment', 'migration'], group: 'presentation' },
      { name: 'wantsForums', type: 'checkbox', group: 'registration' },
    ],
  },
  certificates: {
    label: 'Certificates',
    listColumns: ['number', 'holderName', 'email', 'source', 'sentAt'],
    // The number identifies the certificate publicly and is what a holder
    // verifies against, so it is never edited after issue.
    readOnlyFields: ['number', 'source', 'email', 'sentAt'],
    // Emails the certificate image to its holder again.
    rowAction: { key: 'resend', endpoint: '/admin/certificates/send' },
    // The rendered certificate, shown on its edit page.
    imageEndpoint: '/admin/certificates/image',
    fields: [
      { name: 'holderName', type: 'text', required: true, group: 'content' },
      { name: 'program', type: 'reference', resource: 'programs', group: 'presentation' },
      { name: 'issuedAt', type: 'date', group: 'publish' },
      { name: 'status', type: 'select', options: ['valid', 'revoked'], group: 'publish' },
      { name: 'revokedReason', type: 'textarea', group: 'publish' },
    ],
  },
  'certified-trainers': {
    label: 'Certified Trainers',
    listColumns: ['name', 'email', 'country', 'status'],
    fields: [
      { name: 'name', type: 'text', required: true, group: 'content' },
      { name: 'email', type: 'text', required: true, group: 'basics' },
      { name: 'phone', type: 'text', group: 'basics' },
      { name: 'country', type: 'text', group: 'basics' },
      { name: 'program', type: 'reference', resource: 'programs', group: 'presentation' },
      { name: 'certifiedAt', type: 'date', group: 'presentation' },
      { name: 'status', type: 'select', options: ['active', 'suspended'], group: 'publish' },
      { name: 'notes', type: 'textarea', group: 'content' },
    ],
  },
  'email-templates': {
    label: 'Email Templates',
    listColumns: ['name', 'subject', 'format'],
    orderable: true,
    fields: [
      { name: 'name', type: 'text', required: true, group: 'content' },
      { name: 'subject', type: 'text', required: true, group: 'content' },
      { name: 'format', type: 'select', options: ['html', 'text'], group: 'presentation' },
      { name: 'html', type: 'textarea', group: 'content' },
      { name: 'text', type: 'textarea', group: 'content' },
      { name: 'order', type: 'number', group: 'presentation' },
    ],
  },
  enquiries: {
    label: 'Enquiries',
    listColumns: ['name', 'email', 'handled'],
    fields: [{ name: 'handled', type: 'checkbox', group: 'publish' }],
  },
  users: {
    label: 'Users',
    listColumns: ['name', 'email', 'role'],
    fields: [
      { name: 'name', type: 'text', required: true, group: 'content' },
      { name: 'email', type: 'text', required: true, group: 'basics' },
      { name: 'role', type: 'select', options: ['admin', 'editor', 'student'], group: 'content' },
    ],
  },
  exams: {
    label: 'Exams',
    listColumns: ['passScore', 'durationMinutes'],
    fields: [
      { name: 'passScore', type: 'number', required: true, group: 'basics' },
      { name: 'durationMinutes', type: 'number', required: true, group: 'basics' },
      { name: 'retakeAfterDays', type: 'number', group: 'basics' },
    ],
  },
};

/**
 * Values shown in the admin that are worked out from a record rather than
 * stored on it, keyed by the column name a schema lists.
 */
export const COMPUTED_VALUES = {
  // Where a certificate request (or certificate) came from: its program or
  // course, named in the panel's language.
  source(item, locale, t) {
    const subject = item.program || item.course;
    // A request whose program or course was since deleted still says so,
    // rather than showing a blank.
    if (!subject || typeof subject !== 'object') return t('value.source.missing');
    const kind = item.program ? t('value.source.program') : t('value.source.course');
    const title = subject.title?.[locale] || subject.title?.ar || subject.title?.en || subject.code || '';
    return `${kind} · ${title}`;
  },
};

/**
 * How each resource's list looks and what it can be filtered by.
 *
 *   primary  — the first column: `title` (and `subtitle`) fields, an `image`
 *              field for a thumbnail, or `avatar` for a person's initials
 *   columns  — the other columns, by field (or computed value) name
 *   status   — the field the summary cards count, and its values in order
 *   filters  — extra filters: `select` (fixed options), `boolean`,
 *              `reference` (a linked record, loaded from `resource`),
 *              `distinct` (the values already stored), `date` (a range)
 *   sorts    — the orders offered, as sort keys (`-` = descending)
 *   bulk     — changes offered for several records at once (delete is
 *              always offered)
 *
 * The server accepts only the filters, sorts and bulk fields it declares
 * for the same resource (routes/admin.js).
 */
const PUBLISH_BULK = [
  { field: 'published', value: true },
  { field: 'published', value: false },
];

export const LIST_VIEWS = {
  programs: {
    primary: { title: 'title', subtitle: 'slug', image: 'image', meta: 'code' },
    columns: ['track', 'parent', 'order', 'published'],
    status: { field: 'track', options: ['entrepreneurship', 'trainers', 'ai'] },
    filters: [
      { field: 'published', type: 'boolean' },
      { field: 'accent', type: 'select', options: ['green', 'orange', 'blue', 'slate', 'navy'] },
      { field: 'parent', type: 'reference', resource: 'programs' },
      { field: 'createdAt', type: 'date' },
    ],
    sorts: ['order', '-order', 'code', '-updatedAt', '-createdAt'],
    bulk: PUBLISH_BULK,
  },
  categories: {
    primary: { title: 'title', subtitle: 'slug', image: 'image' },
    columns: ['order', 'updatedAt'],
    filters: [{ field: 'createdAt', type: 'date' }],
    sorts: ['order', '-order', '-updatedAt'],
  },
  courses: {
    primary: { title: 'title', subtitle: 'slug', image: 'image', meta: 'code' },
    columns: ['category', 'rating', 'enrollmentOpen', 'published'],
    status: { field: 'published', options: [true, false] },
    filters: [
      { field: 'category', type: 'reference', resource: 'categories' },
      { field: 'enrollmentOpen', type: 'boolean' },
      { field: 'registrationType', type: 'select', options: ['internal', 'external'] },
      { field: 'releasedAt', type: 'date' },
    ],
    sorts: ['order', '-rating', 'code', '-releasedAt', '-updatedAt'],
    bulk: [...PUBLISH_BULK, { field: 'enrollmentOpen', value: true }, { field: 'enrollmentOpen', value: false }],
  },
  forums: {
    primary: { title: 'forumName', subtitle: 'city' },
    columns: ['startDate', 'seats', 'status'],
    status: { field: 'status', options: ['open', 'full', 'announced-soon'] },
    filters: [
      { field: 'year', type: 'distinct' },
      { field: 'city', type: 'distinct' },
      { field: 'startDate', type: 'date' },
    ],
    sorts: ['-startDate', 'startDate', '-year', '-seatsTaken'],
    bulk: [
      { field: 'status', value: 'open' },
      { field: 'status', value: 'full' },
      { field: 'status', value: 'announced-soon' },
    ],
  },
  products: {
    primary: { title: 'title', subtitle: 'url', image: 'image' },
    columns: ['updatedAt', 'published'],
    status: { field: 'published', options: [true, false] },
    filters: [{ field: 'createdAt', type: 'date' }],
    sorts: ['-updatedAt', '-createdAt'],
    bulk: PUBLISH_BULK,
  },
  'store-examples': {
    primary: { title: 'title', subtitle: 'owner', image: 'image' },
    columns: ['country', 'order', 'published'],
    status: { field: 'published', options: [true, false] },
    filters: [
      { field: 'country', type: 'distinct' },
      { field: 'createdAt', type: 'date' },
    ],
    sorts: ['order', '-updatedAt'],
    bulk: PUBLISH_BULK,
  },
  resources: {
    primary: { title: 'title', subtitle: 'slug', image: 'image' },
    columns: ['directDownload', 'order', 'published'],
    status: { field: 'published', options: [true, false] },
    filters: [
      { field: 'directDownload', type: 'boolean' },
      { field: 'createdAt', type: 'date' },
    ],
    sorts: ['order', '-updatedAt'],
    bulk: [...PUBLISH_BULK, { field: 'directDownload', value: true }, { field: 'directDownload', value: false }],
  },
  'certificate-requests': {
    primary: { title: 'fullName', subtitle: 'email', avatar: true },
    columns: ['source', 'country', 'createdAt', 'status'],
    status: { field: 'status', options: ['pending', 'issued', 'rejected'] },
    filters: [
      { field: 'program', type: 'reference', resource: 'programs' },
      { field: 'course', type: 'reference', resource: 'courses' },
      { field: 'country', type: 'distinct' },
      { field: 'wantsForums', type: 'boolean' },
      { field: 'createdAt', type: 'date' },
    ],
    sorts: ['-createdAt', 'createdAt', 'fullName'],
    // "Issued" only ever comes from Certify, which issues the certificate.
    bulk: [
      { field: 'status', value: 'rejected' },
      { field: 'status', value: 'pending' },
    ],
  },
  'forum-registrations': {
    primary: { title: 'fullName', subtitle: 'email', avatar: true },
    columns: ['forum', 'country', 'createdAt', 'status'],
    status: { field: 'status', options: ['pending', 'confirmed', 'cancelled'] },
    filters: [
      { field: 'forum', type: 'reference', resource: 'forums' },
      { field: 'country', type: 'distinct' },
      { field: 'createdAt', type: 'date' },
    ],
    sorts: ['-createdAt', 'createdAt', 'fullName'],
    bulk: [
      { field: 'status', value: 'confirmed' },
      { field: 'status', value: 'cancelled' },
      { field: 'status', value: 'pending' },
    ],
  },
  'proposal-requests': {
    primary: { title: 'fullName', subtitle: 'email', avatar: true },
    columns: ['targetCountry', 'field', 'createdAt', 'tab'],
    status: { field: 'tab', options: ['investments', 'employment', 'migration'] },
    filters: [
      { field: 'targetCountry', type: 'distinct' },
      { field: 'wantsForums', type: 'boolean' },
      { field: 'createdAt', type: 'date' },
    ],
    sorts: ['-createdAt', 'createdAt', 'fullName'],
  },
  certificates: {
    primary: { title: 'holderName', subtitle: 'number', avatar: true },
    columns: ['source', 'issuedAt', 'sentAt', 'status'],
    status: { field: 'status', options: ['valid', 'revoked'] },
    filters: [
      { field: 'program', type: 'reference', resource: 'programs' },
      { field: 'course', type: 'reference', resource: 'courses' },
      { field: 'issuedAt', type: 'date' },
    ],
    sorts: ['-issuedAt', 'issuedAt', 'number', 'holderName', '-sentAt'],
    bulk: [
      { field: 'status', value: 'valid' },
      { field: 'status', value: 'revoked' },
    ],
  },
  'certified-trainers': {
    primary: { title: 'name', subtitle: 'email', avatar: true },
    columns: ['program', 'country', 'certifiedAt', 'status'],
    status: { field: 'status', options: ['active', 'suspended'] },
    filters: [
      { field: 'program', type: 'reference', resource: 'programs' },
      { field: 'country', type: 'distinct' },
      { field: 'certifiedAt', type: 'date' },
    ],
    sorts: ['name', '-certifiedAt', '-lastEmailedAt'],
    bulk: [
      { field: 'status', value: 'active' },
      { field: 'status', value: 'suspended' },
    ],
  },
  'email-templates': {
    primary: { title: 'name', subtitle: 'subject' },
    columns: ['order', 'updatedAt', 'format'],
    status: { field: 'format', options: ['html', 'text'] },
    sorts: ['order', 'name', '-updatedAt'],
  },
  enquiries: {
    primary: { title: 'name', subtitle: 'email', avatar: true },
    columns: ['subject', 'source', 'createdAt', 'handled'],
    status: { field: 'handled', options: [false, true] },
    filters: [
      { field: 'source', type: 'distinct' },
      { field: 'createdAt', type: 'date' },
    ],
    sorts: ['-createdAt', 'createdAt', 'name'],
    bulk: [
      { field: 'handled', value: true },
      { field: 'handled', value: false },
    ],
  },
  users: {
    primary: { title: 'name', subtitle: 'email', avatar: true },
    columns: ['locale', 'createdAt', 'role'],
    status: { field: 'role', options: ['student', 'editor', 'admin'] },
    filters: [
      { field: 'locale', type: 'select', options: ['ar', 'en'] },
      { field: 'createdAt', type: 'date' },
    ],
    sorts: ['-createdAt', 'createdAt', 'name', 'email'],
  },
  exams: {
    primary: { title: 'program' },
    columns: ['passScore', 'durationMinutes', 'retakeAfterDays'],
    filters: [{ field: 'program', type: 'reference', resource: 'programs' }],
    sorts: ['-createdAt', 'passScore', 'durationMinutes'],
  },
};

Object.assign(COMPUTED_VALUES, {
  // A forum by its month and year.
  forumName(item) {
    return [item.month, item.year].filter(Boolean).join(' ');
  },
  // Seats as "taken / total".
  seats(item) {
    if (!item.seatsTotal) return item.seatsTaken ? String(item.seatsTaken) : '';
    return `${item.seatsTaken || 0} / ${item.seatsTotal}`;
  },
});
