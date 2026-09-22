import { useTranslation } from 'react-i18next';
import { useLocale } from '../context/LocaleContext';
import SEO from '../components/SEO';
import HomeGrid, { HomeBand } from '../components/home/HomeGrid';
import Hero from '../components/home/Hero';
import AudiencePaths from '../components/home/AudiencePaths';
import HomeFaq from '../components/home/HomeFaq';
import HowItWorks from '../components/home/HowItWorks';
import AiEngine from '../components/home/AiEngine';
import IdeaExamples from '../components/home/IdeaExamples';
import VerifyBand from '../components/home/VerifyBand';
import ProgramBands from '../components/home/ProgramBands';
import ForumsTeaser from '../components/home/ForumsTeaser';
import StatsBand from '../components/home/StatsBand';
import NetworkPreview from '../components/home/NetworkPreview';
import StorePreview from '../components/home/StorePreview';
import ForumRegistrationBand from '../components/home/ForumRegistrationBand';
import CtaBand from '../components/home/CtaBand';

const TITLE = {
  ar: 'إبدأ مشروعك الآن | SIYB',
  en: 'Start Your Business Now | SIYB',
};

const DESCRIPTION = {
  ar: 'برامج تدريب ومرافقة معتمدة من المنظمة الدولية للعمل لإيجاد وتأسيس وتطوير مشاريعك، مع ملتقيات دولية للإعتماد وشبكة عالمية من الشركاء.',
  en: 'ILO-accredited training and mentoring programs to find, launch, and grow your business, with international accreditation forums and a global partner network.',
};

export default function Home() {
  const { locale } = useLocale();
  const { t } = useTranslation('home');

  return (
    <>
      <SEO title={TITLE[locale]} description={DESCRIPTION[locale]} path="/" />

      {/* The page is a sequence of spaced bands, each a small grid of tiles —
          long and calm, rather than one dense screen. See DESIGN.md §5. */}
      <Hero />

      {/* The two audience paths, then the programme ladder — each its own
          band, separated by a rule so neither runs into the other. */}
      
      <HomeBand label={t('audiences.section')} centered>
        <AudiencePaths />
      </HomeBand>
      <HomeBand
        label={t('bands.title')}
        title={t('ladder.sub')}
        rhythm="loose"
        centered
        className="border-t border-rule"
      >
        <ProgramBands />
      </HomeBand>
      <IdeaExamples />

      <HomeBand
        label={t('forumRegistration.section')}
        title={t('forumRegistration.title')}
        centered
        className="bg-sunk"
      >
        <ForumRegistrationBand />
      </HomeBand>

      <HomeBand label={t('howItWorks.section')} centered className="bg-sunk">
        <HowItWorks />
      </HomeBand>

      <HomeBand label={t('faq.section')}>
        <HomeFaq />
      </HomeBand>

      <HomeGrid className="py-8 md:py-10">
        <CtaBand />
      </HomeGrid>
    </>
  );
}
