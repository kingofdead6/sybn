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
      setError(
        err instanceof SyntaxError
          ? t('settings.invalidJson')
          : err.response?.data?.error || t('form.saveFailed')
      );
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">{t('settings.title')}</h1>
      <p className="text-sm text-sage mb-8">{t('settings.subtitle')}</p>

      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        <div className="flex flex-col gap-1 rounded-lg border border-line bg-surface p-2 shadow-sm h-fit">
          {keys.map((k) => (
            <button
              key={k._id}
              type="button"
              onClick={() => select(k)}
              dir="ltr"
              className={`text-start px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selected === k._id
                  ? 'bg-saffron-tint text-saffron-deep'
                  : 'text-body hover:bg-surface-muted hover:text-ink'
              }`}
            >
              {k.key}
            </button>
          ))}
        </div>

        <div>
          {selected ? (
            <>
              <textarea
                dir="ltr"
                spellCheck={false}
                className="w-full h-96 rounded-lg border border-line bg-surface p-4 font-mono text-sm text-body shadow-sm transition-colors focus-visible:border-saffron"
                value={json}
                onChange={(e) => {
                  setJson(e.target.value);
                  setSaved(false);
                }}
              />
              {error && (
                <p className="mt-2 rounded-lg bg-clay-tint px-4 py-2 text-sm text-clay" role="alert">
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
            <div className="rounded-lg border border-line bg-surface p-10 text-center shadow-sm">
              <p className="text-sage">{t('settings.selectKey')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
