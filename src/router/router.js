/**
 * Router SPA — El Rincón Gastronómico
 *
 * Router basado en hash (#) con:
 * - Guard de autenticación (isProtected / onlyGuest)
 * - Soporte a parámetros dinámicos (:param)
 * - Cleanup de módulo previo para evitar memory leaks
 */

import { routes, notFoundRoute } from './routes.js';
import { isAuthenticated } from '../services/authService.js';
import { refreshIcons } from '../components/icons.js';

/** Función de limpieza del módulo activo. */
let activeCleanup = null;

/** Devuelve el hash actual de la URL. */
const getCurrentPath = () => window.location.hash || '#/';

/**
 * Evalúa si una ruta definida coincide con el path actual.
 * Soporta segmentos dinámicos (:param).
 * @returns {Object|null} params si coincide, null si no.
 */
const matchRoute = (routePath, currentPath) => {
  const rSegments = routePath.split('/');
  const cSegments = currentPath.split('/');

  if (rSegments.length !== cSegments.length) return null;

  const params = {};

  for (let i = 0; i < rSegments.length; i++) {
    const rs = rSegments[i];
    const cs = cSegments[i];

    if (rs.startsWith(':')) {
      params[rs.slice(1)] = decodeURIComponent(cs);
      continue;
    }

    if (rs !== cs) return null;
  }

  return params;
};

/** Busca la ruta que coincide con el path actual. */
const resolveRoute = (path) => {
  for (const route of routes) {
    const params = matchRoute(route.path, path);
    if (params !== null) return { route, params };
  }
  return { route: notFoundRoute, params: {} };
};

/** Ejecuta el cleanup del módulo anterior. */
const cleanupActiveModule = () => {
  if (typeof activeCleanup === 'function') {
    try {
      activeCleanup();
    } catch (err) {
      console.error('[router] Error en cleanup:', err);
    } finally {
      activeCleanup = null;
    }
  }
};

/**
 * Renderiza la ruta actual en el contenedor #app.
 */
export const renderRoute = async () => {
  const appContainer = document.getElementById('app');

  if (!appContainer) {
    console.error('[router] No se encontró el contenedor #app.');
    return;
  }

  const currentPath = getCurrentPath();
  const { route, params } = resolveRoute(currentPath);

  // Limpia el módulo anterior antes de montar el nuevo.
  cleanupActiveModule();

  // Guard: ruta protegida sin sesión → redirige a login.
  if (route.isProtected && !isAuthenticated()) {
    window.location.hash = '#/login';
    return;
  }

  // Guard: ruta de solo invitado con sesión activa → redirige a home.
  if (route.onlyGuest && isAuthenticated()) {
    window.location.hash = '#/home';
    return;
  }

  // Actualizar título del documento.
  document.title = route.title
    ? `${route.title} · Rincón Gastronómico`
    : 'El Rincón Gastronómico · Inventario';

  // Renderizar la vista.
  const renderedView = await Promise.resolve(route.view({ params }));

  if (renderedView instanceof Node) {
    appContainer.innerHTML = '';
    appContainer.appendChild(renderedView);
  } else {
    appContainer.innerHTML = renderedView || '';
  }

  // Inicializar iconos Lucide después de inyectar el HTML.
  refreshIcons();

  // Ejecutar el controlador (puede retornar función cleanup).
  if (typeof route.controller === 'function') {
    activeCleanup = (await Promise.resolve(route.controller({ params }))) || null;
  }
};

/**
 * Navegación programática.
 * @param {string} path - Hash de destino (ej: '#/inventario' o '/inventario')
 */
export const navigateTo = (path) => {
  const hash = path.startsWith('#') ? path : `#${path}`;
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  } else {
    // Si ya estamos en la misma ruta, re-renderizar igual.
    renderRoute();
  }
};

/** Inicializa los listeners del router. */
export const initRouter = () => {
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
};

/** Desmonta el router completamente (útil en hot reload / tests). */
export const destroyRouter = () => {
  window.removeEventListener('hashchange', renderRoute);
  cleanupActiveModule();
};
