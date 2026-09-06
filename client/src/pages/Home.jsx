import { useLocale } from '../context/LocaleContext';
import SEO from '../components/SEO';
import Hero from '../components/home/Hero';
import VerifyBand from '../components/home/VerifyBand';
import ProgramLadder from '../components/home/ProgramLadder';
import ForumsTeaser from '../components/home/ForumsTeaser';
import StatsBand from '../components/home/StatsBand';
import NetworkPreview from '../components/home/NetworkPreview';
import StorePreview from '../components/home/StorePreview';
import CtaBand from '../components/home/CtaBand';

const TITLE = {
  ar: 'أبسط | إبدأ ، حسن و طور مشروعك',
  en: 'ABCET · SIYB | Start & Improve Your Business',
};

const DESCRIPTION = {
  ar: 'برامج تدريب ومرافقة معتمدة من المنظمة الدولية للعمل لإيجاد وتأسيس وتطوير مشاريعك، مع ملتقيات دولية للإعتماد وشبكة عالمية من الشركاء.',
  en: 'ILO-accredited training and mentoring programs to find, launch, and grow your business, with international accreditation forums and a global partner network.',
};

export default function Home() {
  const { locale } = useLocale();

  return (
    <>
      <SEO title={TITLE[locale]} description={DESCRIPTION[locale]} path="/" />
      <Hero />
      <VerifyBand />
      <ProgramLadder />
      <ForumsTeaser />
      <StatsBand />
      <NetworkPreview />
      <StorePreview />
      <CtaBand />
    </>
  );
}
