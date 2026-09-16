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
  {
    slug: 'ai-tools-for-customer-service',
    category: 'leadership-and-artificial-intelligence',
    title: {
      ar: 'الذكاء الاصطناعي في خدمة العملاء و المبيعات',
      en: 'Artificial Intelligence in Customer Service and Sales',
    },
    description: {
      ar: 'دورة تطبيقية في توظيف المساعدات الذكية و أتمتة الردود لرفع جودة خدمة العملاء و زيادة المبيعات.',
      en: 'An applied course on employing intelligent assistants and response automation to raise the quality of customer service and grow sales.',
    },
    rating: 5,
    order: 10,
  },
  {
    slug: 'data-driven-decision-making',
    category: 'leadership-and-artificial-intelligence',
    title: {
      ar: 'اتخاذ القرار المبني على البيانات',
      en: 'Data-driven Decision Making',
    },
    description: {
      ar: 'دورة في قراءة مؤشرات الأداء و بناء لوحات المتابعة و تحويل البيانات إلى قرارات تشغيلية.',
      en: 'A course in reading performance indicators, building dashboards, and turning data into operational decisions.',
    },
    rating: 4,
    order: 11,
  },
  {
    slug: 'digital-leadership',
    category: 'leadership-and-artificial-intelligence',
    title: {
      ar: 'القيادة في العصر الرقمي',
      en: 'Leadership in the Digital Age',
    },
    description: {
      ar: 'دورة في قيادة فرق العمل عن بعد و إدارة التغيير الرقمي داخل المؤسسات الصغيرة و المتوسطة.',
      en: 'A course in leading remote teams and managing digital change inside small and medium-sized businesses.',
    },
    rating: 4,
    order: 12,
  },

  {
    slug: 'specialization-warehouse-management',
    category: 'specializations',
    title: {
      ar: 'تخصص: إدارة المخازن و سلاسل الإمداد',
      en: 'Specialization: Warehouse and Supply Chain Management',
    },
    description: {
      ar: 'تخصص مهني في تنظيم المخازن و جرد المخزون و تسيير سلاسل الإمداد و ضبط تكاليفها.',
      en: 'A professional specialization in organizing warehouses, stock-taking, running supply chains, and controlling their costs.',
    },
    rating: 5,
    order: 13,
  },
  {
    slug: 'specialization-digital-marketing',
    category: 'specializations',
    title: {
      ar: 'تخصص: التسويق الإلكتروني',
      en: 'Specialization: Digital Marketing',
    },
    description: {
      ar: 'تخصص مهني في بناء الحضور الرقمي و إدارة الحملات الإعلانية و قياس عائد الإنفاق التسويقي.',
      en: 'A professional specialization in building a digital presence, running advertising campaigns, and measuring return on marketing spend.',
    },
    rating: 5,
    order: 14,
  },
  {
    slug: 'specialization-accounting-for-small-business',
    category: 'specializations',
    title: {
      ar: 'تخصص: المحاسبة و التسيير المالي للمؤسسات الصغيرة',
      en: 'Specialization: Accounting and Financial Management for Small Businesses',
    },
    description: {
      ar: 'تخصص مهني في مسك السجلات المحاسبية و إعداد الميزانيات و حساب التكاليف و قراءة القوائم المالية.',
      en: 'A professional specialization in keeping accounting records, preparing budgets, costing, and reading financial statements.',
    },
    rating: 4,
    order: 15,
  },
  {
    slug: 'specialization-tourism-and-religious-guidance',
    category: 'specializations',
    title: {
      ar: 'تخصص: السياحة و الإرشاد الديني',
      en: 'Specialization: Tourism and Religious Guidance',
    },
    description: {
      ar: 'تخصص مهني في تنظيم الرحلات و مرافقة الوفود و مهارات الإرشاد الديني و السياحي.',
      en: 'A professional specialization in organizing trips, accompanying delegations, and the skills of religious and tourist guidance.',
    },
    rating: 4,
    order: 16,
  },

  {
    slug: 'human-skills-negotiation',
    category: 'human-skills-development',
    title: {
      ar: 'مهارات التفاوض و الإقناع',
      en: 'Negotiation and Persuasion Skills',
    },
    description: {
      ar: 'دورة في إعداد ملف التفاوض و إدارة جولاته و أساليب الإقناع و الخروج باتفاق مربح للطرفين.',
      en: 'A course in preparing a negotiation file, managing its rounds, methods of persuasion, and reaching a deal that works for both sides.',
    },
    rating: 5,
    order: 17,
  },
  {
    slug: 'human-skills-time-and-stress',
    category: 'human-skills-development',
    title: {
      ar: 'إدارة الوقت و ضغوط العمل',
      en: 'Time and Work-stress Management',
    },
    description: {
      ar: 'دورة في ترتيب الأولويات و تنظيم اليوم المهني و التعامل مع ضغوط العمل و الإرهاق.',
      en: 'A course in setting priorities, organizing the working day, and handling work pressure and burnout.',
    },
    rating: 4,
    order: 18,
  },
  {
    slug: 'human-skills-presentation',
    category: 'human-skills-development',
    title: {
      ar: 'مهارات العرض و الإلقاء',
      en: 'Presentation and Public Speaking Skills',
    },
    description: {
      ar: 'دورة في بناء العرض التقديمي و لغة الجسد و إدارة الحوار مع الجمهور و التعامل مع رهبة المسرح.',
      en: 'A course in building a presentation, body language, managing dialogue with an audience, and handling stage fright.',
    },
    rating: 4,
    order: 19,
  },

  {
    slug: 'public-administration-governance-and-integrity',
    category: 'modern-public-administration',
    title: {
      ar: 'الحوكمة و النزاهة في القطاع العام',
      en: 'Governance and Integrity in the Public Sector',
    },
    description: {
      ar: 'دورة في مبادئ الحوكمة و الشفافية و آليات الوقاية من الفساد داخل الهيئات العمومية.',
      en: 'A course in the principles of governance and transparency, and the mechanisms for preventing corruption inside public bodies.',
    },
    rating: 4,
    order: 20,
  },
  {
    slug: 'public-administration-project-management',
    category: 'modern-public-administration',
    title: {
      ar: 'إدارة المشاريع العمومية',
      en: 'Public Project Management',
    },
    description: {
      ar: 'دورة في تخطيط المشاريع العمومية و ميزنتها و متابعة تنفيذها و تقييم أثرها.',
      en: 'A course in planning public projects, budgeting them, following up their execution, and evaluating their impact.',
    },
    rating: 4,
    order: 21,
  },

  {
    slug: 'education-active-learning-methods',
    category: 'education-and-pedagogy',
    title: {
      ar: 'أساليب التعلم النشط',
      en: 'Active Learning Methods',
    },
    description: {
      ar: 'دورة في تصميم الأنشطة الصفية التفاعلية و إشراك المتعلمين و توظيف الألعاب التربوية.',
      en: 'A course in designing interactive classroom activities, involving learners, and employing educational games.',
    },
    rating: 5,
    order: 22,
  },
  {
    slug: 'education-adult-learning-principles',
    category: 'education-and-pedagogy',
    title: {
      ar: 'مبادئ تعليم الكبار',
      en: 'Principles of Adult Education',
    },
    description: {
      ar: 'دورة في خصائص المتعلم البالغ و بناء الجلسات القائمة على الخبرة العملية و التغذية الراجعة.',
      en: 'A course in the characteristics of the adult learner and in building sessions based on practical experience and feedback.',
    },
    rating: 5,
    order: 23,
  },
  {
    slug: 'education-assessment-and-evaluation',
    category: 'education-and-pedagogy',
    title: {
      ar: 'التقويم و قياس أثر التدريب',
      en: 'Assessment and Measuring Training Impact',
    },
    description: {
      ar: 'دورة في بناء أدوات التقويم و قياس أثر التدريب على الأداء بعد انتهاء البرنامج.',
      en: 'A course in building assessment tools and measuring the impact of training on performance after a programme ends.',
    },
    rating: 4,
    order: 24,
  },
];

export default courses;
