/**
 * Módulo de Autenticación — Vista y Controlador de Login
 * El Rincón Gastronómico
 */

import { loginWithCredentials } from '../../services/authService.js';
import { loginSchema, validarConSchema } from '../../utils/validaciones.js';
import { showValidationErrors, showError } from '../../ui/notificationsUi.js';
import { refreshIcons } from '../../components/icons.js';

// ── Vista de Login ────────────────────────────────────────────────────────────

export const loginView = () => `
  <div class="login-wrapper animate__animated animate__fadeIn">
    <div class="login-card">

      <div class="login-card__brand">
        <img
          class="login-card__logo"
          src="/assets/img/Gemini_Generated_Image_717eyy717eyy717e.png"
          alt="Logo El Rincón Gastronómico"
          onerror="this.style.display='none'"
        >
        <h1 class="login-card__title">El Rincón Gastronómico</h1>
        <p class="login-card__subtitle">Sistema de Inventario</p>
      </div>

      <form id="login-form" novalidate autocomplete="off">
        <div class="form-group">
          <label for="login-username">
            <i data-lucide="user"></i> Usuario
          </label>
          <input
            id="login-username"
            name="username"
            type="text"
            placeholder="Ej: admin"
            autocomplete="username"
            required
          >
        </div>

        <div class="form-group">
          <label for="login-password">
            <i data-lucide="lock"></i> Contraseña
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          >
        </div>

        <span id="login-error" class="field-error" role="alert" aria-live="assertive"></span>

        <button type="submit" class="btn-primary btn--full" style="margin-top:1rem;">
          <i data-lucide="log-in"></i> Iniciar sesión
        </button>
      </form>
    </div>
  </div>
`;

// ── Controlador de Login ──────────────────────────────────────────────────────

export const loginController = () => {
  const form       = document.getElementById('login-form');
  const usernameEl = document.getElementById('login-username');
  const passwordEl = document.getElementById('login-password');
  const errorEl    = document.getElementById('login-error');

  if (!form) return null;

  const clearError = () => {
    if (errorEl) errorEl.textContent = '';
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    clearError();

    const username = usernameEl?.value?.trim() || '';
    const password = passwordEl?.value           || '';

    // Validación con Zod
    const { success, data, errors } = validarConSchema(loginSchema, { username, password });

    if (!success) {
      await showValidationErrors(errors);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Iniciando sesión…';
    }

    try {
      await loginWithCredentials(data.username, data.password);
      window.location.hash = '#/home';
    } catch (error) {
      const msg = error?.message || 'No fue posible iniciar sesión. Verifica tus credenciales.';
      if (errorEl) errorEl.textContent = msg;
      await showError(msg);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i data-lucide="log-in"></i> Iniciar sesión';
        refreshIcons(submitBtn);
      }
    }
  };

  form.addEventListener('submit', onSubmit);

  // Cleanup: remover listener al desmontar la vista
  return () => {
    form.removeEventListener('submit', onSubmit);
  };
};
