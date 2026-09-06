import { useEffect, useState } from 'react';
import api from '../lib/api';
import Button from '../components/ui/Button';

export default function AdminSettings() {
  const [keys, setKeys] = useState([]);
  const [selected, setSelected] = useState('');
  const [json, setJson] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/admin/settings', { params: { limit: 100 } }).then(({ data }) => setKeys(data.data));
  }, []);

  function select(item) {
    setSelected(item._id);
    setJson(JSON.stringify(item.value, null, 2));
    setSaved(false);
  }

  async function save() {
    setError('');
    try {
      const value = JSON.parse(json);
      await api.put(`/admin/settings/${selected}`, { value });
      setSaved(true);
    } catch (err) {
      setError(err instanceof SyntaxError ? 'Invalid JSON' : err.response?.data?.error || 'Save failed');
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Settings</h1>
      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <div className="flex flex-col gap-1">
          {keys.map((k) => (
            <button
              key={k._id}
              type="button"
              onClick={() => select(k)}
              className={`text-start px-3 py-2 rounded text-sm ${selected === k._id ? 'bg-saffron text-on-saffron' : 'text-ink hover:bg-surface'}`}
            >
              {k.key}
            </button>
          ))}
        </div>
        <div>
          {selected ? (
            <>
              <textarea
                dir="auto"
                className="w-full h-96 border border-line rounded p-3 font-mono text-sm bg-surface"
                value={json}
                onChange={(e) => setJson(e.target.value)}
              />
              {error && <p className="text-clay text-sm mt-2">{error}</p>}
              {saved && <p className="text-success text-sm mt-2">Saved.</p>}
              <Button className="mt-3" onClick={save}>
                Save
              </Button>
            </>
          ) : (
            <p className="text-sage">Select a setting key to edit.</p>
          )}
        </div>
      </div>
    </div>
  );
}
