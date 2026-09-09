export function ok(res, data, extra = {}) {
  return res.json({ success: true, data, error: null, ...extra });
}

/**
 * `code` is an optional machine-readable identifier the client maps to a
 * translated message. `error` stays human-readable English for logs and for
 * clients that have no mapping for the code.
 */
export function fail(res, status, error, code) {
  return res.status(status).json({ success: false, data: null, error, ...(code ? { code } : {}) });
}

export function paginate(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
