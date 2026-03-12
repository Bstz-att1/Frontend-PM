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
    <h2>Bienvenido</h2>
    <p>Seleccione una opción del menú para comenzar.</p>
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
    case "Usuarios":
      content.innerHTML = `
        <h2>Gestión de Usuarios</h2>
        <p>Aquí se mostrará el formulario para crear y listar usuarios.</p>
      `;
      break;
    case "Categorías":
      content.innerHTML = `
        <h2>Gestión de Categorías</h2>
        <p>Aquí se mostrará el formulario para crear y listar categorías.</p>
      `;
      break;
    case "Productos":
      content.innerHTML = `
        <h2>Gestión de Productos</h2>
        <p>Aquí se mostrará el formulario para crear y listar productos.</p>
      `;
      break;
    case "Auditoría":
      content.innerHTML = `
        <h2>Auditoría</h2>
        <p>Aquí se mostrarán los reportes de acciones realizadas por cada usuario.</p>
      `;
      break;
    default:
      renderWelcome();
  }
}

// Inicializa la aplicación al cargar la página
document.addEventListener("DOMContentLoaded", initApp);
