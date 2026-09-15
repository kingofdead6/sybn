// Settings seed data — sections 7.1, 7.2, 7.5, 7.6, 7.7, 7.8, 7.9, 7.12, 7.13, 7.14
// Each entry is a Setting document: { key, value }.

const settings = [
  // 7.1 Brand & contact
  {
    key: 'brand',
    value: {
      name: { ar: 'أبسط', en: 'ABCET · SIYB' },
      tagline: { ar: 'إبدأ ، حسن و طور مشروعك', en: 'Start & Improve Your Business' },
      phone: '+213 770 31 34 48',
      whatsapp: '+213 770 31 34 48',
      email: 'berrslim3@gmail.com',
      instagram: 'https://instagram.com/berrayah_slimane',
      motto: {
        ar: 'لا يكتمل النجاح حتى يصبح سببا في نجاح الآخرين',
        en: 'Success is not complete until it becomes a cause for the success of others',
      },
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
    // Photographs shown beside the forum registration form on the home page.
    // Managed from the admin Settings screen; empty is a valid, handled state.
    key: 'forums.gallery',
    value: [],
  },
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

  // Audience segmentation — the two entry paths into the programme.
  {
    key: 'home.audiences',
    value: {
      heading: {
        ar: 'اختر مسارك',
        en: 'Choose your path',
      },
      sub: {
        ar: 'مساران يغطيان الرحلة كاملة: من فكرة مشروع أولى إلى مدرب معتمد دوليا.',
        en: 'Two paths covering the whole journey: from a first business idea to an internationally accredited trainer.',
      },
      items: [
        {
          key: 'entrepreneurs',
          title: { ar: 'رواد الأعمال', en: 'Entrepreneurs' },
          tagline: {
            ar: 'فكرة مشروعك تدور في رأسك؟ حان وقت اختبارها وتجسيدها على أرض الواقع بدون مخاطرة عشوائية.',
            en: 'Is your business idea going round in your head? It is time to test it and bring it to life without blind risk.',
          },
          questions: [
            { ar: 'هل حان وقت اختبارها وتجسيدها على أرض الواقع بدون مخاطرة عشوائية؟', en: 'Is it time to test it and bring it to life without blind risk?' },
            { ar: 'هل أنت راض عن طريقة تسييرك للمشروع؟', en: 'Are you satisfied with the way you run your project?' },
            { ar: 'هل أنت قادر على المضي قدما؟', en: 'Are you able to move forward?' },
          ],
          body: {
            ar: 'انضم لأقوى مسار ريادي مدعوم بمنهجيات منظمة العمل الدولية (ILO)، وتدرب على إدارة وتسريع أعمالك عبر ألعاب محاكاة السوق الواقعية (Business Gamification).',
            en: 'Join the strongest entrepreneurial path, backed by International Labour Organization (ILO) methodologies, and train to manage and accelerate your business through real market simulation games (Business Gamification).',
          },
          bullets: [
            { ar: 'مسار توليد وتثبيت الفكرة', en: 'Generating and validating the idea' },
            { ar: 'مسار خطة وتأسيس المشروع', en: 'Business plan and launching the project' },
            { ar: 'مسار نمو وتوسيع الأعمال', en: 'Business growth and expansion' },
            { ar: 'مسار إستراتيجية التوسع في الأعمال', en: 'Business expansion strategy' },
          ],
          cta: { ar: 'سجل الآن وابدأ بصياغة فكرتك', en: 'Register now and start shaping your idea' },
          href: '#product-tracks',
        },
        {
          key: 'trainers',
          title: { ar: 'المدربون والخبراء', en: 'Trainers and experts' },
          tagline: {
            ar: 'من خبرة محلية إلى مدرب دولي. لا تجعل خبرتك تقف عندك — حوّلها إلى رخصة دولية وأثر عابر للحدود.',
            en: 'From local expertise to international trainer. Do not let your experience stop with you — turn it into an international licence and a cross-border impact.',
          },
          body: {
            ar: 'برنامج SIYB لإعداد واعتماد المدربين الدوليين (TOT): اعتماد رسمي من منظمة العمل الدولية بجنيف، وتملّك أدوات وحقائب محاكاة الأعمال التخصصية، وفرصة اعتماد دوراتك التدريبية الخاصة ونشرها عالميا.',
            en: 'The SIYB programme for preparing and accrediting international trainers (TOT): official accreditation from the International Labour Organization in Geneva, ownership of specialised business simulation tools and packages, and the opportunity to accredit your own training courses and publish them globally.',
          },
          bullets: [
            { ar: 'اعتماد رسمي من منظمة العمل الدولية (ILO - Geneva)', en: 'Official accreditation from the International Labour Organization (ILO - Geneva)' },
            { ar: 'إدراج اسمك في المنصة الرسمية كخبير معتمد لدى هيئة أممية', en: 'Your name listed on the official platform as an expert accredited by a UN body' },
            { ar: 'ترخيص استخدام الحقائب الشاملة والمصادر الرقمية', en: 'Licence to use the complete packages and digital resources' },
            { ar: 'الحصول على الحقيبة الكاملة للعبة محاكاة تطوير الأعمال بكافة مستوياتها', en: 'The full business development simulation game package, at all levels' },
          ],
          cta: { ar: 'قدّم طلب اعتمادك المهني', en: 'Apply for your professional accreditation' },
          href: '#elite-tracks',
        },
      ],
    },
  },

  // General FAQ for the home page (the store keeps its own, separate FAQ).
  {
    key: 'home.faq',
    value: {
      heading: { ar: 'الأسئلة الشائعة', en: 'Frequently asked questions' },
      items: [
        {
          question: {
            ar: 'هل البرامج موجهة للمشاريع الناشئة فقط أم للخبراء أيضا؟',
            en: 'Are the programmes aimed only at start-ups, or at experts as well?',
          },
          answer: {
            ar: 'تغطي المنظومة المرحلتين بدقة؛ تبدأ مع رائد الأعمال من مرحلة توليد الفكرة، وتصل بالخبراء لتأهيلهم كمدربين ومستشارين معتمدين دوليا.',
            en: 'The system covers both stages precisely: it starts with the entrepreneur at the idea-generation stage, and takes experts through to qualifying as internationally accredited trainers and consultants.',
          },
        },
        {
          question: {
            ar: 'ما هي ملتقيات طيبة الدولية؟',
            en: 'What are the Taiba International Forums?',
          },
          answer: {
            ar: 'هي ملتقيات تقام دوريا كل شهر في المدينة المنورة ومكة المكرمة لمناقشة عروض المترشحين، وتدريبهم على تقنيات المحاكاة، وتأهيلهم لشهادات الاعتماد.',
            en: 'They are forums held periodically each month in Medina and Mecca to discuss the presentations of candidates, train them in simulation techniques, and qualify them for accreditation certificates.',
          },
        },
        {
          question: {
            ar: 'كيف تختلف لعبة محاكاة الأعمال عن التدريب النظري؟',
            en: 'How does the business simulation game differ from theoretical training?',
          },
          answer: {
            ar: 'لعبة المحاكاة تطبق نموذج التعلم النشط القائم على اتخاذ قرارات مالية وتسويقية وإدارية داخل بيئة تحاكي تقلبات السوق الفعلي، مما يرفع الكفاءة بصورة تفاعلية.',
            en: 'The simulation game applies an active-learning model based on making financial, marketing and management decisions inside an environment that mirrors real market fluctuations, raising competence interactively.',
          },
        },
      ],
    },
  },
  // Product tracks — "مسارات رواد الأعمال: اختر مرحلة مشروعك".
  // The four-stage entrepreneur journey, stated by project stage rather than by
  // programme code, so a reader can self-select before meeting the ladder.
  {
    key: 'home.productTracks',
    value: {
      heading: {
        ar: 'مسارات رواد الأعمال: اختر مرحلة مشروعك',
        en: 'Entrepreneur tracks: choose your project stage',
      },
      sub: {
        ar: 'انضم لأقوى مسار ريادي مدعوم بمنهجيات منظمة العمل الدولية (ILO)، وتدرب على إدارة وتسريع أعمالك عبر ألعاب محاكاة السوق الواقعية (Business Gamification).',
        en: 'Join the strongest entrepreneurial path, backed by International Labour Organization (ILO) methodologies, and train to manage and accelerate your business through real market simulation games (Business Gamification).',
      },
      outcomesLabel: { ar: 'ماذا ستحقق؟', en: 'What will you achieve?' },
      audienceLabel: { ar: 'الفئة المستهدفة', en: 'Who it is for' },
      items: [
        {
          key: 'track-1',
          number: '01',
          accent: 'green',
          gameLevel: 1,
          program: 'generate-your-business-idea',
          title: {
            ar: 'توليد واختبار الفكرة الاستثمارية',
            en: 'Generating and testing the investment idea',
          },
          audience: {
            ar: 'من يبحث عن فكرة مشروع واعدة، أو يرغب في اختبار جاهزيته لدخول السوق.',
            en: 'Anyone looking for a promising project idea, or wanting to test their readiness to enter the market.',
          },
          outcomes: [
            {
              ar: 'فحص صلاحية الفكرة وجدواها قبل استثمار دينار واحد',
              en: 'Check the validity and feasibility of your idea before investing a single dinar',
            },
            {
              ar: 'توليد أفكار مبتكرة باستخدام أدوات تحليل الفرص السوقية',
              en: 'Generate innovative ideas using market opportunity analysis tools',
            },
            {
              ar: 'خوض لعبة محاكاة تطوير الأعمال (المستوى 1) لفهم ديناميكيات السوق مبكرا',
              en: 'Play the business development simulation game (level 1) to understand market dynamics early',
            },
          ],
          cta: { ar: 'سجل الآن وابدأ بصياغة فكرتك', en: 'Register now and start shaping your idea' },
        },
        {
          key: 'track-2',
          number: '02',
          accent: 'orange',
          gameLevel: 2,
          program: 'start-your-business',
          title: {
            ar: 'إطلاق وتأسيس المشروع',
            en: 'Launching and establishing the project',
          },
          audience: {
            ar: 'أصحاب الأفكار الجاهزة للتنفيذ، والراغبون في خارطة طريق عملية للانطلاق.',
            en: 'Owners of ideas that are ready to execute, who want a practical road map to get started.',
          },
          outcomes: [
            {
              ar: 'بناء خطة عمل متكاملة (Business Plan) قابلة للتمويل والتطبيق',
              en: 'Build a complete business plan that is fundable and applicable',
            },
            {
              ar: 'إتقان خطوات التأسيس الفعلي وإدارة الموارد المتاحة',
              en: 'Master the real steps of setting up and managing the resources available to you',
            },
            {
              ar: 'اختبار استراتيجية إطلاق مشروعك عبر لعبة محاكاة الأعمال (المستوى 2)',
              en: 'Test your launch strategy through the business simulation game (level 2)',
            },
          ],
          cta: { ar: 'سجل الآن وابنِ خطة إطلاقك', en: 'Register now and build your launch plan' },
        },
        {
          key: 'track-3',
          number: '03',
          accent: 'blue',
          gameLevel: 3,
          program: 'improve-your-business',
          title: {
            ar: 'توسيع ونمو الأعمال والتحول الرقمي',
            en: 'Business growth, expansion and digital transformation',
          },
          audience: {
            ar: 'منظومة الشركات القائمة، وتضم أربعة مسارات تنفيذية.',
            en: 'The ecosystem for existing companies, comprising four executive tracks.',
          },
          outcomes: [
            {
              ar: 'تحسين وتسيير الأعمال: إتقان التسويق، التفاوض، سلاسل الإمداد، المحاسبة، والموارد البشرية (لعبة المؤسسة مستوى 3)',
              en: 'Improving and running the business: mastering marketing, negotiation, supply chains, accounting and human resources (enterprise game level 3)',
            },
            {
              ar: 'توظيف التقنيات والذكاء الاصطناعي في خدمة العملاء وزيادة المبيعات (محاكاة مستوى 4)',
              en: 'Employing technology and artificial intelligence in customer service and sales growth (simulation level 4)',
            },
          ],
          cta: { ar: 'سجل الآن واختبر قدراتك', en: 'Register now and test your capabilities' },
        },
        {
          key: 'track-4',
          number: '04',
          accent: 'slate',
          gameLevel: 4,
          program: 'expand-your-business',
          title: {
            ar: 'استراتيجيات التوسع في الأعمال',
            en: 'Business expansion strategies',
          },
          audience: {
            ar: 'المؤسسات التي بلغت مرحلة النضج وتستهدف أسواقا جديدة وحصة سوقية أكبر.',
            en: 'Established businesses that have reached maturity and are targeting new markets and a larger market share.',
          },
          outcomes: [
            { ar: 'استهداف أسواق جديدة', en: 'Target new markets' },
            { ar: 'بناء الميزة التنافسية', en: 'Build your competitive advantage' },
            {
              ar: 'رفع الحصة السوقية (لعبة المؤسسة مستوى 4)',
              en: 'Raise your market share (enterprise game level 4)',
            },
          ],
          cta: { ar: 'سجل الآن وسرّع نمو منشأتك', en: 'Register now and accelerate your growth' },
        },
      ],
    },
  },

  // Elite / trainer tracks — "مسارات النخبة والمدربين".
  {
    key: 'home.eliteTracks',
    value: {
      heading: { ar: 'مسارات النخبة والمدربين', en: 'Elite and trainer tracks' },
      kicker: { ar: 'من خبرة محلية إلى مدرب دولي', en: 'From local expertise to international trainer' },
      sub: {
        ar: 'لا تجعل خبرتك تقف عندك — حوّلها إلى رخصة دولية وأثر عابر للحدود.',
        en: 'Do not let your experience stop with you — turn it into an international licence and a cross-border impact.',
      },
      cta: { ar: 'قدّم طلب اعتمادك المهني', en: 'Apply for your professional accreditation' },
      items: [
        {
          key: 'tot-certified',
          code: 'TOT',
          program: 'certified-trainer-consultant',
          title: { ar: 'مدرب معتمد دوليا (TOT)', en: 'Internationally certified trainer (TOT)' },
          tagline: {
            ar: 'حوّل الخبرة المحلية إلى مدرب معتمد في شبكة الخبراء الدولية.',
            en: 'Turn local expertise into a certified trainer within the international network of experts.',
          },
          bullets: [
            {
              ar: 'الحصول على اعتماد رسمي من منظمة العمل الدولية (ILO - Geneva)',
              en: 'Obtain official accreditation from the International Labour Organization (ILO - Geneva)',
            },
            {
              ar: 'إدراج اسمك في المنصة الرسمية كخبير معتمد لدى هيئة أممية',
              en: 'Have your name listed on the official platform as an expert accredited by a UN body',
            },
            {
              ar: 'ترخيص استخدام الحقائب الشاملة والمصادر الرقمية (أدلة المدرب، عروض، دراسات حالة)',
              en: 'A licence to use the complete packages and digital resources (trainer guides, presentations, case studies)',
            },
            {
              ar: 'الحصول على الحقيبة الكاملة للعبة محاكاة تطوير الأعمال بكافة مستوياتها',
              en: 'Receive the full business development simulation game package, at all its levels',
            },
            {
              ar: 'فرصة اعتماد دوراتك التدريبية الخاصة ونشرها عالميا',
              en: 'The opportunity to accredit your own training courses and publish them globally',
            },
          ],
        },
        {
          key: 'tot-preparation',
          code: 'TOT',
          program: 'training-of-trainers',
          title: { ar: 'إعداد مدربين TOT مؤهلين', en: 'Preparing qualified TOT trainers' },
          tagline: {
            ar: 'تمهيدا للالتحاق ببرامج الاعتماد الدولية، وتنمية مهارات التدريب وفق مبادئ تعليم الكبار والتعلم القائم على المشاركة والخبرة العملية.',
            en: 'In preparation for joining the international accreditation programs, developing training skills according to the principles of adult education and participatory, experience-based learning.',
          },
          bullets: [
            {
              ar: 'تحليل الاحتياجات التدريبية وتحديد الأهداف التعليمية وتصميم البرامج والجلسات التدريبية',
              en: 'Analyze training needs, define learning objectives, and design training programs and sessions',
            },
            {
              ar: 'اكتساب مهارات العرض والإلقاء، ولغة الجسد، وإدارة الحوار، والتواصل الفعال مع مختلف فئات المتدربين',
              en: 'Acquire presentation and delivery skills, body language, dialogue management, and effective communication with every category of trainee',
            },
            {
              ar: 'تطوير القدرة على تحفيز المتدربين، وإدارة ديناميكية المجموعات، والتعامل مع الأنماط المختلفة للمشاركين والمواقف التدريبية',
              en: 'Develop the ability to motivate trainees, manage group dynamics, and handle the different types of participants and training situations',
            },
            {
              ar: 'التعرف على أخلاقيات المدرب المحترف، وبناء الثقة بالنفس، وتطوير الهوية المهنية للمدرب والمستشار',
              en: 'Learn the ethics of the professional trainer, build self-confidence, and develop the professional identity of the trainer and consultant',
            },
            {
              ar: 'بناء قاعدة قوية في التدريب واكتساب المهارات الأساسية لتصميم وتنفيذ البرامج التدريبية',
              en: 'Build a strong base in training and acquire the core skills for designing and delivering training programs',
            },
            {
              ar: 'إمكانية الولوج إلى كل الوسائل التدريبية (دليل التدريب، مرشد كل الدورات، مذكرات، شرائح PowerPoint، فيديوهات، قصص) معتمدة من المنظمة الدولية للعمل',
              en: 'Access to all training materials (training guide, facilitator guide for every course, handouts, PowerPoint slides, videos, stories) accredited by the International Labour Organization',
            },
            {
              ar: 'التسجيل والحصول على عضوية في المنصة الرسمية للمنظمة الدولية للعمل كخبير معتمد من هيئة تابعة للأمم المتحدة',
              en: 'Register and obtain membership on the official platform of the International Labour Organization as an expert certified by a United Nations agency',
            },
          ],
        },
      ],
    },
  },

  // Forums spotlight — the band that sets up the forums before the calendar.
  {
    key: 'forums.highlight',
    value: {
      heading: { ar: 'تسليط الضوء على الملتقيات', en: 'Forums in the spotlight' },
      body: {
        ar: 'ناقش مشروعك، واحصل على اعتمادك الدولي في مجالات ريادة الأعمال، الذكاء الاصطناعي، التميز المؤسسي، والصناعات التخصصية.',
        en: 'Present your project and earn your international accreditation in entrepreneurship, artificial intelligence, institutional excellence, and specialized industries.',
      },
      seatsNote: {
        ar: 'المقاعد محدودة لضمان جودة ورش المحاكاة.',
        en: 'Seats are limited to protect the quality of the simulation workshops.',
      },
      cta: { ar: 'احجز مقعدك في الدورة القادمة', en: 'Book your seat in the next session' },
      // Up to three clips, admin-managed. Empty falls back to `forums.content`.
      videos: [],
    },
  },

  // Quick registration / lead capture form — "استمارة التسجيل السريع وحجز المقعد".
  {
    key: 'home.lead',
    value: {
      heading: { ar: 'خطوتك القادمة تبدأ هنا', en: 'Your next step starts here' },
      intro: {
        ar: 'سجّل بياناتك للتواصل معك وتزويدك بالحقيبة التعريفية والجدول الزمني لأقرب ملتقى.',
        en: 'Leave your details so we can contact you and send you the introductory pack and the schedule of the nearest forum.',
      },
      fields: {
        fullName: { ar: 'الاسم واللقب بالكامل', en: 'Full name' },
        whatsapp: { ar: 'رقم الواتساب (متضمنا رمز الدولة)', en: 'WhatsApp number (including country code)' },
        email: { ar: 'البريد الإلكتروني المهني', en: 'Professional email address' },
        country: { ar: 'بلد الإقامة', en: 'Country of residence' },
        countryPlaceholder: { ar: 'اختر دولتك', en: 'Choose your country' },
        interest: { ar: 'المسار أو الملتقى المراد الالتحاق به', en: 'The track or forum you want to join' },
        track: { ar: 'حدد المسار', en: 'Pick the track' },
      },
      interests: [
        {
          key: 'entrepreneur',
          label: { ar: 'رائد أعمال', en: 'Entrepreneur' },
          hint: { ar: 'المسار 1 / 2 / 3 / 4', en: 'Track 1 / 2 / 3 / 4' },
          options: [
            { value: 'track-1', label: { ar: 'المسار 1 — توليد واختبار الفكرة', en: 'Track 1 — Generating and testing the idea' } },
            { value: 'track-2', label: { ar: 'المسار 2 — إطلاق وتأسيس المشروع', en: 'Track 2 — Launching the project' } },
            { value: 'track-3', label: { ar: 'المسار 3 — النمو والتحول الرقمي', en: 'Track 3 — Growth and digital transformation' } },
            { value: 'track-4', label: { ar: 'المسار 4 — استراتيجيات التوسع', en: 'Track 4 — Expansion strategies' } },
          ],
        },
        {
          key: 'trainer',
          label: { ar: 'مسار المدربين (TOT)', en: 'Trainer track (TOT)' },
          hint: { ar: 'GYB / SYB / IYB / EYB', en: 'GYB / SYB / IYB / EYB' },
          options: [
            { value: 'TOT', label: { ar: 'إعداد واعتماد المدربين (TOT)', en: 'Trainer preparation and accreditation (TOT)' } },
            { value: 'GYB', label: { ar: 'GYB — أوجد فكرة عمل ناجح', en: 'GYB — Generate Your Business Idea' } },
            { value: 'SYB', label: { ar: 'SYB — إبدأ أعمالك', en: 'SYB — Start Your Business' } },
            { value: 'IYB', label: { ar: 'IYB — حسّن أعمالك', en: 'IYB — Improve Your Business' } },
            { value: 'EYB', label: { ar: 'EYB — وسّع أعمالك', en: 'EYB — Expand Your Business' } },
          ],
        },
        {
          key: 'partnership',
          label: { ar: 'شراكة في تنظيم الملتقيات', en: 'Partnership in organising the forums' },
          hint: { ar: '', en: '' },
          options: [],
        },
      ],
      submit: {
        ar: 'تأكيد التسجيل واستلام الملف التعريفي',
        en: 'Confirm registration and receive the introductory pack',
      },
      privacy: {
        ar: 'بياناتك محمية تماما ولن تُستخدم إلا للتواصل بخصوص البرنامج.',
        en: 'Your data is fully protected and will only be used to contact you about the program.',
      },
      success: {
        ar: 'تم استلام تسجيلكم. سنتواصل معكم عبر الواتساب والبريد الإلكتروني لإرسال الحقيبة التعريفية والجدول الزمني.',
        en: 'Your registration has been received. We will contact you by WhatsApp and email with the introductory pack and the schedule.',
      },
    },
  },
];

export default settings;
