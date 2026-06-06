/**
 * API de Productos — El Rincón Gastronómico
 * Rutas: GET/POST /products · PUT/DELETE /products/:id
 *
 * Payload POST/PUT: { name, description?, category_id, quantity? }
 */

import { API_URL } from '../core/config.js';
import { authFetch } from './httpClient.js';

const BASE = `${API_URL}/products`;

function extractData(json) { return json?.data ?? json; }
function extractError(json, fallback) {
  return json?.message || (Array.isArray(json?.errors) ? json.errors.join(', ') : null) || fallback;
}
async function parseJson(res) {
  try { return await res.json(); } catch { return {}; }
}

export async function productGet() {
  const res  = await authFetch(BASE);
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al obtener productos'));
  const data = extractData(json);
  return Array.isArray(data) ? data : [];
}

export async function productGetById(id) {
  const res  = await authFetch(`${BASE}/${id}`);
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al obtener el producto'));
  return extractData(json) || {};
}

export async function productPost({ name, description, category_id, quantity = 0 }) {
  const payload = { name, category_id, quantity, ...(description ? { description } : {}) };
  const res  = await authFetch(BASE, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al crear el producto'));
  return extractData(json) || payload;
}

export async function productPut(id, { name, description, category_id, quantity }) {
  const payload = {
    name,
    category_id,
    quantity,
    ...(description !== undefined ? { description } : {}),
  };
  const res  = await authFetch(`${BASE}/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al actualizar el producto'));
  return extractData(json) || { id, ...payload };
}

export async function productDelete(id) {
  const res  = await authFetch(`${BASE}/${id}`, { method: 'DELETE' });
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al eliminar el producto'));
  return true;
}
