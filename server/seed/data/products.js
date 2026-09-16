// Products seed data — section 7.12
//
// The store's opening catalogue: goods from projects that came through the
// programme, which is exactly what `store.content` describes ("natural and
// authentic products from projects run by inspiring young men and women…").
//
// These are CATALOGUE PLACEHOLDERS. The store runs a real order flow (cash on
// delivery and Chargily), so every row here must be replaced with a real
// product — real price, real stock, real photographs uploaded through the admin
// media screen — before the store takes a live order. `stock` is deliberately
// small so nothing can be over-ordered while they stand in.
//
// `category` holds the STABLE KEY from `store.content.categories`, not the
// display label — the label differs per locale, and filtering on it would only
// ever match in one language.

const products = [
  // ---- منتجات مميزة / Featured products ----
  {
    slug: 'yemeni-sidr-honey-500g',
    title: { ar: 'عسل السدر اليمني — 500 غ', en: 'Yemeni Sidr Honey — 500g' },
    description: {
      ar: 'عسل سدر يمني خام غير مصفى، من مناحل جبلية يديرها شباب تخرجوا من برنامج "إبدأ أعمالك". يعبأ يدويا في جرار زجاجية.',
      en: 'Raw, unfiltered Yemeni Sidr honey from mountain apiaries run by young people who graduated from the "Start Your Business" programme. Hand-packed in glass jars.',
    },
    price: 9500,
    currency: 'DZD',
    category: 'featured',
    stock: 12,
    published: true,
  },
  {
    slug: 'premium-saffron-1g',
    title: { ar: 'زعفران فاخر — 1 غ', en: 'Premium Saffron — 1g' },
    description: {
      ar: 'زعفران من فئة "كل حمراء" من مزرعة نموذجية أنشئت ضمن مسار زراعة واستثمار الزعفران، مع شهادة مصدر داخل العلبة.',
      en: 'All-red grade saffron from a model farm set up through the saffron cultivation and investment track, with a certificate of origin in the box.',
    },
    price: 3200,
    currency: 'DZD',
    category: 'featured',
    stock: 20,
    published: true,
  },
  {
    slug: 'mountain-olive-oil-1l',
    title: { ar: 'زيت زيتون بكر ممتاز — 1 ل', en: 'Extra Virgin Olive Oil — 1L' },
    description: {
      ar: 'زيت زيتون بكر ممتاز معصور على البارد من ضيعة عائلية رافقها خبراؤنا في تحسين سلسلة الإنتاج والتعبئة.',
      en: 'Cold-pressed extra virgin olive oil from a family estate our experts mentored on improving its production and packaging chain.',
    },
    price: 1800,
    currency: 'DZD',
    category: 'featured',
    stock: 40,
    published: true,
  },
  {
    slug: 'organic-deglet-nour-dates-1kg',
    title: { ar: 'تمور دقلة نور عضوية — 1 كغ', en: 'Organic Deglet Nour Dates — 1kg' },
    description: {
      ar: 'تمور دقلة نور عضوية معتمدة، منتقاة يدويا ومعبأة في علب صالحة للإهداء، من تعاونية شاركت في ملتقيات طيبة.',
      en: 'Certified organic Deglet Nour dates, hand-sorted and packed in gift-ready boxes, from a cooperative that took part in the Taiba forums.',
    },
    price: 1400,
    currency: 'DZD',
    category: 'featured',
    stock: 60,
    published: true,
  },

  // ---- كتب نادرة / Rare books ----
  {
    slug: 'siyb-trainer-field-guide',
    title: { ar: 'دليل المدرب الميداني — SIYB', en: 'SIYB Trainer Field Guide' },
    description: {
      ar: 'دليل عملي من إعداد مدربين معتمدين شاركوا في ملتقياتنا، يغطي تصميم الجلسات وإدارة المجموعات وتيسير لعبة المحاكاة.',
      en: 'A practical guide written by certified trainers from our forums, covering session design, group management, and facilitating the simulation game.',
    },
    price: 2600,
    currency: 'DZD',
    category: 'rare-books',
    stock: 25,
    published: true,
  },
  {
    slug: 'business-plan-workbook',
    title: { ar: 'كراس خطة العمل التطبيقي', en: 'The Business Plan Workbook' },
    description: {
      ar: 'كراس تطبيقي يرافق برنامج "إبدأ أعمالك" خطوة بخطوة، بنماذج قابلة للتعبئة لدراسة السوق والتمويل والتوقعات المالية.',
      en: 'A hands-on workbook that walks alongside the "Start Your Business" programme, with fillable templates for market study, financing, and financial projections.',
    },
    price: 1900,
    currency: 'DZD',
    category: 'rare-books',
    stock: 35,
    published: true,
  },

  // ---- تحف فنية / Artistic handicrafts ----
  {
    slug: 'hand-woven-wool-rug',
    title: { ar: 'زربية صوف منسوجة يدويا', en: 'Hand-woven Wool Rug' },
    description: {
      ar: 'زربية صوف بنقوش تقليدية، منسوجة يدويا من طرف حرفيات ماكثات بالبيت رافقهن البرنامج في التسويق والتسعير.',
      en: 'A traditional-pattern wool rug, hand-woven by stay-at-home craftswomen whom the programme mentored on marketing and pricing.',
    },
    price: 24000,
    currency: 'DZD',
    category: 'handicrafts',
    stock: 4,
    published: true,
  },
  {
    slug: 'engraved-copper-tray',
    title: { ar: 'صينية نحاسية منقوشة', en: 'Engraved Copper Tray' },
    description: {
      ar: 'صينية نحاسية منقوشة يدويا بأنامل حرفي معتمد، قطعة واحدة لكل نقش — لا يوجد نموذجان متطابقان.',
      en: 'A copper tray engraved by hand by a certified craftsman — one piece per engraving, no two alike.',
    },
    price: 7800,
    currency: 'DZD',
    category: 'handicrafts',
    stock: 6,
    published: true,
  },

  // ---- براءات اختراع / Patents ----
  {
    slug: 'solar-dryer-licence',
    title: { ar: 'رخصة استغلال مجفف شمسي', en: 'Solar Dryer Exploitation Licence' },
    description: {
      ar: 'رخصة استغلال براءة اختراع مجفف شمسي للفواكه والأعشاب، مسجلة باسم مخترع تخرج من مسار التوسع في الأعمال. تشمل المخططات والمرافقة التقنية.',
      en: 'An exploitation licence for a patented solar dryer for fruit and herbs, registered to an inventor who came through the business expansion track. Includes the drawings and technical mentoring.',
    },
    price: 145000,
    currency: 'DZD',
    category: 'patents',
    stock: 2,
    published: true,
  },
  {
    slug: 'prickly-pear-press-licence',
    title: { ar: 'رخصة استغلال معصرة التين الشوكي', en: 'Prickly Pear Press Exploitation Licence' },
    description: {
      ar: 'رخصة استغلال آلة معصرة مصممة لاستخلاص زيت بذور التين الشوكي، مع دفتر شروط التصنيع ودراسة الجدوى المرفقة.',
      en: 'An exploitation licence for a press designed to extract prickly pear seed oil, with the manufacturing specification and the accompanying feasibility study.',
    },
    price: 168000,
    currency: 'DZD',
    category: 'patents',
    stock: 2,
    published: true,
  },

  // ---- طاقات بشرية / Human talent ----
  {
    slug: 'certified-consultant-day',
    title: { ar: 'يوم استشاري مع خبير معتمد', en: 'Consulting Day with a Certified Expert' },
    description: {
      ar: 'يوم مرافقة ميداني كامل داخل مؤسستك مع مستشار معتمد من المنظمة الدولية للعمل، يشمل التشخيص وخطة عمل مكتوبة.',
      en: 'A full day of on-site mentoring inside your business with an ILO-certified consultant, including a diagnosis and a written action plan.',
    },
    price: 38000,
    currency: 'DZD',
    category: 'human-talent',
    stock: 8,
    published: true,
  },
  {
    slug: 'simulation-game-workshop-seat',
    title: { ar: 'مقعد في ورشة لعبة المحاكاة', en: 'Seat in a Simulation Game Workshop' },
    description: {
      ar: 'مقعد في ورشة لعبة محاكاة تطوير الأعمال (المستوى 1 و 2)، على مدى يومين ويسيرها مدرب معتمد. المقاعد محدودة لضمان جودة الورشة.',
      en: 'A seat in the business development simulation game workshop (levels 1 and 2), over two days and facilitated by a certified trainer. Seats are limited to protect the quality of the workshop.',
    },
    price: 16000,
    currency: 'DZD',
    category: 'human-talent',
    stock: 15,
    published: true,
  },

  // ---- منوعات / Miscellaneous ----
  {
    slug: 'date-fig-chocolate-box',
    title: { ar: 'علبة شوكولاتة بالتمر والتين', en: 'Date and Fig Chocolate Box' },
    description: {
      ar: 'شوكولاتة محضرة بالتمر والتين المجفف دون سكر مضاف، من مشروع حرفي انطلق ضمن مسار الحرف بملتقيات طيبة.',
      en: 'Chocolate made with dates and dried figs and no added sugar, from an artisan project launched through the crafts track at the Taiba forums.',
    },
    price: 2200,
    currency: 'DZD',
    category: 'miscellaneous',
    stock: 30,
    published: true,
  },
  {
    slug: 'artisanal-cheese-basket',
    title: { ar: 'سلة أجبان حرفية', en: 'Artisanal Cheese Basket' },
    description: {
      ar: 'تشكيلة أجبان طرية ونصف صلبة من مجبنة صغيرة رافقها البرنامج في مطابقة معايير الجودة والتعبئة.',
      en: 'A selection of soft and semi-hard cheeses from a small dairy the programme mentored on meeting quality and packaging standards.',
    },
    price: 3400,
    currency: 'DZD',
    category: 'miscellaneous',
    stock: 10,
    published: true,
  },
];

export default products;
