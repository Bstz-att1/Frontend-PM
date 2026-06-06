/**
 * API de Categorías — El Rincón Gastronómico
 * Rutas: GET/POST /categories · PUT/DELETE /categories/:id
 *
 * Payload POST/PUT: { name, description? }
 */

import { API_URL } from '../core/config.js';
import { authFetch } from './httpClient.js';

const BASE = `${API_URL}/categories`;

function extractData(json) { return json?.data ?? json; }
function extractError(json, fallback) {
  return json?.message || (Array.isArray(json?.errors) ? json.errors.join(', ') : null) || fallback;
}
async function parseJson(res) {
  try { return await res.json(); } catch { return {}; }
}

export async function categoryGet() {
  const res  = await authFetch(BASE);
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al obtener categorías'));
  const data = extractData(json);
  return Array.isArray(data) ? data : [];
}

export async function categoryGetById(id) {
  const res  = await authFetch(`${BASE}/${id}`);
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al obtener la categoría'));
  return extractData(json) || {};
}

export async function categoryPost({ name, description }) {
  const payload = { name, ...(description ? { description } : {}) };
  const res  = await authFetch(BASE, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al crear la categoría'));
  return extractData(json) || payload;
}

export async function categoryPut(id, { name, description }) {
  const payload = { name, ...(description !== undefined ? { description } : {}) };
  const res  = await authFetch(`${BASE}/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al actualizar la categoría'));
  return extractData(json) || { id, ...payload };
}

export async function categoryDelete(id) {
  const res  = await authFetch(`${BASE}/${id}`, { method: 'DELETE' });
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al eliminar la categoría'));
  return true;
}
