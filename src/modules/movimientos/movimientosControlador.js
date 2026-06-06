/**
 * Controlador de Movimientos de Stock — El Rincón Gastronómico
 *
 * Permite registrar entradas y salidas de stock como logs de auditoría.
 * El tipo ('entrada'|'salida') puede pre-seleccionarse vía params de ruta.
 */

import { setupShell } from '../home/shellController.js';
import { refreshIcons } from '../../components/icons.js';
import { showSuccess, showError, showValidationErrors } from '../../ui/notificationsUi.js';
import { renderHistorialMovimientos } from '../../ui/movimientosUi.js';
import { errorState } from '../../ui/uiHelpers.js';
import { registrarMovimiento, obtenerHistorialMovimientos } from '../../services/movimientosService.js';
import { movimientoSchema, validarConSchema } from '../../utils/validaciones.js';

// ── HTML de la sección ────────────────────────────────────────────────────────

function buildSectionHTML(defaultTipo = '') {
  const selectedEntrada = defaultTipo === 'entrada' ? 'selected' : '';
  const selectedSalida  = defaultTipo === 'salida'  ? 'selected' : '';
  const selectedAjuste  = defaultTipo === 'ajuste'  ? 'selected' : '';

  return `
    <div class="section-header animate__animated animate__fadeIn">
      <h2><i data-lucide="arrow-left-right"></i> Movimientos de stock</h2>
      <p>Registra entradas, salidas y ajustes para conservar la trazabilidad diaria del inventario.</p>
    </div>

    <div class="panel-card animate__animated animate__fadeInUp">
      <h3><i data-lucide="plus-circle"></i> Registrar movimiento</h3>
      <form id="form-movimiento" novalidate autocomplete="off">
        <div class="form-grid">
          <div class="form-group">
            <label for="mov-tipo"><i data-lucide="arrow-left-right"></i> Tipo de movimiento</label>
            <select id="mov-tipo" name="tipo" required>
              <option value="">— Seleccione —</option>
              <option value="entrada" ${selectedEntrada}>Entrada de stock</option>
              <option value="salida"  ${selectedSalida}>Salida de stock</option>
              <option value="ajuste"  ${selectedAjuste}>Ajuste de stock</option>
            </select>
          </div>
          <div class="form-group">
            <label for="mov-producto"><i data-lucide="package"></i> Producto</label>
            <input id="mov-producto" name="producto" type="text" placeholder="Ej: Café Americano" required>
          </div>
          <div class="form-group">
            <label for="mov-cantidad"><i data-lucide="hash"></i> Cantidad</label>
            <input id="mov-cantidad" name="cantidad" type="number" min="1" step="1" placeholder="Ej: 10" required>
          </div>
          <div class="form-group form-group--full">
            <label for="mov-motivo"><i data-lucide="message-square"></i> Motivo</label>
            <input id="mov-motivo" name="motivo" type="text" placeholder="Ej: Reabastecimiento semanal" required>
          </div>
        </div>
        <button type="submit" class="btn-primary">
          <i data-lucide="check-circle"></i> Registrar movimiento
        </button>
      </form>
    </div>

    <div class="panel-card animate__animated animate__fadeInUp">
      <h3><i data-lucide="history"></i> Historial de movimientos</h3>
      <div id="historial-movimientos">
        <div class="empty-state">
          <i data-lucide="loader" class="empty-state__icon"></i>
          <p>Cargando historial…</p>
        </div>
      </div>
    </div>
  `;
}

// ── Controlador ───────────────────────────────────────────────────────────────

export const movimientosController = async ({ params = {} } = {}) => {
  const { sectionEl, cleanup: shellCleanup } = setupShell();
  if (!sectionEl) return shellCleanup;

  // Tipo pre-seleccionado desde la ruta (#/movimientos/entrada o /salida)
  const defaultTipo = params?.tipo || '';

  sectionEl.innerHTML = buildSectionHTML(defaultTipo);
  refreshIcons();

  // Cargar historial
  async function refreshHistorial() {
    const el = document.getElementById('historial-movimientos');
    if (!el) return;
    try {
      const logs = await obtenerHistorialMovimientos();
      el.innerHTML = renderHistorialMovimientos(logs);
    } catch (err) {
      el.innerHTML = errorState(err.message);
    }
    refreshIcons();
  }

  await refreshHistorial();

  // Formulario de registro
  const form = document.getElementById('form-movimiento');
  if (!form) return shellCleanup;

  const onSubmit = async (e) => {
    e.preventDefault();

    const tipo     = form.tipo?.value     || '';
    const producto = form.producto?.value?.trim() || '';
    const cantidad = form.cantidad?.value !== '' ? Number(form.cantidad?.value) : NaN;
    const motivo   = form.motivo?.value?.trim()  || '';

    const { success, data, errors } = validarConSchema(movimientoSchema, { tipo, producto, cantidad, motivo });
    if (!success) { await showValidationErrors(errors); return; }

    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      await registrarMovimiento(data);
      await showSuccess(`Movimiento de ${data.tipo} registrado correctamente.`);
      form.reset();
      if (defaultTipo && form.tipo) form.tipo.value = defaultTipo;
      await refreshHistorial();
    } catch (err) {
      await showError(err.message || 'No se pudo registrar el movimiento.');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  };

  form.addEventListener('submit', onSubmit);

  return () => {
    form.removeEventListener('submit', onSubmit);
    shellCleanup();
  };
};
