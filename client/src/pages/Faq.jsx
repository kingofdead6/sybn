import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import Section from '../components/ui/Section';
import Accordion, { AccordionItem } from '../components/ui/Accordion';
import SEO from '../components/SEO';

/**
 * The public FAQ. Questions come from the admin-managed `home.faq` setting, so
 * this page and the home-page FAQ stay in step without duplicating content.
 */
export default function Faq() {
  const { locale } = useLocale();
  const { t } = useTranslation('home');
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/settings/home.faq')
      .then(({ data: res }) => {
        if (active) setData(res.data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const heading = data?.heading?.[locale] || t('faq.section');
  const items = data?.items || [];

  return (
    <>
      <SEO title={heading} description={heading} path="/faq" />

      <Section label={heading}>
        <h1 className="font-display text-2xl md:text-3xl leading-tight text-ink">{heading}</h1>

        {items.length === 0 ? (
          <p className="mt-6 text-sm text-muted">{t('forums.empty')}</p>
        ) : (
          <div className="mt-7 rounded-lg border border-rule/60 bg-surface px-6 py-2 shadow-raised md:px-8">
            <Accordion>
              {items.map((item, i) => (
                <AccordionItem key={i} title={item.question?.[locale]} defaultOpen={i === 0}>
                  {item.answer?.[locale]}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </Section>
    </>
  );
}
