import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import { useLocale } from '../context/LocaleContext';

export default function NotFound() {
  const { t } = useTranslation('common');
  const { locale } = useLocale();
  return (
    <Section>
      <div className="text-center py-9">
        <h1 className="font-display text-2xl text-ink mb-3">{t('notFound')}</h1>
        <Button as={Link} to={locale === 'en' ? '/en' : '/'}>
          {t('backHome')}
        </Button>
      </div>
    </Section>
  );
}
