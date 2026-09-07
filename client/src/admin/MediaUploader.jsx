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
    <div className="flex flex-col gap-3 rounded-sm border border-rule bg-surface p-4">
      {value && (
        <img src={value} alt="" className="max-h-40 w-auto rounded-sm border border-rule object-contain" />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Input label={t('media.altAr')} value={altAr} onChange={(e) => setAltAr(e.target.value)} dir="rtl" />
        <Input label={t('media.altEn')} value={altEn} onChange={(e) => setAltEn(e.target.value)} dir="ltr" />
      </div>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
        onChange={onFileChange}
        className="block w-full text-sm text-ink-soft file:me-3 file:rounded-sm file:border-0 file:bg-accent-wash file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:brightness-95"
      />

      {uploading && <p className="text-sm text-muted">{t('media.uploading')}</p>}
      {error && (
        <p className="rounded-sm bg-error-wash px-3 py-2 text-sm text-error" role="alert">
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
