import { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { RESOURCE_SCHEMAS } from './resourceSchemas';
import { useAdminLocale } from './AdminLocaleContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Table, { Tr, Td } from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';

const LIMIT = 20;

function displayValue(item, col, locale, t) {
  const val = col.split('.').reduce((acc, k) => acc?.[k], item);
  if (val && typeof val === 'object' && ('ar' in val || 'en' in val)) {
    return val[locale] || val.ar || val.en || '';
  }
  if (typeof val === 'boolean') return val ? t('yes') : t('no');
  return val ?? '';
}

export default function AdminList() {
  const { resource } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('admin');
  const { locale } = useAdminLocale();
  const schema = RESOURCE_SCHEMAS[resource];

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [loading, setLoading] = useState(true);

  // Typing shouldn't fire a request per keystroke.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(id);
  }, [q]);

  // A new search starts from the first page again.
  useEffect(() => {
    setPage(1);
  }, [debouncedQ, resource]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/${resource}`, {
        params: { page, q: debouncedQ, limit: LIMIT },
      });
      setItems(data.data);
      setTotal(data.meta?.total || 0);
    } finally {
      setLoading(false);
    }
  }, [resource, page, debouncedQ]);

  useEffect(() => {
    load();
  }, [load]);

  if (!schema) {
    return (
      <p className="text-error">
        {t('list.unknownResource')} {resource}
      </p>
    );
  }

  const label = t(`resource.${resource}`, { defaultValue: schema.label });

  async function onDelete(id) {
    if (!window.confirm(t('list.confirmDelete'))) return;
    await api.delete(`/admin/${resource}/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{label}</h1>
          {!loading && total > 0 && (
            <p className="text-sm text-muted mt-1">
              {t('list.showing', { count: items.length, total })}
            </p>
          )}
        </div>
        <div className="flex items-end gap-3">
          <Input
            placeholder={t('list.search')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={t('list.search')}
          />
          <Button as={Link} to={`/admin/${resource}/new`}>
            {t('list.new')}
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">{t('list.loading')}</p>
      ) : items.length === 0 ? (
        <div className="rounded-sm border border-rule bg-surface p-10 text-center">
          <p className="text-ink font-medium">{t('list.empty')}</p>
          <p className="text-sm text-muted mt-1 mb-5">{t('list.emptyHint')}</p>
          <Button as={Link} to={`/admin/${resource}/new`}>
            {t('list.new')}
          </Button>
        </div>
      ) : (
        <>
          <Table
            columns={[
              ...schema.listColumns.map((c) => ({
                key: c,
                label: t(`field.${c}`, { defaultValue: c }),
              })),
              { key: '__actions', label: t('list.actions') },
            ]}
          >
            {items.map((item) => (
              <Tr key={item._id}>
                {schema.listColumns.map((col) => (
                  <Td key={col}>{String(displayValue(item, col, locale, t))}</Td>
                ))}
                <Td>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/${resource}/${item._id}`)}
                      className="text-accent text-sm font-medium hover:underline"
                    >
                      {t('list.edit')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item._id)}
                      className="text-error text-sm font-medium hover:underline"
                    >
                      {t('list.delete')}
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
          <Pagination page={page} limit={LIMIT} total={total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
