/**
 * Configuración centralizada — El Rincón Gastronómico
 * Todas las constantes globales de la aplicación.
 */

export const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:3000';

export const APP_CONFIG = {
  /** Duración de los toasts de notificación (ms) */
  NOTIFICATION_DURATION: 3000,

  /** Claves de almacenamiento en sessionStorage */
  SESSION_KEY_TOKEN: 'rg_auth_token',
  SESSION_KEY_USER:  'rg_auth_user',

  /** Timeout de peticiones HTTP (ms) */
  REQUEST_TIMEOUT: 12000,

  /** Máximo de registros a mostrar en tablas */
  MAX_TABLE_ROWS: 100,
};
