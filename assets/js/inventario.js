export function renderInventarioSection(content) {
  const categorias = ["cocina", "barra", "suministros"];
  const productos = [];

  content.innerHTML = `
    <h2>Inventario</h2>
    <p>Administra productos y categorías en un solo módulo para mantener control centralizado del stock.</p>

    <form id="inventario-form" novalidate>
      <label for="inv-nombre">Nombre</label>
      <input id="inv-nombre" name="nombre" type="text" />

      <label for="inv-categoria">Categoría</label>
      <select id="inv-categoria" name="categoria" required>
        <option value="">Seleccione una categoría</option>
      </select>

      <label for="inv-cantidad">Cantidad inicial</label>
      <input id="inv-cantidad" name="cantidadInicial" type="number" step="1" />

      <label for="inv-proveedor">Proveedor</label>
      <input id="inv-proveedor" name="proveedor" type="text" />

      <button type="submit">Registrar producto</button>
      <div id="inventario-errors" aria-live="polite"></div>
    </form>

    <section id="inventario-filtros" aria-labelledby="inventario-filtros-title">
      <h3 id="inventario-filtros-title">Filtros de búsqueda</h3>
      <label for="filtro-nombre">Buscar por nombre</label>
      <input id="filtro-nombre" name="filtroNombre" type="text" placeholder="Ej: tomate" />

      <label for="filtro-categoria">Filtrar por categoría</label>
      <select id="filtro-categoria" name="filtroCategoria">
        <option value="">Todas las categorías</option>
      </select>
    </section>

    <section id="inventario-listado" aria-labelledby="inventario-listado-title">
      <h3 id="inventario-listado-title">Inventario completo</h3>
      <div id="inventario-table-container"></div>
    </section>

    <section id="categorias-module" aria-labelledby="categorias-title">
      <h3 id="categorias-title">Categorías</h3>
      <p>Crea y consulta las categorías de productos del inventario.</p>

      <form id="categoria-form" novalidate>
        <label for="categoria-nombre">Nueva categoría</label>
        <input id="categoria-nombre" name="categoriaNombre" type="text" />
        <button type="submit">Crear categoría</button>
        <div id="categoria-messages" aria-live="polite"></div>
      </form>

      <h4>Listado de categorías</h4>
      <ul id="categorias-list"></ul>
    </section>
  `;

  const form = content.querySelector("#inventario-form");
  const errorsContainer = content.querySelector("#inventario-errors");
  const categoriaForm = content.querySelector("#categoria-form");
  const categoriaMessages = content.querySelector("#categoria-messages");
  const categoriasList = content.querySelector("#categorias-list");
  const categoriaSelect = content.querySelector("#inv-categoria");
  const filtroNombreInput = content.querySelector("#filtro-nombre");
  const filtroCategoriaSelect = content.querySelector("#filtro-categoria");
  const tableContainer = content.querySelector("#inventario-table-container");

  const soloTextoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

  function normalizeText(value) {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function getSessionUser() {
    try {
      const sessionUserRaw = localStorage.getItem("sessionUser");
      if (sessionUserRaw) {
        try {
          const parsed = JSON.parse(sessionUserRaw);
          if (typeof parsed === "string" && parsed.trim()) {
            return parsed.trim();
          }
          if (parsed && typeof parsed === "object") {
            const candidate = parsed.username || parsed.nombre || parsed.name;
            if (candidate && String(candidate).trim()) {
              return String(candidate).trim();
            }
          }
        } catch {
          if (sessionUserRaw.trim()) {
            return sessionUserRaw.trim();
          }
        }
      }

      const currentUserRaw = localStorage.getItem("currentUser");
      if (currentUserRaw) {
        try {
          const parsed = JSON.parse(currentUserRaw);
          if (typeof parsed === "string" && parsed.trim()) {
            return parsed.trim();
          }
          if (parsed && typeof parsed === "object") {
            const candidate = parsed.username || parsed.nombre || parsed.name;
            if (candidate && String(candidate).trim()) {
              return String(candidate).trim();
            }
          }
        } catch {
          if (currentUserRaw.trim()) {
            return currentUserRaw.trim();
          }
        }
      }

      const username = localStorage.getItem("username");
      if (username && username.trim()) {
        return username.trim();
      }
    } catch {
      return "Usuario no identificado";
    }

    return "Usuario no identificado";
  }

  function renderCategoriasList() {
    categoriasList.innerHTML = categorias
      .map((categoria) => `<li>${categoria}</li>`)
      .join("");
  }

  function renderCategoriaOptions() {
    const options = categorias
      .map((categoria) => `<option value="${categoria}">${categoria}</option>`)
      .join("");

    categoriaSelect.innerHTML = `
      <option value="">Seleccione una categoría</option>
      ${options}
    `;

    filtroCategoriaSelect.innerHTML = `
      <option value="">Todas las categorías</option>
      ${options}
    `;
  }

  function renderProductos(items) {
    if (items.length === 0) {
      tableContainer.innerHTML = `<p>No hay productos registrados en inventario.</p>`;
      return;
    }

    tableContainer.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Cantidad inicial</th>
            <th>Proveedor</th>
            <th>Creado por</th>
            <th>Fecha de creación</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (producto) => `
                <tr>
                  <td>${producto.nombre}</td>
                  <td>${producto.categoria}</td>
                  <td>${producto.cantidadInicial}</td>
                  <td>${producto.proveedor}</td>
                  <td>${producto.creadoPor}</td>
                  <td>${producto.fechaCreacion}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  function applyFilters() {
    const filtroNombre = normalizeText(filtroNombreInput.value || "");
    const filtroCategoria = normalizeText(filtroCategoriaSelect.value || "");

    const filtrados = productos.filter((producto) => {
      const coincideNombre = filtroNombre
        ? normalizeText(producto.nombre).includes(filtroNombre)
        : true;
      const coincideCategoria = filtroCategoria
        ? normalizeText(producto.categoria) === filtroCategoria
        : true;
      return coincideNombre && coincideCategoria;
    });

    renderProductos(filtrados);
  }

  categoriaForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nuevaCategoriaRaw = categoriaForm.categoriaNombre.value;
    const nuevaCategoria = normalizeText(nuevaCategoriaRaw);
    const errores = [];

    if (!nuevaCategoria) {
      errores.push("El nombre de la categoría es requerido.");
    } else if (!soloTextoRegex.test(nuevaCategoria)) {
      errores.push("La categoría debe contener solo texto.");
    } else if (categorias.includes(nuevaCategoria)) {
      errores.push("La categoría ya existe en el listado.");
    }

    if (errores.length > 0) {
      categoriaMessages.innerHTML = `
        <ul>
          ${errores.map((error) => `<li>${error}</li>`).join("")}
        </ul>
      `;
      return;
    }

    categorias.push(nuevaCategoria);
    renderCategoriasList();
    renderCategoriaOptions();
    categoriaForm.reset();
    categoriaMessages.innerHTML = `<p>Categoría creada correctamente.</p>`;
    applyFilters();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const errores = [];

    const nombre = form.nombre.value.trim();
    const categoria = form.categoria.value.trim();
    const cantidad = Number(form.cantidadInicial.value);
    const proveedor = form.proveedor.value.trim();

    if (!nombre) {
      errores.push("El nombre del producto es requerido.");
    } else if (!soloTextoRegex.test(nombre)) {
      errores.push("El nombre del producto debe contener solo texto para mantener una identificación clara en inventario.");
    }

    if (!categoria) {
      errores.push("Debe seleccionar una categoría para registrar el producto.");
    } else if (!categorias.includes(normalizeText(categoria))) {
      errores.push("La categoría seleccionada no es válida.");
    }

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      errores.push("La cantidad inicial debe ser mayor que cero.");
    }

    if (!proveedor) {
      errores.push("Debe indicar el proveedor para mantener trazabilidad y control de abastecimiento.");
    } else if (!soloTextoRegex.test(proveedor)) {
      errores.push("El proveedor debe contener solo texto para mantener la trazabilidad correcta del abastecimiento.");
    }

    if (errores.length > 0) {
      renderErrors(errorsContainer, errores);
      return;
    }

    const nuevoProducto = {
      nombre,
      categoria: normalizeText(categoria),
      cantidadInicial: cantidad,
      proveedor,
      creadoPor: getSessionUser(),
      fechaCreacion: new Date().toLocaleString("es-CO"),
    };

    productos.push(nuevoProducto);
    renderErrors(errorsContainer, []);
    form.reset();
    applyFilters();
  });

  filtroNombreInput.addEventListener("input", applyFilters);
  filtroCategoriaSelect.addEventListener("change", applyFilters);

  renderCategoriasList();
  renderCategoriaOptions();
  renderProductos(productos);
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
