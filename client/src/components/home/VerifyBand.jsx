import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useLocale } from '../../context/LocaleContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Pill from '../ui/Pill';
import Tile from '../ui/Tile';

/** Certificate lookup, as a compact instrument tile in the grid. */
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
    <Tile span="md" label={t('verify.title')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
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
          className="flex flex-wrap items-center gap-3 rounded-md border-s-2 border-s-success bg-sunk px-4 py-3"
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
        <p className="text-sm text-error">{t('verify.notFound')}</p>
      )}

      <Link
        to={`${prefix}/verify`}
        className="mt-auto text-sm text-accent transition-colors duration-fast ease-out hover:text-accent-deep"
      >
        {t('verify.full')} →
      </Link>
    </Tile>
  );
}
