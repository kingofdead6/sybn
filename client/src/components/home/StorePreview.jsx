import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Card from '../ui/Card';

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
    <section className="relative bg-bg py-9 md:py-10">
      <div className="mx-auto max-w-[86rem] px-4 md:px-8">
        {products.length === 0 ? (
          <Card radius="lg" className="px-6 py-9 text-center">
            <h2 className="font-display text-xl md:text-2xl text-ink">
              {content?.title?.[locale]}
            </h2>
            <p className="mt-3 mx-auto max-w-prose text-sm text-ink-soft">{t('store.empty')}</p>
            <Link
              to={`${prefix}/store`}
              className="mt-5 inline-block text-sm text-accent border-b border-accent pb-0.5 transition-colors duration-fast ease-out hover:text-accent-deep hover:border-accent-deep"
            >
              {t('store.full')}
            </Link>
          </Card>
        ) : (
          <>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <h2 className="font-display text-xl md:text-2xl text-ink">
                {content?.title?.[locale]}
              </h2>
              <Link to={`${prefix}/store`} className="text-sm text-accent border-b border-accent pb-0.5 transition-colors duration-fast ease-out hover:text-accent-deep hover:border-accent-deep">
                {t('store.full')}
              </Link>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-6 md:grid-cols-4">
              {products.map((product) => (
                <Link key={product.slug} to={`${prefix}/store/${product.slug}`} className="block">
                  <Card hoverable className="p-3">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.title?.[locale] || ''}
                        className="w-full aspect-square rounded-sm object-cover"
                      />
                    )}
                    <span className="mt-3 block text-sm text-ink">{product.title?.[locale]}</span>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
