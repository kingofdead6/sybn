import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import { onLeadPreselect, LEAD_ANCHOR_ID } from '../../lib/leadPreselect';
import LeadCaptureForm from '../leads/LeadCaptureForm';
import Reveal from '../motion/Reveal';
import AscentEdge from '../motion/AscentEdge';

/**
 * "Your next step starts here" — the quick-registration band. Every "register
 * now" button on the page lands here with its track already chosen, so the
 * visitor's last click is the only thing they have to restate.
 *
 * Copy is admin-managed under the `home.lead` setting.
 */
export default function LeadCaptureBand() {
  const { locale } = useLocale();
  const { t } = useTranslation('home');
  const [content, setContent] = useState(null);
  const [preselect, setPreselect] = useState(null);

  useEffect(() => {
    let mounted = true;
    api
      .get('/settings/home.lead')
      .then((res) => {
        if (mounted) setContent(res.data.data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => onLeadPreselect(setPreselect), []);

  if (!content) return null;

  return (
    <section
      id={LEAD_ANCHOR_ID}
      aria-label={content.heading?.[locale] || t('lead.section')}
      className="md:col-span-6 grid gap-6 md:grid-cols-12 md:gap-8"
    >
      <Reveal from="start" className="md:col-span-4 flex flex-col gap-4">
        <AscentEdge label={t('lead.section')} />
        <h3 className="font-display text-xl md:text-2xl leading-tight text-ink max-w-[16ch]">
          {content.heading?.[locale]}
        </h3>
        {content.intro?.[locale] && (
          <p className="text-sm leading-relaxed text-ink-soft max-w-[42ch]">
            {content.intro[locale]}
          </p>
        )}
      </Reveal>

      <Reveal
        from="end"
        delay={0.08}
        className="md:col-span-8 rounded-lg border border-rule/60 bg-surface p-6 shadow-raised md:p-8"
      >
        <LeadCaptureForm content={content} preselect={preselect} />
      </Reveal>
    </section>
  );
}
