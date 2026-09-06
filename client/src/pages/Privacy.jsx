import { useReducedMotion, motion } from 'framer-motion';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Rule from '../components/ui/Rule';
import SEO from '../components/SEO';

const CONTENT = {
  ar: {
    title: 'سياسة الخصوصية',
    intro: 'تصف هذه السياسة كيف تجمع أبسط (SIYB) وتستخدم وتحفظ بياناتكم الشخصية عند استخدامكم لموقعنا وخدماتنا.',
    sections: [
      {
        heading: '١. البيانات التي نجمعها',
        body: 'نجمع الاسم الكامل، البريد الإلكتروني، رقم الهاتف / واتساب، بلد الإقامة، وعند الحاجة عنوان الشحن والولاية. في حالة الطلبات المتعلقة بالدفع، نحتفظ فقط بمرجع العملية دون أي تفاصيل مصرفية حساسة (لا نعرض أو نخزن أرقام الحسابات البنكية أو رموز IBAN أو SWIFT في أي واجهة عامة).',
      },
      {
        heading: '٢. أسباب جمع البيانات',
        body: 'نستخدم بياناتكم من أجل: إصدار الشهادات والتحقق منها، تسجيل المشاركين في الملتقيات الدولية، معالجة طلبات المتجر الإلكتروني وتوصيل المنتجات، ومعالجة طلبات المقترحات الاستثمارية والتوظيفية والهجروية المرتبطة ببرنامج "أوجد فكرة عمل ناجح".',
      },
      {
        heading: '٣. من يطّلع على بياناتكم',
        body: 'لا تُنشر شهاداتكم أو تعليمات الدفع الخاصة بكم في أي صفحة عامة على الموقع. يقتصر الاطلاع على هذه المعلومات على الفريق الإداري المخول ومقدم الطلب نفسه عبر حسابه الشخصي.',
      },
      {
        heading: '٤. الاحتفاظ بالبيانات وحقوقكم',
        body: 'نحتفظ ببياناتكم للمدة اللازمة لتقديم الخدمة أو وفق ما يقتضيه القانون. يمكنكم في أي وقت طلب الاطلاع على بياناتكم أو تصحيحها أو حذفها عبر التواصل معنا على contact@abcet.net.',
      },
      {
        heading: '٥. ملفات تعريف الارتباط والتحليلات',
        body: 'قد يستخدم الموقع ملفات تعريف ارتباط أساسية لتذكر تفضيلات اللغة والمظهر، وأدوات تحليل مجهولة الهوية لفهم استخدام الموقع وتحسينه. لا تُستخدم هذه الأدوات لأغراض تسويقية طرف ثالث دون علمكم.',
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    intro: 'This policy describes how ABCET (SIYB) collects, uses, and stores your personal data when you use our website and services.',
    sections: [
      {
        heading: '1. Data we collect',
        body: 'We collect your full name, email address, phone/WhatsApp number, country of residence, and, where needed, a shipping address and province. For payment-related requests, we only keep a payment reference — we never display or store bank account numbers, IBAN, or SWIFT codes on any public page.',
      },
      {
        heading: '2. Why we collect it',
        body: 'We use your data to: issue and verify certificates, register participants for international forums, process store orders and fulfill deliveries, and process investment, employment, and migration proposal requests tied to the "Generate Your Business Idea" program.',
      },
      {
        heading: '3. Who can see your data',
        body: 'Your certificates and payment instructions are never published on any public page. Access to this information is limited to authorized staff and to you, the requester, through your own account.',
      },
      {
        heading: '4. Retention and your rights',
        body: 'We retain your data for as long as necessary to provide the service, or as required by law. You may request access, correction, or deletion of your data at any time by contacting us at contact@abcet.net.',
      },
      {
        heading: '5. Cookies and analytics',
        body: 'The site may use essential cookies to remember your language and theme preferences, and anonymized analytics to understand and improve site usage. These tools are never used for third-party marketing without your knowledge.',
      },
    ],
  },
};

export default function Privacy() {
  const { locale } = useLocale();
  const reduceMotion = useReducedMotion();
  const c = CONTENT[locale];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO title={c.title} description={c.intro} path="/privacy" />
      <Section>
        <h1 className="font-display text-2xl md:text-3xl text-ink mb-4">{c.title}</h1>
        <p className="text-body max-w-3xl mb-8">{c.intro}</p>
        <Rule className="mb-8" />
        <div className="flex flex-col gap-6 max-w-3xl">
          {c.sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-display text-md text-ink mb-2">{s.heading}</h2>
              <p className="text-body">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </motion.div>
  );
}
