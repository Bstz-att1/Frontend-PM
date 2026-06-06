/**
 * Utilidades compartidas de UI — El Rincón Gastronómico
 */

/**
 * Escapa caracteres HTML para evitar XSS.
 * @param {*} value
 * @returns {string}
 */
export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Formatea una fecha ISO para mostrar.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleString('es-CO', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return String(date);
  }
}

/**
 * Genera el HTML de un estado vacío.
 * @param {string} [message]
 * @param {string} [icon]
 */
export function emptyState(message = 'No hay datos disponibles.', icon = 'inbox') {
  return `
    <div class="empty-state">
      <i data-lucide="${icon}" class="empty-state__icon"></i>
      <p>${escapeHtml(message)}</p>
    </div>`;
}

/**
 * Genera el HTML de un error de carga.
 * @param {string} [message]
 */
export function errorState(message = 'No se pudo cargar la información.') {
  return `
    <div class="error-state">
      <i data-lucide="wifi-off" class="error-state__icon"></i>
      <p>${escapeHtml(message)}</p>
    </div>`;
}
