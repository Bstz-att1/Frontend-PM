/**
 * Servicio de Movimientos — El Rincón Gastronómico
 *
 * Los movimientos de stock se registran como logs de auditoría.
 * Mapeo de tipos:
 *   entrada → action: "CREATE"
 *   salida  → action: "DELETE"
 *   ajuste  → action: "UPDATE"
 */

import { auditGet, auditPost } from '../api/audit.api.js';
import { getSessionUser } from './authService.js';

const ACTION_MAP = {
  entrada: 'CREATE',
  salida:  'DELETE',
  ajuste:  'UPDATE',
};

const TIPO_LABEL = {
  entrada: 'Entrada',
  salida:  'Salida',
  ajuste:  'Ajuste',
};

/**
 * Registra un movimiento de stock como log de auditoría.
 *
 * @param {{ tipo: 'entrada'|'salida'|'ajuste', producto: string, cantidad: number, motivo: string }} datos
 */
export async function registrarMovimiento({ tipo, producto, cantidad, motivo }) {
  const user   = getSessionUser();
  const userId = Number(user?.id);

  if (!userId) throw new Error('No se pudo identificar al usuario de la sesión.');

  const action  = ACTION_MAP[tipo];
  if (!action) throw new Error(`Tipo de movimiento inválido: ${tipo}`);

  const label   = TIPO_LABEL[tipo] || tipo;
  const details = `${label} | Producto: ${producto} | Cantidad: ${cantidad} uds. | Motivo: ${motivo}`;

  return auditPost({
    user_id:        userId,
    action,
    affected_table: 'products',
    record_id:      1,
    details,
  });
}

/**
 * Obtiene el historial de movimientos (filtra logs CREATE/DELETE/UPDATE).
 */
export async function obtenerHistorialMovimientos() {
  const logs = await auditGet();
  return (Array.isArray(logs) ? logs : []).filter(
    (log) => log.action === 'CREATE' || log.action === 'DELETE' || log.action === 'UPDATE'
  );
}
