// Settings seed data — sections 7.1, 7.2, 7.5, 7.6, 7.7, 7.8, 7.9, 7.12, 7.13, 7.14
// Each entry is a Setting document: { key, value }.

const settings = [
  // 7.1 Brand & contact
  {
    key: 'brand',
    value: {
      name: { ar: 'إبدأ مشروعك الآن', en: 'Start Your Business Now' },
      tagline: { ar: 'إبدأ ، حسن و طور مشروعك', en: 'Start & Improve Your Business' },
      phone: '+213 699 067 381',
      whatsapp: '+213 699 067 381',
      email: 'contact@abcet.net',
      facebook: 'https://www.facebook.com/2290555824559951',
      youtube: 'https://www.youtube.com/channel/UC_2J7AbvqCmpAIVSIZDrUmA',
      guidePdf: 'https://drive.google.com/file/d/1-bSWl94Sa-K9uTzZiAstFU7MlWJnnyqQ/view',
      copyright: {
        ar: 'إبدأ مشروعك الآن | SIYB | جميع الحقوق محفوظة © 2026',
        en: 'Start Your Business Now | SIYB | All rights reserved © 2026',
      },
    },
  },

  // 7.2 Homepage hero
  {
    key: 'home.hero',
    value: {
      // The small caps label above the headline.
      eyebrow: {
        ar: 'إبدأ مشروعك الآن',
        en: 'Start Your Business Now',
      },
      h1: {
        ar: 'اصنع أثرك الريادي عالمياً.. من الفكرة إلى الاعتماد الدولي',
        en: 'Make your entrepreneurial mark globally — from idea to international accreditation',
      },
      sub: {
        ar: 'منصة Start_Your_Business_Now هي بوابتك المتقدمة لتمكين رواد الأعمال وبناء المستشارين المعتمدين وفق المنهاج الرسمي لمنظمة العمل الدولية (ILO)، مدعومةً بأحدث أدوات الذكاء الاصطناعي والمحاكاة التفاعلية.',
        en: 'The Start_Your_Business_Now platform is your advanced gateway to empowering entrepreneurs and building accredited consultants according to the official curriculum of the International Labour Organization (ILO), supported by the latest artificial intelligence tools and interactive simulation.',
      },
      sub2: {
        ar: 'تأهيل شامل، شبكات أعمال استثمارية، وملتقيات دولية للاعتماد في المدينة المنورة ومكة المكرمة لفتح آفاق الشراكات والتوسع المهني عالمياً.',
        en: 'Comprehensive qualification, investment business networks, and international accreditation forums in Medina and Mecca to open horizons for partnerships and professional expansion worldwide.',
      },
      cta: {
        ar: 'برامج ريادة الأعمال',
        en: 'Entrepreneurship Programs',
      },
      // Where the primary button goes — an on-page anchor or a full path.
      ctaHref: '#programs-ladder',
      cta2: {
        ar: 'سجّل في ملتقى',
        en: 'Register for a forum',
      },
      cta2Href: '#forum-registration',
      // A YouTube or Vimeo link is embedded; any other URL is played as a
      // video file. Left empty, the bundled film is used.
      video: 'https://youtu.be/dkRAoTmZ0Kk',
    },
  },

  // Integration credentials. Held here so they can be changed without a
  // redeploy; the public settings route refuses to serve this record, so the
  // values are readable only through the authenticated admin API.
  {
    key: 'integrations',
    value: {
      // Hugging Face, for the AI page assistants (Idea Generator and simulator).
      // Both share the key and model; each is tuned under `bots`.
      huggingFace: {
        apiKey: '',
        model: 'meta-llama/Llama-3.1-8B-Instruct',
        // Each prompt is prepended to its conversation to keep the bot on task.
        // Anything left empty falls back to the server's built-in value.
        bots: {
          idea: {
            systemPrompt: {
              ar: 'أنت مستشار ريادة أعمال ضمن برنامج SIYB. ساعد المستخدم على توليد أفكار مشاريع واقعية وقابلة للتنفيذ، واسأل عن اهتماماته ومهاراته ورأس ماله وسوقه المحلي قبل الاقتراح. أجب بالعربية وبإيجاز.',
              en: 'You are an entrepreneurship advisor within the SIYB programme. Help the user generate realistic, workable business ideas; ask about their interests, skills, capital and local market before suggesting. Answer concisely.',
            },
            temperature: 0.7,
            maxTokens: 700,
          },
          simulator: {
            systemPrompt: { ar: '', en: '' },
            temperature: 0.8,
            maxTokens: 800,
          },
        },
      },

      // WhatsApp alerts for shop requests, sent to every number at once via
      // CallMeBot. Each number gets its own key by messaging the bot once.
      whatsapp: {
        recipients: [
          { phone: '213542120271', apiKey: '' },
          { phone: '213770313448', apiKey: '' },
        ],
      },

      // Outgoing email. Left blank, the server falls back to its environment
      // variables, so an existing deployment keeps working untouched.
      email: {
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPass: '',
        from: '',
        adminNotifyEmail: '',
      },
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
      // Left empty, the page shows the home hero's film. Set a YouTube, Vimeo
      // or direct file URL here only to give the About page its own video.
      video: '',
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
      intro: {
        ar: 'حصيلة البرنامج حول العالم، بالأرقام.',
        en: 'What the programme has achieved worldwide, in numbers.',
      },
      // The map shown on the Worldwide page. `mapImage` takes the URL of an
      // image uploaded through the admin media library; until one is set that
      // page renders a labelled placeholder in its place.
      mapImage: '',
      mapCaption: {
        ar: 'انتشار البرنامج حول العالم',
        en: 'The programme’s reach around the world',
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
          href: '#programs-ladder',
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
          href: '#programs-ladder',
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

  // The "how the platform works" explainer video (YouTube link, admin-managed).
  {
    key: 'home.howItWorks',
    value: {
      heading: { ar: 'كيف تعمل المنصة', en: 'How the platform works' },
      sub: {
        ar: 'من إنشاء الحساب إلى الاعتماد الدولي — أربع خطوات واضحة.',
        en: 'From creating an account to international accreditation — four clear steps.',
      },
      // The steps carry the section on their own; the video is optional and
      // sits beside them when a link is set.
      steps: [
        {
          title: { ar: 'أنشئ حسابك', en: 'Create your account' },
          body: {
            ar: 'سجّل مجانا للوصول إلى لوحتك الشخصية، ومتابعة تقدمك، وحفظ شهاداتك في مكان واحد.',
            en: 'Register for free to reach your dashboard, follow your progress, and keep your certificates in one place.',
          },
        },
        {
          title: { ar: 'اختر برنامجك', en: 'Choose your program' },
          body: {
            ar: 'ابدأ من إيجاد الفكرة أو انطلق من المستوى الذي يناسب خبرتك ضمن سلسلة برامج SIYB المعتمدة.',
            en: 'Start from idea generation, or enter at the level that matches your experience within the accredited SIYB ladder.',
          },
        },
        {
          title: { ar: 'تدرّب وتابع', en: 'Train and practise' },
          body: {
            ar: 'رزم تدريبية تفاعلية، محاكاة أعمال، ومرافقة من خبراء معتمدين، مدعومة بأدوات الذكاء الاصطناعي.',
            en: 'Interactive training packages, business simulation, and mentoring from accredited experts, supported by AI tools.',
          },
        },
        {
          title: { ar: 'احصل على اعتمادك', en: 'Get accredited' },
          body: {
            ar: 'اجتز التقييم واحصل على شهادة قابلة للتحقق، مع إمكانية المشاركة في ملتقيات الاعتماد الدولية.',
            en: 'Pass the assessment and receive a verifiable certificate, with the option to attend the international accreditation forums.',
          },
        },
      ],
      video: '',
    },
  },

  // Store examples page copy. The entries themselves are a separate resource.
  {
    key: 'store.examples',
    value: {
      title: { ar: 'نماذج من المتاجر', en: 'Store examples' },
      intro: {
        ar: 'متاجر إلكترونية أنشأها خريجو برامجنا. اطلع عليها لتتصور ما يمكنك بناؤه.',
        en: 'Online stores built by graduates of our programs. Browse them to see what you could build.',
      },
    },
  },

  // The AI / business-simulation engine block on the home page.
  {
    key: 'home.aiEngine',
    value: {
      heading: {
        ar: 'محرك الذكاء الاصطناعي ومحاكاة الأعمال',
        en: 'The AI and business simulation engine',
      },
      intro: {
        ar: 'نقدم بنية تقنية متطورة (Platform Tech Core) تضع مستشاراً استراتيجياً ذكياً بين يديك، لتحليل الأفكار، نمذجة الأعمال، ومحاكاة الأسواق الواقعية بأعلى درجات الدقة.',
        en: 'We provide an advanced technical architecture (Platform Tech Core) that puts an intelligent strategic advisor in your hands - to analyse ideas, model businesses, and simulate real markets with the highest degree of accuracy.',
      },
      // Each capability is its own section on the AI page. `kind` picks what
      // sits beneath the copy: a film ('video', link added in the admin panel)
      // or an assistant ('chatbot', with `bot` naming which: 'idea' or 'simulator').
      items: [
        {
          kind: 'video',
          video: '',
          title: { ar: 'المستشار الذكي للمشاريع (AI Mentor)', en: 'The intelligent project advisor (AI Mentor)' },
          body: {
            ar: 'تدقيق دراسات الجدوى والخطط التشغيلية آلياً واقتراح مسارات التحسين الفوري لضمان الكفاءة وتقليل المخاطر.',
            en: 'Automatically audits feasibility studies and operational plans and proposes immediate improvement paths to ensure efficiency and reduce risk.',
          },
        },
        {
          kind: 'chatbot',
          bot: 'simulator',
          title: { ar: 'محاكي الأعمال التفاعلي', en: 'The interactive business simulator' },
          body: {
            ar: 'ألعاب تدريبية (Simulation Engine) تحاكي إدارة رأس المال والمخاطر السوقية من المستوى الأول حتى السادس.',
            en: 'Training games (Simulation Engine) that simulate capital management and market risk, from level one through level six.',
          },
        },
        {
          kind: 'chatbot',
          bot: 'idea',
          title: { ar: 'مولّد الأفكار والفرص (Idea Generator)', en: 'The idea and opportunity generator' },
          body: {
            ar: 'رصد الفجوات السوقية والفرص الاستثمارية استناداً إلى بيانات الأسواق الصاعدة والتحليلات الضخمة.',
            en: 'Detects market gaps and investment opportunities based on emerging-market data and big-data analytics.',
          },
        },
      ],
    },
  },

  // Worked examples produced by the idea generator.
  {
    key: 'home.ideaExamples',
    value: {
      eyebrow: { ar: 'Idea Generator', en: 'Idea Generator' },
      heading: {
        ar: 'أمثلة لفرص وأفكار تجارية مبتكرة',
        en: 'Examples of innovative business ideas and opportunities',
      },
      intro: {
        ar: 'استكشف بعض الأفكار والفرص الاستثمارية الواعدة التي استخرجها محرك الذكاء الاصطناعي بناءً على توجهات السوق الصاعدة والفجوات الحالية.',
        en: 'Explore some of the promising ideas and investment opportunities surfaced by the AI engine, based on emerging market trends and current gaps.',
      },
      items: [
        {
          tag: { ar: 'تقنية وسلاسل إمداد', en: 'Technology and supply chains' },
          title: { ar: 'منصة لوجستيات ذكية (AI Logistics)', en: 'A smart logistics platform (AI Logistics)' },
          body: {
            ar: 'تطبيق يعتمد على الذكاء الاصطناعي لتحسين مسارات التوصيل وتقليل التكاليف للشركات الصغيرة والمتوسطة.',
            en: 'An AI-driven application that optimises delivery routes and cuts costs for small and medium enterprises.',
          },
        },
        {
          tag: { ar: 'استدامة وبيئة', en: 'Sustainability and environment' },
          title: { ar: 'حلول التغليف المستدام', en: 'Sustainable packaging solutions' },
          body: {
            ar: 'تصنيع مواد تغليف قابلة للتحلل وصديقة للبيئة كبديل للبلاستيك، تستهدف قطاع المطاعم والتجارة الإلكترونية.',
            en: 'Manufacturing biodegradable, environmentally friendly packaging as an alternative to plastic, aimed at the restaurant and e-commerce sectors.',
          },
        },
        {
          tag: { ar: 'صحة ورعاية', en: 'Health and care' },
          title: { ar: 'الرعاية الصحية عن بُعد (Telehealth)', en: 'Remote healthcare (Telehealth)' },
          body: {
            ar: 'منصة استشارات طبية ونفسية تربط المرضى بأطباء متخصصين مع متابعة دورية عبر الأجهزة القابلة للارتداء.',
            en: 'A medical and psychological consultation platform connecting patients with specialists, with regular follow-up through wearable devices.',
          },
        },
        {
          tag: { ar: 'تكنولوجيا التعليم (EdTech)', en: 'Education technology (EdTech)' },
          title: { ar: 'منصة تعليم تفاعلي بالواقع الافتراضي', en: 'An interactive virtual-reality learning platform' },
          body: {
            ar: 'توفير بيئات تعليمية وتدريبية (VR) للمدارس والشركات لمحاكاة التجارب العلمية والمهنية بأمان كامل.',
            en: 'Providing VR learning and training environments for schools and companies to simulate scientific and professional experiments in complete safety.',
          },
        },
        {
          tag: { ar: 'عقارات وخدمات', en: 'Real estate and services' },
          title: { ar: 'مساحات عمل مشتركة ذكية ومستقلة', en: 'Smart, self-contained co-working spaces' },
          body: {
            ar: 'كبائن عمل عازلة للصوت ومجهزة تقنياً تتوزع في المقاهي والمراكز التجارية وتُحجز عبر تطبيق ذكي.',
            en: 'Soundproofed, technically equipped work pods distributed across cafes and shopping centres and booked through a smart app.',
          },
        },
        {
          tag: { ar: 'تجارة إلكترونية', en: 'E-commerce' },
          title: { ar: 'اقتصاد التجارة الدائرية (Recommerce)', en: 'The circular commerce economy (Recommerce)' },
          body: {
            ar: 'سوق إلكتروني متخصص في إعادة تجديد وبيع الأجهزة والإلكترونيات المستعملة بضمان وشهادة فحص معتمدة.',
            en: 'An online marketplace specialising in refurbishing and reselling used devices and electronics with a warranty and a certified inspection report.',
          },
        },
      ],
    },
  },
];

export default settings;
