/**
 * Servicio de Administración de Usuarios — El Rincón Gastronómico
 */

import { userGet, userGetById, userPost, userPut, userDelete } from '../api/users.api.js';

export async function obtenerUsuarios() {
  return userGet();
}

export async function obtenerUsuarioPorId(id) {
  return userGetById(id);
}

export async function crearUsuario({ document, name, username, password, roles }) {
  return userPost({ document, name, username, password, roles });
}

export async function actualizarUsuario(id, { document, name, username, password, roles }) {
  return userPut(id, { document, name, username, password, roles });
}

export async function eliminarUsuario(id) {
  return userDelete(id);
}

// ── Helpers de filtrado ───────────────────────────────────────────────────────

export function filtrarUsuarios(usuarios, { search = '', roleFilter = '' } = {}) {
  const s    = search.trim().toLowerCase();
  const role = roleFilter.trim().toLowerCase();

  return (Array.isArray(usuarios) ? usuarios : []).filter((u) => {
    const matchSearch =
      !s ||
      (u.name     || '').toLowerCase().includes(s) ||
      (u.username || '').toLowerCase().includes(s) ||
      (u.document || '').toLowerCase().includes(s);

    const userRoles = Array.isArray(u.roles) ? u.roles.map((r) => r.toLowerCase()) : [];
    const matchRole = !role || userRoles.includes(role);

    return matchSearch && matchRole;
  });
}
