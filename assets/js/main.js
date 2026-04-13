// index.js
// Punto de entrada del frontend - Sistema de Inventario

// Función para inicializar la aplicación
function initApp() {
  renderWelcome();
  setupNavigation();
}

// Renderiza la vista de bienvenida
function renderWelcome() {
  const content = document.querySelector(".content");
  content.innerHTML = `
    <h2>Panel operativo diario</h2>
    <p>Selecciona una opción del menú para gestionar el inventario interno con tranquilidad y orden.</p>
  `;
}

// Configura la navegación básica
function setupNavigation() {
  const navLinks = document.querySelectorAll(".nav a");
  navLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const section = event.target.textContent;
      renderSection(section);
    });
  });
}

// Renderiza dinámicamente secciones según el menú
function renderSection(section) {
  const content = document.querySelector(".content");

  switch (section) {
    case "Inventario":
      content.innerHTML = `
        <h2>Inventario</h2>
        <p>Administra productos y categorías en un solo módulo para mantener control centralizado del stock.</p>
      `;
      break;
    case "Movimientos":
      content.innerHTML = `
        <h2>Movimientos</h2>
        <p>Registra entradas, salidas y ajustes para conservar trazabilidad diaria del inventario.</p>
      `;
      break;
    case "Auditoría":
      content.innerHTML = `
        <h2>Auditoría</h2>
        <p>Consulta el historial de acciones internas para seguimiento y control administrativo.</p>
      `;
      break;
    case "Administración":
      content.innerHTML = `
        <h2>Administración de usuarios</h2>
        <p>Desde este módulo puedes crear, editar y gestionar usuarios del sistema interno.</p>
        <ul>
          <li>Registrar nuevos usuarios administrativos.</li>
          <li>Actualizar roles y permisos.</li>
          <li>Activar o desactivar accesos.</li>
        </ul>
      `;
      break;
    default:
      renderWelcome();
  }
}

// Inicializa la aplicación al cargar la página
document.addEventListener("DOMContentLoaded", initApp);
