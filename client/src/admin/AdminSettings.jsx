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
      <p className="text-sm text-muted mb-8">{t('settings.subtitle')}</p>

      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        <div className="flex flex-col gap-1 rounded-sm border border-rule bg-surface p-2 h-fit">
          {keys.map((k) => (
            <button
              key={k._id}
              type="button"
              onClick={() => select(k)}
              dir="ltr"
              className={`text-start px-3 py-2 rounded-sm text-sm font-medium transition-colors ${
                selected === k._id
                  ? 'bg-accent-wash text-accent'
                  : 'text-ink-soft hover:bg-sunk hover:text-ink'
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
