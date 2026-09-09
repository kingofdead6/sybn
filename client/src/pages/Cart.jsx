import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion, motion } from 'framer-motion';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../hooks/useCart';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import Rule from '../components/ui/Rule';
import SEO from '../components/SEO';
import CheckoutForm from '../components/store/CheckoutForm';

export default function Cart() {
  const { locale } = useLocale();
  const { t } = useTranslation('store');
  const reduceMotion = useReducedMotion();
  const { items, removeItem, updateQty, total, clear } = useCart();
  const prefix = locale === 'en' ? '/en' : '';

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SEO title={t('cart')} path="/cart" />

      <Section>
        <h1 className="font-display text-2xl md:text-3xl text-ink mb-6">{t('cart')}</h1>

        {items.length === 0 ? (
          <div className="rounded-md border border-rule/60 bg-surface p-8 text-center shadow-raised">
            <p className="font-medium text-ink mb-1">{t('emptyCartTitle')}</p>
            <p className="text-muted mb-4">{t('emptyCartBody')}</p>
            <Link to={`${prefix}/store`}>
              <Button variant="secondary">{t('browseStore')}</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-4 rounded-md border border-rule/60 bg-surface p-4 shadow-raised"
                >
                  <div>
                    <Link to={`${prefix}/store/${item.slug}`} className="font-medium text-ink">
                      {item.title}
                    </Link>
                    <p className="text-sm text-accent">{item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => updateQty(item.productId, Number(e.target.value))}
                      className="w-16 rounded-md border border-rule bg-bg px-2 py-1 text-center text-ink-soft"
                      aria-label={t('quantity')}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-sm text-error font-medium"
                    >
                      {t('remove')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="font-display text-lg text-ink mb-6">
              {t('total')}: {total}
            </p>

            <Rule className="mb-6" />

            <CheckoutForm items={items} total={total} onSuccess={clear} />
          </>
        )}
      </Section>
    </motion.div>
  );
}
