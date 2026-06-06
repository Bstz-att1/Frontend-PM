/**
 * API de Autenticación — El Rincón Gastronómico
 * Rutas: POST /auth/login · POST /auth/logout · GET /auth/me
 */

import { API_URL } from '../core/config.js';
import { authFetch } from './httpClient.js';

const AUTH_BASE = `${API_URL}/auth`;

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.message ||
      (Array.isArray(data?.errors) ? data.errors.join(', ') : null) ||
      `Error ${response.status}`;
    throw new Error(message);
  }

  return data;
}

/**
 * Inicia sesión con credenciales.
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 */
export async function authLogin(username, password) {
  const response = await fetch(`${AUTH_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
}

/**
 * Cierra sesión en el backend.
 * @param {string} token - JWT activo
 */
export async function authLogout(token) {
  const response = await fetch(`${AUTH_BASE}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  // Fallo silencioso: si el backend no responde, se limpia la sesión local igualmente.
  return handleResponse(response).catch(() => null);
}

/**
 * Obtiene el perfil del usuario autenticado.
 */
export async function authMe() {
  const response = await authFetch(`${AUTH_BASE}/me`);
  return handleResponse(response);
}
