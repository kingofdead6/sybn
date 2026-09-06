import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';

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
      setProducts((productsRes.data.data || []).slice(0, 4));
      setLoaded(true);
    });
    return () => { mounted = false; };
  }, []);

  if (!loaded) return null;

  return (
    <section className="bg-paper py-9 md:py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {products.length === 0 ? (
          <div className="border border-line bg-surface px-6 py-9 text-center">
            <h2 className="font-display text-xl md:text-2xl font-bold text-ink">
              {content?.title?.[locale]}
            </h2>
            <p className="mt-3 mx-auto max-w-2xl text-sm text-body">{t('store.empty')}</p>
            <Link
              to={`${prefix}/store`}
              className="mt-5 inline-block text-sm font-medium text-saffron-deep hover:text-ink"
            >
              {t('store.full')}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <h2 className="font-display text-xl md:text-2xl font-bold text-ink">
                {content?.title?.[locale]}
              </h2>
              <Link to={`${prefix}/store`} className="text-sm font-medium text-saffron-deep hover:text-ink">
                {t('store.full')}
              </Link>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-6 md:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.slug}
                  to={`${prefix}/store/${product.slug}`}
                  className="border border-line bg-surface p-4 block hover:border-saffron transition-colors duration-150"
                >
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.title?.[locale] || ''}
                      className="w-full aspect-square object-cover"
                    />
                  )}
                  <span className="mt-3 block text-sm font-medium text-ink">{product.title?.[locale]}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
