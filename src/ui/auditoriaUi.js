/**
 * UI de Auditoría — El Rincón Gastronómico
 */

import { escapeHtml, formatDate } from './uiHelpers.js';

const ACTION_CLS = {
  CREATE:  'success',
  UPDATE:  'warning',
  DELETE:  'danger',
  LOGIN:   'info',
  LOGOUT:  'muted',
  READ:    'muted',
  RESTORE: 'info',
  ASSIGN:  'warning',
  REVOKE:  'danger',
};

function actionBadge(action) {
  const cls = ACTION_CLS[String(action).toUpperCase()] || 'muted';
  return `<span class="action-badge action-badge--${cls}">${escapeHtml(action || '—')}</span>`;
}

// ── Historial completo ────────────────────────────────────────────────────────

export function renderHistorialCompleto(logs) {
  if (!Array.isArray(logs) || !logs.length) {
    return `
      <div class="empty-state">
        <i data-lucide="file-clock" class="empty-state__icon"></i>
        <p>No hay registros de auditoría disponibles.</p>
      </div>`;
  }

  const rows = logs.map((log) => `
    <tr>
      <td data-label="ID">${escapeHtml(String(log.id ?? ''))}</td>
      <td data-label="Usuario">${escapeHtml(log.user_name || `Usuario ${log.user_id}` || '—')}</td>
      <td data-label="Acción">${actionBadge(log.action)}</td>
      <td data-label="Tabla"><code>${escapeHtml(log.affected_table || '—')}</code></td>
      <td data-label="Registro">${escapeHtml(String(log.record_id ?? '—'))}</td>
      <td data-label="Detalles">${escapeHtml(log.details || 'Sin detalles')}</td>
    </tr>`).join('');

  return `
    <div class="table-wrapper" role="region" aria-label="Historial de auditoría">
      <table class="table-pro">
        <thead>
          <tr>
            <th>ID</th>
            <th><i data-lucide="user" class="th-icon"></i> Usuario</th>
            <th><i data-lucide="zap" class="th-icon"></i> Acción</th>
            <th><i data-lucide="database" class="th-icon"></i> Tabla</th>
            <th><i data-lucide="hash" class="th-icon"></i> Registro</th>
            <th><i data-lucide="file-text" class="th-icon"></i> Detalles</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ── Resumen por usuario ───────────────────────────────────────────────────────

export function renderResumenUsuarios(porUsuario) {
  const usuarios = Object.keys(porUsuario || {});
  if (!usuarios.length) {
    return '<p class="text-muted">Sin actividad registrada.</p>';
  }

  const rows = usuarios.map((u) => `
    <tr>
      <td>${escapeHtml(u)}</td>
      <td><strong>${porUsuario[u].length}</strong></td>
    </tr>`).join('');

  return `
    <div class="table-wrapper" role="region" aria-label="Actividad por usuario">
      <table class="table-pro">
        <thead>
          <tr>
            <th><i data-lucide="user" class="th-icon"></i> Usuario</th>
            <th><i data-lucide="bar-chart-3" class="th-icon"></i> Acciones</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ── Detalle por usuario ───────────────────────────────────────────────────────

export function renderDetallePorUsuario(porUsuario) {
  const usuarios = Object.keys(porUsuario || {});
  if (!usuarios.length) return '';

  return usuarios.map((usuario) => {
    const logs = porUsuario[usuario];
    const rows = logs.map((log) => `
      <tr>
        <td>${actionBadge(log.action)}</td>
        <td><code>${escapeHtml(log.affected_table || '—')}</code></td>
        <td>${escapeHtml(log.details || 'Sin detalles')}</td>
      </tr>`).join('');

    return `
      <article class="audit-user-card panel-card">
        <div class="audit-user-card__header">
          <i data-lucide="user-circle-2" class="audit-user-card__icon"></i>
          <h4>${escapeHtml(usuario)}</h4>
          <span class="audit-user-card__count">${logs.length} registro${logs.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="table-wrapper" role="region" aria-label="Actividad de ${escapeHtml(usuario)}">
          <table class="table-pro">
            <thead><tr><th>Acción</th><th>Tabla</th><th>Detalles</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </article>`;
  }).join('');
}
