/**
 * Módulo de permisos basado en roles.
 * Roles válidos del backend: admin, supervisor, user
 */

import { getSession } from '../services/authService.js';

/**
 * Devuelve los roles del usuario actual (normalizados a minúsculas).
 */
function getCurrentRoles() {
  const { user } = getSession();
  if (!user) return [];

  if (Array.isArray(user.roles)) {
    return user.roles.map((r) => String(r).toLowerCase());
  }
  if (user.role) return [String(user.role).toLowerCase()];
  if (user.rol)  return [String(user.rol).toLowerCase()];

  return [];
}

/** Verifica si el usuario tiene un rol específico. */
export function hasRole(role) {
  return getCurrentRoles().includes(String(role).toLowerCase());
}

/** Verifica si el usuario tiene al menos uno de los roles indicados. */
export function hasAnyRole(...roles) {
  const current = getCurrentRoles();
  return roles.some((r) => current.includes(String(r).toLowerCase()));
}

/** Es administrador. */
export function isAdmin() {
  return hasRole('admin');
}

/** Es administrador o supervisor. */
export function isSupervisor() {
  return hasAnyRole('admin', 'supervisor');
}

/** Tiene algún rol válido (usuario autenticado). */
export function isRegularUser() {
  return getCurrentRoles().length > 0;
}

// ── Permisos funcionales ──────────────────────────────────────────────────────

/** Puede gestionar usuarios (solo admin). */
export function canManageUsers() {
  return isAdmin();
}

/** Puede ver auditoría (admin o supervisor). */
export function canViewAudit() {
  return isSupervisor();
}

/** Puede gestionar inventario: categorías y productos. */
export function canManageInventory() {
  return isSupervisor();
}

/** Puede registrar movimientos de stock. */
export function canRegisterMovements() {
  return isRegularUser();
}

/** Puede ver el inventario. */
export function canViewInventory() {
  return isRegularUser();
}
