// Programs seed data — section 7.3
//
// Two branches:
//   trainers         — TOT, the accreditation offer, with the four SIYB paths
//                      (GYB, SYB, IYB, EYB) nested beneath it as the
//                      programmes a certified trainer is qualified to deliver.
//   entrepreneurship — the four stage-based tracks for people building a
//                      business of their own: idea, launch, growth, expansion.
//
// `parentSlug` is resolved to a real `parent` id by seed/index.js once every
// programme has been inserted, so the order of this list does not matter.

const programs = [
  // ---------------------------------------------------------------------
  // Trainers branch
  // ---------------------------------------------------------------------
  {
    slug: 'training-of-trainers',
    order: 1,
    code: 'TOT',
    title: {
      ar: 'إعداد واعتماد المدربين الدوليين "TOT"',
      en: 'Training and Accreditation of International Trainers (TOT)',
    },
    audience: {
      ar: 'للخبراء والمهنيين الراغبين في تحويل خبرتهم المحلية إلى اعتماد دولي، وبناء قاعدة مهنية قوية في التدريب والتيسير والاستشارة، تمهيدا للالتحاق ببرامج الاعتماد الاحترافية.',
      en: 'For experts and professionals wishing to turn local expertise into international accreditation, and to build a strong professional base in training, facilitation and consulting, in preparation for the professional accreditation programmes.',
    },
    intro: {
      ar: 'لا تجعل خبرتك تقف عندك — حوّلها إلى رخصة دولية وأثر عابر للحدود.\nبرنامج SIYB لإعداد واعتماد المدربين الدوليين (TOT): اعتماد رسمي من منظمة العمل الدولية بجنيف (هيئة تابعة للأمم المتحدة)، وتملّك أدوات وحقائب محاكاة الأعمال التخصصية، وفرصة اعتماد دوراتك التدريبية الخاصة ونشرها عالميا.',
      en: 'Do not let your expertise stop with you — turn it into an international licence and a cross-border impact.\nThe SIYB programme for preparing and accrediting international trainers (TOT): official accreditation from the International Labour Organization in Geneva (a United Nations body), ownership of specialised business-simulation tools and packages, and the opportunity to accredit your own training courses and publish them worldwide.',
    },
    bullets: [
      {
        ar: 'الحصول على اعتماد رسمي من منظمة العمل الدولية (ILO – Geneva).',
        en: 'Obtain official accreditation from the International Labour Organization (ILO – Geneva).',
      },
      {
        ar: 'إدراج اسمك في المنصة الرسمية كخبير معتمد لدى هيئة أممية.',
        en: 'Have your name listed on the official platform as an expert accredited by a UN body.',
      },
      {
        ar: 'ترخيص استخدام الحقائب الشاملة والمصادر الرقمية (أدلة المدرب، عروض، دراسات حالة).',
        en: 'A licence to use the complete packages and digital resources (trainer guides, presentations, case studies).',
      },
      {
        ar: 'الحصول على الحقيبة الكاملة للعبة محاكاة تطوير الأعمال بكافة مستوياتها.',
        en: 'Receive the full business-development simulation game package at every level.',
      },
      {
        ar: 'تحليل الاحتياجات التدريبية وتحديد الأهداف التعليمية وتصميم البرامج والجلسات التدريبية.',
        en: 'Analyse training needs, define learning objectives, and design training programmes and sessions.',
      },
      {
        ar: 'اكتساب مهارات العرض والإلقاء، ولغة الجسد، وإدارة الحوار، والتواصل الفعال مع مختلف فئات المتدربين.',
        en: 'Acquire presentation and delivery skills, body language, dialogue management, and effective communication with every kind of trainee.',
      },
      {
        ar: 'تطوير القدرة على تحفيز المتدربين، وإدارة ديناميكية المجموعات، والتعامل مع الأنماط المختلفة للمشاركين والمواقف التدريبية.',
        en: 'Develop the ability to motivate trainees, manage group dynamics, and handle different participant types and training situations.',
      },
      {
        ar: 'التعرف على أخلاقيات المدرب المحترف، وبناء الثقة بالنفس، وتطوير الهوية المهنية للمدرب والمستشار.',
        en: 'Learn the ethics of the professional trainer, build self-confidence, and develop the professional identity of a trainer and consultant.',
      },
      {
        ar: 'إمكانية الولوج إلى كل الوسائل التدريبية (دليل التدريب، مرشد الدورات، مذكرات، شرائح PowerPoint، فيديوهات، قصص) معتمدة من المنظمة الدولية للعمل.',
        en: 'Access to every training resource (training manual, course guide, handouts, PowerPoint slides, videos, case stories) accredited by the International Labour Organization.',
      },
      {
        ar: 'التسجيل والحصول على عضوية في المنصة الرسمية للمنظمة الدولية للعمل كخبير معتمد من هيئة تابعة للأمم المتحدة.',
        en: 'Register and obtain membership of the official ILO platform as an expert accredited by a United Nations body.',
      },
    ],
    ctaLabel: {
      ar: 'قدّم طلب اعتمادك المهني',
      en: 'Apply for your professional accreditation',
    },
    resources: { interactive: '', videoPlaylist: '', pdfUrl: '' },
    image: '',
    category: '',
    accent: 'navy',
    track: 'trainers',
    bandTitle: true,
    published: true,
  },

  // The four SIYB paths, as the programmes a TOT graduate is qualified to
  // deliver. Each keeps the curriculum it teaches and gains the trainer framing.
  {
    slug: 'generate-your-business-idea',
    order: 2,
    code: 'GYB',
    parentSlug: 'training-of-trainers',
    title: {
      ar: 'المسار الأول: برنامج "أوجد فكرة عمل ناجح - GYB"',
      en: 'Path One: Generate Your Business Idea – GYB',
    },
    audience: {
      ar: 'مساعدة رواد الأعمال المحتملين الذين يرغبون في تأسيس مشروع والدخول في مجال الأعمال على كسب مهارات القيادة والريادة واختيار الأفكار الواعدة.',
      en: 'Helping prospective entrepreneurs who want to start a project and enter the business world to gain leadership and entrepreneurship skills and to choose promising ideas.',
    },
    intro: {
      ar: 'المسار الأول ضمن إعداد المدربين: تأهيلك لتدريب رواد الأعمال على توليد الأفكار واختيارها، ومرافقتهم في لعبة المحاكاة (مستوى 1).',
      en: 'The first path in trainer preparation: qualifying you to train entrepreneurs in generating and selecting ideas, and to facilitate the simulation game (level 1).',
    },
    bullets: [
      {
        ar: 'تقييم ما إذا كان لديك المتطلبات الأساسية اللازمة في مجال الأعمال والتعريف بها لدى رواد الأعمال.',
        en: 'Assess whether the basic business requirements are in place, and introduce them to entrepreneurs.',
      },
      {
        ar: 'شرح بوضوح أي فكرة مشروع أو عمل مقاولاتي يتبادر إلى الذهن — الخبرة.',
        en: 'Clearly explain any business or entrepreneurial idea that comes to mind — experience.',
      },
      {
        ar: 'القدرة على تحديد المصادر المحتملة لتوليد الأفكار الناجحة للمتدربين — القدرة.',
        en: 'The ability to identify potential sources for generating successful ideas for trainees — capability.',
      },
      {
        ar: 'المشاركة في لعبة تطوير الأعمال التي تحاكي الواقع (مستوى 1) — التجربة.',
        en: 'Take part in the realistic business-development simulation game (level 1) — practice.',
      },
    ],
    ctaLabel: {
      ar: 'التسجيل والمشاركة في برامج إعداد واعتماد مدرب',
      en: 'Register for the trainer preparation and accreditation programmes',
    },
    resources: {
      interactive: 'http://training.itcilo.org/emld/gyb/#/',
      videoPlaylist: 'https://www.youtube.com/playlist?list=PLQCnfMK-vatutTOh17BhJEQgoUe-iqiCX',
      pdfUrl: '',
    },
    image: '',
    category: '',
    accent: 'green',
    track: 'trainers',
    bandTitle: false,
    published: true,
  },
  {
    slug: 'start-your-business',
    order: 3,
    code: 'SYB',
    parentSlug: 'training-of-trainers',
    title: {
      ar: 'المسار الثاني: برنامج "إبدأ أعمالك - SYB"',
      en: 'Path Two: Start Your Business – SYB',
    },
    audience: {
      ar: 'لمن لديهم فكرة مشروع مدروسة ويريدون وضعها حيز التنفيذ، عبر تقديم الخطوات العملية للبدء ووضع خطة عمل للمشروع المقترح.',
      en: 'For those with a considered project idea who want to put it into execution, through the practical steps for starting and building a business plan for the proposed project.',
    },
    intro: {
      ar: 'المسار الثاني: تأهيلك لتدريب رواد الأعمال على وضع خطة العمل ودراسة السوق والانتقال بها إلى حيز التنفيذ، ومرافقتهم في لعبة المحاكاة (مستوى 2).',
      en: 'The second path: qualifying you to train entrepreneurs in building a business plan and market study, taking it into execution, and facilitating the simulation game (level 2).',
    },
    bullets: [
      {
        ar: 'القدرة على وصف محتوى خطة المشروع أو العمل من خلال دراسة السوق.',
        en: 'The ability to describe the content of a project or business plan through a market study.',
      },
      {
        ar: 'دعم فكرة المشروع لدى رواد الأعمال والعمل من خلال دراسة جيدة على البدء في التنفيذ.',
        en: 'Support the entrepreneur’s project idea and work, through a sound study, towards beginning execution.',
      },
      {
        ar: 'المشاركة في لعبة تطوير الأعمال التي تحاكي الواقع (مستوى 2).',
        en: 'Take part in the realistic business-development simulation game (level 2).',
      },
    ],
    ctaLabel: {
      ar: 'التسجيل والمشاركة في برامج إعداد واعتماد مدرب',
      en: 'Register for the trainer preparation and accreditation programmes',
    },
    resources: { interactive: '', videoPlaylist: '', pdfUrl: '' },
    image: '',
    category: '',
    accent: 'orange',
    track: 'trainers',
    bandTitle: false,
    published: true,
  },
  {
    slug: 'improve-your-business',
    order: 4,
    code: 'IYB',
    parentSlug: 'training-of-trainers',
    title: {
      ar: 'المسار الثالث: برنامج "سرّع نمو أعمالك - IYB"',
      en: 'Path Three: Improve Your Business – IYB',
    },
    audience: {
      ar: 'لأصحاب المشاريع القائمة الراغبين في تطوير قدراتهم المهنية خطوة بخطوة، وتحسين معلوماتهم في إدارة الأعمال، والاستثمار في التقنيات الرقمية، واكتساب مهارات قيادة البرامج والمبادرات التنموية.',
      en: 'For owners of established projects who want to develop their professional capabilities step by step, improve their business-management knowledge, invest in digital technology, and acquire the skills to lead development programmes and initiatives.',
    },
    intro: {
      ar: 'المسار الثالث: تأهيلك لتدريب أصحاب المشاريع على التسويق والتفاوض وإدارة المبيعات والمخازن والموارد البشرية والتسيير المالي، ومرافقتهم في لعبة المحاكاة (مستوى 3).',
      en: 'The third path: qualifying you to train business owners in marketing, negotiation, sales, inventory, human resources and financial management, and to facilitate the simulation game (level 3).',
    },
    bullets: [
      {
        ar: 'تعلم فنيات التسويق والتفاوض وإدارة المبيعات.',
        en: 'Learn the techniques of marketing, negotiation and sales management.',
      },
      {
        ar: 'اكتساب مهارات ووسائل إدارة المخازن.',
        en: 'Acquire the skills and tools of inventory management.',
      },
      {
        ar: 'التدرب على إدارة الموارد البشرية.',
        en: 'Train in human-resources management.',
      },
      {
        ar: 'الإلمام بأساليب التسيير المالي والمحاسبي للمشاريع.',
        en: 'Master the methods of financial and accounting management for projects.',
      },
      {
        ar: 'التدرب على أساليب ووسائل التخطيط في المؤسسات.',
        en: 'Train in the methods and tools of planning within institutions.',
      },
      {
        ar: 'المشاركة في لعبة تطوير الأعمال التي تحاكي الواقع (مستوى 3).',
        en: 'Take part in the realistic business-development simulation game (level 3).',
      },
    ],
    ctaLabel: {
      ar: 'التسجيل والمشاركة في برامج إعداد واعتماد مدرب',
      en: 'Register for the trainer preparation and accreditation programmes',
    },
    resources: { interactive: '', videoPlaylist: '', pdfUrl: '' },
    image: '',
    category: '',
    accent: 'blue',
    track: 'trainers',
    bandTitle: false,
    published: true,
  },
  {
    slug: 'expand-your-business',
    order: 5,
    code: 'EYB',
    parentSlug: 'training-of-trainers',
    title: {
      ar: 'المسار الرابع: برنامج "وسع أعمالك - EYB"',
      en: 'Path Four: Expand Your Business – EYB',
    },
    audience: {
      ar: 'تحت شعار "سطّر أهدافا أكبر وامضِ قدما في عملك" — لرواد الأعمال الراغبين في تحسين وتطوير أعمالهم أو مشاريعهم والتوسع بها.',
      en: 'Under the banner “set larger goals and push your business forward” — for entrepreneurs seeking to improve, develop and expand their businesses or projects.',
    },
    intro: {
      ar: 'المسار الرابع: تأهيلك لتدريب المؤسسات على استراتيجيات التوسع ونمو الأعمال واستهداف أسواق جديدة، ومرافقتهم في لعبة المحاكاة (مستوى 4).',
      en: 'The fourth path: qualifying you to train institutions in expansion strategies, business growth and targeting new markets, and to facilitate the simulation game (level 4).',
    },
    bullets: [
      {
        ar: 'التعرف على الطرق واحتمالات نمو الأعمال وكيف يمكن تطوير الشركات.',
        en: 'Learn the routes and possibilities for business growth, and how companies can be developed.',
      },
      {
        ar: 'التعرف على المبادئ الأساسية لوضع استراتيجية عملية لتطوير الأعمال.',
        en: 'Learn the basic principles for setting a workable business-development strategy.',
      },
      {
        ar: 'التعرف على كيفية اختيار الاستراتيجية الصحيحة لتطوير الأعمال وجعلها قابلة للتنفيذ.',
        en: 'Learn how to choose the right business-development strategy and make it executable.',
      },
      {
        ar: 'المشاركة في لعبة تطوير الأعمال التي تحاكي الواقع (مستوى 4).',
        en: 'Take part in the realistic business-development simulation game (level 4).',
      },
    ],
    ctaLabel: {
      ar: 'التسجيل والمشاركة في برامج إعداد واعتماد مدرب',
      en: 'Register for the trainer preparation and accreditation programmes',
    },
    resources: { interactive: '', videoPlaylist: '', pdfUrl: '' },
    image: '',
    category: '',
    accent: 'blue',
    track: 'trainers',
    bandTitle: false,
    published: true,
  },

  // ---------------------------------------------------------------------
  // Entrepreneurship branch — choose the stage your project is at.
  // ---------------------------------------------------------------------
  {
    slug: 'track-idea-validation',
    order: 11,
    code: '01',
    title: {
      ar: 'المسار 01: توليد واختبار الفكرة الاستثمارية',
      en: 'Track 01: Generating and testing the investment idea',
    },
    audience: {
      ar: 'من يبحث عن فكرة مشروع واعدة، أو يرغب في اختبار جاهزيته لدخول السوق.',
      en: 'For anyone looking for a promising business idea, or wanting to test their readiness to enter the market.',
    },
    bullets: [
      {
        ar: 'فحص صلاحية الفكرة وجدواها قبل استثمار دينار واحد.',
        en: 'Test the validity and feasibility of the idea before investing a single dinar.',
      },
      {
        ar: 'توليد أفكار مبتكرة باستخدام أدوات تحليل الفرص السوقية.',
        en: 'Generate innovative ideas using market-opportunity analysis tools.',
      },
      {
        ar: 'خوض لعبة محاكاة تطوير الأعمال (المستوى 1) لفهم ديناميكيات السوق مبكرا.',
        en: 'Play the business-development simulation game (level 1) to understand market dynamics early.',
      },
    ],
    ctaLabel: {
      ar: 'سجل الآن وابدأ بصياغة فكرتك',
      en: 'Register now and start shaping your idea',
    },
    resources: { interactive: '', videoPlaylist: '', pdfUrl: '' },
    image: '',
    category: '',
    accent: 'green',
    track: 'entrepreneurship',
    bandTitle: true,
    published: true,
  },
  {
    slug: 'track-launch',
    order: 12,
    code: '02',
    title: {
      ar: 'المسار 02: إطلاق وتأسيس المشروع',
      en: 'Track 02: Launching and establishing the project',
    },
    audience: {
      ar: 'أصحاب الأفكار الجاهزة للتنفيذ، والراغبون في خارطة طريق عملية للانطلاق.',
      en: 'For those whose ideas are ready to execute and who want a practical road map for launching.',
    },
    bullets: [
      {
        ar: 'بناء خطة عمل متكاملة (Business Plan) قابلة للتمويل والتطبيق.',
        en: 'Build a complete business plan that is fundable and workable.',
      },
      {
        ar: 'إتقان خطوات التأسيس الفعلي وإدارة الموارد المتاحة.',
        en: 'Master the real steps of establishment and the management of available resources.',
      },
      {
        ar: 'اختبار استراتيجية إطلاق مشروعك عبر لعبة محاكاة الأعمال (المستوى 2).',
        en: 'Test your launch strategy through the business simulation game (level 2).',
      },
    ],
    ctaLabel: {
      ar: 'سجل الآن وابنِ خطة إطلاقك',
      en: 'Register now and build your launch plan',
    },
    resources: { interactive: '', videoPlaylist: '', pdfUrl: '' },
    image: '',
    category: '',
    accent: 'orange',
    track: 'entrepreneurship',
    bandTitle: true,
    published: true,
  },
  {
    slug: 'track-growth-digital',
    order: 13,
    code: '03',
    title: {
      ar: 'المسار 03: توسيع ونمو الأعمال والتحول الرقمي',
      en: 'Track 03: Business growth and digital transformation',
    },
    audience: {
      ar: 'منظومة الشركات القائمة التي تريد تحسين تسييرها وتوظيف التقنيات الحديثة في نموها.',
      en: 'For established companies seeking to improve how they are run and to put modern technology to work in their growth.',
    },
    bullets: [
      {
        ar: 'تحسين وتسيير الأعمال: إتقان التسويق والتفاوض وسلاسل الإمداد والمحاسبة والموارد البشرية (لعبة المؤسسة مستوى 3).',
        en: 'Improving and running the business: mastering marketing, negotiation, supply chains, accounting and human resources (enterprise game level 3).',
      },
      {
        ar: 'توظيف التقنيات والذكاء الاصطناعي في خدمة العملاء وزيادة المبيعات (محاكاة مستوى 4).',
        en: 'Putting technology and artificial intelligence to work in customer service and increasing sales (simulation level 4).',
      },
    ],
    ctaLabel: {
      ar: 'سجل الآن واختبر قدراتك',
      en: 'Register now and test your capabilities',
    },
    resources: { interactive: '', videoPlaylist: '', pdfUrl: '' },
    image: '',
    category: '',
    accent: 'blue',
    track: 'entrepreneurship',
    bandTitle: true,
    published: true,
  },
  {
    slug: 'track-expansion',
    order: 14,
    code: '04',
    title: {
      ar: 'المسار 04: استراتيجيات التوسع في الأعمال',
      en: 'Track 04: Business expansion strategies',
    },
    audience: {
      ar: 'المؤسسات التي تستهدف أسواقا جديدة وتسعى لرفع حصتها السوقية.',
      en: 'For institutions targeting new markets and seeking to raise their market share.',
    },
    bullets: [
      {
        ar: 'استهداف أسواق جديدة وبناء الميزة التنافسية.',
        en: 'Target new markets and build competitive advantage.',
      },
      {
        ar: 'رفع الحصة السوقية عبر استراتيجيات توسع قابلة للتنفيذ.',
        en: 'Raise market share through workable expansion strategies.',
      },
      {
        ar: 'المشاركة في لعبة تطوير الأعمال التي تحاكي الواقع (مستوى 4).',
        en: 'Take part in the realistic business-development simulation game (level 4).',
      },
    ],
    ctaLabel: {
      ar: 'سجل الآن وسرّع نمو منشأتك',
      en: 'Register now and accelerate your growth',
    },
    resources: { interactive: '', videoPlaylist: '', pdfUrl: '' },
    image: '',
    category: '',
    accent: 'navy',
    track: 'entrepreneurship',
    bandTitle: true,
    published: true,
  },
];

export default programs;
