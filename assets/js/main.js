import {
  renderInventarioSection,
  renderMovimientosSection,
  renderAuditoriaSection,
  renderAdministracionSection,
} from "./index.js";
import { setupSidebarNavigation } from "./sidebar.js";

// Punto de entrada del frontend - Sistema de Inventario

// Función para inicializar la aplicación
function initApp() {
  renderWelcome();
  setupNavigation();
  setupSidebar();
}

// Renderiza la vista de bienvenida
function renderWelcome() {
  const content = document.querySelector(".content");
  content.innerHTML = `
    <h2>Panel operativo diario</h2>
    <p>Selecciona una opción del menú para gestionar el inventario interno con tranquilidad y orden.</p>

    <section class="institucional-intro" aria-labelledby="titulo-introduccion-sistema">
      <h3 id="titulo-introduccion-sistema">Bienvenidos al sistema de gestión interna</h3>
      <p>
        Este espacio fue diseñado para apoyar el trabajo diario de cada colaborador de El Rincón Gastronómico.
        Aquí podrás gestionar el inventario de forma clara, rápida y confiable, fortaleciendo nuestro orden interno,
        el trabajo en equipo y el sentido de pertenencia con el restaurante.
      </p>

      <div class="institucional-grid">
        <article class="institucional-card">
          <h4>Objetivo de la empresa</h4>
          <p>
            Nuestro objetivo es ofrecer una experiencia gastronómica que combine calidad constante en cada plato, un servicio amable y eficiente, higiene impecable y un ambiente acogedor que invite a quedarse. Buscamos que cada visita refleje una relación justa entre calidad y precio, conectando emocionalmente con nuestros clientes y haciéndolos sentir valorados desde su llegada hasta su salida. Con una identidad clara y el uso de ingredientes frescos y locales, trabajamos día a día para ser el restaurante de referencia en confianza, sabor y bienestar.
          </p>
        </article>

        <article class="institucional-card">
          <h4>Visión</h4>
          <p>
            Ser líderes en soluciones de gestión interna, ofreciendo herramientas modernas que mejoren
            la productividad y el bienestar de nuestros equipos.
          </p>
        </article>
      </div>

      <section class="testimonios" aria-labelledby="titulo-testimonios">
        <h4 id="titulo-testimonios">Opiniones de nuestros trabajadores</h4>
        <div class="testimonios-grid">
          <blockquote class="testimonio-card">
            <p>“El sistema nos ha permitido reducir errores y mejorar la trazabilidad.”</p>
            <cite>– Laura Méndez</cite>
          </blockquote>
          <blockquote class="testimonio-card">
            <p>“La interfaz es clara y fácil de usar, lo que agiliza nuestro trabajo.”</p>
            <cite>– Carlos Ríos</cite>
          </blockquote>
          <blockquote class="testimonio-card">
            <p>“Ahora tenemos más control del inventario y evitamos faltantes en horas pico.”</p>
            <cite>– Andrea Salazar</cite>
          </blockquote>
          <blockquote class="testimonio-card">
            <p>“Los reportes semanales nos ayudan a tomar decisiones más rápidas y acertadas.”</p>
            <cite>– Felipe Montoya</cite>
          </blockquote>
          <blockquote class="testimonio-card">
            <p>“La organización del sistema mejoró la coordinación entre cocina, compras y administración.”</p>
            <cite>– Daniela Pardo</cite>
          </blockquote>
          <blockquote class="testimonio-card">
            <p>“Se nota la mejora en los procesos: menos errores, más orden y mejor servicio al cliente.”</p>
            <cite>– Julián Herrera</cite>
          </blockquote>
        </div>
      </section>
    </section>
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

function renderMovimientosByTipo(tipo) {
  const content = document.querySelector(".content");
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
