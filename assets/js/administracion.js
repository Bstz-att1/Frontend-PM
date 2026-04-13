export function renderAdministracionSection(content) {
  content.innerHTML = `
    <h2>Administración de usuarios</h2>
    <p>Desde este módulo puedes crear, editar y gestionar usuarios del sistema interno.</p>

    <form id="administracion-form" novalidate>
      <label for="adm-nombre">Nombre</label>
      <input id="adm-nombre" name="nombre" type="text" />

      <label for="adm-correo">Correo</label>
      <input id="adm-correo" name="correo" type="email" />

      <label for="adm-rol">Rol</label>
      <select id="adm-rol" name="rol">
        <option value="">Seleccione un rol</option>
        <option value="admin">Administrador</option>
        <option value="supervisor">Supervisor</option>
        <option value="operador">Operador</option>
      </select>

      <label for="adm-estado">Estado</label>
      <select id="adm-estado" name="estado">
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>

      <button type="submit">Crear usuario administrativo</button>
      <div id="administracion-errors" aria-live="polite"></div>
    </form>
  `;

  const form = content.querySelector("#administracion-form");
  const errorsContainer = content.querySelector("#administracion-errors");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const errores = [];

    const nombre = form.nombre.value.trim();
    const correo = form.correo.value.trim();
    const rol = form.rol.value.trim();

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    const soloTextoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

    if (!nombre) {
      errores.push("Debe ingresar el nombre del usuario para identificar correctamente el registro administrativo.");
    } else if (!soloTextoRegex.test(nombre)) {
      errores.push("El nombre debe contener solo texto para mantener una identificación clara del usuario.");
    }

    if (!correoValido) {
      errores.push("Debe ingresar un correo electrónico válido para garantizar notificaciones, acceso seguro y trazabilidad del usuario.");
    }

    if (!rol) {
      errores.push("Debe asignar un rol al usuario para definir permisos y responsabilidades dentro del sistema.");
    }

    if (!form.estado.value.trim()) {
      errores.push("Debe definir el estado del usuario para controlar si tendrá acceso activo o inactivo al sistema.");
    }

    renderErrors(errorsContainer, errores);
  });
}

function renderErrors(container, errors) {
  if (errors.length === 0) {
    container.innerHTML = `<p>Formulario válido.</p>`;
    return;
  }

  container.innerHTML = `
    <ul>
      ${errors.map((error) => `<li>${error}</li>`).join("")}
    </ul>
  `;
}
