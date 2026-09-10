import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Accordion, { AccordionItem } from '../ui/Accordion';

/**
 * General questions about the programme as a whole. The store keeps its own,
 * separate FAQ — this one answers what the offering is, not how to buy.
 *
 * Content is admin-managed under the `home.faq` setting.
 */
export default function HomeFaq() {
  const { locale } = useLocale();
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    api
      .get('/settings/home.faq')
      .then((res) => {
        if (mounted) setData(res.data.data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const items = data?.items || [];
  if (!items.length) return null;

  return (
    <div className="md:col-span-6 rounded-lg border border-rule/60 bg-surface px-6 py-2 shadow-raised md:px-8">
      <Accordion>
        {items.map((item, i) => (
          <AccordionItem key={i} title={item.question?.[locale]} defaultOpen={i === 0}>
            {item.answer?.[locale]}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
