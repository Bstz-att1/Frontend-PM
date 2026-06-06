/**
 * UI de Inventario — El Rincón Gastronómico
 * Funciones puras de renderizado (devuelven HTML string).
 */

import { escapeHtml } from './uiHelpers.js';

// ── Categorías ────────────────────────────────────────────────────────────────

export function renderCategorias(categorias, canManage = false) {
  if (!Array.isArray(categorias) || !categorias.length) {
    return `
      <div class="empty-state">
        <i data-lucide="inbox" class="empty-state__icon"></i>
        <p>No hay categorías registradas aún.</p>
      </div>`;
  }

  const rows = categorias.map((c) => `
    <tr>
      <td data-label="ID">${escapeHtml(String(c.id ?? ''))}</td>
      <td data-label="Nombre">${escapeHtml(c.name || '—')}</td>
      <td data-label="Descripción">${escapeHtml(c.description || '—')}</td>
      ${canManage ? `
      <td data-label="Acciones" class="td-actions">
        <button class="btn-icon btn-icon--warning" data-action="edit-cat" data-id="${c.id}" title="Editar">
          <i data-lucide="pencil"></i>
        </button>
        <button class="btn-icon btn-icon--danger" data-action="delete-cat" data-id="${c.id}" title="Eliminar">
          <i data-lucide="trash-2"></i>
        </button>
      </td>` : ''}
    </tr>`).join('');

  return `
    <div class="table-wrapper" role="region" aria-label="Lista de categorías">
      <table class="table-pro">
        <thead>
          <tr>
            <th>ID</th>
            <th><i data-lucide="tag" class="th-icon"></i> Nombre</th>
            <th><i data-lucide="file-text" class="th-icon"></i> Descripción</th>
            ${canManage ? '<th>Acciones</th>' : ''}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ── Productos ─────────────────────────────────────────────────────────────────

export function renderProductos(productos, categorias = [], canManage = false) {
  if (!Array.isArray(productos) || !productos.length) {
    return `
      <div class="empty-state">
        <i data-lucide="inbox" class="empty-state__icon"></i>
        <p>No hay productos registrados aún.</p>
      </div>`;
  }

  const catMap = (Array.isArray(categorias) ? categorias : []).reduce((acc, c) => {
    acc[String(c.id)] = c.name || `Cat. ${c.id}`;
    return acc;
  }, {});

  const rows = productos.map((p) => {
    const qty     = Number(p.quantity ?? 0);
    const isLow   = qty <= 5;
    const catName = catMap[String(p.category_id)] || `Cat. ${p.category_id}`;
    return `
      <tr>
        <td data-label="ID">${escapeHtml(String(p.id ?? ''))}</td>
        <td data-label="Producto">${escapeHtml(p.name || '—')}</td>
        <td data-label="Categoría">${escapeHtml(catName)}</td>
        <td data-label="Stock">
          <span class="stock-badge ${isLow ? 'stock-badge--low' : ''}">
            ${escapeHtml(String(qty))} uds.${isLow ? ' ⚠️' : ''}
          </span>
        </td>
        <td data-label="Descripción">${escapeHtml(p.description || '—')}</td>
        ${canManage ? `
        <td data-label="Acciones" class="td-actions">
          <button class="btn-icon btn-icon--warning" data-action="edit-prod" data-id="${p.id}" title="Editar">
            <i data-lucide="pencil"></i>
          </button>
          <button class="btn-icon btn-icon--danger" data-action="delete-prod" data-id="${p.id}" title="Eliminar">
            <i data-lucide="trash-2"></i>
          </button>
        </td>` : ''}
      </tr>`;
  }).join('');

  return `
    <div class="table-wrapper" role="region" aria-label="Lista de productos">
      <table class="table-pro">
        <thead>
          <tr>
            <th>ID</th>
            <th><i data-lucide="package" class="th-icon"></i> Producto</th>
            <th><i data-lucide="tag" class="th-icon"></i> Categoría</th>
            <th><i data-lucide="hash" class="th-icon"></i> Stock</th>
            <th><i data-lucide="file-text" class="th-icon"></i> Descripción</th>
            ${canManage ? '<th>Acciones</th>' : ''}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ── Select de categorías (para formularios) ───────────────────────────────────

export function renderCategoryOptions(categorias, selectedId = '') {
  if (!Array.isArray(categorias) || !categorias.length) {
    return '<option value="">— Sin categorías disponibles —</option>';
  }
  return [
    '<option value="">— Seleccione una categoría —</option>',
    ...categorias.map((c) => `<option value="${c.id}" ${String(c.id) === String(selectedId) ? 'selected' : ''}>${escapeHtml(c.name)}</option>`),
  ].join('');
}
