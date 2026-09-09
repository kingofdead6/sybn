import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Tile from '../ui/Tile';

/** Store stock, as a compact product strip tile. */
export default function StorePreview() {
  const { t } = useTranslation('home');
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const [content, setContent] = useState(null);
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get('/settings/store.content').catch(() => ({ data: { data: null } })),
      api.get('/products').catch(() => ({ data: { data: [] } })),
    ]).then(([contentRes, productsRes]) => {
      if (!mounted) return;
      setContent(contentRes.data.data);
      setProducts((productsRes.data.data || []).slice(0, 3));
      setLoaded(true);
    });
    return () => { mounted = false; };
  }, []);

  if (!loaded) return null;

  return (
    <Tile span="md" label={content?.title?.[locale]}>
      {products.length === 0 ? (
        <p className="text-sm text-ink-soft">{t('store.empty')}</p>
      ) : (
        <ul className="grid grid-cols-3 gap-3">
          {products.map((product) => (
            <li key={product.slug}>
              <Link
                to={`${prefix}/store/${product.slug}`}
                className="group flex flex-col gap-2"
              >
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.title?.[locale] || ''}
                    className="aspect-square w-full rounded-md object-cover shadow-raised transition-shadow duration-base ease-out group-hover:shadow-md"
                    loading="lazy"
                  />
                )}
                <span className="line-clamp-2 text-xs text-ink">
                  {product.title?.[locale]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        to={`${prefix}/store`}
        className="mt-auto text-sm text-accent transition-colors duration-fast ease-out hover:text-accent-deep"
      >
        {t('store.full')} →
      </Link>
    </Tile>
  );
}
