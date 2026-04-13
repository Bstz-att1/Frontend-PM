const STORAGE_USERS_KEY = "rg_users";
const SESSION_USER_KEY = "rg_current_user";

const DEFAULT_USERS = [
  {
    id: 1,
    nombre: "Administrador General",
    username: "admin",
    password: "admin123",
    rol: "Administrador",
  },
];

function readUsers() {
  const raw = localStorage.getItem(STORAGE_USERS_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return [...DEFAULT_USERS];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return [...DEFAULT_USERS];
    }
    return parsed;
  } catch (error) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return [...DEFAULT_USERS];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

function getNextId(users) {
  if (!users.length) return 1;
  return Math.max(...users.map((user) => Number(user.id) || 0)) + 1;
}

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
  const users = readUsers();
  const found = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!found) return null;

  setCurrentSession(found);
  return getCurrentSessionUser();
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
        <td>${escapeHtml(String(user.id))}</td>
        <td>${escapeHtml(user.nombre)}</td>
        <td>${escapeHtml(user.username)}</td>
        <td>${escapeHtml(user.rol)}</td>
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
  const users = readUsers();

  content.innerHTML = `
    <h2>Administración de usuarios</h2>
    <p>Gestiona cuentas internas y consulta el listado dinámico con una visualización clara y profesional.</p>

    <section class="panel-card">
      <h3>Crear usuario</h3>
      <form id="usuarios-form" novalidate>
        <label for="usr-nombre">Nombre</label>
        <input id="usr-nombre" name="nombre" type="text" placeholder="Ej: Laura Méndez" required />

        <label for="usr-username">Username</label>
        <input id="usr-username" name="username" type="text" placeholder="Ej: laura.mendez" required />

        <label for="usr-password">Password</label>
        <input id="usr-password" name="password" type="password" placeholder="Mínimo 6 caracteres" required />

        <label for="usr-rol">Rol</label>
        <select id="usr-rol" name="rol" required>
          <option value="">Seleccione un rol</option>
          <option value="Administrador">Administrador</option>
          <option value="Operador">Operador</option>
          <option value="Supervisor">Supervisor</option>
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

  renderUsersTable(listContainer, users);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = form.nombre.value.trim();
    const username = form.username.value.trim();
    const password = form.password.value.trim();
    const rol = form.rol.value.trim();

    const errores = [];
    const soloTextoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!nombre) {
      errores.push("El nombre es obligatorio.");
    } else if (!soloTextoRegex.test(nombre)) {
      errores.push("El nombre debe contener solo letras y espacios.");
    }

    if (!username) {
      errores.push("El username es obligatorio.");
    } else if (username.length < 4) {
      errores.push("El username debe tener al menos 4 caracteres.");
    }

    if (!password) {
      errores.push("La contraseña es obligatoria.");
    } else if (password.length < 6) {
      errores.push("La contraseña debe tener mínimo 6 caracteres.");
    }

    if (!rol) {
      errores.push("Debe seleccionar un rol.");
    }

    const latestUsers = readUsers();
    const existsUsername = latestUsers.some(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
    if (existsUsername) {
      errores.push("Ese username ya existe, debe ser único.");
    }

    if (errores.length > 0) {
      errorsContainer.innerHTML = `
        <ul>${errores.map((error) => `<li>${escapeHtml(error)}</li>`).join("")}</ul>
      `;
      return;
    }

    const nuevoUsuario = {
      id: getNextId(latestUsers),
      nombre,
      username,
      password,
      rol,
    };

    const updatedUsers = [...latestUsers, nuevoUsuario];
    saveUsers(updatedUsers);

    errorsContainer.innerHTML = "<p>Usuario creado correctamente.</p>";
    form.reset();
    renderUsersTable(listContainer, updatedUsers);
  });
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
