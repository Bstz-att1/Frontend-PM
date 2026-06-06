/**
 * UI de Administración de Usuarios — El Rincón Gastronómico
 */

import { escapeHtml } from './uiHelpers.js';

const ROLE_LABELS = { admin: 'Administrador', supervisor: 'Supervisor', user: 'Usuario' };
const ROLE_CLS    = { admin: 'admin', supervisor: 'supervisor', user: 'user' };

function roleBadge(role) {
  const key = String(role || '').toLowerCase();
  const cls  = ROLE_CLS[key]    || 'user';
  const label = ROLE_LABELS[key] || escapeHtml(role);
  return `<span class="role-badge role-badge--${cls}">${label}</span>`;
}

export function renderUsuarios(usuarios, canManage = false) {
  if (!Array.isArray(usuarios) || !usuarios.length) {
    return `
      <div class="empty-state">
        <i data-lucide="users" class="empty-state__icon"></i>
        <p>No hay usuarios registrados.</p>
      </div>`;
  }

  const rows = usuarios.map((u) => {
    const roles = Array.isArray(u.roles) ? u.roles : (u.role ? [u.role] : []);
    return `
      <tr>
        <td data-label="ID">${escapeHtml(String(u.id ?? ''))}</td>
        <td data-label="Nombre">${escapeHtml(u.name || '—')}</td>
        <td data-label="Usuario">${escapeHtml(u.username || '—')}</td>
        <td data-label="Documento">${escapeHtml(u.document || '—')}</td>
        <td data-label="Roles">
          ${roles.length ? roles.map(roleBadge).join(' ') : '<span class="text-muted">—</span>'}
        </td>
        ${canManage ? `
        <td data-label="Acciones" class="td-actions">
          <button class="btn-icon btn-icon--warning" data-action="edit-user" data-id="${u.id}" title="Editar usuario">
            <i data-lucide="pencil"></i>
          </button>
          <button class="btn-icon btn-icon--danger" data-action="delete-user" data-id="${u.id}" title="Eliminar usuario">
            <i data-lucide="trash-2"></i>
          </button>
        </td>` : ''}
      </tr>`;
  }).join('');

  return `
    <div class="table-wrapper" role="region" aria-label="Lista de usuarios">
      <table class="table-pro">
        <thead>
          <tr>
            <th>ID</th>
            <th><i data-lucide="user" class="th-icon"></i> Nombre</th>
            <th><i data-lucide="at-sign" class="th-icon"></i> Usuario</th>
            <th><i data-lucide="id-card" class="th-icon"></i> Documento</th>
            <th><i data-lucide="shield" class="th-icon"></i> Roles</th>
            ${canManage ? '<th>Acciones</th>' : ''}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}
