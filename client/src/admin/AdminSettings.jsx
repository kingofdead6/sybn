import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import Button from '../components/ui/Button';

export default function AdminSettings() {
  const { t } = useTranslation('admin');
  const [keys, setKeys] = useState([]);
  const [selected, setSelected] = useState('');
  const [json, setJson] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get('/admin/settings', { params: { limit: 100 } })
      .then(({ data }) => setKeys(data.data))
      .catch(() => {});
  }, []);

  function select(item) {
    setSelected(item._id);
    setJson(JSON.stringify(item.value, null, 2));
    setSaved(false);
    setError('');
  }

  async function save() {
    setError('');
    try {
      const value = JSON.parse(json);
      await api.put(`/admin/settings/${selected}`, { value });
      setSaved(true);
    } catch (err) {
      // Server messages are English-only, so only the local strings are shown.
      setError(err instanceof SyntaxError ? t('settings.invalidJson') : t('form.saveFailed'));
    }
  }

  /** Readable name for a setting key, falling back to the raw key itself. */
  const keyLabel = (key) => t(`settings.key.${key}`, { defaultValue: key });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">{t('settings.title')}</h1>
      <p className="text-sm text-muted mb-8">{t('settings.subtitle')}</p>

      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        <div className="flex flex-col gap-1 rounded-sm border border-rule bg-surface p-2 h-fit">
          {keys.map((k) => (
            <button
              key={k._id}
              type="button"
              onClick={() => select(k)}
              className={`flex flex-col gap-0.5 text-start px-3 py-2 rounded-sm text-sm font-medium transition-colors ${
                selected === k._id
                  ? 'bg-accent-wash text-accent'
                  : 'text-ink-soft hover:bg-sunk hover:text-ink'
              }`}
            >
              <span>{keyLabel(k.key)}</span>
              {/* The raw key is the identifier the JSON is stored under, so it
                  stays visible — and stays LTR regardless of interface language. */}
              <span dir="ltr" className="font-mono text-2xs text-muted">
                {k.key}
              </span>
            </button>
          ))}
        </div>

        <div>
          {selected ? (
            <>
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-display text-lg text-ink">
                  {keyLabel(keys.find((k) => k._id === selected)?.key || '')}
                </h2>
                <span dir="ltr" className="font-mono text-xs text-muted">
                  {keys.find((k) => k._id === selected)?.key}
                </span>
              </div>
              <textarea
                dir="ltr"
                spellCheck={false}
                className="w-full h-96 rounded-sm border border-rule bg-surface p-4 font-mono text-sm text-ink-soft transition-colors focus-visible:border-accent"
                value={json}
                onChange={(e) => {
                  setJson(e.target.value);
                  setSaved(false);
                }}
              />
              {error && (
                <p className="mt-2 rounded-sm bg-error-wash px-4 py-2 text-sm text-error" role="alert">
                  {error}
                </p>
              )}
              <div className="mt-3 flex items-center gap-3">
                <Button onClick={save}>{t('settings.save')}</Button>
                {saved && (
                  <span className="text-sm font-medium text-success" role="status">
                    {t('settings.saved')}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-sm border border-rule bg-surface p-10 text-center">
              <p className="text-muted">{t('settings.selectKey')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
