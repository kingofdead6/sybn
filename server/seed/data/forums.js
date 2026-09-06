// Forums seed data — section 7.7
// One Forum doc per month in the cycle. The Arabic month names given start
// mid-cycle at "أوت" (August) 2026, so جانفي/فيفري/مارس/أفريل roll into 2027.

const topics = [
  'ريادة أعمال',
  'الجودة والتميز المؤسسي',
  'الريادة الذكاء الإصطناعي',
  'التنمية البشرية',
  'التربية والتعليم',
  'الرياضة',
  'السياحة والإرشاد الديني',
  'الحرف (صناعة الأجبان والمصبرات والعصائر، زراعة واستثمار الزعفران، استغلال التين الشوكي، صناعة الشوكولاتة بالتمر و التين)',
  'مهارات الحياة الطبيعية (تغذية – رياضة – تجميل)',
];

const notes = {
  ar: 'في الملتقى تتم مناقشة عروض المترشحين للإعتماد والتدرب على لعبة محاكات الأعمال . تتم أيضا مناقشة البرامج التخصصية المقترحة من الخبراء المعتمدين وبدأ إجراءات إقتراحها للإعتماد',
  en: 'During the forum, accreditation candidates\' proposals are discussed and participants train on the business simulation game. Specialized programs proposed by certified experts are also discussed, and the process of proposing them for accreditation begins.',
};

const agreementUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfEnDyaS1g3i-pYe39L6jXg5PBacIAhVKDJcMr-gUvNatkwWw/viewform';
const partnershipUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScYT4MAxGZMMsaD9ci8E76VWDWu7nz2RYgAP8VveZJ2rkt_FA/viewform';

const cycle = [
  { month: 'أوت', year: 2026 },
  { month: 'سبتمبر', year: 2026 },
  { month: 'أكتوبر', year: 2026 },
  { month: 'نوفمبر', year: 2026 },
  { month: 'ديسمبر', year: 2026 },
  { month: 'جانفي', year: 2027 },
  { month: 'فيفري', year: 2027 },
  { month: 'مارس', year: 2027 },
  { month: 'أفريل', year: 2027 },
];

// Make the first 3 upcoming forums 'open' with a few seats already taken,
// the rest 'announced-soon'. None are 'full'.
const openIndexes = new Set([0, 1, 2]);

const forums = cycle.map((entry, i) => {
  const status = openIndexes.has(i) ? 'open' : 'announced-soon';
  return {
    month: entry.month,
    year: entry.year,
    city: 'المدينة المنورة / مكة المكرمة',
    topics,
    notes,
    status,
    seatsTotal: 30,
    seatsTaken: status === 'open' ? [8, 12, 5][i] : 0,
    tripDays: 15,
    forumDays: 3,
    agreementUrl,
    partnershipUrl,
  };
});

export default forums;
