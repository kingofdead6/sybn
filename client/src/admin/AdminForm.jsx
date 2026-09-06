import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { RESOURCE_SCHEMAS } from './resourceSchemas';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import MediaUploader from './MediaUploader';

function getPath(obj, path) {
  return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

function setPath(obj, path, value) {
  const keys = path.split('.');
  const next = { ...obj };
  let cursor = next;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      cursor[k] = value;
    } else {
      cursor[k] = { ...(cursor[k] || {}) };
      cursor = cursor[k];
    }
  });
  return next;
}

function BilingualField({ label, value = {}, onChange, textarea }) {
  const Comp = textarea ? 'textarea' : 'input';
  const missingEn = !value?.en;
  return (
    <div className="grid gap-3 sm:grid-cols-2 border border-line rounded p-3">
      <div>
        <label className="text-sm font-medium text-ink">{label} (AR)</label>
        <Comp
          dir="rtl"
          value={value?.ar || ''}
          onChange={(e) => onChange({ ...value, ar: e.target.value })}
          className="w-full mt-1 rounded border border-line bg-surface px-3 py-2"
          rows={textarea ? 4 : undefined}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-ink flex items-center gap-2">
          {label} (EN)
          {missingEn && <span className="text-clay text-xs">missing</span>}
        </label>
        <Comp
          dir="ltr"
          value={value?.en || ''}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          className="w-full mt-1 rounded border border-line bg-surface px-3 py-2"
          rows={textarea ? 4 : undefined}
        />
      </div>
    </div>
  );
}

function BulletListField({ value = [], onChange }) {
  function updateBullet(i, patch) {
    const next = [...value];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  return (
    <div className="flex flex-col gap-3">
      {value.map((b, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1">
            <BilingualField label={`Bullet ${i + 1}`} value={b} onChange={(v) => updateBullet(i, v)} />
          </div>
          <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="text-clay text-sm mt-2">
            Remove
          </button>
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" onClick={() => onChange([...value, { ar: '', en: '' }])}>
        Add bullet
      </Button>
    </div>
  );
}

export default function AdminForm() {
  const { resource, id } = useParams();
  const navigate = useNavigate();
  const schema = RESOURCE_SCHEMAS[resource];
  const isNew = !id;
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew) {
      api.get(`/admin/${resource}/${id}`).then(({ data }) => {
        setForm(data.data);
        setLoading(false);
      });
    }
  }, [resource, id, isNew]);

  if (!schema) return <p className="text-clay">Unknown resource: {resource}</p>;
  if (loading) return <p className="text-sage">Loading…</p>;

  function update(name, value) {
    setForm((prev) => setPath(prev, name, value));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        const { data } = await api.post(`/admin/${resource}`, form);
        navigate(`/admin/${resource}/${data.data._id}`);
      } else {
        await api.put(`/admin/${resource}/${id}`, form);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl text-ink mb-6">
        {isNew ? `New ${schema.label}` : `Edit ${schema.label}`}
      </h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {schema.fields.map((f) => {
          const val = getPath(form, f.name);
          if (f.type === 'bilingual') {
            return <BilingualField key={f.name} label={f.name} value={val} onChange={(v) => update(f.name, v)} />;
          }
          if (f.type === 'bilingual-textarea') {
            return <BilingualField key={f.name} label={f.name} value={val} onChange={(v) => update(f.name, v)} textarea />;
          }
          if (f.type === 'bulletlist-bilingual') {
            return <BulletListField key={f.name} value={val} onChange={(v) => update(f.name, v)} />;
          }
          if (f.type === 'image') {
            return (
              <div key={f.name}>
                <label className="text-sm font-medium text-ink">{f.name}</label>
                <div className="mt-1">
                  <MediaUploader value={val} onChange={(v) => update(f.name, v)} folder={`siyb/${resource}`} />
                </div>
              </div>
            );
          }
          if (f.type === 'checkbox') {
            return (
              <label key={f.name} className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={!!val} onChange={(e) => update(f.name, e.target.checked)} />
                {f.name}
              </label>
            );
          }
          if (f.type === 'select') {
            return (
              <Select key={f.name} label={f.name} value={val || ''} onChange={(e) => update(f.name, e.target.value)}>
                <option value="">—</option>
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </Select>
            );
          }
          return (
            <Input
              key={f.name}
              label={f.name}
              type={f.type === 'number' ? 'number' : 'text'}
              value={val ?? ''}
              required={f.required}
              onChange={(e) => update(f.name, f.type === 'number' ? Number(e.target.value) : e.target.value)}
            />
          );
        })}
        {error && <p className="text-sm text-clay">{error}</p>}
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? '…' : 'Save'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(`/admin/${resource}`)}>
            Back to list
          </Button>
        </div>
      </form>
    </div>
  );
}
