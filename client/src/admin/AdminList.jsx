import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { RESOURCE_SCHEMAS, COMPUTED_VALUES, LIST_VIEWS } from './resourceSchemas';
import { useAdminLocale } from './AdminLocaleContext';
import Button from '../components/ui/Button';
import Pill from '../components/ui/Pill';
import Modal from '../components/ui/Modal';
import Avatar from '../components/ui/Avatar';
import Pagination from '../components/ui/Pagination';

const LIMIT = 20;

// ---------------------------------------------------------------------------
// Values and their look
// ---------------------------------------------------------------------------

/** Status-like values → the pill tone that reads right for them. */
const GOOD = new Set(['issued', 'confirmed', 'valid', 'active', 'open', 'completed', 'accepted', 'true']);
const BAD = new Set(['rejected', 'cancelled', 'revoked', 'suspended', 'full']);
const WARN = new Set(['announced-soon', 'pending', 'false']);
function toneOf(value) {
  const v = String(value);
  if (GOOD.has(v)) return 'success';
  if (BAD.has(v)) return 'clay';
  if (WARN.has(v)) return 'default';
  return 'saffron';
}
const ACCENT = { success: 'bg-success', clay: 'bg-error', default: 'bg-warning', saffron: 'bg-accent' };

const bilingual = (v, locale) =>
  v && typeof v === 'object' && ('ar' in v || 'en' in v) ? v[locale] || v.ar || v.en || '' : null;

/** A linked record's name: its title, or its code, name, month or slug. */
const refName = (v, locale) =>
  v && typeof v === 'object'
    ? bilingual(v.title, locale) || v.code || v.name || COMPUTED_VALUES.forumName?.(v) || v.slug || ''
    : '';

const isDateKey = (key) => /At$|Date$/.test(key);
const fmtDate = (d, locale, style = 'medium') =>
  d ? new Date(d).toLocaleDateString(locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { dateStyle: style }) : '';

function ago(d, locale) {
  if (!d) return '';
  const days = Math.round((Date.now() - new Date(d).getTime()) / 86400000);
  const rtf = new Intl.RelativeTimeFormat(locale === 'ar' ? 'ar-u-nu-latn' : 'en', { numeric: 'auto' });
  if (Math.abs(days) < 1) return rtf.format(0, 'day');
  if (Math.abs(days) < 30) return rtf.format(-days, 'day');
  if (Math.abs(days) < 365) return rtf.format(-Math.round(days / 30), 'month');
  return rtf.format(-Math.round(days / 365), 'year');
}

/** A value's label in the panel's language (a status, a track, yes/no…). */
function valueLabel(t, field, value) {
  const v = String(value);
  return t(`value.${field}.${v}`, {
    defaultValue: t(`value.status.${v}`, { defaultValue: v === 'true' ? t('yes') : v === 'false' ? t('no') : v }),
  });
}

function Icon({ d, className = 'h-[1rem] w-[1rem]' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const ICONS = {
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  plus: 'M12 5v14M5 12h14',
  filter: 'M22 3H2l8 9.5V19l4 2v-8.5z',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  inbox: 'M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13L22 12v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6z',
};

/** One table cell, drawn for the kind of value it holds. */
function Cell({ item, col, field, locale, t }) {
  if (COMPUTED_VALUES[col]) {
    const v = COMPUTED_VALUES[col](item, locale, t);
    return <span className="text-ink-soft">{v || '—'}</span>;
  }
  const v = col.split('.').reduce((acc, k) => acc?.[k], item);
  if (v === undefined || v === null || v === '') return <span className="text-muted">—</span>;

  if (typeof v === 'boolean' || field?.type === 'checkbox') {
    return <Pill tone={v ? 'success' : 'default'}>{valueLabel(t, col, !!v)}</Pill>;
  }
  if (field?.type === 'select' || ['status', 'role', 'format', 'tab', 'track'].includes(col)) {
    return <Pill tone={toneOf(v)}>{valueLabel(t, col, v)}</Pill>;
  }
  if (typeof v === 'object' && !Array.isArray(v)) {
    const text = bilingual(v, locale) ?? refName(v, locale);
    return <span className="text-ink-soft">{text || '—'}</span>;
  }
  if (isDateKey(col) && !Number.isNaN(Date.parse(v))) {
    return (
      <span className="whitespace-nowrap text-ink-soft" title={fmtDate(v, locale, 'long')}>
        {ago(v, locale)}
      </span>
    );
  }
  if (typeof v === 'number') return <span className="numerals text-ink-soft">{v}</span>;
  return <span className="text-ink-soft">{String(v)}</span>;
}

/** The first column: a picture or initials, the record's name, and a second line. */
function PrimaryCell({ item, primary, locale, t }) {
  const pick = (key) => {
    if (!key) return '';
    if (COMPUTED_VALUES[key]) return COMPUTED_VALUES[key](item, locale, t);
    const v = key.split('.').reduce((acc, k) => acc?.[k], item);
    return bilingual(v, locale) ?? (v && typeof v === 'object' ? refName(v, locale) : v ?? '');
  };
  const title = pick(primary.title) || item.slug || item.name || '—';
  const subtitle = pick(primary.subtitle);
  const image = primary.image ? item[primary.image] : '';
  return (
    <div className="flex min-w-0 items-center gap-3">
      {primary.image ? (
        image ? (
          <img src={image} alt="" loading="lazy" className="h-[2.5rem] w-[2.5rem] shrink-0 rounded-md bg-sunk object-cover" />
        ) : (
          <span className="flex h-[2.5rem] w-[2.5rem] shrink-0 items-center justify-center rounded-md bg-sunk text-muted">
            <Icon d={ICONS.inbox} />
          </span>
        )
      ) : primary.avatar ? (
        <Avatar name={String(title)} className="h-[2.25rem] w-[2.25rem] text-xs" rounded="rounded-full" />
      ) : null}
      <div className="min-w-0">
        <p className="truncate font-medium text-ink">
          {title}
          {primary.meta && item[primary.meta] && (
            <span className="ms-2 rounded-sm bg-sunk px-1.5 py-0.5 text-2xs font-normal text-muted">{item[primary.meta]}</span>
          )}
        </p>
        {subtitle && (
          <p dir={/^[\x20-\x7E]*$/.test(String(subtitle)) ? 'ltr' : undefined} className="truncate text-xs text-muted text-start">
            {String(subtitle)}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

const selectClass =
  'min-w-[10rem] max-w-full rounded-md border border-rule bg-bg px-3 py-2 text-sm text-ink transition-colors focus-visible:border-accent';

function FilterControl({ filter, value, onChange, t, options }) {
  const label = t(`field.${filter.field}`, { defaultValue: filter.field });
  const active = !!value;
  const cls = `${selectClass} ${active ? 'border-accent text-accent' : ''}`;
  let choices;
  if (filter.type === 'boolean') {
    choices = [
      { value: 'true', label: valueLabel(t, filter.field, true) },
      { value: 'false', label: valueLabel(t, filter.field, false) },
    ];
  } else if (filter.type === 'select') {
    choices = filter.options.map((o) => ({ value: o, label: valueLabel(t, filter.field, o) }));
  } else {
    choices = options || [];
  }
  return (
    <select aria-label={label} value={value || ''} onChange={(e) => onChange(e.target.value)} className={cls}>
      <option value="">
        {label}: {t('list.any')}
      </option>
      {choices.map((o) => (
        <option key={o.value} value={o.value}>
          {label}: {o.label}
        </option>
      ))}
    </select>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/**
 * The list for any admin resource, drawn from its schema and list view:
 * summary cards per status, search, the resource's own filters and sorts,
 * selection with bulk changes and bulk delete, and a table whose cells are
 * drawn for what they hold. Everything filtered on lives in the URL.
 */
export default function AdminList() {
  const { resource } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('admin');
  const { locale } = useAdminLocale();
  const schema = RESOURCE_SCHEMAS[resource];
  const view = useMemo(
    () =>
      LIST_VIEWS[resource] || {
        primary: { title: schema?.listColumns?.[0] },
        columns: (schema?.listColumns || []).slice(1),
      },
    [resource, schema]
  );
  const fieldDef = (name) => schema?.fields?.find((f) => f.name === name);

  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const status = params.get('status') || '';
  const sort = params.get('sort') || view.sorts?.[0] || '-createdAt';
  const page = Number(params.get('page')) || 1;
  const from = params.get('from') || '';
  const to = params.get('to') || '';
  const dateFilter = (view.filters || []).find((f) => f.type === 'date');
  const valueFilters = useMemo(() => (view.filters || []).filter((f) => f.type !== 'date'), [view]);

  const setParam = useCallback(
    (patch, keepPage = false) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [k, v] of Object.entries(patch)) {
            if (v === '' || v === null || v === undefined) next.delete(k);
            else next.set(k, String(v));
          }
          if (!keepPage) next.delete('page');
          return next;
        },
        { replace: true }
      ),
    [setParams]
  );

  // Search is typed locally and pushed to the URL a moment later.
  const [draft, setDraft] = useState(q);
  useEffect(() => setDraft(q), [q, resource]);
  useEffect(() => {
    if (draft === q) return undefined;
    const id = setTimeout(() => setParam({ q: draft }), 300);
    return () => clearTimeout(id);
  }, [draft, q, setParam]);

  const [data, setData] = useState({ items: [], total: 0, counts: null });
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({});
  const [selected, setSelected] = useState(new Set());
  const [confirm, setConfirm] = useState(null); // { kind: 'delete' | 'bulk', ids, set?, label? }
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionId, setActionId] = useState(null);

  // Options for the linked-record and stored-value filters.
  useEffect(() => {
    let active = true;
    setOptions({});
    for (const f of valueFilters) {
      if (f.type === 'reference') {
        api
          .get(`/admin/${f.resource}`, { params: { limit: 100 } })
          .then(({ data: d }) => {
            if (!active) return;
            const opts = (d.data || [])
              .map((r) => ({ value: r._id, label: refName(r, locale) || r._id }))
              .sort((a, b) => String(a.label).localeCompare(String(b.label)));
            setOptions((o) => ({ ...o, [f.field]: opts }));
          })
          .catch(() => {});
      } else if (f.type === 'distinct') {
        api
          .get(`/admin/${resource}`, { params: { distinct: f.field } })
          .then(({ data: d }) => active && setOptions((o) => ({ ...o, [f.field]: (d.data || []).map((v) => ({ value: v, label: v })) })))
          .catch(() => {});
      }
    }
    return () => {
      active = false;
    };
  }, [resource, locale, valueFilters]);

  const paramKey = params.toString();
  const load = useCallback(async () => {
    if (!schema) return;
    setLoading(true);
    try {
      const query = { page, limit: LIMIT, sort, q: q || undefined, from: from || undefined, to: to || undefined };
      if (dateFilter) query.dateField = dateFilter.field;
      if (view.status) {
        query.countBy = view.status.field;
        if (status) query[view.status.field] = status;
      }
      for (const f of valueFilters) {
        const v = params.get(`f.${f.field}`);
        if (v) query[f.field] = v;
      }
      const { data: d } = await api.get(`/admin/${resource}`, { params: query });
      setData({ items: d.data || [], total: d.meta?.total || 0, counts: d.meta?.counts || null });
    } catch {
      setData({ items: [], total: 0, counts: null });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, paramKey]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => setSelected(new Set()), [resource, paramKey]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(id);
  }, [toast]);

  if (!schema) {
    return (
      <p className="text-error">
        {t('list.unknownResource')} {resource}
      </p>
    );
  }

  const label = t(`resource.${resource}`, { defaultValue: schema.label });
  const rowAction = schema.rowAction;
  const activeFilters = valueFilters.filter((f) => params.get(`f.${f.field}`)).length + (from || to ? 1 : 0) + (q ? 1 : 0);
  const all = data.counts ? Object.values(data.counts).reduce((s, n) => s + n, 0) : null;
  const allChecked = data.items.length > 0 && data.items.every((i) => selected.has(i._id));
  const clearAll = () => {
    setDraft('');
    setParams({}, { replace: true });
  };

  async function runConfirmed() {
    setBusy(true);
    try {
      if (confirm.kind === 'delete') {
        if (confirm.ids.length === 1) await api.delete(`/admin/${resource}/${confirm.ids[0]}`);
        else await api.post(`/admin/${resource}/bulk-delete`, { ids: confirm.ids });
        setToast({ tone: 'success', text: t('list.deletedCount', { count: confirm.ids.length }) });
      } else {
        const { data: d } = await api.post(`/admin/${resource}/bulk-update`, { ids: confirm.ids, set: confirm.set });
        setToast({ tone: 'success', text: t('list.updatedCount', { count: d.data.updated }) });
      }
      setConfirm(null);
      setSelected(new Set());
      load();
    } catch (err) {
      setToast({ tone: 'error', text: err.response?.data?.error || t('form.saveFailed') });
    } finally {
      setBusy(false);
    }
  }

  async function runRowAction(id) {
    setActionId(id);
    try {
      const { data: d } = await api.post(`${rowAction.endpoint}/${id}`);
      const result = d.data || {};
      setToast(
        result.emailed === false
          ? { tone: 'error', text: t(`action.${rowAction.key}NotEmailed`, { ...result, defaultValue: result.emailError }) }
          : { tone: 'success', text: t(`action.${rowAction.key}Done`, { ...result, defaultValue: t('settings.saved') }) }
      );
      load();
    } catch (err) {
      setToast({ tone: 'error', text: err.response?.data?.error || t('form.saveFailed') });
    } finally {
      setActionId(null);
    }
  }

  const bulkLabel = (b) =>
    t(`list.bulkSet.${b.field}.${b.value}`, {
      defaultValue: `${t(`field.${b.field}`, { defaultValue: b.field })}: ${valueLabel(t, b.field, b.value)}`,
    });

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold text-ink">{label}</h1>
          {i18n.exists(`resourceIntro.${resource}`, { ns: 'admin' }) && (
            <p className="mt-1 max-w-[64ch] text-sm text-muted">{t(`resourceIntro.${resource}`)}</p>
          )}
        </div>
        <Button as={Link} to={`/admin/${resource}/new`}>
          <Icon d={ICONS.plus} />
          {t('list.new')}
        </Button>
      </div>

      {/* Status cards — also the status filter */}
      {view.status && (
        <div className={`mb-5 grid gap-3 ${view.status.options.length > 3 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
          {view.status.options.map((opt) => {
            const key = String(opt);
            const on = status === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setParam({ status: on ? '' : key })}
                aria-pressed={on}
                className={`relative overflow-hidden rounded-md border bg-surface p-4 text-start transition-all ${
                  on ? 'border-accent shadow-raised ring-1 ring-accent' : 'border-rule hover:border-rule-strong'
                }`}
              >
                <span className={`absolute inset-x-0 top-0 h-[3px] ${ACCENT[toneOf(opt)]}`} aria-hidden="true" />
                <span className="block text-xs text-muted">{valueLabel(t, view.status.field, opt)}</span>
                <span className="numerals mt-1 block font-display text-3xl leading-none text-ink">{data.counts?.[key] ?? 0}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 rounded-md border border-rule bg-surface p-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-[14rem] flex-1">
            <span className="sr-only">{t('list.search')}</span>
            <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-muted">
              <Icon d={ICONS.search} />
            </span>
            <input
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t('list.search')}
              className="w-full rounded-md border border-rule bg-bg py-2 pe-3 ps-9 text-sm text-ink transition-colors focus-visible:border-accent"
            />
          </label>
          {view.sorts?.length > 1 && (
            <select aria-label={t('list.sortBy')} value={sort} onChange={(e) => setParam({ sort: e.target.value })} className={selectClass}>
              {view.sorts.map((s) => {
                const key = s.replace(/^-/, '');
                return (
                  <option key={s} value={s}>
                    {t('list.sortBy')}: {t(`field.${key}`, { defaultValue: t(`sort.${key}`, { defaultValue: key }) })} {s.startsWith('-') ? '↓' : '↑'}
                  </option>
                );
              })}
            </select>
          )}
          {view.status && (
            <button
              type="button"
              onClick={() => setParam({ status: '' })}
              aria-pressed={!status}
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${!status ? 'border-accent text-accent' : 'border-rule text-ink-soft hover:border-accent'}`}
            >
              {t('list.all')} {all !== null && <span className="numerals text-xs opacity-70">{all}</span>}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-rule pt-3">
          {(valueFilters.length > 0 || dateFilter) && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <Icon d={ICONS.filter} className="h-[0.85rem] w-[0.85rem]" />
              {t('list.filters')}
            </span>
          )}
          {valueFilters.map((f) => (
            <FilterControl
              key={f.field}
              filter={f}
              value={params.get(`f.${f.field}`)}
              options={options[f.field]}
              onChange={(v) => setParam({ [`f.${f.field}`]: v })}
              t={t}
            />
          ))}
          {dateFilter && (
            <span className="inline-flex flex-wrap items-center gap-1.5 text-sm text-ink-soft">
              <span className="text-xs text-muted">{t(`field.${dateFilter.field}`, { defaultValue: dateFilter.field })}</span>
              <input type="date" aria-label={t('list.from')} value={from} onChange={(e) => setParam({ from: e.target.value })} className={`${selectClass} min-w-0 ${from ? 'border-accent' : ''}`} />
              <span className="text-muted">→</span>
              <input type="date" aria-label={t('list.to')} value={to} onChange={(e) => setParam({ to: e.target.value })} className={`${selectClass} min-w-0 ${to ? 'border-accent' : ''}`} />
            </span>
          )}
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={() => {
                setDraft('');
                setParams(status ? { status } : {}, { replace: true });
              }}
              className="ms-1 text-sm text-accent hover:underline"
            >
              {t('list.clearFilters', { count: activeFilters })}
            </button>
          )}
          <span className="ms-auto text-xs text-muted">{t('list.resultCount', { count: data.total })}</span>
        </div>
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="sticky top-16 z-20 mb-4 flex flex-wrap items-center gap-2 rounded-md border border-accent bg-accent-wash px-4 py-3 shadow-raised">
          <span className="me-2 text-sm font-medium text-ink">{t('list.selected', { count: selected.size })}</span>
          {(view.bulk || []).map((b) => (
            <Button
              key={`${b.field}-${b.value}`}
              size="sm"
              variant="secondary"
              onClick={() => setConfirm({ kind: 'bulk', ids: [...selected], set: { [b.field]: b.value }, label: bulkLabel(b) })}
            >
              {bulkLabel(b)}
            </Button>
          ))}
          <Button size="sm" variant="danger" onClick={() => setConfirm({ kind: 'delete', ids: [...selected] })}>
            <Icon d={ICONS.trash} className="h-[0.9rem] w-[0.9rem]" />
            {t('list.deleteSelected')}
          </Button>
          <button type="button" onClick={() => setSelected(new Set())} className="ms-auto text-sm text-accent hover:underline">
            {t('list.clearSelection')}
          </button>
        </div>
      )}

      {/* Table */}
      {loading && !data.items.length ? (
        <div className="flex flex-col gap-2" aria-busy="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[3.5rem] animate-pulse rounded-md bg-surface" />
          ))}
        </div>
      ) : data.items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-rule bg-surface px-6 py-14 text-center">
          <span className="text-muted">
            <Icon d={ICONS.inbox} className="h-[2rem] w-[2rem]" />
          </span>
          <p className="font-medium text-ink">{activeFilters || status ? t('list.emptyFiltered') : t('list.empty')}</p>
          {activeFilters || status ? (
            <button type="button" onClick={clearAll} className="text-sm text-accent hover:underline">
              {t('list.clearAll')}
            </button>
          ) : (
            <Button as={Link} to={`/admin/${resource}/new`} size="sm">
              {t('list.new')}
            </Button>
          )}
        </div>
      ) : (
        <div className={`overflow-hidden rounded-md border border-rule bg-surface transition-opacity ${loading ? 'opacity-60' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-sunk text-2xs caps-label text-muted">
                <tr>
                  <th className="w-[2.75rem] px-4 py-3 text-start">
                    <input
                      type="checkbox"
                      className="h-[1rem] w-[1rem] align-middle"
                      checked={allChecked}
                      onChange={() => setSelected(allChecked ? new Set() : new Set(data.items.map((i) => i._id)))}
                      aria-label={t('list.selectAll')}
                    />
                  </th>
                  <th className="px-3 py-3 text-start font-medium">{t(`field.${view.primary.title}`, { defaultValue: t('list.name') })}</th>
                  {view.columns.map((c) => (
                    <th key={c} className="hidden px-3 py-3 text-start font-medium md:table-cell">
                      {t(`field.${c}`, { defaultValue: c })}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-end font-medium">{t('list.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr
                    key={item._id}
                    onClick={(e) => {
                      if (e.target.closest('button, a, input, label')) return;
                      navigate(`/admin/${resource}/${item._id}`);
                    }}
                    className={`cursor-pointer border-t border-rule align-middle transition-colors ${selected.has(item._id) ? 'bg-accent-wash' : 'hover:bg-sunk'}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="h-[1rem] w-[1rem] align-middle"
                        checked={selected.has(item._id)}
                        onChange={() =>
                          setSelected((s) => {
                            const next = new Set(s);
                            if (next.has(item._id)) next.delete(item._id);
                            else next.add(item._id);
                            return next;
                          })
                        }
                        aria-label={t('list.select')}
                      />
                    </td>
                    <td className="max-w-[22rem] px-3 py-3">
                      <PrimaryCell item={item} primary={view.primary} locale={locale} t={t} />
                    </td>
                    {view.columns.map((c) => (
                      <td key={c} className="hidden px-3 py-3 md:table-cell">
                        <Cell item={item} col={c} field={fieldDef(c)} locale={locale} t={t} />
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {rowAction && !rowAction.hideWhen?.(item) && (
                          <button
                            type="button"
                            onClick={() => runRowAction(item._id)}
                            disabled={actionId === item._id}
                            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-accent bg-accent px-2.5 py-1.5 text-xs font-medium text-on-accent transition-colors hover:bg-accent-deep disabled:opacity-50"
                          >
                            <Icon d={ICONS.check} className="h-[0.85rem] w-[0.85rem]" />
                            {actionId === item._id ? t('list.working') : t(`action.${rowAction.key}`, { defaultValue: rowAction.key })}
                          </button>
                        )}
                        <Link
                          to={`/admin/${resource}/${item._id}`}
                          title={t('list.edit')}
                          aria-label={t('list.edit')}
                          className="rounded-md border border-rule p-1.5 text-muted transition-colors hover:border-accent hover:text-accent"
                        >
                          <Icon d={ICONS.edit} className="h-[0.9rem] w-[0.9rem]" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setConfirm({ kind: 'delete', ids: [item._id] })}
                          title={t('list.delete')}
                          aria-label={t('list.delete')}
                          className="rounded-md border border-rule p-1.5 text-muted transition-colors hover:border-error hover:bg-error-wash hover:text-error"
                        >
                          <Icon d={ICONS.trash} className="h-[0.9rem] w-[0.9rem]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination page={page} limit={LIMIT} total={data.total} onPageChange={(p) => setParam({ page: p }, true)} />

      {/* Confirmation */}
      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.kind === 'delete' ? t('list.confirmDeleteTitle', { count: confirm?.ids.length }) : confirm?.label}
      >
        {confirm && (
          <div className="flex flex-col gap-5">
            <p className="text-sm text-ink-soft">
              {confirm.kind === 'delete'
                ? t('list.confirmDeleteBody', { count: confirm.ids.length })
                : t('list.confirmBulkBody', { count: confirm.ids.length })}
            </p>
            <div className="flex flex-wrap justify-end gap-2 border-t border-rule pt-4">
              <Button variant="ghost" onClick={() => setConfirm(null)}>
                {t('enrollments.cancel')}
              </Button>
              <Button variant={confirm.kind === 'delete' ? 'danger' : 'primary'} onClick={runConfirmed} disabled={busy}>
                {busy ? t('list.working') : confirm.kind === 'delete' ? t('list.delete') : t('list.apply')}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 end-5 z-50 flex max-w-sm items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-overlay ${
            toast.tone === 'error'
              ? 'border-[color-mix(in_srgb,var(--c-error)_40%,transparent)] bg-error-wash text-error'
              : 'border-[color-mix(in_srgb,var(--c-success)_40%,transparent)] bg-success-wash text-success'
          }`}
        >
          <Icon d={toast.tone === 'error' ? ICONS.x : ICONS.check} className="mt-0.5 h-[1rem] w-[1rem] shrink-0" />
          <span className="flex-1">{toast.text}</span>
          <button type="button" onClick={() => setToast(null)} aria-label={t('enrollments.cancel')} className="opacity-60 hover:opacity-100">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
