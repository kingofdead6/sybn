import { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { RESOURCE_SCHEMAS } from './resourceSchemas';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Table, { Tr, Td } from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';

function displayValue(item, col) {
  const val = col.split('.').reduce((acc, k) => acc?.[k], item);
  if (val && typeof val === 'object' && ('ar' in val || 'en' in val)) return val.ar || val.en || '';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  return val ?? '';
}

export default function AdminList() {
  const { resource } = useParams();
  const navigate = useNavigate();
  const schema = RESOURCE_SCHEMAS[resource];
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await api.get(`/admin/${resource}`, { params: { page, q, limit: 20 } });
    setItems(data.data);
    setTotal(data.meta?.total || 0);
    setLoading(false);
  }, [resource, page, q]);

  useEffect(() => {
    load();
  }, [load]);

  if (!schema) return <p className="text-clay">Unknown resource: {resource}</p>;

  async function onDelete(id) {
    if (!window.confirm('Delete this item?')) return;
    await api.delete(`/admin/${resource}/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-display text-2xl text-ink">{schema.label}</h1>
        <div className="flex items-center gap-3">
          <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Button as={Link} to={`/admin/${resource}/new`}>
            New
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-sage">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sage">No records yet.</p>
      ) : (
        <>
          <Table columns={[...schema.listColumns, 'actions']}>
            {items.map((item) => (
              <Tr key={item._id}>
                {schema.listColumns.map((col) => (
                  <Td key={col}>{String(displayValue(item, col))}</Td>
                ))}
                <Td>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/${resource}/${item._id}`)}
                      className="text-saffron-deep text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button type="button" onClick={() => onDelete(item._id)} className="text-clay text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
          <Pagination page={page} limit={20} total={total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
