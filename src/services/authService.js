/**
 * Servicio de Autenticación — El Rincón Gastronómico
 *
 * Gestiona la sesión en sessionStorage y las llamadas al backend.
 * Almacena el JWT bajo la clave 'rg_auth_token' y el usuario bajo 'rg_auth_user'.
 */

import { authLogin, authLogout } from '../api/auth.api.js';
import { APP_CONFIG } from '../core/config.js';

const { SESSION_KEY_TOKEN, SESSION_KEY_USER } = APP_CONFIG;

// ── Lectura / Escritura de sesión ─────────────────────────────────────────────

/** Guarda token y datos de usuario en sessionStorage. */
export function saveSession({ token, user }) {
  if (token) sessionStorage.setItem(SESSION_KEY_TOKEN, token);
  if (user)  sessionStorage.setItem(SESSION_KEY_USER, JSON.stringify(user));
}

/** Lee la sesión actual desde sessionStorage. */
export function getSession() {
  const token = sessionStorage.getItem(SESSION_KEY_TOKEN);
  let user = null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY_USER);
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }
  return { token, user };
}

/** Devuelve el token JWT actual o null. */
export function getToken() {
  return sessionStorage.getItem(SESSION_KEY_TOKEN) || null;
}

/** Devuelve el objeto usuario guardado en sesión o null. */
export function getSessionUser() {
  const { user } = getSession();
  return user;
}

/** Indica si hay una sesión activa con token. */
export function isAuthenticated() {
  return Boolean(getToken());
}

/** Elimina toda la información de sesión del almacenamiento. */
export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY_TOKEN);
  sessionStorage.removeItem(SESSION_KEY_USER);
}

// ── Operaciones de sesión ─────────────────────────────────────────────────────

/**
 * Inicia sesión con credenciales y guarda la sesión resultante.
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} datos de usuario logueado
 */
export async function loginWithCredentials(username, password) {
  const response = await authLogin(username, password);
  const payload  = response?.data || response;

  // El backend puede devolver el token en distintos campos
  const token = payload?.token || payload?.accessToken || payload?.access_token;
  const user  = payload?.user || null;

  if (!token) {
    throw new Error('El servidor no devolvió un token de acceso válido.');
  }

  saveSession({ token, user });
  return { token, user };
}

/**
 * Cierra la sesión: notifica al backend y limpia sessionStorage.
 */
export async function logoutCurrentSession() {
  const { token } = getSession();
  try {
    if (token) await authLogout(token);
  } finally {
    clearSession();
  }
}
