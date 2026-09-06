// Programs seed data — section 7.3
// Flat list of 9 Program documents: GYB, SYB, IYB, EYB, DYB, lead-development-programs,
// TOT, and the two accreditation sub-programs PTOT + SPTOT (order 8 and 9).

const programs = [
  {
    slug: 'generate-your-business-idea',
    order: 1,
    code: 'GYB',
    title: {
      ar: 'برنامج "أوجد فكرة عمل ناجح"',
      en: 'Generate Your Business Idea – GYB',
    },
    audience: {
      ar: 'لرواد الأعمال المحتملين الذين يرغبون في تأسيس مشروع أو الدخول في مجال الأعمال و يسعون إلى كسب مهارات القيادة و الريادة و اختيار الأفكار الواعدة',
      en: 'For prospective entrepreneurs who want to start a project or enter the business world and are seeking to gain leadership and entrepreneurship skills and choose promising ideas.',
    },
    bullets: [
      {
        ar: 'تقييم ما إذا كان لديك المتطلبات الأساسية اللازمة للدخول في مجال الأعمال',
        en: 'Assess whether you have the basic requirements needed to enter the business world',
      },
      {
        ar: 'شرح بوضوح أي فكرة مشروع أو عمل تتبادر إلى ذهنك',
        en: 'Clearly explain any business or project idea that comes to mind',
      },
      {
        ar: 'تحديد المصادر المحتملة لتوليد الأفكار الناجحة و إنشاء قائمة لها',
        en: 'Identify potential sources for generating successful ideas and create a list of them',
      },
      {
        ar: 'المشاركة في لعبة تطوير الأعمال التي تحاكي الواقع (مستوى 1)',
        en: 'Take part in the realistic business development simulation game (level 1)',
      },
      {
        ar: 'التسجيل و المشاركة في برامج إعداد و اعتماد مناجير أو مدرب أو مستشار (أنظر الرزنامة)',
        en: 'Register and participate in manager, trainer, or consultant preparation and accreditation programs (see the calendar)',
      },
    ],
    resources: {
      interactive: 'http://training.itcilo.org/emld/gyb/#/',
      videoPlaylist: 'https://www.youtube.com/playlist?list=PLQCnfMK-vatutTOh17BhJEQgoUe-iqiCX',
      pdfUrl: '',
    },
    image: '',
    category: '',
    accent: 'green',
    bandTitle: true,
    published: true,
  },
  {
    slug: 'start-your-business',
    order: 2,
    code: 'SYB',
    title: {
      ar: 'برنامج "إبدأ أعمالك"',
      en: 'Start Your Business – SYB',
    },
    audience: {
      ar: 'للذين لديهم فكرة مشروع أو عمل ويريدون وضعها حيز التنفيذ . يقدم الخطوات العملية للبدء و وضع خطة عمل للمشروع المقترح',
      en: 'For those who have a business or project idea and want to put it into practice. It provides the practical steps to get started and to draw up a business plan for the proposed project.',
    },
    bullets: [
      {
        ar: 'وصف محتوى خطة المشروع أو العمل',
        en: 'Describe the content of the business or project plan',
      },
      {
        ar: 'دعم فكرة المشروع أو العمل',
        en: 'Support the business or project idea',
      },
      {
        ar: 'بدء المشروع أو العمل',
        en: 'Launch the business or project',
      },
      {
        ar: 'المشاركة في لعبة تطوير الأعمال التي تحاكي الواقع (مستوى 2)',
        en: 'Take part in the realistic business development simulation game (level 2)',
      },
      {
        ar: 'التسجيل و المشاركة في برامج إعداد و اعتماد مناجير أو مدرب أو مستشار (أنظر الرزنامة)',
        en: 'Register and participate in manager, trainer, or consultant preparation and accreditation programs (see the calendar)',
      },
    ],
    resources: { interactive: '', videoPlaylist: '', pdfUrl: '' },
    image: '',
    category: '',
    accent: 'orange',
    bandTitle: true,
    published: true,
  },
  {
    slug: 'improve-your-business',
    order: 3,
    code: 'IYB',
    title: {
      ar: 'حسن تسيير أعمالك "IYB"',
      en: 'Improve Your Business – IYB',
    },
    audience: {
      ar: 'للذين لديهم مؤسسات ، نشاطات أو يشتغلون في شركات و هيئات و يرغبون في تحسين تسيير أعمالهم و مشاريعهم ؟ هذ البرنامج يمكنهم من تطوير مهارات إدارة الأعمال و بعدها يمكن الحصول على شهادات متخصصة في كل مجال أو ديبلوم شامل معتمد من المنظمة الدولية للعمل :',
      en: 'For those who own businesses or activities, or who work in companies and institutions, and want to improve the management of their businesses and projects. This program enables them to develop business management skills, after which they can obtain specialized certificates in each field or a comprehensive diploma accredited by the International Labour Organization:',
    },
    intro: {
      ar: 'في هذا المسار تطور قدراتك المهنية خطوةً بخطوة ؛ فتحسن إدارة أعمالك ، و تسرّع نموها ، و تستثمر التقنيات الرقمية ، و تكتسب مهارات قيادة البرامج والمبادرات التنموية ، ثم تتأهل لاكتساب مهارات التدريب والمرافقة ، استعدادًا للانضمام إلى برامج الاعتماد الاحترافية ، لتصبح قادرًا على نقل خبرتك و تحويل نجاحك إلى نجاحات جديدة . و يشمل خمسة برامج فيها عشرة رزم تدريبية متكاملة :',
      en: 'On this track you develop your professional capabilities step by step: you improve the management of your business, accelerate its growth, invest in digital technologies, and acquire skills for leading development programs and initiatives. You then qualify to acquire training and mentoring skills, in preparation for joining professional accreditation programs, becoming able to pass on your expertise and turn your success into new successes. It comprises five programs made up of ten fully integrated training packages:',
    },
    bullets: [
      {
        ar: 'تعلم فنيات التسويق ، التفاوض و إدارة المبيعات',
        en: 'Learn the techniques of marketing, negotiation, and sales management',
      },
      {
        ar: 'إكتساب مهارات و وسائل إدارة المخازن',
        en: 'Acquire skills and tools for warehouse management',
      },
      {
        ar: 'التدرب على إدارة الموارد البشرية',
        en: 'Train in human resources management',
      },
      {
        ar: 'الإلمام بأساليب التسيير المالي و المحاسبي للمشاريع',
        en: 'Become familiar with financial and accounting management methods for projects',
      },
      {
        ar: 'التدرب على أساليب و وسائل التخطيط في المؤسسات',
        en: 'Train in planning methods and tools within institutions',
      },
      {
        ar: 'المشاركة في لعبة تطوير الأعمال التي تحاكي الواقع (مستوى 3)',
        en: 'Take part in the realistic business development simulation game (level 3)',
      },
      {
        ar: 'التسجيل و المشاركة في برامج إعداد و اعتماد مناجير أو مدرب أو مستشار (أنظر الرزنامة)',
        en: 'Register and participate in manager, trainer, or consultant preparation and accreditation programs (see the calendar)',
      },
    ],
    resources: { interactive: '', videoPlaylist: '', pdfUrl: '' },
    image: '',
    category: '',
    accent: 'blue',
    bandTitle: true,
    bandHeading: {
      ar: 'حسّن، طوّر و رقمن أعمالك ثم قد برامج التنمية',
      en: 'Improve, expand and digitize your business, then lead development programs',
    },
    modules: [
      {
        title: { ar: 'التسويق و المبيعات', en: 'Marketing and Sales' },
        image: '',
        videoUrl: '',
        pdfUrl: '',
        order: 1,
      },
      {
        title: { ar: 'المشتريات و المخزون', en: 'Purchasing and Stock Control' },
        image: '',
        videoUrl: '',
        pdfUrl: '',
        order: 2,
      },
      {
        title: { ar: 'الموارد البشرية', en: 'Human Resources' },
        image: '',
        videoUrl: '',
        pdfUrl: '',
        order: 3,
      },
      {
        title: { ar: 'مسك سجلات المحاسبة', en: 'Keeping Accounting Records' },
        image: '',
        videoUrl: '',
        pdfUrl: '',
        order: 4,
      },
      {
        title: { ar: 'التخطيط للمؤسسة', en: 'Planning for Your Business' },
        image: '',
        videoUrl: '',
        pdfUrl: '',
        order: 5,
      },
      {
        title: { ar: 'حساب تكاليف المؤسسة', en: 'Costing for Your Business' },
        image: '',
        videoUrl: '',
        pdfUrl: '',
        order: 6,
      },
    ],
    published: true,
  },
  {
    slug: 'expand-your-business',
    order: 4,
    code: 'EYB',
    title: {
      ar: 'وسع أعمالك "EYB"',
      en: 'Expand Your Business – EYB',
    },
    audience: {
      ar: 'لرواد الأعمال الذين يرغبون في تحسين و تطوير أعمالهم أو مشاريعهم "سطر أهدافا أكبر و امضي قدما في عملك"',
      en: 'For entrepreneurs who want to improve and develop their businesses or projects: "Set bigger goals and move your business forward."',
    },
    bullets: [
      {
        ar: 'التعرف على احتمالات نمو الأعمال',
        en: 'Discover the possibilities for business growth',
      },
      {
        ar: 'كيف يمكن تطوير الشركات',
        en: 'How companies can be developed',
      },
      {
        ar: 'المبادئ الأساسية لوضع استراتيجية عملية لتطوير الأعمال',
        en: 'The basic principles for setting a practical strategy for business development',
      },
      {
        ar: 'كيفية اختيار الاستراتيجية الصحيحة لتطوير الأعمال',
        en: 'How to choose the right strategy for business development',
      },
      {
        ar: 'كيف يمكن أن نجعل استراتيجية النمو قابلة للتنفيذ',
        en: 'How to make a growth strategy actionable',
      },
      {
        ar: 'المشاركة في لعبة تطوير الأعمال التي تحاكي الواقع (مستوى 4)',
        en: 'Take part in the realistic business development simulation game (level 4)',
      },
      {
        ar: 'التسجيل و المشاركة في برامج إعداد و اعتماد مناجير أو مدرب أو مستشار (أنظر الرزنامة)',
        en: 'Register and participate in manager, trainer, or consultant preparation and accreditation programs (see the calendar)',
      },
    ],
    resources: { interactive: '', videoPlaylist: '', pdfUrl: '' },
    image: '',
    category: '',
    accent: 'blue',
    bandTitle: false,
    published: true,
  },
  {
    slug: 'digitize-your-business',
    order: 5,
    code: 'DYB',
    title: {
      ar: 'رقمن أعمالك "DYB"',
      en: 'Digitize Your Business – DYB',
    },
    audience: {
      ar: 'رواد الأعمال الذين يريدون توظيف التقنيات الرقمية لتطوير أعمالهم ، والوصول إلى عملاء جدد ، وتحسين الأداء ، و زيادة القدرة على المنافسة .',
      en: 'Entrepreneurs who want to employ digital technologies to develop their businesses, reach new customers, improve performance, and increase their competitiveness.',
    },
    bullets: [
      {
        ar: 'التعرف على فرص التحول الرقمي في الأعمال.',
        en: 'Discover the opportunities for digital transformation in business.',
      },
      {
        ar: 'اختيار الأدوات والمنصات الرقمية المناسبة لنشاطك.',
        en: 'Choose the digital tools and platforms suited to your activity.',
      },
      {
        ar: 'تطوير التسويق الرقمي والتواصل مع العملاء.',
        en: 'Develop digital marketing and communication with customers.',
      },
      {
        ar: 'تحسين العمليات والإدارة باستخدام الحلول الرقمية.',
        en: 'Improve operations and management using digital solutions.',
      },
      {
        ar: 'إعداد خطة عملية لرقمنة مشروعك خطوة بخطوة.',
        en: 'Prepare a practical plan to digitize your project step by step.',
      },
      {
        ar: 'المشاركة في لعبة تطوير الأعمال التي تحاكي الواقع (مستوى 5)',
        en: 'Take part in the realistic business development simulation game (level 5)',
      },
      {
        ar: 'التسجيل و المشاركة في برامج إعداد و اعتماد مناجير أو مدرب أو مستشار (أنظر الرزنامة)',
        en: 'Register and participate in manager, trainer, or consultant preparation and accreditation programs (see the calendar)',
      },
    ],
    resources: { interactive: '', videoPlaylist: '', pdfUrl: '' },
    image: '',
    category: '',
    accent: 'blue',
    bandTitle: false,
    published: true,
  },
  {
    slug: 'lead-development-programs',
    order: 6,
    code: '',
    title: {
      ar: 'قد برامج التنمية بخبرتك',
      en: 'Lead development programs with your expertise',
    },
    audience: {
      ar: 'لمنسقي المشاريع الوطنية ، مديري المشاريع ، مسؤولي تخطيط التنمية الوطنية و موظفي المنظمات غير الحكومية',
      en: 'For national project coordinators, project managers, national development planning officers, and NGO staff.',
    },
    bullets: [
      {
        ar: 'رفع كفاءة المشاركين في صياغة ، تنفيذ ، مراقبة و تقييم برامج و مشاريع التنمية',
        en: 'Raise participants\' proficiency in drafting, implementing, monitoring, and evaluating development programs and projects',
      },
      {
        ar: 'تعلم طريقة تحليل السياق الأولي',
        en: 'Learn the method for initial context analysis',
      },
      {
        ar: 'تصميم الإطار المنطقي (إطار نتائج المشروع)',
        en: 'Design the logical framework (project results framework)',
      },
      {
        ar: 'إنجاز التخطيط و الميزانية للمشروع',
        en: 'Carry out project planning and budgeting',
      },
      {
        ar: 'التدرب على المراقبة و التقييم و التقويم',
        en: 'Train in monitoring, evaluation, and appraisal',
      },
      {
        ar: 'المشاركة في لعبة تطوير الأعمال التي تحاكي الواقع (مستوى 6)',
        en: 'Take part in the realistic business development simulation game (level 6)',
      },
      {
        ar: 'التسجيل و المشاركة في برامج إعداد و اعتماد مناجير أو مدرب أو مستشار (أنظر الرزنامة)',
        en: 'Register and participate in manager, trainer, or consultant preparation and accreditation programs (see the calendar)',
      },
    ],
    resources: { interactive: '', videoPlaylist: '', pdfUrl: '' },
    image: '',
    category: '',
    accent: 'blue',
    bandTitle: false,
    published: true,
  },
  {
    slug: 'training-of-trainers',
    order: 7,
    code: 'TOT',
    title: {
      ar: 'إعداد مدربين ومستشارين "TOT" عام',
      en: 'Training of Trainers and Consultants (TOT / General)',
    },
    audience: {
      ar: 'للراغبين في بناء قاعدة مهنية قوية في التدريب والتيسير والاستشارة، واكتساب المهارات الأساسية لتصميم وتنفيذ البرامج التدريبية، تمهيدًا للالتحاق ببرامج الاعتماد الاحترافية المحلية والدولية.',
      en: 'For those wishing to build a strong professional base in training, facilitation, and consulting, and to acquire the fundamental skills for designing and delivering training programs, in preparation for joining local and international professional accreditation programs.',
    },
    bullets: [
      {
        ar: 'تنمية مهارات التدريب والتيسير وفق مبادئ تعليم الكبار والتعلم القائم على المشاركة والخبرة العملية.',
        en: 'Develop training and facilitation skills according to the principles of adult education and participatory, experience-based learning.',
      },
      {
        ar: 'تعلم تحليل الاحتياجات التدريبية وتحديد الأهداف التعليمية وتصميم البرامج والجلسات التدريبية.',
        en: 'Learn to analyze training needs, define learning objectives, and design training programs and sessions.',
      },
      {
        ar: 'اكتساب مهارات العرض والإلقاء، ولغة الجسد، وإدارة الحوار، والتواصل الفعال مع مختلف فئات المتدربين.',
        en: 'Acquire presentation and delivery skills, body language, dialogue management, and effective communication with different categories of trainees.',
      },
      {
        ar: 'تطوير القدرة على تحفيز المتدربين، وإدارة ديناميكية المجموعات، والتعامل مع الأنماط المختلفة للمشاركين والمواقف التدريبية.',
        en: 'Develop the ability to motivate trainees, manage group dynamics, and handle the different types of participants and training situations.',
      },
      {
        ar: 'التعرف على أخلاقيات المدرب المحترف، وبناء الثقة بالنفس، وتطوير الهوية المهنية للمدرب والمستشار.',
        en: 'Learn the ethics of the professional trainer, build self-confidence, and develop the professional identity of the trainer and consultant.',
      },
      {
        ar: 'التدرب عمليًا على تصميم وتنفيذ جلسات تدريبية وتلقي التغذية الراجعة',
        en: 'Practice designing and delivering training sessions and receiving feedback',
      },
    ],
    resources: { interactive: '', videoPlaylist: '', pdfUrl: '' },
    image: '',
    category: '',
    accent: 'blue',
    bandTitle: false,
    published: true,
  },
  {
    slug: 'certified-trainer-consultant',
    order: 8,
    code: 'PTOT',
    title: {
      ar: 'ضع مهاراتك في خدمة الشركات و المؤسسات الإقتصادية PTOT',
      en: 'Put Your Skills at the Service of Companies and Economic Institutions (PTOT)',
    },
    audience: {
      ar: 'برنامج "مدرِب و مستشار معتمد من المنظمة الدولية للعمل"',
      en: 'The "ILO-Certified Trainer and Consultant" program',
    },
    intro: {
      ar: 'طور غيرك من خلال اكتساب المهارات والمنهجيات والاعتمادات اللازمة لتدريب الأفراد، ومرافقة المؤسسات، وقيادة برامج التنمية، ضمن شبكة دولية من الخبراء والممارسين.\nهنا لا يتوقف النجاح عند صاحبه، بل يتحول إلى رسالة، وشراكة، وأثر يمتد إلى مجتمعات وأجيال جديدة.',
      en: 'Develop others by acquiring the skills, methodologies, and accreditations needed to train individuals, mentor institutions, and lead development programs, within an international network of experts and practitioners.\nHere, success does not stop with the person who achieves it — it becomes a message, a partnership, and an impact that extends to communities and new generations.',
    },
    bullets: [
      {
        ar: 'اعتماد من المنظمة الدولية للعمل بجنيف',
        en: 'Accreditation from the International Labour Organization in Geneva',
      },
      {
        ar: 'إمكانية الولوج إلى كل الوسائل التدريبية (دليل التدريب ، مرشد كل الدورات، مذكرات ، شرائح PowerPoint ، فيديوهات ، قصص) معتمدة من المنظمة الدولية للعمل',
        en: 'Access to all training materials (training guide, facilitator guide for every course, handouts, PowerPoint slides, videos, stories) accredited by the International Labour Organization',
      },
      {
        ar: 'الإستفادة من الخبرات العالمية المعتمدة من المنظمة الدولية للعمل',
        en: 'Benefit from global expertise accredited by the International Labour Organization',
      },
      {
        ar: 'التسجيل و الحصول على عضوية في المنصة الرسمية للمنظمة الدولية للعمل كخبير معتمد من هيئة تابعة للأمم المتحدة',
        en: 'Register and obtain membership on the official platform of the International Labour Organization as an expert certified by a United Nations agency',
      },
      {
        ar: 'الحصول على حقيبة لعبة تطوير الأعمال (كل مستويات)',
        en: 'Receive the business development game kit (all levels)',
      },
      {
        ar: 'المشاركة في في برامج تحويل خبرتك إلى برنامج تدريب ومرافقة معتمد',
        en: 'Participate in programs that turn your expertise into an accredited training and mentoring program',
      },
      {
        ar: 'المشاركة في لعبة تطوير الأعمال التي تحاكي الواقع (كل المستويات)',
        en: 'Take part in the realistic business development simulation game (all levels)',
      },
    ],
    resources: { interactive: '', videoPlaylist: '', pdfUrl: '' },
    image: '',
    category: '',
    accent: 'slate',
    bandTitle: true,
    bandHeading: {
      ar: 'برنامج "مدرِب و مستشار معتمد من المنظمة الدولية للعمل"',
      en: 'ILO Certified Trainer & Consultant Program',
    },
    published: true,
  },
  {
    slug: 'program-designer-accreditation',
    order: 9,
    code: 'SPTOT',
    title: {
      ar: 'طور غيرك بتحويل خبرتك إلى برنامج تدريب ومرافقة معتمد SPTOT',
      en: 'Transform Your Expertise into an Accredited Training and Mentoring Program (SPTOT)',
    },
    audience: {
      ar: 'للخبراء، والمدربين، والمستشارين ، وقادة البرامج المعتمدين والذين يمتلكون خبرات عملية ناجحة، ويرغبون في تحويلها إلى برامج تدريب ومرافقة احترافية قابلة للتطبيق والاعتماد وفق منهجية ومعايير منظمة العمل الدولية.',
      en: 'For certified experts, trainers, consultants, and program leaders who have successful practical experience and wish to turn it into professional training and mentoring programs that can be applied and accredited according to the methodology and standards of the International Labour Organization.',
    },
    bullets: [
      {
        ar: 'تحليل الخبرة وتحويلها إلى منهجية تدريبية عملية',
        en: 'Analyze the expertise and turn it into a practical training methodology',
      },
      {
        ar: 'تصميم الحقائب التدريبية وفق المعايير الدولية',
        en: 'Design training kits according to international standards',
      },
      {
        ar: 'بناء برامج المرافقة والاستشارة المرتبطة بالحقيبة التدريبية',
        en: 'Build the mentoring and consulting programs linked to the training kit',
      },
      {
        ar: 'تطوير أدوات التقييم وقياس النتائج والأثر',
        en: 'Develop evaluation tools and measure results and impact',
      },
      {
        ar: 'إعداد ملف البرنامج للتقييم والاعتماد وفق منهجية منظمة العمل الدولية',
        en: 'Prepare the program file for evaluation and accreditation according to the International Labour Organization methodology',
      },
      {
        ar: 'المرافقة من أجل تصميم لعبة محاكات لبرنامجك (تدريب ومرافقة) التخصصي',
        en: 'Mentoring to design a simulation game for your specialized (training and mentoring) program',
      },
    ],
    resources: { interactive: '', videoPlaylist: '', pdfUrl: '' },
    image: '',
    category: '',
    accent: 'slate',
    bandTitle: false,
    published: true,
  },
];

export default programs;
