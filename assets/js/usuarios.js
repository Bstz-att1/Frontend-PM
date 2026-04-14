import { getAllUsers, createUser } from "./api.js";
import { login, getSessionUser, logout, hasRole } from "./auth.js";

const FALLBACK_USERS = [
  {
    id: 1,
    nombre: "Administrador General",
    documento: "1000000000",
    username: "admin",
    rol: "admin",
  },
];

function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")   
        .replaceAll("'", "&#39;");  
}

export function getCurrentSessionUser() {
  return getSessionUser();
}

export function logoutSessionUser() {
  logout();
}

function renderUsersTable(container, users) {
  if (!users.length) {
    container.innerHTML = "<p>No hay usuarios registrados.</p>";
    return;
  }

  const rows = users
    .map(
      (user) => `
      <tr>
        <td>${escapeHtml(String(user.id ?? ""))}</td>
        <td>${escapeHtml(user.nombre || "")}</td>
        <td>${escapeHtml(user.documento ? String(user.documento) : "N/A")}</td>
        <td>${escapeHtml(user.username || "N/A")}</td>
        <td>${escapeHtml(user.rol || "")}</td>
      </tr>
    `
    )
    .join("");

  container.innerHTML = `
    <div class="table-wrapper" role="region" aria-label="Tabla de usuarios registrados">
      <table class="users-table table-pro">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Username</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

export function renderUsuariosSection(content) {
  const isAdmin = hasRole("admin");

  if (!isAdmin) {
    content.innerHTML = `
      <h2>Administración de usuarios</h2>
      <section class="panel-card">
        <p>No tienes permisos para gestionar usuarios. Este módulo es solo para administradores.</p>
      </section>
    `;
    return;
  }

  content.innerHTML = `
    <h2>Administración de usuarios</h2>
    <p>Gestiona cuentas internas y consulta el listado dinámico con una visualización clara y profesional.</p>

    <section class="panel-card">
      <h3>Crear usuario</h3>
      <form id="usuarios-form" novalidate>
        <label for="usr-nombre">Nombre</label>
        <input id="usr-nombre" name="nombre" type="text" placeholder="Ej: Laura Méndez" required />

        <label for="usr-documento">Documento</label>
        <input id="usr-documento" name="documento" type="text" placeholder="Ej: 1020304050" required />

        <label for="usr-username">Username</label>
        <input id="usr-username" name="username" type="text" placeholder="Ej: laura.mendez" required />

        <label for="usr-password">Contraseña</label>
        <input id="usr-password" name="password" type="password" placeholder="Mínimo 6 caracteres" required />

        <label for="usr-rol">Rol</label>
        <select id="usr-rol" name="rol" required>
          <option value="">Seleccione un rol</option>
          <option value="admin">Administrador</option>
          <option value="user">Usuario</option>
        </select>

        <button type="submit">Crear usuario</button>
        <div id="usuarios-errors" aria-live="polite"></div>
      </form>
    </section>

    <section class="panel-card">
      <h3>Listado dinámico de usuarios</h3>
      <div id="usuarios-listado"></div>
    </section>
  `;

  const form = content.querySelector("#usuarios-form");
  const errorsContainer = content.querySelector("#usuarios-errors");
  const listContainer = content.querySelector("#usuarios-listado");

  async function refreshUsers() {
    try {
      const apiUsers = await getAllUsers();
      renderUsersTable(listContainer, apiUsers);
    } catch (error) {
      errorsContainer.innerHTML = `<ul><li>${escapeHtml(
        error.message || "No fue posible cargar usuarios desde el backend."
      )}</li></ul>`;
      renderUsersTable(listContainer, FALLBACK_USERS);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = form.nombre.value.trim();
    const documento = form.documento.value.trim();
    const username = form.username.value.trim();
    const password = form.password.value.trim();
    const rol = form.rol.value.trim();

    const errores = [];
    const soloTextoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const soloNumerosRegex = /^\d+$/;
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;

    if (!nombre) {
      errores.push("El nombre es obligatorio.");
    } else if (!soloTextoRegex.test(nombre)) {
      errores.push("El nombre debe contener solo letras y espacios.");
    }

    if (!documento) {
      errores.push("El documento es obligatorio.");
    } else if (!soloNumerosRegex.test(documento)) {
      errores.push("El documento debe contener solo números.");
    }

    if (!username) {
      errores.push("El username es obligatorio.");
    } else if (!usernameRegex.test(username)) {
      errores.push("El username solo puede contener letras, números, punto, guión y guión bajo.");
    }

    if (!password) {
      errores.push("La contraseña es obligatoria.");
    } else if (password.length < 6) {
      errores.push("La contraseña debe tener mínimo 6 caracteres.");
    }

    if (!rol) {
      errores.push("Debe seleccionar un rol.");
    }

    if (errores.length > 0) {
      errorsContainer.innerHTML = `
        <ul>${errores.map((error) => `<li>${escapeHtml(error)}</li>`).join("")}</ul>
      `;
      return;
    }

    try {
      await createUser({
        documento,
        nombre,
        username,
        password,
        rol,
      });

      errorsContainer.innerHTML = "<p>Usuario creado correctamente en backend.</p>";
      form.reset();
      await refreshUsers();
    } catch (error) {
      const backendErrors = Array.isArray(error.errors) ? error.errors : [];
      const items = [
        escapeHtml(error.message || "No fue posible crear el usuario."),
        ...backendErrors.map((item) => escapeHtml(String(item))),
      ];

      errorsContainer.innerHTML = `<ul>${items
        .map((item) => `<li>${item}</li>`)
        .join("")}</ul>`;
    }
  });

  refreshUsers();
}

export function renderLoginSection(content, onLoginSuccess) {
  content.innerHTML = `
    <h2>Ingreso al sistema</h2>
    <p>Inicia sesión para acceder al sistema de gestión interna.</p>

    <section class="panel-card">
      <form id="login-form" novalidate>
        <label for="login-username">Username</label>
        <input id="login-username" name="username" type="text" placeholder="Ingresa tu usuario" required />

        <label for="login-password">Password</label>
        <input id="login-password" name="password" type="password" placeholder="Ingresa tu contraseña" required />

        <button type="submit">Iniciar sesión</button>
        <div id="login-errors" aria-live="polite"></div>
      </form>
    </section>
  `;

  const form = content.querySelector("#login-form");
  const errorsContainer = content.querySelector("#login-errors");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value.trim();

    const errores = [];

    if (!username) errores.push("Debe ingresar su username.");
    if (!password) errores.push("Debe ingresar su contraseña.");

    if (errores.length) {
      errorsContainer.innerHTML = `<ul>${errores
        .map((e) => `<li>${escapeHtml(e)}</li>`)
        .join("")}</ul>`;
      return;
    }

    try {
      const loggedUser = await login(username, password);
      errorsContainer.innerHTML = "<p>Autenticación exitosa. Redirigiendo...</p>";
      onLoginSuccess(loggedUser);
    } catch (error) {
      errorsContainer.innerHTML = `<ul><li>${escapeHtml(
        error.message || "Credenciales inválidas. Verifica e intenta nuevamente."
      )}</li></ul>`;
    }
  });
}
