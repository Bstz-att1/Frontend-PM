/**
 * Módulo de Notificaciones — El Rincón Gastronómico
 * SweetAlert2: toasts + diálogos + confirmaciones.
 */

import Swal from 'sweetalert2';

const CONFIRM_COLOR = '#1e3a5f';
const CANCEL_COLOR  = '#6b7280';

// ── Toasts ────────────────────────────────────────────────────────────────────

const toastBase = {
  toast:             true,
  position:          'top-end',
  showConfirmButton: false,
  timer:             3000,
  timerProgressBar:  true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
};

export function showSuccess(message) {
  return Swal.fire({ ...toastBase, icon: 'success', title: message });
}

export function showError(message) {
  return Swal.fire({ ...toastBase, icon: 'error', title: message, timer: 4500 });
}

export function showInfo(message) {
  return Swal.fire({ ...toastBase, icon: 'info', title: message });
}

// ── Diálogos de validación ────────────────────────────────────────────────────

export function showValidationErrors(errors = []) {
  return Swal.fire({
    icon:               'warning',
    title:              'Errores de validación',
    html:               `<ul class="swal-error-list">${errors.map((e) => `<li>${escapeHtml(e)}</li>`).join('')}</ul>`,
    confirmButtonText:  'Entendido',
    confirmButtonColor: CONFIRM_COLOR,
  });
}

// ── Confirmaciones ────────────────────────────────────────────────────────────

export async function showConfirm({
  title              = '¿Estás seguro?',
  text               = 'Esta acción no se puede deshacer.',
  confirmButtonText  = 'Sí, continuar',
  cancelButtonText   = 'Cancelar',
  icon               = 'warning',
} = {}) {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton:   true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: CONFIRM_COLOR,
    cancelButtonColor:  CANCEL_COLOR,
    reverseButtons:     true,
    focusCancel:        true,
    allowOutsideClick:  false,
  });
  return Boolean(result.isConfirmed);
}

// ── Helpers internos ──────────────────────────────────────────────────────────

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
