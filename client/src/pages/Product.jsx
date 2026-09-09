import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import api from '../lib/api';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../hooks/useCart';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';

export default function Product() {
  const { slug } = useParams();
  const { locale } = useLocale();
  const { t } = useTranslation('store');
  const reduceMotion = useReducedMotion();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [status, setStatus] = useState('loading');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get(`/products/${slug}`)
      .then(({ data }) => {
        if (active) {
          setProduct(data.data);
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

  if (status === 'loading') {
    return (
      <Section>
        <p className="text-muted">{t('loading')}</p>
      </Section>
    );
  }

  if (status === 'error' || !product) {
    return (
      <Section>
        <p className="text-error">{t('productLoadError')}</p>
      </Section>
    );
  }

  const images = product.images || [];
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addItem({
      productId: product._id,
      slug: product.slug,
      title: product.title?.[locale],
      price: product.price,
    });
    setAdded(true);
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO title={product.title?.[locale]} description={product.description?.[locale]} path={`/store/${product.slug}`} />

      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            {images.length > 0 ? (
              <>
                <img
                  src={images[activeImage]}
                  alt={product.title?.[locale] || ''}
                  className="w-full aspect-square object-cover rounded-lg shadow-raised mb-3"
                />
                {images.length > 1 && (
                  <div className="flex gap-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        className={`w-16 h-16 rounded-md border overflow-hidden ${
                          i === activeImage ? 'border-accent' : 'border-rule'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full aspect-square rounded-lg bg-sunk shadow-raised" />
            )}
          </div>

          <div>
            <h1 className="font-display text-2xl text-ink mb-2">{product.title?.[locale]}</h1>
            <p className="text-xl text-accent font-medium mb-4">
              {product.price} {product.currency}
            </p>
            {product.category && <p className="text-sm text-muted mb-4">{product.category}</p>}
            {product.description?.[locale] && (
              <p className="text-ink-soft mb-6 max-w-prose">{product.description[locale]}</p>
            )}

            {outOfStock ? (
              <p className="text-error font-medium">{t('outOfStock')}</p>
            ) : (
              <Button onClick={handleAdd}>{added ? t('inStock') : t('addToCart')}</Button>
            )}

            <div className="mt-6">
              <Link to={locale === 'en' ? '/en/cart' : '/cart'} className="text-accent font-medium">
                {t('cart')}
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </motion.div>
  );
}
