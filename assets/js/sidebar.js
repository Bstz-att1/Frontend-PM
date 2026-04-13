export function setupSidebarNavigation({
  onWelcome,
  onSectionNavigate,
  onMovimientosNavigate,
}) {
  const sidebarLinks = document.querySelectorAll(".sidebar a");

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const action = event.currentTarget.textContent.trim();

      switch (action) {
        case "Panel principal":
          onWelcome();
          break;
        case "Entradas de stock":
          onMovimientosNavigate("entrada");
          break;
        case "Salidas de stock":
          onMovimientosNavigate("salida");
          break;
        case "Ajustes de inventario":
          onSectionNavigate("Inventario");
          break;
        case "Reportes":
          onSectionNavigate("Auditoría");
          break;
        default:
          onWelcome();
      }
    });
  });
}
