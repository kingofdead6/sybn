import { useEffect, useState } from 'react';
import api from '../lib/api';
import Table, { Tr, Td } from '../components/ui/Table';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function AdminForumsGrid() {
  const [forums, setForums] = useState([]);
  const [dirty, setDirty] = useState({});

  function load() {
    api.get('/admin/forums', { params: { limit: 100, sort: 'startDate' } }).then(({ data }) => setForums(data.data));
  }

  useEffect(load, []);

  function updateField(id, field, value) {
    setForums((prev) => prev.map((f) => (f._id === id ? { ...f, [field]: value } : f)));
    setDirty((prev) => ({ ...prev, [id]: true }));
  }

  async function save(id) {
    const forum = forums.find((f) => f._id === id);
    await api.put(`/admin/forums/${id}`, forum);
    setDirty((prev) => ({ ...prev, [id]: false }));
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Forums Grid</h1>
      <Table columns={['month', 'year', 'city', 'status', 'seatsTotal', 'seatsTaken', 'remaining', 'actions']}>
        {forums.map((f) => (
          <Tr key={f._id}>
            <Td>{f.month}</Td>
            <Td>{f.year}</Td>
            <Td>
              <Input value={f.city} onChange={(e) => updateField(f._id, 'city', e.target.value)} />
            </Td>
            <Td>
              <Select value={f.status} onChange={(e) => updateField(f._id, 'status', e.target.value)}>
                <option value="open">open</option>
                <option value="full">full</option>
                <option value="announced-soon">announced-soon</option>
              </Select>
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
            <Td>{Math.max(f.seatsTotal - f.seatsTaken, 0)}</Td>
            <Td>
              <Button size="sm" disabled={!dirty[f._id]} onClick={() => save(f._id)}>
                Save
              </Button>
            </Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}
