import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function MediaUploader({ value, onChange, folder = 'siyb/misc' }) {
  const { t } = useTranslation('admin');
  const [altAr, setAltAr] = useState('');
  const [altEn, setAltEn] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!altAr || !altEn) {
      setError(t('media.altRequired'));
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
      setError(err.response?.data?.error || t('media.uploadFailed'));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 shadow-sm">
      {value && (
        <img src={value} alt="" className="max-h-40 w-auto rounded-lg border border-line object-contain" />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Input label={t('media.altAr')} value={altAr} onChange={(e) => setAltAr(e.target.value)} dir="rtl" />
        <Input label={t('media.altEn')} value={altEn} onChange={(e) => setAltEn(e.target.value)} dir="ltr" />
      </div>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
        onChange={onFileChange}
        className="block w-full text-sm text-body file:me-3 file:rounded-full file:border-0 file:bg-saffron-tint file:px-4 file:py-2 file:text-sm file:font-semibold file:text-saffron-deep hover:file:brightness-95"
      />

      {uploading && <p className="text-sm text-sage">{t('media.uploading')}</p>}
      {error && (
        <p className="rounded-lg bg-clay-tint px-3 py-2 text-sm text-clay" role="alert">
          {error}
        </p>
      )}

      {value && (
        <Button type="button" variant="ghost" size="sm" className="self-start" onClick={() => onChange('')}>
          {t('media.remove')}
        </Button>
      )}
    </div>
  );
}
