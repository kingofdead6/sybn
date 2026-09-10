import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Button from '../ui/Button';
import Tile from '../ui/Tile';

/**
 * The two entry paths into the programme — entrepreneurs and trainers. The
 * offering genuinely serves two different audiences, so the page says so
 * before the programme ladder rather than making the reader infer it.
 *
 * Content is admin-managed under the `home.audiences` setting.
 */
export default function AudiencePaths() {
  const { locale } = useLocale();
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    api
      .get('/settings/home.audiences')
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
    <>
      {items.map((item) => (
        <Tile key={item.key} span="md" className="md:p-8">
          <h3 className="font-display text-lg md:text-xl leading-tight text-ink">
            {item.title?.[locale]}
          </h3>

          {item.tagline?.[locale] && (
            <p className="text-sm font-medium leading-relaxed text-accent">
              {item.tagline[locale]}
            </p>
          )}

          {item.body?.[locale] && (
            <p className="text-sm leading-relaxed text-ink-soft">{item.body[locale]}</p>
          )}

          {item.bullets?.length > 0 && (
            <ul className="flex flex-col gap-2 border-t border-rule pt-4">
              {item.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-pill bg-accent"
                  />
                  <span>{b?.[locale]}</span>
                </li>
              ))}
            </ul>
          )}

          {item.cta?.[locale] && (
            <div className="mt-auto pt-2">
              <Button as="a" href={item.href || '#programs-ladder'} variant="primary">
                {item.cta[locale]}
              </Button>
            </div>
          )}
        </Tile>
      ))}
    </>
  );
}
