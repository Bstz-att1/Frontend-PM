/**
 * Vista Shell de la Aplicación — El Rincón Gastronómico
 *
 * Renderiza el layout principal: header + sidebar + área de contenido.
 * El área de contenido (#seccion-contenido) es rellenada por cada
 * controlador de sección específico.
 */

import { getSessionUser } from '../../services/authService.js';
import { escapeHtml } from '../../ui/uiHelpers.js';

// Mapeo hash → data-route para marcar el link activo en el sidebar
const ROUTE_TO_SIDEBAR = {
  '#/home':           'welcome',
  '#/inventario':     'inventario',
  '#/movimientos':    'movimientos',
  '#/movimientos/entrada': 'movimientos',
  '#/movimientos/salida':  'movimientos',
  '#/auditoria':      'auditoria',
  '#/administracion': 'administracion',
};

/**
 * Genera el HTML del shell completo.
 * @param {{ params?: Object }} context
 */
export const homeView = ({ params = {} } = {}) => {
  const user     = getSessionUser();
  const userName = escapeHtml(user?.name || user?.username || 'Usuario');

  const currentHash = window.location.hash || '#/home';
  const activeRoute = ROUTE_TO_SIDEBAR[currentHash] || 'welcome';

  const sidebarLinks = [
    { route: 'welcome',        href: '#/home',            icon: 'layout-dashboard', label: 'Panel principal' },
    { route: 'inventario',     href: '#/inventario',      icon: 'boxes',            label: 'Inventario' },
    { route: 'movimientos',    href: '#/movimientos',     icon: 'arrow-left-right', label: 'Movimientos' },
    { separator: true },
    { route: 'auditoria',      href: '#/auditoria',       icon: 'file-clock',       label: 'Auditoría' },
    { route: 'administracion', href: '#/administracion',  icon: 'shield-check',     label: 'Administración' },
  ];

  const sidebarItems = sidebarLinks.map((link) => {
    if (link.separator) return `<li role="separator"><div class="sidebar__divider"></div></li>`;
    const isActive = link.route === activeRoute ? 'sidebar__link--active' : '';
    return `
      <li class="sidebar__item">
        <a class="sidebar__link ${isActive}" href="${link.href}" data-route="${link.route}">
          <i data-lucide="${link.icon}"></i>
          ${link.label}
        </a>
      </li>`;
  }).join('');

  return `
    <div class="app-shell">

      <!-- ── HEADER ──────────────────────────────────────────────────── -->
      <header class="site-header">
        <a class="site-header__brand" href="#/home" aria-label="Inicio">
          <img
            class="site-header__logo"
            src="/assets/img/Gemini_Generated_Image_717eyy717eyy717e.png"
            alt="Logo El Rincón Gastronómico"
            onerror="this.style.display='none'"
          >
          <div>
            <h1 class="site-header__title">El Rincón Gastronómico</h1>
            <span class="site-header__subtitle">Sistema de Inventario</span>
          </div>
        </a>

        <div class="site-header__actions">
          <span class="header-user-name">
            <i data-lucide="circle-user-round"></i>
            ${userName}
          </span>
          <button id="logout-btn" class="logout-btn" type="button">
            <i data-lucide="log-out"></i> Cerrar sesión
          </button>
        </div>
      </header>

      <!-- ── LAYOUT ───────────────────────────────────────────────────── -->
      <div class="layout layout--main">

        <!-- Sidebar -->
        <aside class="sidebar sidebar--card" aria-label="Menú lateral">
          <h2 class="sidebar__title">Menú interno</h2>
          <ul class="sidebar__menu" role="list">
            ${sidebarItems}
          </ul>
        </aside>

        <!-- Contenido principal (rellenado por el controlador de sección) -->
        <main
          class="main-content main-content--card"
          id="seccion-contenido"
          aria-live="polite"
          aria-atomic="false"
        ></main>

      </div>

      <!-- ── FOOTER ───────────────────────────────────────────────────── -->
      <footer class="site-footer">
        <p class="site-footer__text">
          &copy; 2026 El Rincón Gastronómico
          <span class="site-footer__sep" aria-hidden="true">&middot;</span>
          Sistema de Inventario
        </p>
        <p class="site-footer__text site-footer__text--muted">
          Desarrollo de Software SENA &middot; Ficha 3233198
        </p>
      </footer>

    </div>
  `;
};
