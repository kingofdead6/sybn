// Specialized-course catalogue seed data.
//
// `category` is a category *slug* here; seed/index.js resolves it to the real
// ObjectId after the categories have been written.

const courses = [
  {
    slug: 'iso-9001-2015-quality-management',
    code: 'ISO 9001',
    category: 'quality-and-organizational-excellence',
    title: {
      ar: 'مقدمة في نظام إدارة الجودة ISO 9001 : 2015',
      en: 'Introduction to the ISO 9001:2015 Quality Management System',
    },
    description: {
      ar: 'دورة تعريفية بمتطلبات المواصفة الدولية ISO 9001 : 2015 و مبادئ إدارة الجودة و خطوات بناء نظام إدارة الجودة داخل المؤسسة.',
      en: 'An introductory course covering the requirements of the ISO 9001:2015 international standard, the principles of quality management, and the steps to build a quality management system inside an organization.',
    },
    rating: 5,
    order: 1,
  },
  {
    slug: 'iso-45001-2018-occupational-health-safety',
    code: 'ISO 45001',
    category: 'quality-and-organizational-excellence',
    title: {
      ar: 'مقدمة في نظام إدارة السلامة و الصحة المهنية ISO 45001 : 2018',
      en: 'Introduction to the ISO 45001:2018 Occupational Health and Safety Management System',
    },
    description: {
      ar: 'دورة تعريفية بمتطلبات المواصفة الدولية ISO 45001 : 2018 و آليات تقييم المخاطر المهنية و بناء بيئة عمل آمنة.',
      en: 'An introductory course covering the requirements of the ISO 45001:2018 international standard, occupational risk assessment mechanisms, and building a safe working environment.',
    },
    rating: 5,
    order: 2,
  },
  {
    slug: 'quality-and-organizational-excellence-intro',
    category: 'quality-and-organizational-excellence',
    title: {
      ar: 'مقدمة في الجودة و التميز المؤسسي',
      en: 'Introduction to Quality and Organizational Excellence',
    },
    description: {
      ar: 'مدخل إلى مفاهيم الجودة الشاملة و نماذج التميز المؤسسي و أدوات قياس الأداء في المنظمات.',
      en: 'An introduction to total quality concepts, organizational excellence models, and performance measurement tools in organizations.',
    },
    rating: 5,
    order: 3,
  },
  {
    slug: 'iso-22301-business-continuity',
    code: 'ISO 22301',
    category: 'quality-and-organizational-excellence',
    title: {
      ar: 'مقدمة في نظام إدارة استمرارية الأعمال ISO 22301',
      en: 'Introduction to the ISO 22301 Business Continuity Management System',
    },
    description: {
      ar: 'دورة تعريفية بمتطلبات المواصفة ISO 22301 و تخطيط استمرارية الأعمال و الاستجابة للأزمات.',
      en: 'An introductory course covering the requirements of ISO 22301, business continuity planning, and crisis response.',
    },
    rating: 4,
    order: 4,
  },
  {
    slug: 'iso-31000-risk-management',
    code: 'ISO 31000',
    category: 'quality-and-organizational-excellence',
    title: {
      ar: 'مقدمة في نظام إدارة المخاطر ISO 31000',
      en: 'Introduction to the ISO 31000 Risk Management System',
    },
    description: {
      ar: 'دورة تعريفية بإطار إدارة المخاطر وفق المواصفة ISO 31000 و أساليب تحديد و تحليل و معالجة المخاطر.',
      en: 'An introductory course covering the ISO 31000 risk management framework and methods for identifying, analysing, and treating risk.',
    },
    rating: 4,
    order: 5,
  },
  {
    slug: 'iso-14001-environmental-management',
    code: 'ISO 14001',
    category: 'quality-and-organizational-excellence',
    title: {
      ar: 'مقدمة في نظام الإدارة البيئية ISO 14001',
      en: 'Introduction to the ISO 14001 Environmental Management System',
    },
    description: {
      ar: 'دورة تعريفية بمتطلبات المواصفة ISO 14001 و الجوانب البيئية و الامتثال التشريعي في المؤسسات.',
      en: 'An introductory course covering the requirements of ISO 14001, environmental aspects, and regulatory compliance in organizations.',
    },
    rating: 4,
    order: 6,
  },
  {
    slug: 'artificial-intelligence-for-entrepreneurs',
    category: 'leadership-and-artificial-intelligence',
    title: {
      ar: 'توظيف الذكاء الاصطناعي في ريادة الأعمال',
      en: 'Using Artificial Intelligence in Entrepreneurship',
    },
    description: {
      ar: 'دورة عملية في استخدام أدوات الذكاء الاصطناعي لتوليد الأفكار و دراسة السوق و تطوير المنتجات.',
      en: 'A practical course on using artificial intelligence tools to generate ideas, study markets, and develop products.',
    },
    rating: 5,
    order: 7,
  },
  {
    slug: 'human-skills-communication',
    category: 'human-skills-development',
    title: {
      ar: 'مهارات التواصل و العمل ضمن فريق',
      en: 'Communication and Teamwork Skills',
    },
    description: {
      ar: 'دورة في مهارات التواصل الفعال و إدارة الاجتماعات و بناء فرق العمل عالية الأداء.',
      en: 'A course in effective communication skills, meeting management, and building high-performing teams.',
    },
    rating: 4,
    order: 8,
  },
  {
    slug: 'modern-public-administration-intro',
    category: 'modern-public-administration',
    title: {
      ar: 'مقدمة في الإدارة العامة و الحديثة',
      en: 'Introduction to Modern Public Administration',
    },
    description: {
      ar: 'دورة تعريفية بأسس الإدارة العامة و اتجاهات التحديث الإداري و الحوكمة في القطاع العام.',
      en: 'An introductory course covering the foundations of public administration, administrative modernization trends, and governance in the public sector.',
    },
    rating: 4,
    order: 9,
  },
];

export default courses;
