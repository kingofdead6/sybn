import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import Table, { Tr, Td } from '../components/ui/Table';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Pill from '../components/ui/Pill';

const STATUS_TONE = { open: 'success', full: 'clay', 'announced-soon': 'default' };

export default function AdminForumsGrid() {
  const { t } = useTranslation('admin');
  const [forums, setForums] = useState([]);
  const [dirty, setDirty] = useState({});
  const [savedId, setSavedId] = useState(null);

  function load() {
    api
      .get('/admin/forums', { params: { limit: 100, sort: 'startDate' } })
      .then(({ data }) => setForums(data.data))
      .catch(() => {});
  }

  useEffect(load, []);

  function updateField(id, field, value) {
    setForums((prev) => prev.map((f) => (f._id === id ? { ...f, [field]: value } : f)));
    setDirty((prev) => ({ ...prev, [id]: true }));
    setSavedId(null);
  }

  async function save(id) {
    const forum = forums.find((f) => f._id === id);
    await api.put(`/admin/forums/${id}`, forum);
    setDirty((prev) => ({ ...prev, [id]: false }));
    setSavedId(id);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink mb-1">{t('forums.title')}</h1>
      <p className="text-sm text-muted mb-8">{t('forums.subtitle')}</p>

      <Table
        columns={[
          { key: 'month', label: t('field.month') },
          { key: 'year', label: t('field.year') },
          { key: 'city', label: t('field.city') },
          { key: 'status', label: t('field.status') },
          { key: 'seatsTotal', label: t('field.seatsTotal') },
          { key: 'seatsTaken', label: t('field.seatsTaken') },
          { key: 'remaining', label: t('forums.remaining') },
          { key: 'actions', label: t('list.actions') },
        ]}
      >
        {forums.map((f) => (
          <Tr key={f._id}>
            <Td>{f.month}</Td>
            <Td>{f.year}</Td>
            <Td>
              <Input value={f.city} onChange={(e) => updateField(f._id, 'city', e.target.value)} />
            </Td>
            <Td>
              <div className="flex items-center gap-2">
                <Select value={f.status} onChange={(e) => updateField(f._id, 'status', e.target.value)}>
                  <option value="open">{t('forums.statusOpen')}</option>
                  <option value="full">{t('forums.statusFull')}</option>
                  <option value="announced-soon">{t('forums.statusSoon')}</option>
                </Select>
                <Pill tone={STATUS_TONE[f.status] || 'default'}>
                  {t(
                    f.status === 'open'
                      ? 'forums.statusOpen'
                      : f.status === 'full'
                        ? 'forums.statusFull'
                        : 'forums.statusSoon'
                  )}
                </Pill>
              </div>
            </Td>
            <Td>
              <Input
                type="number"
                value={f.seatsTotal}
                onChange={(e) => updateField(f._id, 'seatsTotal', Number(e.target.value))}
              />
            </Td>
            <Td>
              <Input
                type="number"
                value={f.seatsTaken}
                onChange={(e) => updateField(f._id, 'seatsTaken', Number(e.target.value))}
              />
            </Td>
            <Td>
              <span className="font-semibold text-ink">{Math.max(f.seatsTotal - f.seatsTaken, 0)}</span>
            </Td>
            <Td>
              <div className="flex items-center gap-2">
                <Button size="sm" disabled={!dirty[f._id]} onClick={() => save(f._id)}>
                  {t('forums.save')}
                </Button>
                {savedId === f._id && (
                  <span className="text-xs font-medium text-success" role="status">
                    {t('forums.saved')}
                  </span>
                )}
              </div>
            </Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}
