import {
  renderInventarioSection,
  renderMovimientosSection,
  renderAuditoriaSection,
  renderAdministracionSection,
  renderLoginSection,
  getCurrentSessionUser,
  logoutSessionUser,
} from "./index.js";
import { setupSidebarNavigation } from "./sidebar.js";

// Punto de entrada del frontend - Sistema de Inventario

function getContentElement() {
  return document.querySelector(".main-content");
}

function isAuthenticated() {
  return Boolean(getCurrentSessionUser());
}

function setNavigationEnabled(enabled) {
  const navLinks = document.querySelectorAll(".site-header__menu-link");
  const sidebarLinks = document.querySelectorAll(".sidebar__link");

  [...navLinks, ...sidebarLinks].forEach((link) => {
    link.style.pointerEvents = enabled ? "auto" : "none";
    link.style.opacity = enabled ? "1" : "0.55";
  });
}

function ensureLogoutButton() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let button = header.querySelector("#logout-btn");
  if (!button) {
    button = document.createElement("button");
    button.id = "logout-btn";
    button.className = "logout-btn";
    button.textContent = "Cerrar sesión";
  }

  button.style.display = isAuthenticated() ? "inline-flex" : "none";

  if (!button.dataset.boundLogout) {
    button.addEventListener("click", () => {
      logoutSessionUser();
      button.style.display = "none";
      renderLogin();
      setNavigationEnabled(false);
    });
    button.dataset.boundLogout = "true";
  }

  const sessionActions = document.querySelector("#session-actions");
  if (sessionActions) {
    sessionActions.innerHTML = "";
    sessionActions.appendChild(button);
    return;
  }

  const nav = header.querySelector(".site-header__nav");
  header.insertBefore(button, nav);
}

function renderLogin() {
  const content = getContentElement();
  renderLoginSection(content, () => {
    setNavigationEnabled(true);
    ensureLogoutButton();
    renderWelcome();
  });
}

// Función para inicializar la aplicación
function initApp() {
  setupNavigation();
  setupSidebar();
  ensureLogoutButton();

  if (isAuthenticated()) {
    setNavigationEnabled(true);
    ensureLogoutButton();
    renderWelcome();
  } else {
    setNavigationEnabled(false);
    ensureLogoutButton();
    renderLogin();
  }
}

// Renderiza la vista de bienvenida
function renderWelcome() {
  const content = document.querySelector(".main-content");
  content.innerHTML = "";

  const fragment = document.createDocumentFragment();

  const title = document.createElement("h2");
  title.textContent = "Panel operativo diario";

  const intro = document.createElement("p");
  intro.textContent =
    "Selecciona una opción del menú para gestionar el inventario interno con tranquilidad y orden.";

  const institutionalSection = document.createElement("section");
  institutionalSection.className = "institucional-intro";
  institutionalSection.setAttribute("aria-labelledby", "titulo-introduccion-sistema");

  const institutionalTitle = document.createElement("h3");
  institutionalTitle.id = "titulo-introduccion-sistema";
  institutionalTitle.textContent = "Bienvenidos al sistema de gestión interna";

  const institutionalText = document.createElement("p");
  institutionalText.textContent =
    "Este espacio fue diseñado para apoyar el trabajo diario de cada colaborador de El Rincón Gastronómico. Aquí podrás gestionar el inventario de forma clara, rápida y confiable, fortaleciendo nuestro orden interno, el trabajo en equipo y el sentido de pertenencia con el restaurante.";

  const institutionalGrid = document.createElement("div");
  institutionalGrid.className = "institucional-grid";

  const cardsData = [
    {
      title: "Objetivo de la empresa",
      text: "Nuestro objetivo es ofrecer una experiencia gastronómica que combine calidad constante en cada plato, un servicio amable y eficiente, higiene impecable y un ambiente acogedor que invite a quedarse. Buscamos que cada visita refleje una relación justa entre calidad y precio, conectando emocionalmente con nuestros clientes y haciéndolos sentir valorados desde su llegada hasta su salida. Con una identidad clara y el uso de ingredientes frescos y locales, trabajamos día a día para ser el restaurante de referencia en confianza, sabor y bienestar.",
    },
    {
      title: "Visión",
      text: "Ser líderes en soluciones de gestión interna, ofreciendo herramientas modernas que mejoren la productividad y el bienestar de nuestros equipos.",
    },
  ];

  cardsData.forEach((cardData) => {
    const card = document.createElement("article");
    card.className = "institucional-card";

    const cardTitle = document.createElement("h4");
    cardTitle.textContent = cardData.title;

    const cardText = document.createElement("p");
    cardText.textContent = cardData.text;

    card.append(cardTitle, cardText);
    institutionalGrid.appendChild(card);
  });

  const testimonialsSection = document.createElement("section");
  testimonialsSection.className = "testimonios";
  testimonialsSection.setAttribute("aria-labelledby", "titulo-testimonios");

  const testimonialsTitle = document.createElement("h4");
  testimonialsTitle.id = "titulo-testimonios";
  testimonialsTitle.textContent = "Opiniones de nuestros trabajadores";

  const testimonialsGrid = document.createElement("div");
  testimonialsGrid.className = "testimonios-grid";

  const testimonialsData = [
    { text: "“El sistema nos ha permitido reducir errores y mejorar la trazabilidad.”", author: "– Laura Méndez" },
    { text: "“La interfaz es clara y fácil de usar, lo que agiliza nuestro trabajo.”", author: "– Carlos Ríos" },
    { text: "“Ahora tenemos más control del inventario y evitamos faltantes en horas pico.”", author: "– Andrea Salazar" },
    { text: "“Los reportes semanales nos ayudan a tomar decisiones más rápidas y acertadas.”", author: "– Felipe Montoya" },
    { text: "“La organización del sistema mejoró la coordinación entre cocina, compras y administración.”", author: "– Daniela Pardo" },
    { text: "“Se nota la mejora en los procesos: menos errores, más orden y mejor servicio al cliente.”", author: "– Julián Herrera" },
  ];

  testimonialsData.forEach((testimonialData) => {
    const testimonial = document.createElement("blockquote");
    testimonial.className = "testimonio-card";

    const testimonialText = document.createElement("p");
    testimonialText.textContent = testimonialData.text;

    const testimonialAuthor = document.createElement("cite");
    testimonialAuthor.textContent = testimonialData.author;

    testimonial.append(testimonialText, testimonialAuthor);
    testimonialsGrid.appendChild(testimonial);
  });

  testimonialsSection.append(testimonialsTitle, testimonialsGrid);
  institutionalSection.append(
    institutionalTitle,
    institutionalText,
    institutionalGrid,
    testimonialsSection
  );

  fragment.append(title, intro, institutionalSection);
  content.appendChild(fragment);
}

// Configura la navegación básica
function setupNavigation() {
  const navLinks = document.querySelectorAll(".site-header__menu-link");
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
  const content = document.querySelector(".main-content");

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

function renderMovimientosByTipo(tipo) {
  const content = document.querySelector(".main-content");
  renderMovimientosSection(content, { defaultTipo: tipo });
}

function setupSidebar() {
  setupSidebarNavigation({
    onWelcome: renderWelcome,
    onSectionNavigate: renderSection,
    onMovimientosNavigate: renderMovimientosByTipo,
  });
}

// Inicializa la aplicación al cargar la página
document.addEventListener("DOMContentLoaded", initApp);
