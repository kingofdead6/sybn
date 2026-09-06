// Settings seed data — sections 7.1, 7.2, 7.5, 7.6, 7.7, 7.8, 7.9, 7.12, 7.13, 7.14
// Each entry is a Setting document: { key, value }.

const settings = [
  // 7.1 Brand & contact
  {
    key: 'brand',
    value: {
      name: { ar: 'أبسط', en: 'ABCET · SIYB' },
      tagline: { ar: 'إبدأ ، حسن و طور مشروعك', en: 'Start & Improve Your Business' },
      phone: '+213 699 067 381',
      whatsapp: '+213 699 067 381',
      email: 'contact@abcet.net',
      facebook: 'https://www.facebook.com/2290555824559951',
      youtube: 'https://www.youtube.com/channel/UC_2J7AbvqCmpAIVSIZDrUmA',
      guidePdf: 'https://drive.google.com/file/d/1-bSWl94Sa-K9uTzZiAstFU7MlWJnnyqQ/view',
      copyright: {
        ar: 'أبسط | SIYB | جميع الحقوق محفوظة © 2026',
        en: 'ABCET | SIYB | All rights reserved © 2026',
      },
    },
  },

  // 7.2 Homepage hero
  {
    key: 'home.hero',
    value: {
      h1: {
        ar: 'أكبر برنامج تدريب ومرافقة في العالم',
        en: "The world's largest training & mentorship program",
      },
      sub: {
        ar: 'تعلم خطوة بخطوة كيفية إيجاد أفكار مشاريع و أعمال ثم تجسيدها وتطويرها وفق المنهاج الرسمي للمنظمة الدولية للعمل الذي يتضمن ملتقيات دولية للإعتماد بالمدينة المنورة تساعدك على دخول عالم الشغل و الهجرة و فتح شراكات على نطاق واسع',
        en: 'Learn step by step how to find winning business and project ideas, then bring them to life and grow them according to the official curriculum of the International Labour Organization — which includes international accreditation forums in Medina that help you enter the world of employment and migration and open wide-ranging partnerships.',
      },
      cta: {
        ar: 'برامج ريادة الأعمال',
        en: 'Entrepreneurship Programs',
      },
      video: 'https://youtu.be/dkRAoTmZ0Kk',
    },
  },

  // 7.5 Business game modal
  {
    key: 'businessGame',
    value: {
      title: { ar: 'لعبة الأعمال', en: 'The Business Game' },
      body: {
        ar: 'تعتبر لعبة تطوير الاعمال أداة تدريبية معتمدة من المنظمة الدولية للعمل في كل أنحاء العالم ، وهي محاكاة للواقع مكملة للتدريب والمرافقة . تساعد هذه اللعبة على فهم الحقائق المتعلقة بتأسيس وتطوير الأعمال والمشاريع حيث تمكن من وضع المشاركين في جو من المنافسة المقوية لمهارات التفاوض ، التواصل ، اتخاذ القرارات ، إدارة الضغوطات ومعرفة مناخ الأعمال',
        en: 'The business development game is a training tool accredited by the International Labour Organization worldwide. It is a realistic simulation that complements training and mentoring. This game helps participants understand the realities of establishing and developing businesses and projects by placing them in a competitive environment that strengthens negotiation skills, communication, decision-making, stress management, and understanding of the business climate.',
      },
      videos: [
        'https://www.youtube.com/embed/CTumA6JuLyw',
        'https://www.youtube.com/embed/uvYO80r8rY4',
      ],
    },
  },

  // 7.6 About page — intro paragraphs and benefits
  {
    key: 'about.content',
    value: {
      paragraphs: [
        {
          ar: 'سلسلة برامج "إبدأ ، حسن و طور أعمالك" أو اختصارا "أبسط" أو "SIYB" بالإنجليزية المعتمدة من المنظمة الدولية للعمل ، و هي عبارة عن نظام رزم تدريبية مترابطة و مواد دعم و مرافقة من طرف خبراء معتمدين في مجالات الأعمال ، الإستثمار ، التوظيف و الهجرة موجهة للرياديين ، الباحثين عن الشغل ، المهنيين ، الحرفيين ، المرأة الماكثة في البيت و أصحاب المشاريع الذين ليس لديهم خبرات إدارية سابقة ، أو يمتلكون بعضا منها ويريدون تطويرها و تتضمن هذه السلسلة 4 مستويات و هي : إيجاد أفكار أعمال أو مشاريع ناجحة ، بعث أعمال أو مشاريع على ركائز متينة ثم تحسينها',
          en: 'The "Start, Improve and Develop Your Business" program series — abbreviated "ABCET" or "SIYB" in English — is accredited by the International Labour Organization. It is a system of interconnected training packages and support and mentoring materials delivered by certified experts in business, investment, employment, and migration. It is aimed at entrepreneurs, job seekers, professionals, craftspeople, stay-at-home women, and project owners who have no prior management experience, or who have some and want to develop it. The series includes 4 levels: finding successful business or project ideas, launching businesses or projects on solid foundations, and then improving them.',
        },
        {
          ar: 'كما يساعد هذا البرنامج لدخول عالم الشغل و الهجرة و فتح علاقات و شراكات على مستوى عالمي بمنهجية مبسطة و لغة سهلة ، و يعتمد أسلوب المشاركة مع التركيز على عدة نشاطات تطبيقية من خلال الملتقيات الدولية للإعتماد ، بين عدة متعاملين إقتصاديين حيث تساعد المتدربين على تشخيص و إيجاد الحلول للمشاكل المتعلقة بأعمالهم و مشاريعهم',
          en: 'This program also helps participants enter the world of employment and migration and build relationships and partnerships on a global scale, using a simplified methodology and easy language. It relies on a participatory approach with a focus on several practical activities through the international accreditation forums, bringing together various economic operators, and it helps trainees diagnose and find solutions to problems related to their businesses and projects.',
        },
      ],
      benefits: {
        heading: {
          ar: 'مزايا المشاركة في هذا البرنامج',
          en: 'Benefits of Participating in This Program',
        },
        items: [
          {
            ar: 'الحصول على شهادات عالمية معتمدة من المنظمة الدولية للعمل (هيئة الأمم المتحدة) ، هذه الشهادات تثير اهتمام الشركات الإقتصادية في كل دول العالم',
            en: 'Obtain international certificates accredited by the International Labour Organization (a United Nations agency); these certificates attract the interest of economic companies in every country in the world.',
          },
          {
            ar: 'إمكانية المشاركة في برامج إعداد و اعتماد مدربين و مستشارين للشركات و الهيئات (اعتمادات رسمية)',
            en: 'The possibility of participating in programs for preparing and accrediting trainers and consultants for companies and institutions (official accreditations).',
          },
          {
            ar: 'الإنتماء إلى الشبكة العالمية لشركاء المنظمة الدولية للعمل (شركات ، خبراء ، مدربين و مستشارين)',
            en: 'Belonging to the global network of International Labour Organization partners (companies, experts, trainers, and consultants).',
          },
          {
            ar: 'المشاركة في لعبة الأعمال ضمن الملتقيات الدولية العالمية السنوية في مختلف دول العالم بأسعار مدعمة',
            en: 'Participating in the business game as part of the annual international global forums in various countries around the world at subsidized prices.',
          },
          {
            ar: 'إمكانية التواصل مع شركاء البرنامج ضمن الشبكة الدولية و نسج علاقات عمل و شراكة في مختلف دول العالم',
            en: 'The ability to connect with program partners within the international network and build working relationships and partnerships in various countries around the world.',
          },
        ],
      },
    },
  },

  // 7.6 About page — stats
  {
    key: 'about.stats',
    value: {
      heading: {
        ar: 'برنامج "SIYB" بلغة الأرقام',
        en: 'The SIYB Program in Numbers',
      },
      items: [
        {
          label: { ar: 'منصب عمل مستحدث', en: 'Jobs created' },
          value: '25,000+',
        },
        {
          label: { ar: 'مدرب أول بمختلف جنسياتهم', en: 'Master trainers' },
          value: '120+',
        },
        {
          label: { ar: 'مدرب مستشار', en: 'Trainer-consultants' },
          value: '3,500+',
        },
        {
          label: { ar: 'دولة تعتمد البرنامج', en: 'Countries running the program' },
          value: '40+',
        },
        {
          label: { ar: 'مؤسسة معتمدة', en: 'Accredited institutions' },
          value: '200+',
        },
        {
          label: { ar: 'رائد أعمال متدرب', en: 'Entrepreneurs trained' },
          value: '12,000+',
        },
      ],
    },
  },

  // 7.7 Forums section content
  {
    key: 'forums.content',
    value: {
      sectionTitle: {
        ar: 'رزنامة ملتقيات طيبة الدولية للإعتماد * إعتمادات المنظمة الدولية للعمل *',
        en: 'Calendar of Taiba International Accreditation Forums * International Labour Organization Accreditations *',
      },
      tableColumns: {
        ar: ['الملتقى', 'التوقيت (منتصف كل شهر)', 'الشهادات والإعتمادات الدولية', 'ملاحظات'],
        en: ['Forum', 'Timing (mid-month)', 'International Certificates and Accreditations', 'Notes'],
      },
      location: {
        ar: 'المدينة المنورة / مكة المكرمة (مدة الملتقى 3 أيام) (مدة الرحلة 15 يوم)',
        en: 'Medina / Mecca (forum duration: 3 days) (trip duration: 15 days)',
      },
      registrationFields: {
        ar: ['الإسم و اللقب', 'وتساب مع الرمز الدولي', 'البريد الإلكتروني', 'بلد الإقامة', 'الملتقى', 'تأكيد الطلب'],
        en: ['First and last name', 'WhatsApp number with country code', 'Email address', 'Country of residence', 'Forum', 'Confirm request'],
      },
      tagline: {
        ar: 'ملتقيات طيبة : لا يكتمل النجاح حتى يصبح سببا في نجاح الآخرين',
        en: 'Taiba Forums: Success is not complete until it becomes a cause for the success of others.',
      },
      video: 'https://youtu.be/eXYVEvvWVcc',
      playlist: 'https://youtube.com/playlist?list=PLQCnfMK-vatsoKjdm-BYnm4NiNjgw5nh9',
    },
  },

  // 7.8 Certificate request form
  {
    key: 'certRequest.form',
    value: {
      heading: {
        ar: 'طلب شهادة "<اسم البرنامج>"',
        en: 'Request a "<Program Name>" Certificate',
      },
      preamble: {
        ar: 'أنهيت البرنامج ؟ يمكن الحصول على شهادة المنظمة الدولية للعمل بعد اجتياز الإمتحانات التقييمية . كما يمكن المشاركة في دورات متخصصة و طلب المرافقة من طرف خبرائنا المعتمدين',
        en: 'Finished the program? You can obtain the International Labour Organization certificate after passing the assessment exams. You can also take part in specialized courses and request mentoring from our certified experts.',
      },
      fields: [
        { ar: 'الإسم الكامل بالحروف اللاتينية (abc ...)', en: 'Full name in Latin characters (abc ...)' },
        { ar: 'البريد الإلكتروني', en: 'Email address' },
        { ar: 'رقم واتساب مع الرمز الدولي', en: 'WhatsApp number with country code' },
        { ar: 'بلد الإقامة', en: 'Country of residence' },
        { ar: 'هل تود المشاركة في الملتقيات و المعارض الدولية ؟ (نعم / لا)', en: 'Would you like to participate in international forums and exhibitions? (Yes / No)' },
      ],
      shippingNote: {
        ar: 'ملاحظة : لتوصيل الشهادات إلى مقر إقامتكم يجب دفع مبلغ التوصيل قيمته 500 دج (€2.5 / $3)',
        en: 'Note: To have certificates delivered to your place of residence, a delivery fee of 500 DZD (€2.5 / $3) must be paid.',
      },
    },
  },

  // 7.9 Business-proposal request form
  {
    key: 'proposal.form',
    value: {
      heading: {
        ar: 'إختر مقترحات توصيفية لأفكار مشاريع و أعمال في مختلف المجالات',
        en: 'Choose descriptive proposals for business and project ideas in various fields',
      },
      note: {
        ar: 'ملاحظة : للحصول على القوائم التوصيفية للمشاريع و الأعمال يجب حيازة شهادة "أوجد فكرة عمل ناجح"',
        en: 'Note: To obtain the descriptive lists of projects and businesses, you must hold the "Generate Your Business Idea" certificate.',
      },
      tabs: [
        { ar: 'الإستثمارات', en: 'Investments' },
        { ar: 'التوظيف', en: 'Employment' },
        { ar: 'الهجرة', en: 'Migration' },
      ],
      fields: [
        { ar: 'الإسم الكامل بالحروف اللاتينية', en: 'Full name in Latin characters' },
        { ar: 'البريد الإلكتروني', en: 'Email address' },
        { ar: 'وتساب مع الرمز الدولي', en: 'WhatsApp number with country code' },
        { ar: 'في أي بلد تريد أن نرافقك فيه ؟', en: 'In which country would you like us to mentor you?' },
        { ar: 'في أي مجال تريد أن نرافقك', en: 'In which field would you like us to mentor you?' },
        { ar: 'هل تود المشاركة في الملتقيات و المعارض الدولية ؟', en: 'Would you like to participate in international forums and exhibitions?' },
      ],
      fieldOptions: [
        { ar: 'السياحة', en: 'Tourism' },
        { ar: 'الحرف', en: 'Crafts' },
        { ar: 'التكنولوجيا', en: 'Technology' },
        { ar: 'الفلاحة', en: 'Agriculture' },
        { ar: 'الصناعات التحويلية', en: 'Manufacturing Industries' },
        { ar: 'التجارة', en: 'Trade' },
        { ar: 'الطاقات المتجددة', en: 'Renewable Energy' },
        { ar: 'الخدمات', en: 'Services' },
        { ar: 'الرياضة', en: 'Sports' },
        { ar: 'الفن و الأدب', en: 'Art and Literature' },
        { ar: 'ذوي الإحتياجات الخاصة', en: 'People with Special Needs' },
        { ar: 'النساء الماكثات في البيت', en: 'Stay-at-home Women' },
        { ar: 'البناء و العمران', en: 'Construction and Urban Planning' },
        { ar: 'التدوير', en: 'Recycling' },
        { ar: 'هجرة طالب', en: 'Student Migration' },
        { ar: 'هجرة سائح', en: 'Tourist Migration' },
        { ar: 'هجرة مستثمر', en: 'Investor Migration' },
        { ar: 'هجرة موظف', en: 'Employee Migration' },
        { ar: 'مسوق', en: 'Marketer' },
        { ar: 'مسير مخزن', en: 'Warehouse Manager' },
        { ar: 'مندوب مبيعات', en: 'Sales Representative' },
        { ar: 'عون أمن و سلامة', en: 'Security and Safety Officer' },
        { ar: 'سكريتارية', en: 'Secretarial Work' },
        { ar: 'مسير موارد بشرية', en: 'Human Resources Manager' },
        { ar: 'مسير مؤسسة', en: 'Business Manager' },
        { ar: 'مدقق', en: 'Auditor' },
        { ar: 'مسير مالي', en: 'Financial Manager' },
        { ar: 'مسوق إلكتروني', en: 'Digital Marketer' },
        { ar: 'أخرى', en: 'Other' },
      ],
    },
  },

  // 7.13 Sitewide CTA band
  {
    key: 'cta.band',
    value: {
      heading: {
        ar: 'أطلب استشارات ، مرافقة ، اعتمادات أو شهادات فور إنهاء برامجك التدريبية',
        en: 'Request consulting, mentoring, accreditations, or certificates as soon as you finish your training programs',
      },
      sub: {
        ar: 'للمزيد من التفاصيل إتصلوا بنا على رقمنا',
        en: 'For more details, contact us on our phone number',
      },
    },
  },

  // 7.14 Certificate verification
  {
    key: 'certVerify.page',
    value: {
      title: {
        ar: 'تحقق من صحة شهادتك',
        en: 'Verify Your Certificate',
      },
    },
  },

  // 7.12 Store content
  {
    key: 'store.content',
    value: {
      title: { ar: 'المتجر الإلكتروني', en: 'Online Store' },
      intro: {
        ar: 'متجرنا الإلكتروني – دعم حقيقي لرواد الأعمال . في رواد التنمية الفكرية ، لا نكتفي بالتدريب بل نرافقكم حتى السوق . المتجر الإلكتروني لدينا ليس مجرد مساحة لعرض المنتجات بل هو منصة تنموية تهدف إلى دعم وتمكين رواد الأعمال الذين تخرجوا من برامجنا و احتضان مشاريعهم الصغيرة و المتوسطة في أولى خطواتهم نحو النجاح .',
        en: 'Our online store — real support for entrepreneurs. At Rowad Al-Tanmia Al-Fikria, we do not stop at training; we accompany you all the way to the market. Our online store is not just a space to display products but a development platform that aims to support and empower the entrepreneurs who have graduated from our programs and to nurture their small and medium projects in their first steps toward success.',
      },
      categories: [
        { ar: 'براءات اختراع', en: 'Patents' },
        { ar: 'كتب نادرة', en: 'Rare Books' },
        { ar: 'طاقات بشرية', en: 'Human Talent' },
        { ar: 'منتجات مميزة', en: 'Featured Products' },
        { ar: 'تحف فنية', en: 'Artistic Handicrafts' },
        { ar: 'منوعات', en: 'Miscellaneous' },
      ],
      faq: {
        heading: {
          ar: 'أسئلة و إجابات بخصوص المتجر - FAQ',
          en: 'Frequently Asked Questions About the Store - FAQ',
        },
        items: [
          {
            question: { ar: 'ماذا ستجدون هنا؟', en: 'What will you find here?' },
            answer: {
              ar: 'منتجات طبيعية وأصلية من مشاريع يديرها شباب و شابات ملهمون : عسل يمني نادر ، زعفران فاخر ، زيت الزيتون ، تمور عضوية ، و غيرها . بالإضافة إلى كتب و أدلة تدريبية صادرة عن مدربين معتمدين شاركوا في ملتقياتنا . كذلك منتجات فنية و إبداعية من مبادرات محلية شاركت في برنامج SIYB .',
              en: 'Natural and authentic products from projects run by inspiring young men and women: rare Yemeni honey, premium saffron, olive oil, organic dates, and more. In addition to books and training guides published by certified trainers who took part in our forums. Also artistic and creative products from local initiatives that took part in the SIYB program.',
            },
          },
          {
            question: { ar: 'كيف يعمل المتجر؟', en: 'How does the store work?' },
            answer: {
              ar: 'كل منتج هنا يعود لمشروع ناشئ أشرفنا على تأهيله و تدريبه . نحن نتكفل بعملية العرض و التسويق ، ليتمكن صاحب المشروع من التركيز على الجودة والإنتاج . جزء من العائدات يعود بالكامل لصاحب المشروع دعمًا له للاستمرار و التطور.',
              en: 'Every product here belongs to a startup project whose qualification and training we supervised. We take care of the display and marketing process so that the project owner can focus on quality and production. A share of the proceeds goes entirely to the project owner to support them in continuing and growing.',
            },
          },
          {
            question: { ar: 'لماذا هذا النموذج؟', en: 'Why this model?' },
            answer: {
              ar: [
                'تعزيز ثقافة الشراء من المشاريع المحلية',
                'تحويل التدريب إلى نتائج ملموسة و فرص اقتصادية',
                'بناء مجتمع ريادي يتعاون و ينمو معًا',
              ],
              en: [
                'Promoting a culture of buying from local projects',
                'Turning training into tangible results and economic opportunities',
                'Building an entrepreneurial community that collaborates and grows together',
              ],
            },
          },
          {
            question: { ar: 'ما هي رسالتنا؟', en: 'What is our mission?' },
            answer: {
              ar: 'نؤمن أن التمكين الحقيقي لا يكتمل إلا بفتح الأبواب أمام أصحاب المشاريع ليصلوا إلى جمهور واسع. لذلك ، وفرنا لهم هذا الفضاء الإلكتروني ليكون واجهتهم الأولى نحو السوق الرقمي .',
              en: 'We believe that true empowerment is only complete when doors are opened for project owners to reach a wide audience. That is why we have provided them with this online space to be their first gateway to the digital market.',
            },
          },
        ],
      },
    },
  },
];

export default settings;
