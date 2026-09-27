// A starting course evaluation, asked on every course. Only created when no
// questions exist: the questions are the admin's to write and are never
// overwritten by a reseed.
export default [
  { order: 1, type: 'rating', required: true, label: { ar: 'تقييمك العام للدورة', en: 'Your overall rating of the course' } },
  { order: 2, type: 'rating', required: true, label: { ar: 'جودة المحتوى وفائدته', en: 'Quality and usefulness of the content' } },
  { order: 3, type: 'rating', required: true, label: { ar: 'أداء المدرب ووضوح الشرح', en: 'The trainer and the clarity of the explanations' } },
  { order: 4, type: 'rating', required: true, label: { ar: 'التنظيم والتوقيت', en: 'Organisation and timing' } },
  {
    order: 5,
    type: 'choice',
    required: true,
    label: { ar: 'هل توصي بهذه الدورة لغيرك؟', en: 'Would you recommend this course to others?' },
    options: [
      { ar: 'نعم، بالتأكيد', en: 'Yes, definitely' },
      { ar: 'ربما', en: 'Maybe' },
      { ar: 'لا', en: 'No' },
    ],
  },
  {
    order: 6,
    type: 'text',
    required: false,
    label: { ar: 'ما الذي أعجبك أكثر، وما الذي يمكن تحسينه؟', en: 'What did you like most, and what could be improved?' },
  },
];
