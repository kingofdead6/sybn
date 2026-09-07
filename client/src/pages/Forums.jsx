import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Table, { Tr, Td } from '../components/ui/Table';
import Pill from '../components/ui/Pill';
import SEO from '../components/SEO';
import ForumRegistrationForm from '../components/forums/ForumRegistrationForm';

const STATUS_TONE = { open: 'success', full: 'clay', 'announced-soon': 'default' };
const STATUS_KEY = { open: 'statusOpen', full: 'statusFull', 'announced-soon': 'statusAnnouncedSoon' };

export default function Forums() {
  const { locale } = useLocale();
  const { t } = useTranslation('forums');
  const reduceMotion = useReducedMotion();
  const [content, setContent] = useState(null);
  const [forums, setForums] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    Promise.all([api.get('/settings/forums.content'), api.get('/forums')])
      .then(([c, f]) => {
        if (!active) return;
        setContent(c.data.data);
        setForums(f.data.data);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, []);

  if (status === 'loading') {
    return (
      <Section>
        <p className="text-muted">{t('loading')}</p>
      </Section>
    );
  }

  if (status === 'error' || !content) {
    return (
      <Section>
        <p className="text-error">{t('loadError')}</p>
      </Section>
    );
  }

  const openForums = forums.filter((f) => f.status === 'open');
  const first = forums[0];
  const columns = content.tableColumns?.[locale] || [];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO title={content.sectionTitle?.[locale]} description={content.location?.[locale]} path="/forums" />

      <Section>
        <h1 className="font-display text-xl md:text-2xl text-ink mb-2">{content.sectionTitle?.[locale]}</h1>
        <p className="text-muted mb-6">{content.location?.[locale]}</p>

        <Table columns={columns}>
          {forums.map((f) => (
            <Tr key={f._id}>
              <Td>
                {f.month} {f.year}
              </Td>
              <Td>{content.location?.[locale]}</Td>
              <Td>{f.topics?.join('، ')}</Td>
              <Td>
                <div className="flex flex-col gap-2">
                  {f.notes?.[locale] && <span>{f.notes[locale]}</span>}
                  <Pill tone={STATUS_TONE[f.status]}>{t(STATUS_KEY[f.status])}</Pill>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>

        {first && (first.agreementUrl || first.partnershipUrl) && (
          <div className="flex flex-wrap gap-4 mt-6">
            {first.agreementUrl && (
              <a href={first.agreementUrl} target="_blank" rel="noreferrer" className="text-accent font-medium">
                {t('agreementLink')}
              </a>
            )}
            {first.partnershipUrl && (
              <a href={first.partnershipUrl} target="_blank" rel="noreferrer" className="text-accent font-medium">
                {t('partnershipLink')}
              </a>
            )}
          </div>
        )}
      </Section>

      <Section tone="surface">
        <ForumRegistrationForm openForums={openForums} fieldLabels={content.registrationFields} />
      </Section>

      <Section>
        {content.tagline?.[locale] && (
          <p className="font-display text-lg text-ink-soft border-s-2 border-accent ps-4 mb-8">
            {content.tagline[locale]}
          </p>
        )}
        <div className="flex flex-wrap gap-4">
          {content.video && (
            <a href={content.video} target="_blank" rel="noreferrer" className="text-accent font-medium">
              {t('watchVideo')}
            </a>
          )}
          {content.playlist && (
            <a href={content.playlist} target="_blank" rel="noreferrer" className="text-accent font-medium">
              {t('watchPlaylist')}
            </a>
          )}
        </div>
      </Section>
    </motion.div>
  );
}
