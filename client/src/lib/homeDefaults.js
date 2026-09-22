/**
 * Built-in fallback content for the settings-driven home sections.
 *
 * Each key mirrors the shape of its `/settings/<key>` record. A component
 * falls back to the entry here when the setting is missing, empty, or the
 * request fails, so the home page always renders complete rather than
 * silently dropping whole bands on a fresh or half-configured database.
 *
 * These values are generated from the seed, so a seeded install and a bare
 * one show the same page. Editing the setting in the admin panel overrides
 * them; this file is only the floor.
 */
export const HOME_DEFAULTS = {
  "home.hero": {
    "eyebrow": {
      "ar": "إبدأ مشروعك الآن",
      "en": "Start Your Business Now"
    },
    "h1": {
      "ar": "اصنع أثرك الريادي عالمياً.. من الفكرة إلى الاعتماد الدولي",
      "en": "Make your entrepreneurial mark globally — from idea to international accreditation"
    },
    "sub": {
      "ar": "منصة Start_Your_Business_Now هي بوابتك المتقدمة لتمكين رواد الأعمال وبناء المستشارين المعتمدين وفق المنهاج الرسمي لمنظمة العمل الدولية (ILO)، مدعومةً بأحدث أدوات الذكاء الاصطناعي والمحاكاة التفاعلية.",
      "en": "The Start_Your_Business_Now platform is your advanced gateway to empowering entrepreneurs and building accredited consultants according to the official curriculum of the International Labour Organization (ILO), supported by the latest artificial intelligence tools and interactive simulation."
    },
    "sub2": {
      "ar": "تأهيل شامل، شبكات أعمال استثمارية، وملتقيات دولية للاعتماد في المدينة المنورة ومكة المكرمة لفتح آفاق الشراكات والتوسع المهني عالمياً.",
      "en": "Comprehensive qualification, investment business networks, and international accreditation forums in Medina and Mecca to open horizons for partnerships and professional expansion worldwide."
    },
    "cta": {
      "ar": "برامج ريادة الأعمال",
      "en": "Entrepreneurship Programs"
    },
    "ctaHref": "#programs-ladder",
    "cta2": {
      "ar": "سجّل في ملتقى",
      "en": "Register for a forum"
    },
    "cta2Href": "#forum-registration",
    "video": "https://youtu.be/dkRAoTmZ0Kk"
  },
  "home.audiences": {
    "heading": {
      "ar": "اختر مسارك",
      "en": "Choose your path"
    },
    "sub": {
      "ar": "مساران يغطيان الرحلة كاملة: من فكرة مشروع أولى إلى مدرب معتمد دوليا.",
      "en": "Two paths covering the whole journey: from a first business idea to an internationally accredited trainer."
    },
    "items": [
      {
        "key": "entrepreneurs",
        "title": {
          "ar": "رواد الأعمال",
          "en": "Entrepreneurs"
        },
        "tagline": {
          "ar": "فكرة مشروعك تدور في رأسك؟ حان وقت اختبارها وتجسيدها على أرض الواقع بدون مخاطرة عشوائية.",
          "en": "Is your business idea going round in your head? It is time to test it and bring it to life without blind risk."
        },
        "body": {
          "ar": "انضم لأقوى مسار ريادي مدعوم بمنهجيات منظمة العمل الدولية (ILO)، وتدرب على إدارة وتسريع أعمالك عبر ألعاب محاكاة السوق الواقعية (Business Gamification).",
          "en": "Join the strongest entrepreneurial path, backed by International Labour Organization (ILO) methodologies, and train to manage and accelerate your business through real market simulation games (Business Gamification)."
        },
        "bullets": [
          {
            "ar": "مسار توليد وتثبيت الفكرة",
            "en": "Generating and validating the idea"
          },
          {
            "ar": "مسار خطة وتأسيس المشروع",
            "en": "Business plan and launching the project"
          },
          {
            "ar": "مسار نمو وتوسيع الأعمال",
            "en": "Business growth and expansion"
          },
          {
            "ar": "مسار إستراتيجية التوسع في الأعمال",
            "en": "Business expansion strategy"
          }
        ],
        "cta": {
          "ar": "سجل الآن وابدأ بصياغة فكرتك",
          "en": "Register now and start shaping your idea"
        },
        "href": "#programs-ladder"
      },
      {
        "key": "trainers",
        "title": {
          "ar": "المدربون والخبراء",
          "en": "Trainers and experts"
        },
        "tagline": {
          "ar": "من خبرة محلية إلى مدرب دولي. لا تجعل خبرتك تقف عندك — حوّلها إلى رخصة دولية وأثر عابر للحدود.",
          "en": "From local expertise to international trainer. Do not let your experience stop with you — turn it into an international licence and a cross-border impact."
        },
        "body": {
          "ar": "برنامج SIYB لإعداد واعتماد المدربين الدوليين (TOT): اعتماد رسمي من منظمة العمل الدولية بجنيف، وتملّك أدوات وحقائب محاكاة الأعمال التخصصية، وفرصة اعتماد دوراتك التدريبية الخاصة ونشرها عالميا.",
          "en": "The SIYB programme for preparing and accrediting international trainers (TOT): official accreditation from the International Labour Organization in Geneva, ownership of specialised business simulation tools and packages, and the opportunity to accredit your own training courses and publish them globally."
        },
        "bullets": [
          {
            "ar": "اعتماد رسمي من منظمة العمل الدولية (ILO - Geneva)",
            "en": "Official accreditation from the International Labour Organization (ILO - Geneva)"
          },
          {
            "ar": "إدراج اسمك في المنصة الرسمية كخبير معتمد لدى هيئة أممية",
            "en": "Your name listed on the official platform as an expert accredited by a UN body"
          },
          {
            "ar": "ترخيص استخدام الحقائب الشاملة والمصادر الرقمية",
            "en": "Licence to use the complete packages and digital resources"
          },
          {
            "ar": "الحصول على الحقيبة الكاملة للعبة محاكاة تطوير الأعمال بكافة مستوياتها",
            "en": "The full business development simulation game package, at all levels"
          }
        ],
        "cta": {
          "ar": "قدّم طلب اعتمادك المهني",
          "en": "Apply for your professional accreditation"
        },
        "href": "#programs-ladder"
      }
    ]
  },
  "home.aiEngine": {
    "heading": {
      "ar": "محرك الذكاء الاصطناعي ومحاكاة الأعمال",
      "en": "The AI and business simulation engine"
    },
    "intro": {
      "ar": "نقدم بنية تقنية متطورة (Platform Tech Core) تضع مستشاراً استراتيجياً ذكياً بين يديك، لتحليل الأفكار، نمذجة الأعمال، ومحاكاة الأسواق الواقعية بأعلى درجات الدقة.",
      "en": "We provide an advanced technical architecture (Platform Tech Core) that puts an intelligent strategic advisor in your hands - to analyse ideas, model businesses, and simulate real markets with the highest degree of accuracy."
    },
    "items": [
      {
        "title": {
          "ar": "المستشار الذكي للمشاريع (AI Mentor)",
          "en": "The intelligent project advisor (AI Mentor)"
        },
        "body": {
          "ar": "تدقيق دراسات الجدوى والخطط التشغيلية آلياً واقتراح مسارات التحسين الفوري لضمان الكفاءة وتقليل المخاطر.",
          "en": "Automatically audits feasibility studies and operational plans and proposes immediate improvement paths to ensure efficiency and reduce risk."
        }
      },
      {
        "title": {
          "ar": "محاكي الأعمال التفاعلي",
          "en": "The interactive business simulator"
        },
        "body": {
          "ar": "ألعاب تدريبية (Simulation Engine) تحاكي إدارة رأس المال والمخاطر السوقية من المستوى الأول حتى السادس.",
          "en": "Training games (Simulation Engine) that simulate capital management and market risk, from level one through level six."
        }
      },
      {
        "title": {
          "ar": "مولّد الأفكار والفرص (Idea Generator)",
          "en": "The idea and opportunity generator"
        },
        "body": {
          "ar": "رصد الفجوات السوقية والفرص الاستثمارية استناداً إلى بيانات الأسواق الصاعدة والتحليلات الضخمة.",
          "en": "Detects market gaps and investment opportunities based on emerging-market data and big-data analytics."
        }
      }
    ]
  },
  "home.ideaExamples": {
    "eyebrow": {
      "ar": "Idea Generator",
      "en": "Idea Generator"
    },
    "heading": {
      "ar": "أمثلة لفرص وأفكار تجارية مبتكرة",
      "en": "Examples of innovative business ideas and opportunities"
    },
    "intro": {
      "ar": "استكشف بعض الأفكار والفرص الاستثمارية الواعدة التي استخرجها محرك الذكاء الاصطناعي بناءً على توجهات السوق الصاعدة والفجوات الحالية.",
      "en": "Explore some of the promising ideas and investment opportunities surfaced by the AI engine, based on emerging market trends and current gaps."
    },
    "items": [
      {
        "tag": {
          "ar": "تقنية وسلاسل إمداد",
          "en": "Technology and supply chains"
        },
        "title": {
          "ar": "منصة لوجستيات ذكية (AI Logistics)",
          "en": "A smart logistics platform (AI Logistics)"
        },
        "body": {
          "ar": "تطبيق يعتمد على الذكاء الاصطناعي لتحسين مسارات التوصيل وتقليل التكاليف للشركات الصغيرة والمتوسطة.",
          "en": "An AI-driven application that optimises delivery routes and cuts costs for small and medium enterprises."
        }
      },
      {
        "tag": {
          "ar": "استدامة وبيئة",
          "en": "Sustainability and environment"
        },
        "title": {
          "ar": "حلول التغليف المستدام",
          "en": "Sustainable packaging solutions"
        },
        "body": {
          "ar": "تصنيع مواد تغليف قابلة للتحلل وصديقة للبيئة كبديل للبلاستيك، تستهدف قطاع المطاعم والتجارة الإلكترونية.",
          "en": "Manufacturing biodegradable, environmentally friendly packaging as an alternative to plastic, aimed at the restaurant and e-commerce sectors."
        }
      },
      {
        "tag": {
          "ar": "صحة ورعاية",
          "en": "Health and care"
        },
        "title": {
          "ar": "الرعاية الصحية عن بُعد (Telehealth)",
          "en": "Remote healthcare (Telehealth)"
        },
        "body": {
          "ar": "منصة استشارات طبية ونفسية تربط المرضى بأطباء متخصصين مع متابعة دورية عبر الأجهزة القابلة للارتداء.",
          "en": "A medical and psychological consultation platform connecting patients with specialists, with regular follow-up through wearable devices."
        }
      },
      {
        "tag": {
          "ar": "تكنولوجيا التعليم (EdTech)",
          "en": "Education technology (EdTech)"
        },
        "title": {
          "ar": "منصة تعليم تفاعلي بالواقع الافتراضي",
          "en": "An interactive virtual-reality learning platform"
        },
        "body": {
          "ar": "توفير بيئات تعليمية وتدريبية (VR) للمدارس والشركات لمحاكاة التجارب العلمية والمهنية بأمان كامل.",
          "en": "Providing VR learning and training environments for schools and companies to simulate scientific and professional experiments in complete safety."
        }
      },
      {
        "tag": {
          "ar": "عقارات وخدمات",
          "en": "Real estate and services"
        },
        "title": {
          "ar": "مساحات عمل مشتركة ذكية ومستقلة",
          "en": "Smart, self-contained co-working spaces"
        },
        "body": {
          "ar": "كبائن عمل عازلة للصوت ومجهزة تقنياً تتوزع في المقاهي والمراكز التجارية وتُحجز عبر تطبيق ذكي.",
          "en": "Soundproofed, technically equipped work pods distributed across cafes and shopping centres and booked through a smart app."
        }
      },
      {
        "tag": {
          "ar": "تجارة إلكترونية",
          "en": "E-commerce"
        },
        "title": {
          "ar": "اقتصاد التجارة الدائرية (Recommerce)",
          "en": "The circular commerce economy (Recommerce)"
        },
        "body": {
          "ar": "سوق إلكتروني متخصص في إعادة تجديد وبيع الأجهزة والإلكترونيات المستعملة بضمان وشهادة فحص معتمدة.",
          "en": "An online marketplace specialising in refurbishing and reselling used devices and electronics with a warranty and a certified inspection report."
        }
      }
    ]
  },
  "home.howItWorks": {
    "heading": {
      "ar": "كيف تعمل المنصة",
      "en": "How the platform works"
    },
    "sub": {
      "ar": "من إنشاء الحساب إلى الاعتماد الدولي — أربع خطوات واضحة.",
      "en": "From creating an account to international accreditation — four clear steps."
    },
    "steps": [
      {
        "title": {
          "ar": "أنشئ حسابك",
          "en": "Create your account"
        },
        "body": {
          "ar": "سجّل مجانا للوصول إلى لوحتك الشخصية، ومتابعة تقدمك، وحفظ شهاداتك في مكان واحد.",
          "en": "Register for free to reach your dashboard, follow your progress, and keep your certificates in one place."
        }
      },
      {
        "title": {
          "ar": "اختر برنامجك",
          "en": "Choose your program"
        },
        "body": {
          "ar": "ابدأ من إيجاد الفكرة أو انطلق من المستوى الذي يناسب خبرتك ضمن سلسلة برامج SIYB المعتمدة.",
          "en": "Start from idea generation, or enter at the level that matches your experience within the accredited SIYB ladder."
        }
      },
      {
        "title": {
          "ar": "تدرّب وتابع",
          "en": "Train and practise"
        },
        "body": {
          "ar": "رزم تدريبية تفاعلية، محاكاة أعمال، ومرافقة من خبراء معتمدين، مدعومة بأدوات الذكاء الاصطناعي.",
          "en": "Interactive training packages, business simulation, and mentoring from accredited experts, supported by AI tools."
        }
      },
      {
        "title": {
          "ar": "احصل على اعتمادك",
          "en": "Get accredited"
        },
        "body": {
          "ar": "اجتز التقييم واحصل على شهادة قابلة للتحقق، مع إمكانية المشاركة في ملتقيات الاعتماد الدولية.",
          "en": "Pass the assessment and receive a verifiable certificate, with the option to attend the international accreditation forums."
        }
      }
    ],
    "video": ""
  },
  "home.faq": {
    "heading": {
      "ar": "الأسئلة الشائعة",
      "en": "Frequently asked questions"
    },
    "items": [
      {
        "question": {
          "ar": "هل البرامج موجهة للمشاريع الناشئة فقط أم للخبراء أيضا؟",
          "en": "Are the programmes aimed only at start-ups, or at experts as well?"
        },
        "answer": {
          "ar": "تغطي المنظومة المرحلتين بدقة؛ تبدأ مع رائد الأعمال من مرحلة توليد الفكرة، وتصل بالخبراء لتأهيلهم كمدربين ومستشارين معتمدين دوليا.",
          "en": "The system covers both stages precisely: it starts with the entrepreneur at the idea-generation stage, and takes experts through to qualifying as internationally accredited trainers and consultants."
        }
      },
      {
        "question": {
          "ar": "ما هي ملتقيات طيبة الدولية؟",
          "en": "What are the Taiba International Forums?"
        },
        "answer": {
          "ar": "هي ملتقيات تقام دوريا كل شهر في المدينة المنورة ومكة المكرمة لمناقشة عروض المترشحين، وتدريبهم على تقنيات المحاكاة، وتأهيلهم لشهادات الاعتماد.",
          "en": "They are forums held periodically each month in Medina and Mecca to discuss the presentations of candidates, train them in simulation techniques, and qualify them for accreditation certificates."
        }
      },
      {
        "question": {
          "ar": "كيف تختلف لعبة محاكاة الأعمال عن التدريب النظري؟",
          "en": "How does the business simulation game differ from theoretical training?"
        },
        "answer": {
          "ar": "لعبة المحاكاة تطبق نموذج التعلم النشط القائم على اتخاذ قرارات مالية وتسويقية وإدارية داخل بيئة تحاكي تقلبات السوق الفعلي، مما يرفع الكفاءة بصورة تفاعلية.",
          "en": "The simulation game applies an active-learning model based on making financial, marketing and management decisions inside an environment that mirrors real market fluctuations, raising competence interactively."
        }
      }
    ]
  },
  "cta.band": {
    "heading": {
      "ar": "أطلب استشارات ، مرافقة ، اعتمادات أو شهادات فور إنهاء برامجك التدريبية",
      "en": "Request consulting, mentoring, accreditations, or certificates as soon as you finish your training programs"
    },
    "sub": {
      "ar": "للمزيد من التفاصيل إتصلوا بنا على رقمنا",
      "en": "For more details, contact us on our phone number"
    }
  }
};

/**
 * Returns the configured value when it carries real content, else the
 * built-in default. `listKey` names the array a section needs (items, steps):
 * a record that exists but has an empty list still falls back.
 */
export function withDefaults(key, value, listKey) {
  const fallback = HOME_DEFAULTS[key];
  if (!fallback) return value;
  if (!value) return fallback;
  if (listKey && !(value[listKey] || []).length) {
    return { ...fallback, ...value, [listKey]: fallback[listKey] || [] };
  }
  return { ...fallback, ...value };
}
