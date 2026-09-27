import mongoose from 'mongoose';
import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ok, fail, paginate } from './apiResponse.js';

/**
 * Builds a generic admin CRUD router for a Mongoose model.
 * Public routers still define their own bespoke GET handlers;
 * this only covers the /admin/* surface described in section 9.
 */
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** A query-string value as the stored type: "true"/"false" as booleans, "a,b" as a list. */
function filterValue(raw) {
  if (raw === 'true') return true;
  if (raw === 'false') return { $ne: true };
  if (raw === '__empty') return { $in: [null, ''] };
  const parts = String(raw).split(',').filter(Boolean);
  return parts.length > 1 ? { $in: parts } : parts[0];
}

/**
 * Builds a generic admin CRUD router for a Mongoose model.
 * Public routers still define their own bespoke GET handlers;
 * this only covers the /admin/* surface described in section 9.
 *
 * Options:
 *   searchFields — matched (case-insensitive) by `?q=`
 *   filterFields — the only fields `?field=value` may filter on; a value may
 *                  be a list ("a,b"), "true"/"false", or "__empty"
 *   dateFields   — fields `?from=` / `?to=` (with `?dateField=`) may range on;
 *                  the first is the default (createdAt unless given)
 *   sortFields   — the only fields `?sort=` may order by (± prefix)
 *   countBy      — fields `?countBy=` may count records per value of, for
 *                  status cards; the count ignores that field's own filter
 *   distinctFields — fields `?distinct=` may list the values of, for filters
 *   bulkFields   — the only fields POST /bulk-update may set
 */
export function adminCrudRouter(
  model,
  {
    searchFields = [],
    populate = [],
    filterFields = [],
    dateFields = ['createdAt'],
    sortFields = [],
    countBy = [],
    distinctFields = [],
    bulkFields = [],
  } = {}
) {
  const router = Router();
  router.use(requireAuth, requireRole('admin', 'editor'));

  /**
   * An id filter as real ObjectIds. find() casts strings itself, but the
   * aggregation behind the status counts does not — without this, counting
   * under a linked-record filter (a course's category, say) matches nothing.
   */
  function castIds(field, value) {
    if (model.schema.path(field)?.instance !== 'ObjectId') return value;
    const cast = (v) => (mongoose.isValidObjectId(v) ? new mongoose.Types.ObjectId(String(v)) : v);
    if (value && typeof value === 'object' && Array.isArray(value.$in)) return { $in: value.$in.map(cast) };
    return typeof value === 'string' ? cast(value) : value;
  }

  /** The filter a request asks for, built only from declared fields. */
  function filterFrom(query, { except } = {}) {
    const filter = {};
    if (query.q && searchFields.length) {
      const rx = { $regex: escapeRegex(query.q), $options: 'i' };
      filter.$or = searchFields.map((f) => ({ [f]: rx }));
    }
    for (const f of filterFields) {
      if (f !== except && query[f] !== undefined && query[f] !== '') filter[f] = castIds(f, filterValue(query[f]));
    }
    const dateField = dateFields.includes(query.dateField) ? query.dateField : dateFields[0];
    if (dateField && (query.from || query.to)) {
      const range = {};
      if (query.from && !Number.isNaN(Date.parse(query.from))) range.$gte = new Date(query.from);
      if (query.to && !Number.isNaN(Date.parse(query.to))) {
        const end = new Date(query.to);
        end.setHours(23, 59, 59, 999);
        range.$lte = end;
      }
      if (Object.keys(range).length) filter[dateField] = range;
    }
    return filter;
  }

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      // Distinct values of one field, for a filter's dropdown.
      if (req.query.distinct) {
        if (!distinctFields.includes(req.query.distinct)) return fail(res, 400, 'Unknown field');
        const values = (await model.distinct(req.query.distinct)).filter((v) => v !== null && v !== '').sort();
        return ok(res, values);
      }

      const { page, limit, skip } = paginate(req.query);
      const filter = filterFrom(req.query);
      const sortKey = String(req.query.sort || '').replace(/^-/, '');
      const sort = sortFields.includes(sortKey) || sortKey === 'createdAt' ? req.query.sort : '-createdAt';

      let q = model.find(filter).sort(sort).skip(skip).limit(limit);
      populate.forEach((p) => { q = q.populate(p); });

      const countField = countBy.includes(req.query.countBy) ? req.query.countBy : null;
      const [items, total, counts] = await Promise.all([
        q,
        model.countDocuments(filter),
        countField
          ? model.aggregate([
              { $match: filterFrom(req.query, { except: countField }) },
              { $group: { _id: `$${countField}`, n: { $sum: 1 } } },
            ])
          : null,
      ]);
      const meta = { page, limit, total };
      if (counts) meta.counts = Object.fromEntries(counts.map((c) => [String(c._id ?? ''), c.n]));
      ok(res, items, { meta });
    })
  );

  /** Sets the same allowed fields on several records at once. */
  router.post(
    '/bulk-update',
    asyncHandler(async (req, res) => {
      const { ids = [], set = {} } = req.body || {};
      if (!Array.isArray(ids) || !ids.length) return fail(res, 400, 'Select at least one record');
      const update = {};
      for (const [k, v] of Object.entries(set)) {
        if (bulkFields.includes(k)) update[k] = v;
      }
      if (!Object.keys(update).length) return fail(res, 400, 'Nothing to change');
      // Run validators so a bulk change cannot set a value the schema refuses.
      const result = await model.updateMany({ _id: { $in: ids } }, { $set: update }, { runValidators: true });
      ok(res, { updated: result.modifiedCount });
    })
  );

  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      let q = model.findById(req.params.id);
      populate.forEach((p) => { q = q.populate(p); });
      const item = await q;
      if (!item) return fail(res, 404, 'Not found');
      ok(res, item);
    })
  );

  router.post(
    '/',
    asyncHandler(async (req, res) => {
      const item = await model.create(req.body);
      ok(res, item);
    })
  );

  router.put(
    '/:id',
    asyncHandler(async (req, res) => {
      const item = await model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) return fail(res, 404, 'Not found');
      ok(res, item);
    })
  );

  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      const item = await model.findByIdAndDelete(req.params.id);
      if (!item) return fail(res, 404, 'Not found');
      ok(res, { deleted: true });
    })
  );

  router.post(
    '/bulk-delete',
    asyncHandler(async (req, res) => {
      const { ids = [] } = req.body;
      await model.deleteMany({ _id: { $in: ids } });
      ok(res, { deleted: ids.length });
    })
  );

  return router;
}
