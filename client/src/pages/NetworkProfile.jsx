import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import SEO from '../components/SEO';

const REGION_KEY_MAP = {
  leadership: 'regionLeadership',
  mena: 'regionMena',
  'sub-saharan-africa': 'regionSubSaharanAfrica',
  'europe-central-asia': 'regionEuropeCentralAsia',
  'companies-institutions': 'regionCompaniesInstitutions',
  'training-institutes': 'regionTrainingInstitutes',
};

export default function NetworkProfile() {
  const { slug } = useParams();
  const { locale } = useLocale();
  const { t } = useTranslation('network');
  const reduceMotion = useReducedMotion();
  const [member, setMember] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    api
      .get(`/team/${slug}`)
      .then(({ data }) => {
        if (active) {
          setMember(data.data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const prefix = locale === 'en' ? '/en' : '';

  if (status === 'loading') {
    return (
      <Section>
        <p className="text-muted">{t('loading')}</p>
      </Section>
    );
  }

  if (status === 'error' || !member) {
    return (
      <Section>
        <p className="text-error">{t('loadError')}</p>
      </Section>
    );
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO title={member.name?.[locale]} description={member.role?.[locale]} path={`/network/${member.slug}`} />

      <Section>
        <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
          <img
            src={member.photo}
            alt={member.name?.[locale] || ''}
            className="w-32 h-32 rounded-md object-cover bg-surface shrink-0"
          />
          <div>
            <h1 className="font-display text-2xl text-ink mb-1">{member.name?.[locale]}</h1>
            <p className="text-ink-soft mb-2">{member.role?.[locale]}</p>
            <p className="text-sm text-muted">
              {[member.country, t(REGION_KEY_MAP[member.region])].filter(Boolean).join(' — ')}
            </p>
          </div>
        </div>

        {member.bio?.[locale] && <p className="text-ink-soft max-w-3xl mb-8">{member.bio[locale]}</p>}

        <Link to={`${prefix}/network`} className="text-accent font-medium">
          {t('backToNetwork')}
        </Link>
      </Section>
    </motion.div>
  );
}
