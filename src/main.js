/**
 * Punto de entrada — El Rincón Gastronómico · Inventario SPA
 *
 * Bootstraps:
 *  1. Importa animate.css para las clases de animación.
 *  2. Aplica la clase `app` al body (activa los estilos SPA globales).
 *  3. Garantiza que el contenedor #app existe en el DOM.
 *  4. Inicializa el router (hashchange + render inicial).
 *
 * Los guards de autenticación son responsabilidad exclusiva del router.
 * El router ya maneja isProtected y onlyGuest internamente.
 */

import 'animate.css';
import { initRouter } from './router/router.js';

// ── 1. Estilos base del body ──────────────────────────────────────────────────
document.body.classList.add('app');

// ── 2. Garantizar contenedor raíz ────────────────────────────────────────────
(function ensureAppContainer() {
  if (!document.getElementById('app')) {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
  }
}());

// ── 3. Bootstrap del router ───────────────────────────────────────────────────
initRouter();
