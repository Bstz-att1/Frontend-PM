/**
 * Componente de Iconos Lucide — El Rincón Gastronómico
 *
 * Centraliza la inicialización de iconos Lucide.
 * Debe llamarse después de cada actualización del DOM.
 */

import { createIcons, icons } from 'lucide';

/**
 * Reemplaza todos los elementos <i data-lucide="..."> del DOM
 * con sus correspondientes SVG de Lucide.
 *
 * @param {Element} [scope] - Ámbito de búsqueda (default: document)
 */
export function refreshIcons(scope) {
  try {
    if (scope) {
      createIcons({ icons, scope });
    } else {
      createIcons({ icons });
    }
  } catch (err) {
    console.warn('[icons] Error al inicializar Lucide:', err);
  }
}
