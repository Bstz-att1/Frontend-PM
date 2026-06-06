/**
 * Repositorio HTTP base — El Rincón Gastronómico
 *
 * Centraliza todos los métodos HTTP (GET / POST / PUT / PATCH / DELETE).
 * Utiliza authFetch para inyectar automáticamente el token JWT.
 */

import { API_URL } from '../core/config.js';
import { authFetch } from '../api/httpClient.js';

/**
 * Construye la URL completa con query params opcionales.
 */
const buildUrl = (endpoint, query = null) => {
  const base = `${API_URL}${endpoint}`;
  if (!query || typeof query !== 'object') return base;

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const qs = params.toString();
  return qs ? `${base}${base.includes('?') ? '&' : '?'}${qs}` : base;
};

/**
 * Procesa la respuesta HTTP y normaliza errores.
 */
const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      payload?.message ||
      (Array.isArray(payload?.errors) ? payload.errors.join(', ') : null) ||
      `Error HTTP ${response.status}: ${response.statusText}`;

    const err = new Error(message);
    err.status  = response.status;
    err.payload = payload;
    err.errors  = Array.isArray(payload?.errors) ? payload.errors : [];
    throw err;
  }

  return payload;
};

/**
 * Método base de request autenticado.
 */
const request = async (method, endpoint, { data, query, headers } = {}) => {
  const url = buildUrl(endpoint, query);

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
  };

  if (data !== undefined) {
    config.body = JSON.stringify(data);
  }

  const response = await authFetch(url, config);
  return parseResponse(response);
};

// ── Métodos públicos ──────────────────────────────────────────────────────────

export const baseRepository = {
  get:    (endpoint, options = {})       => request('GET',    endpoint, options),
  post:   (endpoint, data, options = {}) => request('POST',   endpoint, { ...options, data }),
  put:    (endpoint, data, options = {}) => request('PUT',    endpoint, { ...options, data }),
  patch:  (endpoint, data, options = {}) => request('PATCH',  endpoint, { ...options, data }),
  delete: (endpoint, options = {})       => request('DELETE', endpoint, options),
};
