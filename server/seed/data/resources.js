// Key Resources — the downloadable guides behind the programme.
//
// `directDownload: true` makes the card link straight to the PDF; left false,
// the card opens the resource's own page where the description has room and
// the download is a button. Both routes are exercised below.

const resources = [
  {
    slug: 'siyb-program-guide',
    order: 1,
    title: {
      ar: 'الدليل التعريفي لبرنامج SIYB',
      en: 'The SIYB Program Guide',
    },
    category: { ar: 'دليل', en: 'Guide' },
    summary: {
      ar: 'نظرة شاملة على سلسلة برامج "إبدأ، حسّن وطوّر أعمالك" ومساراتها الأربعة.',
      en: 'A complete overview of the Start and Improve Your Business series and its four levels.',
    },
    description: {
      ar: 'يقدم هذا الدليل سلسلة برامج SIYB المعتمدة من منظمة العمل الدولية: المسارات الأربعة، الفئات المستهدفة، آلية التدريب والمرافقة، ومسار الاعتماد الدولي. مناسب لمن يريد فهم البرنامج قبل اختيار المستوى الذي يبدأ منه.',
      en: 'This guide sets out the ILO-accredited SIYB series: the four levels, who each is for, how training and mentoring work, and the route to international accreditation. Read it to understand the programme before choosing where to start.',
    },
    image: '',
    pdfUrl: 'https://drive.google.com/file/d/1-bSWl94Sa-K9uTzZiAstFU7MlWJnnyqQ/view',
    directDownload: false,
    published: true,
  },
  {
    slug: 'business-plan-template',
    order: 2,
    title: {
      ar: 'نموذج خطة العمل',
      en: 'Business Plan Template',
    },
    category: { ar: 'نموذج', en: 'Template' },
    summary: {
      ar: 'نموذج جاهز لبناء خطة عملك خطوة بخطوة وفق منهجية البرنامج.',
      en: 'A ready template for building your business plan step by step, following the programme methodology.',
    },
    description: {
      ar: 'نموذج عملي يغطي وصف المشروع، دراسة السوق، الخطة التشغيلية، والتوقعات المالية — بالصيغة المعتمدة في برنامج "بعث الأعمال".',
      en: 'A working template covering the business description, market study, operating plan and financial projections — in the format used in the Start Your Business programme.',
    },
    image: '',
    pdfUrl: '',
    directDownload: true,
    published: true,
  },
  {
    slug: 'trainer-accreditation-handbook',
    order: 3,
    title: {
      ar: 'دليل اعتماد المدربين (TOT)',
      en: 'Trainer Accreditation Handbook (TOT)',
    },
    category: { ar: 'حقيبة', en: 'Handbook' },
    summary: {
      ar: 'شروط ومراحل التأهيل للحصول على اعتماد مدرب دولي من منظمة العمل الدولية.',
      en: 'The requirements and stages for qualifying as an ILO-accredited international trainer.',
    },
    description: {
      ar: 'يشرح هذا الدليل مسار إعداد واعتماد المدربين الدوليين: شروط الترشح، مراحل التأهيل، أدوات وحقائب المحاكاة، ومتطلبات المشاركة في ملتقيات الاعتماد.',
      en: 'This handbook explains the route to international trainer accreditation: eligibility, the stages of qualification, the simulation tools and packages, and what attending the accreditation forums requires.',
    },
    image: '',
    pdfUrl: '',
    directDownload: false,
    published: true,
  },
];

export default resources;
