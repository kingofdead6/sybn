import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { readRecipientFile } from '../lib/recipientList';
import { useAdminLocale } from './AdminLocaleContext';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Pill from '../components/ui/Pill';
import Modal from '../components/ui/Modal';
import Avatar from '../components/ui/Avatar';

const BASE_PLACEHOLDERS = ['name', 'email', 'country', 'program', 'certifiedAt', 'certifiedYear', 'brandName', 'brandPhone'];

const selectClass =
  'min-w-[9rem] max-w-full rounded-md border border-rule bg-bg px-3 py-2 text-sm text-ink transition-colors focus-visible:border-accent';

function Icon({ d, className = 'h-[1rem] w-[1rem]' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const ICONS = {
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35',
  upload: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
  file: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z',
  x: 'M18 6L6 18M6 6l12 12',
};

/** A stored trainer as a row: the same shape as an uploaded recipient. */
function fromTrainer(tr, locale) {
  const certified = tr.certifiedAt ? new Date(tr.certifiedAt) : null;
  return {
    key: `db:${tr._id}`,
    id: tr._id,
    source: 'db',
    name: tr.name || '',
    email: tr.email || '',
    country: tr.country || '',
    year: certified && !Number.isNaN(certified.getTime()) ? String(certified.getFullYear()) : '',
    program: tr.program?.title?.[locale] || tr.program?.title?.ar || tr.program?.code || '',
    active: tr.status === 'active',
    lastEmailedAt: tr.lastEmailedAt,
  };
}

/**
 * Sending a saved template to certified trainers — and to lists uploaded for
 * the occasion.
 *
 * An uploaded CSV or Excel list is read in the browser and kept only in this
 * page: it is never stored, and a refresh clears it. The admin picks the
 * recipients across every list, a template, previews what some of them would
 * actually receive — placeholders filled with their own details — and only
 * then sends. A message going to many people at once is not sent blind.
 */
export default function AdminTrainerEmail() {
  const { t } = useTranslation('admin');
  const { locale } = useAdminLocale();
  const fileRef = useRef(null);

  const [trainers, setTrainers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Uploaded lists: [{ id, name, rows, extras, report }] — in memory only.
  const [lists, setLists] = useState([]);
  const [tab, setTab] = useState('db');
  const [uploadReport, setUploadReport] = useState(null);
  const [dragging, setDragging] = useState(false);

  const [selected, setSelected] = useState(() => new Set());
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('');
  const [year, setYear] = useState('');
  const [program, setProgram] = useState('');
  const [sort, setSort] = useState('name');

  const [templateId, setTemplateId] = useState('');
  const [format, setFormat] = useState('');
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [confirmSend, setConfirmSend] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/admin/certified-trainers', { params: { limit: 100, sort: 'name' } }),
      api.get('/admin/email-templates', { params: { limit: 100, sort: 'order' } }),
    ])
      .then(async ([tr, tp]) => {
        // Trainers past the first hundred come in the following pages.
        let all = tr.data.data || [];
        const total = tr.data.meta?.total || all.length;
        for (let page = 2; all.length < total && page <= 10; page += 1) {
          const { data } = await api.get('/admin/certified-trainers', { params: { limit: 100, page, sort: 'name' } });
          all = all.concat(data.data || []);
        }
        setTrainers(all);
        setTemplates(tp.data.data || []);
      })
      .catch(() => setError(t('form.loadFailed')))
      .finally(() => setLoaded(true));
  }, [t]);

  // An uploaded list is lost on refresh; say so before it happens.
  useEffect(() => {
    if (!lists.length) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [lists.length]);

  const dbRows = useMemo(() => trainers.map((tr) => fromTrainer(tr, locale)), [trainers, locale]);
  const allRows = useMemo(() => [...dbRows, ...lists.flatMap((l) => l.rows)], [dbRows, lists]);
  const tabRows = tab === 'db' ? dbRows : lists.find((l) => l.id === tab)?.rows || [];

  // Filter choices come from what the current list actually holds.
  const choices = (field) => [...new Set(tabRows.map((r) => r[field]).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
  const countries = choices('country');
  const years = choices('year').reverse();
  const programs = choices('program');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = tabRows.filter(
      (r) =>
        (!q || [r.name, r.email, r.country, r.program].some((v) => v?.toLowerCase().includes(q))) &&
        (!country || r.country === country) &&
        (!year || r.year === year) &&
        (!program || r.program === program)
    );
    const by = {
      name: (a, b) => a.name.localeCompare(b.name),
      country: (a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name),
      '-year': (a, b) => (b.year || '').localeCompare(a.year || '') || a.name.localeCompare(b.name),
      year: (a, b) => (a.year || '9999').localeCompare(b.year || '9999') || a.name.localeCompare(b.name),
    }[sort];
    return by ? [...rows].sort(by) : rows;
  }, [tabRows, query, country, year, program, sort]);

  // Clearing filters when the list changes: one list’s countries are not another’s.
  useEffect(() => {
    setCountry('');
    setYear('');
    setProgram('');
  }, [tab]);

  const selectable = visible.filter((r) => r.active !== false);
  const allSelected = selectable.length > 0 && selectable.every((r) => selected.has(r.key));
  const chosen = allRows.filter((r) => selected.has(r.key));
  const chosenTemplate = templates.find((x) => x._id === templateId);
  const extraKeys = [...new Map(lists.flatMap((l) => l.extras).map((x) => [x.key, x])).values()];

  const reset = () => {
    setPreview(null);
    setResult(null);
  };
  const toggle = (key) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    reset();
  };
  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      selectable.forEach((r) => (allSelected ? next.delete(r.key) : next.add(r.key)));
      return next;
    });
    reset();
  };

  async function onFiles(files) {
    setError('');
    const reports = [];
    let firstNew = null;
    for (const file of files) {
      try {
        const parsed = await readRecipientFile(file);
        for (const p of parsed) {
          const id = `up:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
          const rows = p.recipients.map((r) => ({ ...r, key: `${id}:${r.email}`, source: id, active: true }));
          setLists((prev) => [...prev, { id, name: p.name, rows, extras: p.extras || [] }]);
          firstNew = firstNew || id;
          reports.push({ ok: true, name: p.name, count: rows.length, read: p.read, invalid: p.invalid, duplicates: p.duplicates, columns: p.columns, headers: p.headers });
        }
        if (!parsed.length) reports.push({ ok: false, name: file.name, why: t('trainerEmail.upload.empty') });
      } catch (err) {
        reports.push({ ok: false, name: file.name, why: err.code === 'unsupported' ? t('trainerEmail.upload.unsupported') : t('trainerEmail.upload.unreadable') });
      }
    }
    if (firstNew) setTab(firstNew);
    setUploadReport(reports);
    if (fileRef.current) fileRef.current.value = '';
  }

  function removeList(id) {
    setLists((prev) => prev.filter((l) => l.id !== id));
    setSelected((prev) => new Set([...prev].filter((k) => !k.startsWith(`${id}:`))));
    if (tab === id) setTab('db');
    reset();
  }

  const payload = () => ({
    templateId,
    trainerIds: chosen.filter((r) => r.source === 'db').map((r) => r.id),
    recipients: chosen
      .filter((r) => r.source !== 'db')
      .map(({ name, email, country: c, year: y, program: p, extra }) => ({ name, email, country: c, year: y, program: p, extra })),
  });

  async function runPreview() {
    setError('');
    setResult(null);
    setBusy('preview');
    try {
      const { data } = await api.post('/admin/trainers/preview', payload());
      setPreview(data.data);
    } catch (err) {
      setError(err.response?.data?.error || t('form.saveFailed'));
    } finally {
      setBusy('');
    }
  }

  async function send() {
    setConfirmSend(false);
    setError('');
    setBusy('send');
    try {
      const { data } = await api.post('/admin/trainers/send', { ...payload(), format: format || undefined });
      setResult(data.data);
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.error || t('form.saveFailed'));
    } finally {
      setBusy('');
    }
  }

  if (!loaded) return <p className="text-muted">{t('list.loading')}</p>;
  const colName = (f, report) => (report.columns?.[f] !== undefined ? report.headers?.[report.columns[f]] : null);

  return (
    <div className="max-w-7xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{t('trainerEmail.title')}</h1>
          <p className="mt-1 max-w-[70ch] text-sm text-muted">{t('trainerEmail.subtitle')}</p>
        </div>
        <Button variant="secondary" onClick={() => fileRef.current?.click()}>
          <Icon d={ICONS.upload} />
          {t('trainerEmail.upload.button')}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.xlsx,.txt,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          multiple
          className="hidden"
          onChange={(e) => e.target.files?.length && onFiles([...e.target.files])}
        />
      </div>

      {/* The lists: stored trainers, then each uploaded file */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setTab('db')}
          aria-pressed={tab === 'db'}
          className={`inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
            tab === 'db' ? 'border-accent bg-accent text-on-accent' : 'border-rule bg-surface text-ink-soft hover:border-accent'
          }`}
        >
          <Icon d={ICONS.users} />
          {t('trainerEmail.tabTrainers')}
          <span className="numerals text-xs opacity-75">{dbRows.length}</span>
        </button>
        {lists.map((l) => (
          <span
            key={l.id}
            className={`inline-flex items-center overflow-hidden rounded-md border text-sm font-medium transition-colors ${
              tab === l.id ? 'border-accent bg-accent text-on-accent' : 'border-rule bg-surface text-ink-soft'
            }`}
          >
            <button type="button" onClick={() => setTab(l.id)} aria-pressed={tab === l.id} className="inline-flex items-center gap-2 px-3.5 py-2">
              <Icon d={ICONS.file} />
              <span className="max-w-[14rem] truncate">{l.name}</span>
              <span className="numerals text-xs opacity-75">{l.rows.length}</span>
            </button>
            <button type="button" onClick={() => removeList(l.id)} aria-label={t('trainerEmail.upload.remove')} title={t('trainerEmail.upload.remove')} className="px-2 py-2 opacity-70 hover:opacity-100">
              <Icon d={ICONS.x} className="h-[0.85rem] w-[0.85rem]" />
            </button>
          </span>
        ))}
        {lists.length > 0 && <span className="text-xs text-muted">{t('trainerEmail.upload.notSaved')}</span>}
      </div>

      {/* Upload report */}
      {uploadReport && (
        <div className="mb-4 flex flex-col gap-2 rounded-md border border-rule bg-surface p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-ink">{t('trainerEmail.upload.reportTitle')}</p>
            <button type="button" onClick={() => setUploadReport(null)} aria-label={t('enrollments.cancel')} className="text-muted hover:text-ink">
              <Icon d={ICONS.x} />
            </button>
          </div>
          {uploadReport.map((r, i) =>
            r.ok ? (
              <div key={i} className="text-sm text-ink-soft">
                <p>
                  <span className="font-medium text-ink">{r.name}</span> — {t('trainerEmail.upload.summary', { count: r.count, read: r.read })}
                  {r.invalid > 0 && <span className="text-warning"> · {t('trainerEmail.upload.invalid', { count: r.invalid })}</span>}
                  {r.duplicates > 0 && <span className="text-muted"> · {t('trainerEmail.upload.duplicates', { count: r.duplicates })}</span>}
                </p>
                <p className="mt-1 flex flex-wrap gap-1.5 text-xs text-muted">
                  {['name', 'email', 'country', 'year', 'program'].map((f) => {
                    const col = colName(f, r);
                    return (
                      <span key={f} className={`rounded-pill border px-2 py-0.5 ${col ? 'border-success text-success' : 'border-rule'}`}>
                        {t(`trainerEmail.col.${f}`)}: {col || t('trainerEmail.upload.notFound')}
                      </span>
                    );
                  })}
                </p>
                {r.count === 0 && <p className="mt-1 text-xs text-error">{t('trainerEmail.upload.noEmails')}</p>}
              </div>
            ) : (
              <p key={i} className="text-sm text-error">
                {r.name} — {r.why}
              </p>
            )
          )}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Recipients */}
        <div className="min-w-0">
          {tabRows.length === 0 && tab === 'db' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (e.dataTransfer.files?.length) onFiles([...e.dataTransfer.files]);
              }}
              className={`rounded-md border border-dashed p-10 text-center ${dragging ? 'border-accent bg-accent-wash' : 'border-rule bg-surface'}`}
            >
              <p className="text-muted">{t('trainerEmail.noTrainers')}</p>
              <p className="mt-2 text-sm text-muted">{t('trainerEmail.upload.dropHint')}</p>
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border border-rule bg-surface p-3">
                <label className="relative min-w-[12rem] flex-1">
                  <span className="sr-only">{t('list.search')}</span>
                  <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-muted">
                    <Icon d={ICONS.search} />
                  </span>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('list.search')}
                    className="w-full rounded-md border border-rule bg-bg py-2 pe-3 ps-9 text-sm text-ink focus-visible:border-accent"
                  />
                </label>
                <select aria-label={t('field.country')} value={country} onChange={(e) => setCountry(e.target.value)} className={`${selectClass} ${country ? 'border-accent text-accent' : ''}`}>
                  <option value="">{t('field.country')}: {t('list.any')}</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select aria-label={t('trainerEmail.col.year')} value={year} onChange={(e) => setYear(e.target.value)} className={`${selectClass} ${year ? 'border-accent text-accent' : ''}`}>
                  <option value="">{t('trainerEmail.col.year')}: {t('list.any')}</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                {programs.length > 0 && (
                  <select aria-label={t('field.program')} value={program} onChange={(e) => setProgram(e.target.value)} className={`${selectClass} ${program ? 'border-accent text-accent' : ''}`}>
                    <option value="">{t('field.program')}: {t('list.any')}</option>
                    {programs.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                )}
                <select aria-label={t('list.sortBy')} value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
                  <option value="name">{t('list.sortBy')}: {t('field.name')} ↑</option>
                  <option value="country">{t('list.sortBy')}: {t('field.country')} ↑</option>
                  <option value="-year">{t('list.sortBy')}: {t('trainerEmail.col.year')} ↓</option>
                  <option value="year">{t('list.sortBy')}: {t('trainerEmail.col.year')} ↑</option>
                </select>
              </div>

              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1 text-sm">
                <button type="button" onClick={toggleAll} className="font-medium text-accent hover:underline">
                  {allSelected ? t('trainerEmail.selectNone') : t('trainerEmail.selectAll')}
                </button>
                <span className="text-xs text-muted">
                  {t('list.resultCount', { count: visible.length })}
                  {chosen.length > 0 && ` · ${t('trainerEmail.selectedTotal', { count: chosen.length })}`}
                </span>
              </div>

              <div className="overflow-hidden rounded-md border border-rule bg-surface">
                <div className="max-h-[36rem] overflow-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 z-10 bg-sunk text-2xs caps-label text-muted">
                      <tr>
                        <th className="w-[2.75rem] px-4 py-3 text-start">
                          <input type="checkbox" className="h-[1rem] w-[1rem] align-middle" checked={allSelected} onChange={toggleAll} aria-label={t('list.selectAll')} />
                        </th>
                        <th className="px-3 py-3 text-start font-medium">{t('field.name')}</th>
                        <th className="px-3 py-3 text-start font-medium">{t('field.country')}</th>
                        <th className="px-3 py-3 text-start font-medium">{t('trainerEmail.col.year')}</th>
                        <th className="hidden px-3 py-3 text-start font-medium lg:table-cell">{t('field.program')}</th>
                        <th className="hidden px-4 py-3 text-end font-medium md:table-cell">{tab === 'db' ? t('field.lastEmailedAt') : ''}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((r) => {
                        const disabled = r.active === false;
                        return (
                          <tr
                            key={r.key}
                            onClick={(e) => !disabled && !e.target.closest('input') && toggle(r.key)}
                            className={`border-t border-rule transition-colors ${disabled ? 'opacity-50' : 'cursor-pointer'} ${selected.has(r.key) ? 'bg-accent-wash' : disabled ? '' : 'hover:bg-sunk'}`}
                          >
                            <td className="px-4 py-2.5">
                              <input type="checkbox" className="h-[1rem] w-[1rem] align-middle" disabled={disabled} checked={selected.has(r.key)} onChange={() => toggle(r.key)} aria-label={r.name || r.email} />
                            </td>
                            <td className="px-3 py-2.5">
                              <div className="flex min-w-0 items-center gap-3">
                                <Avatar name={r.name || r.email} className="h-[2rem] w-[2rem] text-xs" rounded="rounded-full" />
                                <div className="min-w-0">
                                  <p className="truncate font-medium text-ink">{r.name || '—'}</p>
                                  <p dir="ltr" className="truncate text-xs text-muted text-start">{r.email}</p>
                                </div>
                                {disabled && <Pill tone="clay">{t('trainerEmail.suspended')}</Pill>}
                              </div>
                            </td>
                            <td className="px-3 py-2.5 text-ink-soft">{r.country || <span className="text-muted">—</span>}</td>
                            <td className="numerals px-3 py-2.5 text-ink-soft">{r.year || <span className="text-muted">—</span>}</td>
                            <td className="hidden max-w-[16rem] truncate px-3 py-2.5 text-ink-soft lg:table-cell">{r.program || <span className="text-muted">—</span>}</td>
                            <td className="hidden whitespace-nowrap px-4 py-2.5 text-end text-xs text-muted md:table-cell">
                              {r.lastEmailedAt ? new Date(r.lastEmailedAt).toLocaleDateString(locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { dateStyle: 'medium' }) : ''}
                            </td>
                          </tr>
                        );
                      })}
                      {visible.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-10 text-center text-muted">
                            {t('list.emptyFiltered')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dropping a file onto the page adds it as a list, too. */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  if (e.dataTransfer.files?.length) onFiles([...e.dataTransfer.files]);
                }}
                onClick={() => fileRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileRef.current?.click()}
                className={`mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed px-4 py-4 text-sm transition-colors ${
                  dragging ? 'border-accent bg-accent-wash text-accent' : 'border-rule text-muted hover:border-accent hover:text-accent'
                }`}
              >
                <Icon d={ICONS.upload} />
                {t('trainerEmail.upload.dropHint')}
              </div>
            </>
          )}
        </div>

        {/* The message */}
        <div className="flex flex-col gap-4 xl:sticky xl:top-20 xl:self-start">
          <div className="flex flex-col gap-4 rounded-md border border-rule bg-surface p-4">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-display text-md text-ink">{t('trainerEmail.messageHeading')}</h2>
              <span className="numerals text-sm text-muted">{t('trainerEmail.selectedTotal', { count: chosen.length })}</span>
            </div>
            <Select
              label={t('trainerEmail.template')}
              value={templateId}
              onChange={(e) => {
                setTemplateId(e.target.value);
                setFormat('');
                reset();
              }}
            >
              <option value="">—</option>
              {templates.map((tpl) => (
                <option key={tpl._id} value={tpl._id}>
                  {tpl.name}
                </option>
              ))}
            </Select>

            {templates.length === 0 && (
              <p className="text-xs text-muted">
                {t('trainerEmail.noTemplates')}{' '}
                <Link to="/admin/email-templates/new" className="text-accent hover:underline">
                  {t('list.new')}
                </Link>
              </p>
            )}

            {chosenTemplate && (
              <>
                <Select label={t('trainerEmail.format')} value={format || chosenTemplate.format} onChange={(e) => setFormat(e.target.value)}>
                  <option value="html">{t('trainerEmail.formatHtml')}</option>
                  <option value="text">{t('trainerEmail.formatText')}</option>
                </Select>
                <p className="text-xs text-muted">
                  {t('trainerEmail.subjectLabel')}: <span className="text-ink-soft">{chosenTemplate.subject}</span>
                </p>
              </>
            )}

            <div className="flex flex-wrap gap-2 border-t border-rule pt-4">
              <Button variant="secondary" onClick={runPreview} disabled={!templateId || !chosen.length || busy === 'preview'}>
                {busy === 'preview' ? t('trainerEmail.previewing') : t('trainerEmail.preview')}
              </Button>
              <Button onClick={() => setConfirmSend(true)} disabled={!templateId || !chosen.length || busy === 'send'}>
                {busy === 'send' ? t('trainerEmail.sending') : t('trainerEmail.send', { count: chosen.length })}
              </Button>
            </div>
          </div>

          {/* What a template can say */}
          <div className="rounded-md border border-rule bg-surface p-4">
            <p className="mb-2 text-xs caps-label text-muted">{t('trainerEmail.placeholders')}</p>
            <div className="flex flex-wrap gap-1.5">
              {BASE_PLACEHOLDERS.map((p) => (
                <code key={p} dir="ltr" className="rounded-sm bg-sunk px-1.5 py-0.5 text-2xs text-ink-soft">{`{{${p}}}`}</code>
              ))}
              {extraKeys.map((x) => (
                <code key={x.key} dir="ltr" title={x.label} className="rounded-sm bg-accent-wash px-1.5 py-0.5 text-2xs text-accent">{`{{${x.key}}}`}</code>
              ))}
            </div>
            {extraKeys.length > 0 && <p className="mt-2 text-2xs text-muted">{t('trainerEmail.extraHint')}</p>}
          </div>

          {error && (
            <p className="rounded-sm bg-error-wash px-4 py-2 text-sm text-error" role="alert">
              {error}
            </p>
          )}

          {result && (
            <div className="rounded-md border border-rule bg-surface p-4">
              <p className="text-sm font-medium text-success">{t('trainerEmail.sentCount', { count: result.sent })}</p>
              {result.failed?.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-error">{t('trainerEmail.failedCount', { count: result.failed.length })}</p>
                  <ul className="mt-1 flex max-h-40 flex-col gap-1 overflow-y-auto">
                    {result.failed.map((f) => (
                      <li key={f.email} dir="ltr" className="text-xs text-muted">
                        {f.email} — {f.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* What recipients would actually get. */}
      {preview && (
        <div className="mt-6">
          <h2 className="mb-3 font-display text-lg text-ink">{t('trainerEmail.previewHeading')}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {preview.map((p) => (
              <div key={p.to} className="rounded-md border border-rule bg-surface p-4">
                <p dir="ltr" className="text-xs text-muted">
                  {t('trainerEmail.to')}: {p.to}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">{p.subject}</p>
                {(format || chosenTemplate?.format) === 'html' ? (
                  /* The body is rendered as markup because that is what the
                     recipient will see; placeholder values were escaped on
                     the server before being substituted in. */
                  <div
                    className="prose-sm mt-3 max-w-none rounded-sm border border-rule bg-bg p-4 text-sm text-ink-soft"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: p.html }}
                  />
                ) : (
                  <pre className="mt-3 whitespace-pre-wrap rounded-sm border border-rule bg-bg p-4 text-sm text-ink-soft">{p.text}</pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={confirmSend} onClose={() => setConfirmSend(false)} title={t('trainerEmail.send', { count: chosen.length })}>
        <div className="flex flex-col gap-5">
          <p className="text-sm text-ink-soft">{t('trainerEmail.confirmSend', { count: chosen.length })}</p>
          <div className="flex flex-wrap justify-end gap-2 border-t border-rule pt-4">
            <Button variant="ghost" onClick={() => setConfirmSend(false)}>
              {t('enrollments.cancel')}
            </Button>
            <Button onClick={send}>{t('trainerEmail.send', { count: chosen.length })}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
