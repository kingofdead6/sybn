/**
 * Field definitions per admin resource, driving the generic AdminList/AdminForm.
 * type: 'text' | 'textarea' | 'number' | 'checkbox' | 'select' | 'bilingual' | 'bilingual-textarea' | 'bulletlist-bilingual' | 'image'
 */
export const RESOURCE_SCHEMAS = {
  programs: {
    label: 'Programs',
    listColumns: ['slug', 'order', 'code', 'published'],
    orderable: true,
    fields: [
      { name: 'slug', type: 'text', required: true },
      { name: 'order', type: 'number', required: true },
      { name: 'code', type: 'text' },
      { name: 'level', type: 'text' },
      { name: 'title', type: 'bilingual', required: true },
      { name: 'audience', type: 'bilingual-textarea', required: true },
      { name: 'intro', type: 'bilingual-textarea' },
      { name: 'bullets', type: 'bulletlist-bilingual' },
      { name: 'resources.interactive', type: 'text' },
      { name: 'resources.videoPlaylist', type: 'text' },
      { name: 'resources.pdfUrl', type: 'text' },
      { name: 'image', type: 'image' },
      { name: 'category', type: 'text' },
      { name: 'published', type: 'checkbox' },
    ],
  },
  categories: {
    label: 'Categories',
    listColumns: ['slug', 'order'],
    orderable: true,
    fields: [
      { name: 'slug', type: 'text', required: true },
      { name: 'title', type: 'bilingual', required: true },
      { name: 'description', type: 'bilingual-textarea' },
      { name: 'order', type: 'number' },
      { name: 'image', type: 'image' },
    ],
  },
  courses: {
    label: 'Courses',
    listColumns: ['slug', 'published'],
    fields: [
      { name: 'slug', type: 'text', required: true },
      { name: 'title', type: 'bilingual', required: true },
      { name: 'description', type: 'bilingual-textarea' },
      { name: 'published', type: 'checkbox' },
    ],
  },
  team: {
    label: 'Team',
    listColumns: ['slug', 'region', 'order'],
    orderable: true,
    fields: [
      { name: 'slug', type: 'text', required: true },
      { name: 'name', type: 'bilingual', required: true },
      { name: 'role', type: 'bilingual', required: true },
      { name: 'country', type: 'text' },
      {
        name: 'region',
        type: 'select',
        required: true,
        options: ['leadership', 'mena', 'sub-saharan-africa', 'europe-central-asia', 'companies-institutions', 'training-institutes'],
      },
      { name: 'photo', type: 'image', required: true },
      { name: 'bio', type: 'bilingual-textarea' },
      { name: 'order', type: 'number' },
      { name: 'type', type: 'select', options: ['individual', 'organization'] },
    ],
  },
  stories: {
    label: 'Stories',
    listColumns: ['slug', 'country', 'category'],
    orderable: true,
    fields: [
      { name: 'slug', type: 'text', required: true },
      { name: 'country', type: 'text', required: true },
      { name: 'videoUrl', type: 'text', required: true },
      { name: 'thumbnail', type: 'image' },
      { name: 'category', type: 'select', required: true, options: ['lead-trainers', 'trainer-consultants', 'entrepreneurs', 'organizations'] },
      { name: 'title', type: 'bilingual' },
      { name: 'excerpt', type: 'bilingual-textarea' },
      { name: 'order', type: 'number' },
    ],
  },
  products: {
    label: 'Products',
    listColumns: ['slug', 'price', 'published'],
    fields: [
      { name: 'slug', type: 'text', required: true },
      { name: 'title', type: 'bilingual', required: true },
      { name: 'description', type: 'bilingual-textarea' },
      { name: 'price', type: 'number', required: true },
      { name: 'currency', type: 'text' },
      { name: 'category', type: 'text', required: true },
      { name: 'stock', type: 'number' },
      { name: 'published', type: 'checkbox' },
    ],
  },
  orders: {
    label: 'Orders',
    listColumns: ['status', 'total', 'paymentMethod'],
    readOnlyFields: ['items', 'customer', 'total'],
    fields: [{ name: 'status', type: 'select', options: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] }],
  },
  certificates: {
    label: 'Certificates',
    listColumns: ['number', 'holderName', 'status'],
    fields: [
      { name: 'number', type: 'text', required: true },
      { name: 'holderName', type: 'text', required: true },
      { name: 'issuedAt', type: 'text' },
      { name: 'status', type: 'select', options: ['valid', 'revoked'] },
      { name: 'revokedReason', type: 'text' },
    ],
  },
  'certificate-requests': {
    label: 'Certificate Requests',
    listColumns: ['fullName', 'email', 'status'],
    fields: [{ name: 'status', type: 'select', options: ['pending', 'paid', 'issued', 'rejected'] }],
  },
  'forum-registrations': {
    label: 'Forum Registrations',
    listColumns: ['fullName', 'email', 'status'],
    fields: [{ name: 'status', type: 'select', options: ['pending', 'confirmed', 'cancelled'] }],
  },
  'proposal-requests': {
    label: 'Proposal Requests',
    listColumns: ['fullName', 'email', 'field'],
    fields: [],
  },
  enquiries: {
    label: 'Enquiries',
    listColumns: ['name', 'email', 'handled'],
    fields: [{ name: 'handled', type: 'checkbox' }],
  },
  users: {
    label: 'Users',
    listColumns: ['name', 'email', 'role'],
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'email', type: 'text', required: true },
      { name: 'role', type: 'select', options: ['admin', 'editor', 'student'] },
    ],
  },
  exams: {
    label: 'Exams',
    listColumns: ['passScore', 'durationMinutes'],
    fields: [
      { name: 'passScore', type: 'number', required: true },
      { name: 'durationMinutes', type: 'number', required: true },
      { name: 'retakeAfterDays', type: 'number' },
    ],
  },
};
