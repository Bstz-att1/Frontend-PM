/**
 * Helper de Shell — El Rincón Gastronómico
 *
 * Configura los comportamientos comunes del shell (logout, sesión expirada)
 * para todos los controladores de sección protegidos.
 *
 * @returns {{ sectionEl: HTMLElement|null, cleanup: Function }}
 */

import { logoutCurrentSession } from '../../services/authService.js';
import { showConfirm, showSuccess, showError } from '../../ui/notificationsUi.js';

export function setupShell() {
  const sectionEl = document.getElementById('seccion-contenido');
  const logoutBtn = document.getElementById('logout-btn');

  // ── Logout ──────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    const confirmed = await showConfirm({
      title:             '¿Cerrar sesión?',
      text:              'Tu sesión actual será terminada de forma segura.',
      confirmButtonText: 'Sí, salir',
      cancelButtonText:  'Cancelar',
      icon:              'question',
    });

    if (!confirmed) return;

    logoutBtn?.setAttribute('disabled', 'true');
    try {
      await logoutCurrentSession();
      showSuccess('Sesión cerrada correctamente.');
      window.location.hash = '#/login';
    } catch (err) {
      console.error('[shellController] Error al cerrar sesión:', err);
      showError('No se pudo cerrar sesión.');
    } finally {
      logoutBtn?.removeAttribute('disabled');
    }
  };

  // ── Sesión expirada ──────────────────────────────────────────────────────────
  const handleSessionExpired = () => {
    window.location.hash = '#/login';
  };

  logoutBtn?.addEventListener('click', handleLogout);
  window.addEventListener('auth:session-expired', handleSessionExpired);

  const cleanup = () => {
    logoutBtn?.removeEventListener('click', handleLogout);
    window.removeEventListener('auth:session-expired', handleSessionExpired);
  };

  return { sectionEl, cleanup };
}
