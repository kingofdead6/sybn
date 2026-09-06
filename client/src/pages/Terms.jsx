import { useReducedMotion, motion } from 'framer-motion';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Rule from '../components/ui/Rule';
import SEO from '../components/SEO';

const CONTENT = {
  ar: {
    title: 'الشروط والأحكام',
    intro: 'باستخدامكم لموقع أبسط (SIYB) وخدماته، فإنكم توافقون على الشروط والأحكام التالية.',
    sections: [
      {
        heading: '١. الاستخدام المقبول',
        body: 'يُمنع استخدام الموقع لأي غرض غير قانوني أو لانتحال هوية شخص أو جهة أخرى. يجب تقديم بيانات صحيحة عند تقديم طلبات الشهادات أو التسجيل في الملتقيات أو الطلبات الأخرى.',
      },
      {
        heading: '٢. صلاحية الشهادات والتحقق منها',
        body: 'تُصدر الشهادات بعد اجتياز الامتحانات التقييمية المعتمدة. يمكن التحقق من صحة أي شهادة عبر صفحة "تحقق من شهادة" باستخدام رقم الشهادة فقط. تحتفظ الإدارة بحق إلغاء أي شهادة إذا ثبت الحصول عليها بطريقة غير نظامية.',
      },
      {
        heading: '٣. الطلبات والمدفوعات',
        body: 'تُعالج طلبات الشهادات والمنتجات والمقترحات وفق الترتيب الذي تصل به، وتُرسل تعليمات الدفع بشكل خاص إلى مقدم الطلب. لا تُسترد المبالغ المدفوعة إلا بعد مراجعة الطلب من طرف الإدارة والتأكد من استيفاء شروط الاسترجاع.',
      },
      {
        heading: '٤. الملتقيات الدولية والسفر',
        body: 'يتكفل البرنامج بتنظيم الملتقيات الدولية للاعتماد، بينما يتحمل المشاركون مسؤولية ترتيب سفرهم الخاص، بما في ذلك تذاكر الطيران والتأشيرات والإقامة، ما لم يُذكر خلاف ذلك صراحة. يقدم فريقنا الدعم اللوجستي والمعلومات اللازمة لتسهيل هذه الإجراءات.',
      },
      {
        heading: '٥. المتجر الإلكتروني',
        body: 'المنتجات المعروضة في المتجر الإلكتروني هي من إنتاج مشاريع خريجي البرنامج. تسري على الطلبات شروط التوصيل والدفع الموضحة عند إتمام الطلب.',
      },
      {
        heading: '٦. النزاعات والتواصل',
        body: 'لأي استفسار أو نزاع متعلق باستخدام الموقع أو خدماته، يرجى التواصل معنا على contact@abcet.net، وسنعمل على معالجة الطلب في أقرب وقت ممكن.',
      },
    ],
  },
  en: {
    title: 'Terms & Conditions',
    intro: 'By using the ABCET (SIYB) website and its services, you agree to the following terms and conditions.',
    sections: [
      {
        heading: '1. Acceptable use',
        body: 'The site may not be used for any unlawful purpose or to impersonate another person or entity. Accurate information must be provided when submitting certificate requests, forum registrations, or other requests.',
      },
      {
        heading: '2. Certificate validity and verification',
        body: 'Certificates are issued after passing the accredited assessment exams. Any certificate can be verified on the "Verify Certificate" page using the certificate number alone. Management reserves the right to revoke any certificate found to have been obtained irregularly.',
      },
      {
        heading: '3. Requests and payments',
        body: 'Certificate, product, and proposal requests are processed in the order received, and payment instructions are sent privately to the requester. Payments are refunded only after the request has been reviewed by our team and found to meet the conditions for a refund.',
      },
      {
        heading: '4. International forums and travel',
        body: 'The program organizes the international accreditation forums, while participants are responsible for arranging their own travel, including flights, visas, and accommodation, unless explicitly stated otherwise. Our team provides logistical support and the information needed to facilitate these arrangements.',
      },
      {
        heading: '5. Online store',
        body: 'Products displayed in the online store are produced by projects run by program graduates. Orders are subject to the delivery and payment terms shown at checkout.',
      },
      {
        heading: '6. Disputes and contact',
        body: 'For any question or dispute relating to your use of the site or its services, please contact us at contact@abcet.net and we will address it as soon as possible.',
      },
    ],
  },
};

export default function Terms() {
  const { locale } = useLocale();
  const reduceMotion = useReducedMotion();
  const c = CONTENT[locale];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO title={c.title} description={c.intro} path="/terms" />
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
