/**
 * Definición de rutas — El Rincón Gastronómico
 *
 * Cada entrada del array describe una ruta del SPA:
 *   path        → hash de la URL (soporta :param dinámicos)
 *   title       → título de la pestaña del navegador
 *   isProtected → true = requiere sesión activa
 *   onlyGuest   → true = solo accesible sin sesión (login)
 *   view        → función que retorna el HTML del shell
 *   controller  → función asíncrona que monta la lógica; retorna cleanup()
 */

import { loginView, loginController, homeView, homeController } from '../modules/home/index.js';
import { inventarioController }     from '../modules/inventario/index.js';
import { movimientosController }    from '../modules/movimientos/index.js';
import { auditoriaController }      from '../modules/auditoria/index.js';
import { administracionController } from '../modules/administracion/index.js';

// ── Ruta "Not Found" ──────────────────────────────────────────────────────────

export const notFoundRoute = {
  path:        '#/404',
  title:       'Página no encontrada',
  isProtected: false,
  onlyGuest:   false,
  view: () => `
    <div style="
      display:flex;flex-direction:column;align-items:center;
      justify-content:center;min-height:100vh;gap:1rem;
      font-family:'Inter',sans-serif;color:#64748b;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"
           viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <h1 style="font-size:2rem;font-weight:700;color:#1e293b;margin:0">404</h1>
      <p style="margin:0">La página que buscas no existe.</p>
      <a href="#/home"
         style="margin-top:.5rem;color:#e67e22;font-weight:600;text-decoration:none">
        ← Volver al inicio
      </a>
    </div>`,
  controller: null,
};

// ── Tabla de rutas ─────────────────────────────────────────────────────────────

export const routes = [
  // ── Rutas públicas (solo invitados) ──────────────────────────────────────────
  {
    path:        '#/',
    title:       'Iniciar sesión',
    isProtected: false,
    onlyGuest:   true,
    view:        loginView,
    controller:  loginController,
  },
  {
    path:        '#/login',
    title:       'Iniciar sesión',
    isProtected: false,
    onlyGuest:   true,
    view:        loginView,
    controller:  loginController,
  },

  // ── Rutas protegidas ──────────────────────────────────────────────────────────
  {
    path:        '#/home',
    title:       'Inicio',
    isProtected: true,
    onlyGuest:   false,
    view:        homeView,
    controller:  homeController,
  },
  {
    path:        '#/inventario',
    title:       'Inventario',
    isProtected: true,
    onlyGuest:   false,
    view:        homeView,
    controller:  inventarioController,
  },
  {
    path:        '#/movimientos',
    title:       'Movimientos',
    isProtected: true,
    onlyGuest:   false,
    view:        homeView,
    controller:  movimientosController,
  },
  {
    path:        '#/movimientos/:tipo',
    title:       'Movimientos',
    isProtected: true,
    onlyGuest:   false,
    view:        homeView,
    controller:  movimientosController,
  },
  {
    path:        '#/auditoria',
    title:       'Auditoría',
    isProtected: true,
    onlyGuest:   false,
    view:        homeView,
    controller:  auditoriaController,
  },
  {
    path:        '#/administracion',
    title:       'Administración',
    isProtected: true,
    onlyGuest:   false,
    view:        homeView,
    controller:  administracionController,
  },
];
