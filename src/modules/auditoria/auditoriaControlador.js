/**
 * Controlador de Auditoría — El Rincón Gastronómico
 *
 * Muestra el historial completo de logs, actividad por usuario
 * y permite registrar hallazgos manuales.
 */

import { setupShell } from '../home/shellController.js';
import { refreshIcons } from '../../components/icons.js';
import { showSuccess, showError, showValidationErrors } from '../../ui/notificationsUi.js';
import { renderHistorialCompleto, renderResumenUsuarios, renderDetallePorUsuario } from '../../ui/auditoriaUi.js';
import { errorState } from '../../ui/uiHelpers.js';
import { obtenerLogsAuditoria, registrarHallazgo, agruparPorUsuario } from '../../services/auditoriaService.js';
import { hallazgoSchema, validarConSchema } from '../../utils/validaciones.js';
import { isSupervisor } from '../../core/permissions.js';

// ── HTML de la sección ────────────────────────────────────────────────────────

function buildSectionHTML(canManage) {
  return `
    <div class="section-header animate__animated animate__fadeIn">
      <h2><i data-lucide="file-clock"></i> Auditoría del sistema</h2>
      <p>Consulta el historial de acciones internas para seguimiento y control administrativo.</p>
    </div>

    <!-- Reporte por usuario -->
    <div class="panel-card animate__animated animate__fadeInUp">
      <h3><i data-lucide="bar-chart-3"></i> Actividad por usuario</h3>
      <div class="auditoria-grid">
        <div id="resumen-usuarios"></div>
        <div id="detalle-usuarios"></div>
      </div>
    </div>

    <!-- Historial completo -->
    <div class="panel-card animate__animated animate__fadeInUp">
      <h3><i data-lucide="list"></i> Historial completo de auditoría</h3>
      <div id="historial-auditoria">
        <div class="empty-state">
          <i data-lucide="loader" class="empty-state__icon"></i>
          <p>Cargando historial…</p>
        </div>
      </div>
    </div>

    ${canManage ? `
    <!-- Registro manual de hallazgo -->
    <div class="panel-card animate__animated animate__fadeInUp">
      <h3><i data-lucide="clipboard-pen"></i> Registrar hallazgo</h3>
      <p class="panel-desc">Registra manualmente un evento de auditoría con acción y tabla afectada.</p>
      <form id="form-hallazgo" novalidate autocomplete="off">
        <div class="form-grid">
          <div class="form-group">
            <label for="aud-tabla"><i data-lucide="database"></i> Tabla afectada</label>
            <select id="aud-tabla" name="affected_table">
              <option value="products">products</option>
              <option value="categories">categories</option>
              <option value="users">users</option>
              <option value="audit_logs">audit_logs</option>
              <option value="roles">roles</option>
            </select>
          </div>
          <div class="form-group">
            <label for="aud-accion"><i data-lucide="zap"></i> Tipo de acción</label>
            <select id="aud-accion" name="action">
              <option value="">— Seleccione —</option>
              <option value="CREATE">CREATE — Creación</option>
              <option value="UPDATE">UPDATE — Actualización</option>
              <option value="DELETE">DELETE — Eliminación</option>
              <option value="READ">READ — Consulta</option>
              <option value="RESTORE">RESTORE — Restauración</option>
            </select>
          </div>
          <div class="form-group">
            <label for="aud-registro"><i data-lucide="hash"></i> ID del registro</label>
            <input id="aud-registro" name="record_id" type="number" min="1" step="1" placeholder="Ej: 1">
          </div>
          <div class="form-group form-group--full">
            <label for="aud-detalles"><i data-lucide="file-text"></i> Detalles del hallazgo</label>
            <textarea id="aud-detalles" name="details" rows="3" placeholder="Describe el hallazgo…"></textarea>
          </div>
        </div>
        <button type="submit" class="btn-primary">
          <i data-lucide="clipboard-check"></i> Registrar hallazgo
        </button>
      </form>
    </div>` : ''}
  `;
}

// ── Render de datos ───────────────────────────────────────────────────────────

async function cargarAuditoria() {
  const histEl    = document.getElementById('historial-auditoria');
  const resumenEl = document.getElementById('resumen-usuarios');
  const detalleEl = document.getElementById('detalle-usuarios');

  try {
    const logs       = await obtenerLogsAuditoria();
    const porUsuario = agruparPorUsuario(logs);

    if (histEl)    { histEl.innerHTML    = renderHistorialCompleto(logs); }
    if (resumenEl) { resumenEl.innerHTML = renderResumenUsuarios(porUsuario); }
    if (detalleEl) { detalleEl.innerHTML = renderDetallePorUsuario(porUsuario); }
  } catch (err) {
    if (histEl)    histEl.innerHTML    = errorState(err.message);
    if (resumenEl) resumenEl.innerHTML = '';
    if (detalleEl) detalleEl.innerHTML = '';
  }

  refreshIcons();
}

// ── Controlador ───────────────────────────────────────────────────────────────

export const auditoriaController = async () => {
  const { sectionEl, cleanup: shellCleanup } = setupShell();
  if (!sectionEl) return shellCleanup;

  const canManage = isSupervisor();

  sectionEl.innerHTML = buildSectionHTML(canManage);
  refreshIcons();

  await cargarAuditoria();

  if (!canManage) return shellCleanup;

  const form = document.getElementById('form-hallazgo');
  if (!form) return shellCleanup;

  const onSubmit = async (e) => {
    e.preventDefault();

    const action         = form.action?.value || '';
    const affected_table = form.affected_table?.value || '';
    const record_id      = Number(form.record_id?.value) || 0;
    const details        = form.details?.value?.trim() || '';

    const { success, data, errors } = validarConSchema(hallazgoSchema, {
      action, affected_table, record_id, details: details || undefined,
    });

    if (!success) { await showValidationErrors(errors); return; }

    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      await registrarHallazgo(data);
      await showSuccess('Hallazgo registrado correctamente.');
      form.reset();
      await cargarAuditoria();
    } catch (err) {
      await showError(err.message || 'No se pudo registrar el hallazgo.');
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
