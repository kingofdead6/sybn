import { useState } from 'react';
import api from '../lib/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function MediaUploader({ value, onChange, folder = 'siyb/misc' }) {
  const [altAr, setAltAr] = useState('');
  const [altEn, setAltEn] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!altAr || !altEn) {
      setError('Enter bilingual alt text before uploading.');
      e.target.value = '';
      return;
    }
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('ar', altAr);
      formData.append('en', altEn);
      const { data } = await api.post(`/admin/media/upload?folder=${folder}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(data.data.url);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 border border-line rounded-lg shadow-sm p-4">
      {value && <img src={value} alt="" className="max-h-32 rounded" />}
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Alt text (AR)" value={altAr} onChange={(e) => setAltAr(e.target.value)} dir="rtl" />
        <Input label="Alt text (EN)" value={altEn} onChange={(e) => setAltEn(e.target.value)} dir="ltr" />
      </div>
      <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf" onChange={onFileChange} />
      {uploading && <p className="text-sm text-sage">Uploading…</p>}
      {error && <p className="text-sm text-clay">{error}</p>}
      {value && (
        <Button type="button" variant="ghost" size="sm" onClick={() => onChange('')}>
          Remove
        </Button>
      )}
    </div>
  );
}
