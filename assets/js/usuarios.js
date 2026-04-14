import { getAllUsers, createUser } from "./api.js";

const SESSION_USER_KEY = "rg_current_user";

const FALLBACK_USERS = [
  {
    id: 1,
    nombre: "Administrador General",
    documento: "1000000000",
    rol: "admin",
  },
];

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replace(/"/g, "&quot;")
    .replaceAll("'", "&#39;");
}

function setCurrentSession(user) {
  const safeUser = {
    id: user.id,
    nombre: user.nombre,
    username: user.username,
    rol: user.rol,
  };
  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(safeUser));
}

export function getCurrentSessionUser() {
  const raw = sessionStorage.getItem(SESSION_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    sessionStorage.removeItem(SESSION_USER_KEY);
    return null;
  }
}

export function logoutSessionUser() {
  sessionStorage.removeItem(SESSION_USER_KEY);
}

export function tryLogin(username, password) {
  if (username === "admin" && password === "admin123") {
    setCurrentSession({
      id: 1,
      nombre: "Administrador General",
      username: "admin",
      rol: "Administrador",
    });
    return getCurrentSessionUser();
  }

  return null;
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
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

export function renderUsuariosSection(content) {
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
    const rol = form.rol.value.trim();

    const errores = [];
    const soloTextoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const soloNumerosRegex = /^\d+$/;

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
      <p class="auth-help">Usuario demo: <strong>admin</strong> / Contraseña: <strong>admin123</strong></p>
    </section>
  `;

  const form = content.querySelector("#login-form");
  const errorsContainer = content.querySelector("#login-errors");

  form.addEventListener("submit", (event) => {
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

    const loggedUser = tryLogin(username, password);

    if (!loggedUser) {
      errorsContainer.innerHTML =
        "<ul><li>Credenciales inválidas. Verifica e intenta nuevamente.</li></ul>";
      return;
    }

    errorsContainer.innerHTML = "<p>Autenticación exitosa. Redirigiendo...</p>";
    onLoginSuccess(loggedUser);
  });
}
