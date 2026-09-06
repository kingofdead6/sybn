export function ok(res, data, extra = {}) {
  return res.json({ success: true, data, error: null, ...extra });
}

export function fail(res, status, error) {
  return res.status(status).json({ success: false, data: null, error });
}

export function paginate(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
