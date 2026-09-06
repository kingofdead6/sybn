import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ok, fail, paginate } from './apiResponse.js';

/**
 * Builds a generic admin CRUD router for a Mongoose model.
 * Public routers still define their own bespoke GET handlers;
 * this only covers the /admin/* surface described in section 9.
 */
export function adminCrudRouter(model, { searchFields = [], populate = [] } = {}) {
  const router = Router();
  router.use(requireAuth, requireRole('admin', 'editor'));

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const { page, limit, skip } = paginate(req.query);
      const filter = {};
      if (req.query.q && searchFields.length) {
        filter.$or = searchFields.map((f) => ({ [f]: { $regex: req.query.q, $options: 'i' } }));
      }
      let q = model.find(filter).sort(req.query.sort || '-createdAt').skip(skip).limit(limit);
      populate.forEach((p) => { q = q.populate(p); });
      const [items, total] = await Promise.all([q, model.countDocuments(filter)]);
      ok(res, items, { meta: { page, limit, total } });
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
