/**
 * Servicio de Inventario — El Rincón Gastronómico
 * Capa intermedia entre la API (products + categories) y la UI.
 */

import { categoryGet, categoryPost, categoryPut, categoryDelete } from '../api/categories.api.js';
import { productGet, productPost, productPut, productDelete } from '../api/products.api.js';

// ── Categorías ────────────────────────────────────────────────────────────────

export async function obtenerCategorias() {
  return categoryGet();
}

export async function crearCategoria({ name, description }) {
  return categoryPost({ name, description });
}

export async function actualizarCategoria(id, { name, description }) {
  return categoryPut(id, { name, description });
}

export async function eliminarCategoria(id) {
  return categoryDelete(id);
}

// ── Productos ─────────────────────────────────────────────────────────────────

export async function obtenerProductos() {
  return productGet();
}

export async function crearProducto({ name, description, category_id, quantity = 0 }) {
  return productPost({ name, description, category_id, quantity });
}

export async function actualizarProducto(id, { name, description, category_id, quantity }) {
  return productPut(id, { name, description, category_id, quantity });
}

export async function eliminarProducto(id) {
  return productDelete(id);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Resuelve el nombre de una categoría dado su ID.
 * @param {Array} categorias - Lista de categorías
 * @param {number|string} categoryId
 */
export function resolverNombreCategoria(categorias, categoryId) {
  if (!Array.isArray(categorias) || !categoryId) return '—';
  const cat = categorias.find((c) => Number(c.id) === Number(categoryId));
  return cat?.name || `Cat. ${categoryId}`;
}
