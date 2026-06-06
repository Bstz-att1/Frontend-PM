/**
 * API de Auditoría — El Rincón Gastronómico
 * Rutas: GET /audit · POST /audit
 *
 * Payload POST: { user_id, action, affected_table, record_id, details? }
 * Acciones válidas: CREATE, UPDATE, DELETE, LOGIN, LOGOUT, READ, RESTORE, ASSIGN, REVOKE
 */

import { API_URL } from '../core/config.js';
import { authFetch } from './httpClient.js';

const BASE = `${API_URL}/audit`;

function extractData(json) { return json?.data ?? json; }
function extractError(json, fallback) {
  return json?.message || (Array.isArray(json?.errors) ? json.errors.join(', ') : null) || fallback;
}
async function parseJson(res) {
  try { return await res.json(); } catch { return {}; }
}

export async function auditGet() {
  const res  = await authFetch(BASE);
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al obtener los registros de auditoría'));
  const data = extractData(json);
  return Array.isArray(data) ? data : [];
}

export async function auditPost({ user_id, action, affected_table, record_id, details }) {
  const payload = {
    user_id,
    action: String(action).toUpperCase(),
    affected_table,
    record_id,
    ...(details ? { details } : {}),
  };

  const res  = await authFetch(BASE, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  const json = await parseJson(res);
  if (!res.ok) throw new Error(extractError(json, 'Error al registrar la auditoría'));
  return extractData(json) || payload;
}
