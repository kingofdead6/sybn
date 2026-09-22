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
  team: {
    label: 'Team',
    listColumns: ['slug', 'region', 'order'],
    orderable: true,
    fields: [
      { name: 'slug', type: 'text', required: true, group: 'publish' },
      { name: 'name', type: 'bilingual', required: true, group: 'content' },
      { name: 'role', type: 'bilingual', required: true, group: 'content' },
      { name: 'country', type: 'text', group: 'basics' },
      {
        name: 'region',
        type: 'select',
        required: true,
        options: ['leadership', 'mena', 'sub-saharan-africa', 'europe-central-asia', 'companies-institutions', 'training-institutes'],
      },
      { name: 'photo', type: 'image', required: true, group: 'media' },
      { name: 'bio', type: 'bilingual-textarea', group: 'content' },
      { name: 'order', type: 'number', group: 'presentation' },
      { name: 'type', type: 'select', options: ['individual', 'organization'], group: 'presentation' },
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
  'product-requests': {
    label: 'Store Item Requests',
    listColumns: ['itemTitle', 'name', 'status'],
    // What the visitor submitted is a record, not something the admin edits;
    // the admin decides the status and, once approved, lists the item himself
    // under Products.
    readOnlyFields: ['name', 'email', 'phone', 'itemTitle', 'itemDescription', 'budget', 'quantity'],
    fields: [
      { name: 'status', type: 'select', options: ['pending', 'approved', 'rejected'], group: 'registration' },
      { name: 'adminNote', type: 'textarea', group: 'publish' },
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
