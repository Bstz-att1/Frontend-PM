export function renderAdministracionSection(content) {
  content.innerHTML = `
    <h2>Administración de usuarios</h2>
    <p>Desde este módulo puedes crear, editar y gestionar usuarios del sistema interno.</p>
    <ul>
      <li>Registrar nuevos usuarios administrativos.</li>
      <li>Actualizar roles y permisos.</li>
      <li>Activar o desactivar accesos.</li>
    </ul>
  `;
}
