/**
 * API de Usuarios — El Rincón Gastronómico
 * Rutas: GET/POST/PUT/DELETE /users · GET /users/:id
 *
 * Campos del backend:
 *   { id, document, name, username, roles: string[] }
 * Payload POST/PUT:
 *   { document, name, username, password, roles: string[] }
 */

import { API_URL } from '../core/config.js';
import { authFetch } from './httpClient.js';

const USERS_BASE = `${API_URL}/users`;

function extractData(json) {
  return json?.data ?? json;
}

function extractError(json, fallback) {
  return (
    json?.message ||
    (Array.isArray(json?.errors) ? json.errors.join(', ') : null) ||
    fallback
  );
}

async function parseJson(response) {
  let json = {};
  try { json = await response.json(); } catch { json = {}; }
  return json;
}

// ── GET /users ────────────────────────────────────────────────────────────────

export async function userGet() {
  const res = await authFetch(USERS_BASE);
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al obtener usuarios'));
  const data = extractData(json);
  return Array.isArray(data) ? data : [];
}

// ── GET /users/:id ────────────────────────────────────────────────────────────

export async function userGetById(id) {
  const res = await authFetch(`${USERS_BASE}/${id}`);
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al obtener el usuario'));
  return extractData(json) || {};
}

// ── POST /users ───────────────────────────────────────────────────────────────

export async function userPost({ document, name, username, password, roles }) {
  const payload = { document, name, username, password, roles: Array.isArray(roles) ? roles : [roles] };
  const res  = await authFetch(USERS_BASE, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al crear el usuario'));
  return extractData(json) || payload;
}

// ── PUT /users/:id ────────────────────────────────────────────────────────────

export async function userPut(id, { document, name, username, password, roles }) {
  const payload = { document, name, username, password, roles: Array.isArray(roles) ? roles : [roles] };
  const res  = await authFetch(`${USERS_BASE}/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al actualizar el usuario'));
  return extractData(json) || { id, ...payload };
}

// ── DELETE /users/:id ─────────────────────────────────────────────────────────

export async function userDelete(id) {
  const res  = await authFetch(`${USERS_BASE}/${id}`, { method: 'DELETE' });
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al eliminar el usuario'));
  return true;
}
