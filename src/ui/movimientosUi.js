/**
 * UI de Movimientos — El Rincón Gastronómico
 */

import { escapeHtml } from './uiHelpers.js';

const ACTION_LABEL = { CREATE: 'Entrada', DELETE: 'Salida', UPDATE: 'Ajuste' };
const ACTION_CLS   = { CREATE: 'success', DELETE: 'danger', UPDATE: 'warning' };

export function renderHistorialMovimientos(logs) {
  if (!Array.isArray(logs) || !logs.length) {
    return `
      <div class="empty-state">
        <i data-lucide="inbox" class="empty-state__icon"></i>
        <p>No hay movimientos registrados aún.</p>
      </div>`;
  }

  const rows = logs.slice(0, 100).map((log) => `
    <tr>
      <td data-label="ID">${escapeHtml(String(log.id ?? ''))}</td>
      <td data-label="Tipo">
        <span class="action-badge action-badge--${ACTION_CLS[log.action] || 'muted'}">
          ${escapeHtml(ACTION_LABEL[log.action] || log.action || '—')}
        </span>
      </td>
      <td data-label="Tabla"><code>${escapeHtml(log.affected_table || '—')}</code></td>
      <td data-label="Detalles">${escapeHtml(log.details || 'Sin detalles')}</td>
    </tr>`).join('');

  return `
    <div class="table-wrapper" role="region" aria-label="Historial de movimientos">
      <table class="table-pro">
        <thead>
          <tr>
            <th>ID</th>
            <th><i data-lucide="arrow-left-right" class="th-icon"></i> Tipo</th>
            <th><i data-lucide="database" class="th-icon"></i> Tabla</th>
            <th><i data-lucide="file-text" class="th-icon"></i> Detalles</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}
