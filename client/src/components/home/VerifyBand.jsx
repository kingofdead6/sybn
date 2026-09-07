import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Pill from '../ui/Pill';

export default function VerifyBand() {
  const { t } = useTranslation('home');
  const { locale } = useLocale();
  const prefix = locale === 'en' ? '/en' : '';
  const [number, setNumber] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | found | notfound
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  useEffect(() => {
    if (status === 'found' && resultRef.current) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) return;
      import('animejs').then(({ default: anime }) => {
        anime({
          targets: resultRef.current,
          opacity: [0, 1],
          scale: [0.97, 1],
          duration: 400,
          easing: 'easeOutQuad',
        });
      });
    }
  }, [status]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!number.trim()) return;
    setStatus('loading');
    try {
      const res = await api.post('/verify-certificate', { number: number.trim() });
      setResult(res.data.data);
      setStatus('found');
    } catch {
      setResult(null);
      setStatus('notfound');
    }
  }

  return (
    <section className="relative border-b border-rule bg-sunk py-8 md:py-9">
      <div className="mx-auto max-w-[86rem] px-4 md:px-8">
        <div className="border border-rule bg-surface p-5 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-lg md:text-xl text-ink">{t('verify.title')}</h2>
            </div>
            <Link to={`${prefix}/verify`} className="text-sm text-accent border-b border-accent pb-0.5 transition-colors duration-fast ease-out hover:text-accent-deep hover:border-accent-deep">
              {t('verify.full')}
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input
                name="certNumber"
                placeholder={t('verify.placeholder')}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" disabled={status === 'loading'}>
              {status === 'loading' ? t('verify.checking') : t('verify.submit')}
            </Button>
          </form>

          {status === 'found' && result && (
            <div
              ref={resultRef}
              className="mt-5 flex flex-wrap items-center gap-4 border-s-2 border-s-success bg-surface px-4 py-3"
            >
              <Pill tone={result.status === 'valid' ? 'success' : 'clay'}>
                {result.status === 'valid' ? t('verify.valid') : t('verify.revoked')}
              </Pill>
              <span className="text-sm text-ink">
                <span className="text-muted">{t('verify.holder')}: </span>
                {result.holderName}
              </span>
              {result.program?.title && (
                <span className="text-sm text-ink">
                  <span className="text-muted">{t('verify.program')}: </span>
                  {result.program.title[locale]}
                </span>
              )}
            </div>
          )}

          {status === 'notfound' && (
            <p className="mt-5 text-sm text-error">{t('verify.notFound')}</p>
          )}
        </div>
      </div>
    </section>
  );
}
