import axios from 'axios';

/**
 * The API client.
 *
 * The base URL comes from `VITE_API_URL` so a deployed build can point at the
 * real server; it falls back to the local dev API, which is what it was
 * hardcoded to before. Set it in the hosting environment (or a local `.env`):
 *
 *   VITE_API_URL=https://sybn.onrender.com/api/v1
 *
 * `withCredentials` is required: the session is an httpOnly cookie, so the
 * browser only sends it on cross-origin calls when this is set.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1',
  withCredentials: true,
});

export default api;
