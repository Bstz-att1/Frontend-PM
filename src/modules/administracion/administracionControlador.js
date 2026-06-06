/**
 * Controlador de Administración de Usuarios — El Rincón Gastronómico
 *
 * Solo accesible para el rol 'admin'.
 * Permite ver, crear y eliminar usuarios del sistema.
 */

import { setupShell } from '../home/shellController.js';
import { refreshIcons } from '../../components/icons.js';
import { showSuccess, showError, showValidationErrors, showConfirm } from '../../ui/notificationsUi.js';
import { renderUsuarios } from '../../ui/administracionUi.js';
import { errorState } from '../../ui/uiHelpers.js';
import {
  obtenerUsuarios, crearUsuario, eliminarUsuario, filtrarUsuarios,
} from '../../services/administracionService.js';
import { crearUsuarioSchema, validarConSchema } from '../../utils/validaciones.js';
import { isAdmin } from '../../core/permissions.js';

// ── Estado del módulo ─────────────────────────────────────────────────────────

const estado = {
  usuarios:   [],
  search:     '',
  roleFilter: '',
};

// ── HTML de la sección ────────────────────────────────────────────────────────

function buildSectionHTML(canManage) {
  return `
    <div class="section-header animate__animated animate__fadeIn">
      <h2><i data-lucide="shield-check"></i> Administración de usuarios</h2>
      <p>Gestiona los usuarios y roles del sistema de inventario.</p>
    </div>

    ${canManage ? `
    <!-- Formulario de nuevo usuario -->
    <div class="panel-card animate__animated animate__fadeInUp">
      <h3><i data-lucide="user-plus"></i> Nuevo usuario</h3>
      <form id="form-usuario" novalidate autocomplete="off">
        <div class="form-grid">
          <div class="form-group">
            <label for="usr-doc"><i data-lucide="id-card"></i> Documento</label>
            <input id="usr-doc" name="document" type="text" placeholder="Ej: 1234567890" required>
          </div>
          <div class="form-group">
            <label for="usr-name"><i data-lucide="user"></i> Nombre completo</label>
            <input id="usr-name" name="name" type="text" placeholder="Ej: Juan Pérez" required>
          </div>
          <div class="form-group">
            <label for="usr-username"><i data-lucide="at-sign"></i> Nombre de usuario</label>
            <input id="usr-username" name="username" type="text" placeholder="Ej: jperez" required>
          </div>
          <div class="form-group">
            <label for="usr-pass"><i data-lucide="lock"></i> Contraseña</label>
            <div class="password-wrapper">
              <input id="usr-pass" name="password" type="password" placeholder="Mín. 8 caracteres" required>
              <button type="button" class="btn-password-toggle" data-target="usr-pass" aria-label="Mostrar contraseña">
                <i data-lucide="eye"></i>
              </button>
            </div>
            <span class="form-hint">Debe incluir mayúscula, minúscula, número y carácter especial.</span>
          </div>
          <div class="form-group">
            <label for="usr-pass-confirm"><i data-lucide="lock-keyhole"></i> Confirmar contraseña</label>
            <div class="password-wrapper">
              <input id="usr-pass-confirm" name="password_confirm" type="password" placeholder="Repite la contraseña" required>
              <button type="button" class="btn-password-toggle" data-target="usr-pass-confirm" aria-label="Mostrar contraseña">
                <i data-lucide="eye"></i>
              </button>
            </div>
          </div>
          <div class="form-group">
            <label for="usr-rol"><i data-lucide="shield"></i> Rol</label>
            <select id="usr-rol" name="roles">
              <option value="user">Usuario</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>
        <button type="submit" class="btn-primary">
          <i data-lucide="user-plus"></i> Crear usuario
        </button>
      </form>
    </div>` : ''}

    <!-- Filtros y lista de usuarios -->
    <div class="panel-card animate__animated animate__fadeInUp">
      <h3><i data-lucide="users"></i> Usuarios registrados</h3>
      <div class="users-toolbar">
        <input id="search-users" type="text" placeholder="Buscar por nombre o usuario…">
        <select id="filter-role">
          <option value="">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="supervisor">Supervisor</option>
          <option value="user">Usuario</option>
        </select>
      </div>
      <div id="lista-usuarios">
        <div class="empty-state">
          <i data-lucide="loader" class="empty-state__icon"></i>
          <p>Cargando usuarios…</p>
        </div>
      </div>
    </div>
  `;
}

// ── Render de lista ───────────────────────────────────────────────────────────

function renderListaUsuarios(canManage) {
  const el = document.getElementById('lista-usuarios');
  if (!el) return;
  const filtrados = filtrarUsuarios(estado.usuarios, {
    search:     estado.search,
    roleFilter: estado.roleFilter,
  });
  el.innerHTML = renderUsuarios(filtrados, canManage);
  refreshIcons();
}

// ── Controlador ───────────────────────────────────────────────────────────────

export const administracionController = async () => {
  const { sectionEl, cleanup: shellCleanup } = setupShell();
  if (!sectionEl) return shellCleanup;

  const canManage = isAdmin();

  sectionEl.innerHTML = buildSectionHTML(canManage);
  refreshIcons();

  // Cargar usuarios
  try {
    estado.usuarios = await obtenerUsuarios();
    renderListaUsuarios(canManage);
  } catch (err) {
    const el = document.getElementById('lista-usuarios');
    if (el) el.innerHTML = errorState(err.message);
    refreshIcons();
  }

  const listeners = [];

  // Búsqueda en tiempo real
  const searchEl = document.getElementById('search-users');
  const filterEl = document.getElementById('filter-role');

  if (searchEl) {
    const onSearch = (e) => { estado.search = e.target.value; renderListaUsuarios(canManage); };
    searchEl.addEventListener('input', onSearch);
    listeners.push(() => searchEl.removeEventListener('input', onSearch));
  }
  if (filterEl) {
    const onFilter = (e) => { estado.roleFilter = e.target.value; renderListaUsuarios(canManage); };
    filterEl.addEventListener('change', onFilter);
    listeners.push(() => filterEl.removeEventListener('change', onFilter));
  }

  // Formulario de creación
  if (canManage) {
    const form = document.getElementById('form-usuario');
    if (form) {
      const onSubmit = async (e) => {
        e.preventDefault();
        const document_       = form.document?.value?.trim()         || '';
        const name            = form.name?.value?.trim()              || '';
        const username        = form.username?.value?.trim()          || '';
        const password        = form.password?.value                  || '';
        const passwordConfirm = form.password_confirm?.value          || '';
        const roles           = [form.roles?.value                    || 'user'];

        if (password !== passwordConfirm) {
          await showValidationErrors(['Las contraseñas no coinciden.']);
          return;
        }

        const { success, data, errors } = validarConSchema(crearUsuarioSchema, {
          document: document_, name, username, password, roles,
        });
        if (!success) { await showValidationErrors(errors); return; }

        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
          const newUser = await crearUsuario({
            document: data.document, name: data.name,
            username: data.username, password: data.password,
            roles: data.roles,
          });
          estado.usuarios.unshift(newUser);
          renderListaUsuarios(canManage);
          await showSuccess('Usuario creado correctamente.');
          form.reset();
        } catch (err) {
          await showError(err.message || 'No se pudo crear el usuario.');
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      };
      form.addEventListener('submit', onSubmit);
      listeners.push(() => form.removeEventListener('submit', onSubmit));
    }
  }

  // Delegación de eventos: toggle contraseña + eliminar usuario
  const onSectionClick = async (e) => {
    // Toggle visibilidad de contraseña
    const toggleBtn = e.target.closest('.btn-password-toggle');
    if (toggleBtn) {
      const targetId = toggleBtn.dataset.target;
      const input    = document.getElementById(targetId);
      if (input) {
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        const icon = toggleBtn.querySelector('i[data-lucide]');
        if (icon) {
          icon.setAttribute('data-lucide', isHidden ? 'eye-off' : 'eye');
          refreshIcons(toggleBtn);
        }
      }
      return;
    }

    const btn = e.target.closest('[data-action="delete-user"]');
    if (!btn) return;
    const { id } = btn.dataset;

    const ok = await showConfirm({
      title: 'Eliminar usuario',
      text:  'Esta acción eliminará el usuario de forma permanente.',
      icon:  'warning',
    });
    if (!ok) return;

    try {
      await eliminarUsuario(id);
      estado.usuarios = estado.usuarios.filter((u) => String(u.id) !== String(id));
      renderListaUsuarios(canManage);
      await showSuccess('Usuario eliminado correctamente.');
    } catch (err) {
      await showError(err.message || 'No se pudo eliminar el usuario.');
    }
  };

  sectionEl.addEventListener('click', onSectionClick);
  listeners.push(() => sectionEl.removeEventListener('click', onSectionClick));

  return () => {
    listeners.forEach((fn) => fn());
    shellCleanup();
  };
};
