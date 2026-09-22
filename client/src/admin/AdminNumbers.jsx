import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

/**
 * Editor for the "SIYB in Numbers" page.
 *
 * The figures live on the `about.stats` setting, which the generic settings
 * screen exposes only as raw JSON. A number is the sort of thing that gets
 * updated often and by whoever is to hand, so it gets a real form: add a row,
 * remove one, reorder them, and type the value and its label in both
 * languages. Nothing here is a fixed slot — the page renders whatever list
 * this screen saves.
 */
export default function AdminNumbers() {
  const { t } = useTranslation('admin');
  const [value, setValue] = useState(null);
  const [status, setStatus] = useState('loading');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/settings', { params: { q: 'about.stats', limit: 5 } })
      .then(({ data }) => {
        const row = (data.data || []).find((s) => s.key === 'about.stats');
        if (!row) {
          setStatus('missing');
          return;
        }
        setValue({ id: row._id, ...row.value });
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  function patch(next) {
    setValue((v) => ({ ...v, ...next }));
    setSaved(false);
  }

  const items = value?.items || [];

  function updateItem(i, next) {
    const copy = [...items];
    copy[i] = { ...copy[i], ...next };
    patch({ items: copy });
  }

  function updateLabel(i, locale, text) {
    const copy = [...items];
    copy[i] = { ...copy[i], label: { ...copy[i].label, [locale]: text } };
    patch({ items: copy });
  }

  function move(i, delta) {
    const target = i + delta;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    [copy[i], copy[target]] = [copy[target], copy[i]];
    patch({ items: copy });
  }

  async function save() {
    setError('');
    try {
      const { id, ...rest } = value;
      await api.put(`/admin/settings/${id}`, { value: rest });
      setSaved(true);
    } catch {
      setError(t('form.saveFailed'));
    }
  }

  if (status === 'loading') return <p className="text-muted">{t('list.loading')}</p>;
  if (status === 'error') return <p className="text-error">{t('form.loadFailed')}</p>;
  if (status === 'missing') return <p className="text-error">{t('numbers.missing')}</p>;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink mb-1">{t('numbers.title')}</h1>
          <p className="text-sm text-muted">{t('numbers.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm font-medium text-success" role="status">
              {t('settings.saved')}
            </span>
          )}
          <Button onClick={save}>{t('settings.save')}</Button>
        </div>
      </div>

      {/* Page heading and intro, both bilingual. */}
      <div className="mb-8 grid gap-4 rounded-sm border border-rule bg-surface p-5 md:grid-cols-2">
        <Input
          label={`${t('numbers.heading')} (AR)`}
          dir="rtl"
          value={value.heading?.ar || ''}
          onChange={(e) => patch({ heading: { ...value.heading, ar: e.target.value } })}
        />
        <Input
          label={`${t('numbers.heading')} (EN)`}
          dir="ltr"
          value={value.heading?.en || ''}
          onChange={(e) => patch({ heading: { ...value.heading, en: e.target.value } })}
        />
        <Input
          label={`${t('numbers.intro')} (AR)`}
          dir="rtl"
          value={value.intro?.ar || ''}
          onChange={(e) => patch({ intro: { ...value.intro, ar: e.target.value } })}
        />
        <Input
          label={`${t('numbers.intro')} (EN)`}
          dir="ltr"
          value={value.intro?.en || ''}
          onChange={(e) => patch({ intro: { ...value.intro, en: e.target.value } })}
        />
      </div>

      {/* The figures themselves. */}
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="grid gap-3 rounded-sm border border-rule bg-surface p-4 md:grid-cols-[10rem_1fr_1fr_auto]"
          >
            <Input
              label={t('numbers.value')}
              dir="ltr"
              value={item.value || ''}
              placeholder="25,000+"
              onChange={(e) => updateItem(i, { value: e.target.value })}
            />
            <Input
              label={`${t('numbers.label')} (AR)`}
              dir="rtl"
              value={item.label?.ar || ''}
              onChange={(e) => updateLabel(i, 'ar', e.target.value)}
            />
            <Input
              label={`${t('numbers.label')} (EN)`}
              dir="ltr"
              value={item.label?.en || ''}
              onChange={(e) => updateLabel(i, 'en', e.target.value)}
            />

            <div className="flex items-end gap-2 pb-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label={t('numbers.moveUp')}
                className="rounded-sm border border-rule px-2 py-1 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                aria-label={t('numbers.moveDown')}
                className="rounded-sm border border-rule px-2 py-1 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => patch({ items: items.filter((_, idx) => idx !== i) })}
                className="px-1 text-sm font-medium text-error hover:underline"
              >
                {t('list.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={() => patch({ items: [...items, { value: '', label: { ar: '', en: '' } }] })}
        >
          {t('numbers.add')}
        </Button>
        {items.length === 0 && <span className="text-sm text-muted">{t('numbers.empty')}</span>}
      </div>

      {error && (
        <p className="mt-4 rounded-sm bg-error-wash px-4 py-2 text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
