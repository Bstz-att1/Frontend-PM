import {
  renderInventarioSection,
  renderMovimientosSection,
  renderAuditoriaSection,
  renderAdministracionSection,
} from "./index.js";

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
  navLinks.forEach((link) => {
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
      renderInventarioSection(content);
      break;
    case "Movimientos":
      renderMovimientosSection(content);
      break;
    case "Auditoría":
      renderAuditoriaSection(content);
      break;
    case "Administración":
      renderAdministracionSection(content);
      break;
    default:
      renderWelcome();
  }
}

// Inicializa la aplicación al cargar la página
document.addEventListener("DOMContentLoaded", initApp);
