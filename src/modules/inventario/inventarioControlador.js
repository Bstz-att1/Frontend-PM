/**
 * Controlador de Inventario — El Rincón Gastronómico
 *
 * Gestiona categorías y productos: listado, creación y eliminación.
 * Rellena el área #seccion-contenido dentro del shell de homeView.
 */

import Swal from 'sweetalert2';
import { setupShell } from '../home/shellController.js';
import { refreshIcons } from '../../components/icons.js';
import { showSuccess, showError, showValidationErrors, showConfirm } from '../../ui/notificationsUi.js';
import { renderCategorias, renderProductos, renderCategoryOptions } from '../../ui/inventarioUi.js';
import { emptyState, errorState, escapeHtml } from '../../ui/uiHelpers.js';
import {
  obtenerCategorias, crearCategoria, actualizarCategoria, eliminarCategoria,
  obtenerProductos, crearProducto, actualizarProducto, eliminarProducto,
} from '../../services/inventarioService.js';
import { categoriaSchema, productoSchema, validarConSchema } from '../../utils/validaciones.js';
import { isSupervisor } from '../../core/permissions.js';

// ── Estado del módulo ─────────────────────────────────────────────────────────

const estado = {
  categorias: [],
  productos:  [],
};

// ── HTML de la sección ────────────────────────────────────────────────────────

function buildSectionHTML(canManage) {
  return `
    <div class="section-header animate__animated animate__fadeIn">
      <h2><i data-lucide="boxes"></i> Inventario</h2>
      <p>Gestiona las categorías y productos del establecimiento.</p>
    </div>

    ${canManage ? `
    <!-- Formulario de categoría -->
    <div class="panel-card animate__animated animate__fadeInUp">
      <h3><i data-lucide="tag"></i> Nueva categoría</h3>
      <form id="form-categoria" novalidate autocomplete="off">
        <div class="form-grid">
          <div class="form-group">
            <label for="cat-name"><i data-lucide="tag"></i> Nombre</label>
            <input id="cat-name" name="name" type="text" placeholder="Ej: Bebidas" required>
          </div>
          <div class="form-group">
            <label for="cat-desc"><i data-lucide="file-text"></i> Descripción <span class="form-optional">(opcional)</span></label>
            <input id="cat-desc" name="description" type="text" placeholder="Descripción breve…">
          </div>
        </div>
        <button type="submit" class="btn-primary">
          <i data-lucide="plus-circle"></i> Crear categoría
        </button>
      </form>
    </div>

    <!-- Formulario de producto -->
    <div class="panel-card animate__animated animate__fadeInUp">
      <h3><i data-lucide="package"></i> Nuevo producto</h3>
      <form id="form-producto" novalidate autocomplete="off">
        <div class="form-grid">
          <div class="form-group">
            <label for="prod-name"><i data-lucide="package"></i> Nombre</label>
            <input id="prod-name" name="name" type="text" placeholder="Ej: Café Americano" required>
          </div>
          <div class="form-group">
            <label for="prod-cat"><i data-lucide="tag"></i> Categoría</label>
            <select id="prod-cat" name="category_id" required>
              <option value="">— Cargando categorías —</option>
            </select>
          </div>
          <div class="form-group">
            <label for="prod-qty"><i data-lucide="hash"></i> Cantidad inicial</label>
            <input id="prod-qty" name="quantity" type="number" min="0" step="1" placeholder="0" value="0">
          </div>
          <div class="form-group form-group--full">
            <label for="prod-desc"><i data-lucide="file-text"></i> Descripción <span class="form-optional">(opcional)</span></label>
            <input id="prod-desc" name="description" type="text" placeholder="Descripción del producto…">
          </div>
        </div>
        <button type="submit" class="btn-primary">
          <i data-lucide="plus-circle"></i> Crear producto
        </button>
      </form>
    </div>` : ''}

    <!-- Lista de categorías -->
    <div class="panel-card animate__animated animate__fadeInUp">
      <h3><i data-lucide="tag"></i> Categorías</h3>
      <div id="lista-categorias"><div class="empty-state"><i data-lucide="loader" class="empty-state__icon"></i><p>Cargando…</p></div></div>
    </div>

    <!-- Lista de productos -->
    <div class="panel-card animate__animated animate__fadeInUp">
      <h3><i data-lucide="package"></i> Productos</h3>
      <div id="lista-productos"><div class="empty-state"><i data-lucide="loader" class="empty-state__icon"></i><p>Cargando…</p></div></div>
    </div>
  `;
}

// ── Render de listas ──────────────────────────────────────────────────────────

function renderListas(canManage) {
  const catEl  = document.getElementById('lista-categorias');
  const prodEl = document.getElementById('lista-productos');
  const selCat = document.getElementById('prod-cat');

  if (catEl)  { catEl.innerHTML  = renderCategorias(estado.categorias, canManage); }
  if (prodEl) { prodEl.innerHTML = renderProductos(estado.productos, estado.categorias, canManage); }
  if (selCat) { selCat.innerHTML = renderCategoryOptions(estado.categorias); }
  refreshIcons();
}

// ── Carga de datos ────────────────────────────────────────────────────────────

async function cargarDatos(canManage) {
  try {
    [estado.categorias, estado.productos] = await Promise.all([
      obtenerCategorias(),
      obtenerProductos(),
    ]);
    renderListas(canManage);
  } catch (err) {
    const catEl  = document.getElementById('lista-categorias');
    const prodEl = document.getElementById('lista-productos');
    if (catEl)  catEl.innerHTML  = errorState(err.message);
    if (prodEl) prodEl.innerHTML = errorState(err.message);
    refreshIcons();
  }
}

// ── Controlador ───────────────────────────────────────────────────────────────

export const inventarioController = async () => {
  const { sectionEl, cleanup: shellCleanup } = setupShell();
  if (!sectionEl) return shellCleanup;

  const canManage = isSupervisor();

  sectionEl.innerHTML = buildSectionHTML(canManage);
  refreshIcons();

  await cargarDatos(canManage);

  // ── Listeners de formularios ────────────────────────────────────────────────

  const listeners = [];

  if (canManage) {
    // Formulario de categoría
    const formCat = document.getElementById('form-categoria');
    if (formCat) {
      const onCatSubmit = async (e) => {
        e.preventDefault();
        const name = formCat.name?.value?.trim() || '';
        const desc = formCat.description?.value?.trim() || '';
        const { success, data, errors } = validarConSchema(categoriaSchema, { name, description: desc || undefined });
        if (!success) { await showValidationErrors(errors); return; }
        try {
          await crearCategoria(data);
          await showSuccess('Categoría creada correctamente.');
          formCat.reset();
          await cargarDatos(canManage);
        } catch (err) { await showError(err.message || 'No se pudo crear la categoría.'); }
      };
      formCat.addEventListener('submit', onCatSubmit);
      listeners.push(() => formCat.removeEventListener('submit', onCatSubmit));
    }

    // Formulario de producto
    const formProd = document.getElementById('form-producto');
    if (formProd) {
      const onProdSubmit = async (e) => {
        e.preventDefault();
        const name       = formProd.name?.value?.trim() || '';
        const category_id = Number(formProd.category_id?.value) || 0;
        const quantity   = Number(formProd.quantity?.value) || 0;
        const description = formProd.description?.value?.trim() || '';
        const { success, data, errors } = validarConSchema(productoSchema, {
          name, category_id, quantity, description: description || undefined,
        });
        if (!success) { await showValidationErrors(errors); return; }
        try {
          await crearProducto(data);
          await showSuccess('Producto creado correctamente.');
          formProd.reset();
          await cargarDatos(canManage);
        } catch (err) { await showError(err.message || 'No se pudo crear el producto.'); }
      };
      formProd.addEventListener('submit', onProdSubmit);
      listeners.push(() => formProd.removeEventListener('submit', onProdSubmit));
    }
  }

  // Delegación de eventos para botones de acción (editar/eliminar)
  const onSectionClick = async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, id } = btn.dataset;

    // ── Editar categoría ──────────────────────────────────────────────────────
    if (action === 'edit-cat') {
      const cat = estado.categorias.find((c) => String(c.id) === String(id));
      if (!cat) return;

      const { value: formValues, isConfirmed } = await Swal.fire({
        title: 'Editar categoría',
        html: `
          <div style="text-align:left;margin-bottom:0.75rem">
            <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:0.3rem">Nombre</label>
            <input id="swal-cat-name" class="swal2-input" style="margin:0;width:100%;box-sizing:border-box"
              type="text" maxlength="100" placeholder="Nombre de la categoría"
              value="${escapeHtml(cat.name || '')}">
          </div>
          <div style="text-align:left">
            <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:0.3rem">Descripción <small style="font-weight:400">(opcional)</small></label>
            <input id="swal-cat-desc" class="swal2-input" style="margin:0;width:100%;box-sizing:border-box"
              type="text" maxlength="500" placeholder="Descripción breve…"
              value="${escapeHtml(cat.description || '')}">
          </div>`,
        showCancelButton:   true,
        confirmButtonText:  'Guardar cambios',
        cancelButtonText:   'Cancelar',
        confirmButtonColor: '#1e3a5f',
        cancelButtonColor:  '#6b7280',
        focusConfirm:       false,
        preConfirm: () => ({
          name:        document.getElementById('swal-cat-name')?.value?.trim() || '',
          description: document.getElementById('swal-cat-desc')?.value?.trim() || '',
        }),
      });

      if (!isConfirmed) return;

      const { success, data, errors } = validarConSchema(categoriaSchema, {
        name:        formValues.name,
        description: formValues.description || undefined,
      });
      if (!success) { await showValidationErrors(errors); return; }

      try {
        await actualizarCategoria(id, data);
        await showSuccess('Categoría actualizada correctamente.');
        await cargarDatos(canManage);
      } catch (err) { await showError(err.message || 'No se pudo actualizar la categoría.'); }
    }

    // ── Editar producto ───────────────────────────────────────────────────────
    if (action === 'edit-prod') {
      const prod = estado.productos.find((p) => String(p.id) === String(id));
      if (!prod) return;

      const catOptions = estado.categorias
        .map((c) => `<option value="${c.id}" ${String(c.id) === String(prod.category_id) ? 'selected' : ''}>${escapeHtml(c.name)}</option>`)
        .join('');

      const { value: formValues, isConfirmed } = await Swal.fire({
        title: 'Editar producto',
        html: `
          <div style="text-align:left;margin-bottom:0.75rem">
            <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:0.3rem">Nombre</label>
            <input id="swal-prod-name" class="swal2-input" style="margin:0;width:100%;box-sizing:border-box"
              type="text" maxlength="150" placeholder="Nombre del producto"
              value="${escapeHtml(prod.name || '')}">
          </div>
          <div style="text-align:left;margin-bottom:0.75rem">
            <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:0.3rem">Categoría</label>
            <select id="swal-prod-cat" style="
              display:block;width:100%;box-sizing:border-box;
              margin:0;padding:0.375em 0.625em;height:2.625em;
              border:1px solid #d9d9d9;border-radius:0.1875em;
              font-size:1.125em;font-family:inherit;color:inherit;
              background:transparent;cursor:pointer;outline:none;
              transition:border-color .1s,box-shadow .1s;">
              ${catOptions}
            </select>
          </div>
          <div style="text-align:left;margin-bottom:0.75rem">
            <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:0.3rem">Stock</label>
            <input id="swal-prod-qty" class="swal2-input" style="margin:0;width:100%;box-sizing:border-box"
              type="number" min="0" step="1" value="${Number(prod.quantity ?? 0)}">
          </div>
          <div style="text-align:left">
            <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:0.3rem">Descripción <small style="font-weight:400">(opcional)</small></label>
            <input id="swal-prod-desc" class="swal2-input" style="margin:0;width:100%;box-sizing:border-box"
              type="text" maxlength="1000" placeholder="Descripción del producto…"
              value="${escapeHtml(prod.description || '')}">
          </div>`,
        showCancelButton:   true,
        confirmButtonText:  'Guardar cambios',
        cancelButtonText:   'Cancelar',
        confirmButtonColor: '#1e3a5f',
        cancelButtonColor:  '#6b7280',
        focusConfirm:       false,
        preConfirm: () => ({
          name:        document.getElementById('swal-prod-name')?.value?.trim() || '',
          category_id: Number(document.getElementById('swal-prod-cat')?.value) || 0,
          quantity:    Number(document.getElementById('swal-prod-qty')?.value) || 0,
          description: document.getElementById('swal-prod-desc')?.value?.trim() || '',
        }),
      });

      if (!isConfirmed) return;

      const { success, data, errors } = validarConSchema(productoSchema, {
        name:        formValues.name,
        category_id: formValues.category_id,
        quantity:    formValues.quantity,
        description: formValues.description || undefined,
      });
      if (!success) { await showValidationErrors(errors); return; }

      try {
        await actualizarProducto(id, data);
        await showSuccess('Producto actualizado correctamente.');
        await cargarDatos(canManage);
      } catch (err) { await showError(err.message || 'No se pudo actualizar el producto.'); }
    }

    // ── Eliminar categoría ────────────────────────────────────────────────────
    if (action === 'delete-cat') {
      const ok = await showConfirm({ title: 'Eliminar categoría', text: 'Esta acción no se puede deshacer.', icon: 'warning' });
      if (!ok) return;
      try {
        await eliminarCategoria(id);
        await showSuccess('Categoría eliminada.');
        await cargarDatos(canManage);
      } catch (err) { await showError(err.message); }
    }

    // ── Eliminar producto ─────────────────────────────────────────────────────
    if (action === 'delete-prod') {
      const ok = await showConfirm({ title: 'Eliminar producto', text: 'Esta acción no se puede deshacer.', icon: 'warning' });
      if (!ok) return;
      try {
        await eliminarProducto(id);
        await showSuccess('Producto eliminado.');
        await cargarDatos(canManage);
      } catch (err) { await showError(err.message); }
    }
  };

  sectionEl.addEventListener('click', onSectionClick);
  listeners.push(() => sectionEl.removeEventListener('click', onSectionClick));

  return () => {
    listeners.forEach((fn) => fn());
    shellCleanup();
  };
};
