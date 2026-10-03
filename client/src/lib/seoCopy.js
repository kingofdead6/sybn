/* Search-result titles and descriptions for the fixed pages, in both
   languages. Each is unique, written from the page's own content, and sized
   for results pages: titles take the brand automatically (see SEO.jsx), and
   descriptions stay within ~160 characters. Pages built from CMS records
   (courses, programs, categories…) derive theirs from the record instead. */

export const SEO_COPY = {
  home: {
    ar: {
      title: 'أبسط SIYB | تكوين ريادة الأعمال في الجزائر',
      description:
        'برامج "أبسط" SIYB المعتمدة من المنظمة الدولية للعمل: تكوين ومرافقة لإيجاد وتأسيس وتطوير مشروعك، واعتماد المدربين الدوليين، مع ملتقيات دولية وشبكة شركاء عالمية.',
    },
    en: {
      title: 'SIYB | Entrepreneurship Training in Algeria',
      description:
        'ILO-accredited SIYB programs to find, start and grow your business: entrepreneurship training, mentoring, international trainer accreditation and global forums.',
    },
  },
  about: {
    ar: {
      title: 'عن برنامج أبسط SIYB ومؤسسه سليمان برايح',
      description:
        'سلسلة برامج "إبدأ، حسن وطور أعمالك" (أبسط / SIYB) المعتمدة من المنظمة الدولية للعمل، أسسها سليمان برايح لمرافقة الرياديين وأصحاب المشاريع نحو النجاح.',
    },
    en: {
      title: 'About SIYB & Founder Slimane Berrayah',
      description:
        'The ILO-accredited Start and Improve Your Business (SIYB) program series, founded by Slimane Berrayah to train and mentor entrepreneurs and project owners.',
    },
  },
  courses: {
    ar: {
      title: 'الدورات التخصصية المعتمدة',
      description:
        'دورات معتمدة في المواصفات الدولية ISO والمهارات المهنية: الجودة والتميز المؤسسي، القيادة والذكاء الاصطناعي، المهارات الإنسانية والإدارة العمومية الحديثة.',
    },
    en: {
      title: 'Accredited Specialized Courses',
      description:
        'Accredited courses in ISO international standards and professional skills: quality and excellence, leadership and AI, human skills and modern public administration.',
    },
  },
  entrepreneurship: {
    ar: {
      title: 'مسارات ريادة الأعمال: من الفكرة إلى التوسع',
      description:
        'أربعة مسارات تدريبية لرواد الأعمال: توليد فكرة المشروع واختبارها، إطلاق المشروع وتأسيسه، النمو والتحول الرقمي، ثم استراتيجيات التوسع في الأسواق.',
    },
    en: {
      title: 'Entrepreneurship Tracks: From Idea to Expansion',
      description:
        'Four training tracks for entrepreneurs: generating and testing a business idea, launching the project, growth and digital transformation, and expansion strategies.',
    },
  },
  ai: {
    ar: {
      title: 'محرك الذكاء الاصطناعي ومحاكاة الأعمال',
      description:
        'مستشار استراتيجي ذكي بين يديك: تحليل الأفكار، نمذجة الأعمال، محاكاة الأسواق الواقعية وتدقيق دراسات الجدوى آليا مع المستشار الذكي للمشاريع (AI Mentor).',
    },
    en: {
      title: 'AI & Business Simulation Engine',
      description:
        'An intelligent strategic advisor in your hands: analyse ideas, model businesses, simulate real markets and audit feasibility studies with the AI Mentor.',
    },
  },
  worldwide: {
    ar: {
      title: 'برنامج أبسط SIYB حول العالم',
      description:
        'يمتد برنامج SIYB عبر شبكة من الخبراء والمدربين والمؤسسات الشريكة في عدة قارات، بإشراف المنظمة الدولية للعمل.',
    },
    en: {
      title: 'The SIYB Program Worldwide',
      description:
        'The SIYB program extends across a network of experts, trainers and partner institutions spanning multiple continents, under the International Labour Organization.',
    },
  },
  network: {
    ar: {
      title: 'شبكة الخبراء والمدربين المعتمدين',
      description:
        'شبكة خبراء ومدربين ومستشارين معتمدين ومؤسسات شريكة لبرنامج SIYB من الجزائر وتونس والسعودية والإمارات ودول أخرى.',
    },
    en: {
      title: 'Network of Accredited Experts & Trainers',
      description:
        'The SIYB network of accredited experts, trainers, consultants and partner institutions from Algeria, Tunisia, Saudi Arabia, the UAE and beyond.',
    },
  },
  forums: {
    ar: {
      title: 'ملتقيات طيبة الدولية للاعتماد',
      description:
        'ملتقيات طيبة: ملتقيات دورية لمناقشة عروض المترشحين وتدريبهم على تقنيات المحاكاة وتأهيلهم لشهادات الاعتماد. لا يكتمل النجاح حتى يصبح سببا في نجاح الآخرين.',
    },
    en: {
      title: 'Taiba International Accreditation Forums',
      description:
        'Taiba Forums: periodic forums to review candidates’ presentations, train them in business simulation and prepare them for accreditation certificates.',
    },
  },
  stories: {
    ar: {
      title: 'قصص ونجاحات المتدربين',
      description:
        'قصص نجاح المتدربين والمدربين والمنظمات الشريكة في برامج أبسط SIYB المعتمدة من المنظمة الدولية للعمل.',
    },
    en: {
      title: 'Stories & Successes',
      description:
        'Success stories from trainees, trainers and partner organizations of the ILO-accredited SIYB entrepreneurship programs.',
    },
  },
  numbers: {
    ar: {
      title: 'برنامج SIYB بلغة الأرقام',
      description:
        'حصيلة برنامج SIYB حول العالم: أكثر من 100 دولة، 17,250 مدربا، 280 مؤسسة معتمدة، 15,270 رائد أعمال متدرب و78,000 منصب عمل مستحدث.',
    },
    en: {
      title: 'The SIYB Program in Numbers',
      description:
        'What SIYB has achieved worldwide: 100+ countries, 17,250+ trainers, 280+ accredited institutions, 15,270+ entrepreneurs trained and 78,000+ jobs created.',
    },
  },
  resources: {
    ar: {
      title: 'الموارد الأساسية: أدلة ونماذج مجانية',
      description:
        'أدلة وكتيبات ونماذج من برنامج SIYB مجانية للتحميل والاستخدام: دليل البرنامج، نموذج خطة العمل ودليل اعتماد المدربين.',
    },
    en: {
      title: 'Key Resources: Free Guides & Templates',
      description:
        'Guides, manuals and templates from the SIYB programme, free to download and use: the program guide, a business plan template and the trainer accreditation handbook.',
    },
  },
  store: {
    ar: {
      title: 'المتجر الإلكتروني لرواد الأعمال',
      description:
        'متجرنا الإلكتروني دعم حقيقي لرواد الأعمال: منصة تنموية لعرض منتجات المشاريع الصغيرة والمتوسطة لخريجي برامجنا ومرافقتهم حتى السوق.',
    },
    en: {
      title: 'Online Store for Entrepreneurs',
      description:
        'Our online store is real support for entrepreneurs: a platform showcasing the products of small businesses founded by our graduates, from training to market.',
    },
  },
  createShop: {
    ar: {
      title: 'أنشئ متجرك الإلكتروني',
      description:
        'اطلب متجرا إلكترونيا لمشروعك وتصفح نماذج متاجر خريجي برامج أبسط SIYB، ونتكفل نحن بالعرض والتسويق.',
    },
    en: {
      title: 'Create Your Online Shop',
      description:
        'Request an online shop for your project and browse example storefronts from SIYB graduates; we take care of display and marketing for you.',
    },
  },
  verify: {
    ar: {
      title: 'التحقق من صحة الشهادات',
      description:
        'تحقق من صحة شهادات برامج SIYB المعتمدة من المنظمة الدولية للعمل برقم الشهادة.',
    },
    en: {
      title: 'Verify a Certificate',
      description:
        'Verify the validity of ILO-accredited SIYB training and trainer certificates using the certificate number.',
    },
  },
  faq: {
    ar: {
      title: 'الأسئلة الشائعة حول برامج أبسط SIYB',
      description:
        'إجابات عن أكثر الأسئلة شيوعا حول برامج أبسط SIYB: لمن هي موجهة، الملتقيات الدولية للاعتماد، والتسجيل والشهادات.',
    },
    en: {
      title: 'SIYB Frequently Asked Questions',
      description:
        'Answers to the most common questions about the SIYB programs: who they are for, the international accreditation forums, registration and certificates.',
    },
  },
  contact: {
    ar: {
      title: 'اتصل بنا',
      description:
        'تواصل مع فريق أبسط SIYB عبر واتساب أو البريد الإلكتروني أو إنستغرام وفيسبوك للاستفسار عن البرامج والدورات والملتقيات.',
    },
    en: {
      title: 'Contact Us',
      description:
        'Get in touch with the SIYB team by WhatsApp, email, Instagram or Facebook about programs, courses and forums.',
    },
  },
  privacy: {
    ar: { title: 'سياسة الخصوصية', description: 'سياسة الخصوصية لمنصة أبسط SIYB: البيانات التي نجمعها وكيف نستخدمها ونحميها.' },
    en: { title: 'Privacy Policy', description: 'The SIYB platform privacy policy: what data we collect, and how we use and protect it.' },
  },
  terms: {
    ar: { title: 'الشروط والأحكام', description: 'الشروط والأحكام لاستخدام منصة أبسط SIYB وخدماتها التدريبية.' },
    en: { title: 'Terms & Conditions', description: 'The terms and conditions for using the SIYB platform and its training services.' },
  },
};

/** The copy for a page in a language. */
export function seoCopy(page, locale) {
  return SEO_COPY[page]?.[locale] || SEO_COPY[page]?.ar || {};
}

/* The sentence appended to a record's own text when it is too short to fill a
   search snippet, naming what the page is and who offers it. */
const BRAND_LINE = {
  course: { ar: 'دورة تخصصية معتمدة من أبسط SIYB، برامج المنظمة الدولية للعمل لريادة الأعمال.', en: 'An accredited specialized course from SIYB, the ILO entrepreneurship programs.' },
  program: { ar: 'برنامج تدريبي معتمد من المنظمة الدولية للعمل ضمن سلسلة أبسط SIYB.', en: 'An ILO-accredited training program in the SIYB series.' },
  category: { ar: 'دورات تخصصية معتمدة من أبسط SIYB.', en: 'Accredited specialized courses from SIYB.' },
  resource: { ar: 'مورد مجاني من برنامج أبسط SIYB.', en: 'A free resource from the SIYB program.' },
  member: { ar: 'عضو في شبكة خبراء ومدربي برنامج أبسط SIYB المعتمدين.', en: 'A member of the SIYB network of accredited experts and trainers.' },
};

/** A record's description, topped up with the brand line when short. */
export function withBrand(text, kind, locale) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  const line = BRAND_LINE[kind]?.[locale] || '';
  if (clean.length >= 120) return clean;
  return clean ? `${clean.replace(/[.。]?$/, '.')} ${line}` : line;
}
