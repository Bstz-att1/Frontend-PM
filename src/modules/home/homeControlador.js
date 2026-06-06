/**
 * Controlador de la vista principal (panel de bienvenida) — El Rincón Gastronómico
 *
 * Responsabilidades:
 * 1. Renderiza el panel de bienvenida en #seccion-contenido.
 * 2. Gestiona el botón de logout.
 * 3. Escucha el evento de sesión expirada.
 * 4. Retorna cleanup para desmontaje seguro.
 */

import { logoutCurrentSession, getSessionUser } from '../../services/authService.js';
import { showConfirm, showSuccess, showError } from '../../ui/notificationsUi.js';
import { refreshIcons } from '../../components/icons.js';
import { escapeHtml } from '../../ui/uiHelpers.js';

// ── Panel de bienvenida ───────────────────────────────────────────────────────

function renderWelcomeContent() {
  const user = getSessionUser();
  const ROLE_MAP = { admin: 'Administrador', supervisor: 'Supervisor', user: 'Usuario' };

  const roles = Array.isArray(user?.roles) ? user.roles : (user?.role ? [user.role] : []);
  const roleLabel = roles.map((r) => ROLE_MAP[String(r).toLowerCase()] || r).join(', ');

  return `
    <div class="welcome-header animate__animated animate__fadeInDown">
      <div class="welcome-user-badge">
        <i data-lucide="circle-user-round" class="welcome-user-icon"></i>
        <div>
          <span class="welcome-greeting">Hola, <strong>${escapeHtml(user?.name || user?.username || '')}</strong></span>
          ${roleLabel ? `<span class="welcome-role">${escapeHtml(roleLabel)}</span>` : ''}
        </div>
      </div>
      <h2 class="welcome-title">Panel operativo diario</h2>
      <p class="welcome-subtitle">Selecciona una opción del menú lateral para gestionar el inventario con orden y precisión.</p>
    </div>

    <div class="stats-grid animate__animated animate__fadeInUp">
      <div class="stat-card" data-nav="#/inventario">
        <i data-lucide="boxes" class="stat-icon"></i>
        <div class="stat-info">
          <span class="stat-label">Inventario</span>
          <span class="stat-desc">Productos y categorías</span>
        </div>
      </div>
      <div class="stat-card" data-nav="#/movimientos">
        <i data-lucide="arrow-left-right" class="stat-icon"></i>
        <div class="stat-info">
          <span class="stat-label">Movimientos</span>
          <span class="stat-desc">Entradas y salidas de stock</span>
        </div>
      </div>
      <div class="stat-card" data-nav="#/auditoria">
        <i data-lucide="file-clock" class="stat-icon"></i>
        <div class="stat-info">
          <span class="stat-label">Auditoría</span>
          <span class="stat-desc">Trazabilidad de operaciones</span>
        </div>
      </div>
      <div class="stat-card" data-nav="#/administracion">
        <i data-lucide="shield-check" class="stat-icon"></i>
        <div class="stat-info">
          <span class="stat-label">Administración</span>
          <span class="stat-desc">Usuarios del sistema</span>
        </div>
      </div>
    </div>

    <section class="welcome-info-grid animate__animated animate__fadeInUp">
      <article class="info-card">
        <div class="info-card__icon"><i data-lucide="target"></i></div>
        <h3 class="info-card__title">Objetivo institucional</h3>
        <p class="info-card__text">Ofrecer una experiencia gastronómica que combine calidad constante en cada plato, servicio amable y ambiente acogedor. Usamos ingredientes frescos y locales para ser el restaurante de referencia en confianza, sabor y bienestar.</p>
      </article>
      <article class="info-card">
        <div class="info-card__icon"><i data-lucide="eye"></i></div>
        <h3 class="info-card__title">Visión</h3>
        <p class="info-card__text">Consolidarnos como referente gastronómico de la región mediante la excelencia operativa y el uso de herramientas tecnológicas que potencien el trabajo de cada colaborador.</p>
      </article>
    </section>

    <section class="testimonials-section animate__animated animate__fadeIn">
      <h3 class="testimonials-title">
        <i data-lucide="message-square-quote"></i>
        Voces de nuestro equipo
      </h3>
      <div class="testimonials-grid">
        <blockquote class="testimonial-card"><p>"El sistema nos ha permitido reducir errores y mejorar la trazabilidad."</p><cite>— Laura Méndez</cite></blockquote>
        <blockquote class="testimonial-card"><p>"La interfaz es clara y fácil de usar, lo que agiliza nuestro trabajo."</p><cite>— Carlos Ríos</cite></blockquote>
        <blockquote class="testimonial-card"><p>"Ahora tenemos más control del inventario y evitamos faltantes en horas pico."</p><cite>— Andrea Salazar</cite></blockquote>
        <blockquote class="testimonial-card"><p>"Los reportes nos ayudan a tomar decisiones más rápidas y acertadas."</p><cite>— Felipe Montoya</cite></blockquote>
      </div>
    </section>
  `;
}

// ── Controlador principal ─────────────────────────────────────────────────────

export const homeController = () => {
  const seccion   = document.getElementById('seccion-contenido');
  const logoutBtn = document.getElementById('logout-btn');

  if (!seccion) return null;

  // Renderizar contenido de bienvenida
  seccion.innerHTML = renderWelcomeContent();
  refreshIcons();

  // Stat cards: click redirige a la sección correspondiente
  const handleStatClick = (event) => {
    const card = event.target.closest('.stat-card[data-nav]');
    if (!card) return;
    window.location.hash = card.dataset.nav;
  };
  seccion.addEventListener('click', handleStatClick);

  // Logout
  const handleLogout = async () => {
    const confirmed = await showConfirm({
      title:             '¿Cerrar sesión?',
      text:              'Tu sesión actual será terminada de forma segura.',
      confirmButtonText: 'Sí, salir',
      cancelButtonText:  'Cancelar',
      icon:              'question',
    });

    if (!confirmed) return;

    logoutBtn?.setAttribute('disabled', 'true');
    try {
      await logoutCurrentSession();
      showSuccess('Sesión cerrada correctamente.');
      window.location.hash = '#/login';
    } catch (err) {
      console.error('[homeController] Error al cerrar sesión:', err);
      showError('No se pudo cerrar sesión. Inténtalo de nuevo.');
    } finally {
      logoutBtn?.removeAttribute('disabled');
    }
  };

  logoutBtn?.addEventListener('click', handleLogout);

  // Sesión expirada: redirigir a login
  const handleSessionExpired = () => {
    window.location.hash = '#/login';
  };
  window.addEventListener('auth:session-expired', handleSessionExpired);

  // Cleanup
  return () => {
    seccion.removeEventListener('click', handleStatClick);
    logoutBtn?.removeEventListener('click', handleLogout);
    window.removeEventListener('auth:session-expired', handleSessionExpired);
  };
};
