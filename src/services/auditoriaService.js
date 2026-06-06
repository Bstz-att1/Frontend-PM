/**
 * Servicio de Auditoría — El Rincón Gastronómico
 *
 * Acciones válidas del backend:
 * CREATE, UPDATE, DELETE, LOGIN, LOGOUT, READ, RESTORE, ASSIGN, REVOKE
 */

import { auditGet, auditPost } from '../api/audit.api.js';
import { userGet } from '../api/users.api.js';
import { getSessionUser } from './authService.js';

/**
 * Obtiene todos los logs de auditoría enriquecidos con nombre de usuario.
 */
export async function obtenerLogsAuditoria() {
  const [logs, users] = await Promise.all([auditGet(), userGet().catch(() => [])]);

  const usersById = (Array.isArray(users) ? users : []).reduce((acc, u) => {
    acc[String(u.id)] = u.name || u.username || `Usuario ${u.id}`;
    return acc;
  }, {});

  return (Array.isArray(logs) ? logs : []).map((log) => ({
    ...log,
    user_name: usersById[String(log.user_id)] || `Usuario ${log.user_id}`,
  }));
}

/**
 * Registra un hallazgo/evento de auditoría manualmente.
 */
export async function registrarHallazgo({ action, affected_table, record_id, details }) {
  const user   = getSessionUser();
  const userId = Number(user?.id);

  if (!userId) throw new Error('No se pudo identificar al usuario de la sesión.');

  return auditPost({
    user_id:        userId,
    action:         String(action).toUpperCase(),
    affected_table,
    record_id:      Number(record_id),
    details:        details || undefined,
  });
}

/**
 * Agrupa logs por nombre de usuario.
 */
export function agruparPorUsuario(logs) {
  return logs.reduce((acc, log) => {
    const name = (log.user_name && String(log.user_name).trim()) || 'Usuario no identificado';
    if (!acc[name]) acc[name] = [];
    acc[name].push(log);
    return acc;
  }, {});
}
