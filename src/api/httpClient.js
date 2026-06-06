/**
 * Cliente HTTP autenticado — El Rincón Gastronómico
 *
 * Inyecta automáticamente el token JWT en cada petición.
 * Emite el evento 'auth:session-expired' cuando el servidor devuelve 401.
 */

import { APP_CONFIG } from '../core/config.js';

const { SESSION_KEY_TOKEN } = APP_CONFIG;

/** Lee el token de la sesión activa. */
function getToken() {
  return sessionStorage.getItem(SESSION_KEY_TOKEN) || null;
}

/** Añade la cabecera Authorization si hay token activo. */
function withAuthHeaders(headers = {}) {
  const token = getToken();
  return {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Dispara el evento global de sesión expirada. */
function dispatchSessionExpired() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:session-expired'));
  }
}

/**
 * Fetch autenticado.
 * Añade Authorization header y gestiona expiración de sesión.
 *
 * @param {string} url
 * @param {RequestInit} options
 * @returns {Promise<Response>}
 */
export async function authFetch(url, options = {}) {
  const requestOptions = {
    ...options,
    headers: withAuthHeaders(options.headers || {}),
  };

  let response;
  try {
    response = await fetch(url, requestOptions);
  } catch (networkErr) {
    throw new Error('Error de red: no se pudo conectar con el servidor.');
  }

  if (response.status === 401) {
    dispatchSessionExpired();
  }

  return response;
}
