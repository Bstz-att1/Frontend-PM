export function renderInventarioSection(content) {
  const categorias = ["cocina", "barra", "suministros"];

  content.innerHTML = `
    <h2>Inventario</h2>
    <p>Administra productos y categorías en un solo módulo para mantener control centralizado del stock.</p>

    <form id="inventario-form" novalidate>
      <label for="inv-nombre">Nombre</label>
      <input id="inv-nombre" name="nombre" type="text" />

      <label for="inv-categoria">Categoría</label>
      <input id="inv-categoria" name="categoria" type="text" />

      <label for="inv-cantidad">Cantidad inicial</label>
      <input id="inv-cantidad" name="cantidadInicial" type="number" step="1" />

      <label for="inv-proveedor">Proveedor</label>
      <input id="inv-proveedor" name="proveedor" type="text" />

      <button type="submit">Registrar producto</button>
      <div id="inventario-errors" aria-live="polite"></div>
    </form>

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

  const soloTextoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

  function renderCategoriasList() {
    categoriasList.innerHTML = categorias
      .map((categoria) => `<li>${categoria}</li>`)
      .join("");
  }

  function normalizeText(value) {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
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
    categoriaForm.reset();
    categoriaMessages.innerHTML = `<p>Categoría creada correctamente.</p>`;
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
      errores.push("Debe indicar la categoría del producto para clasificar correctamente el inventario.");
    } else if (!soloTextoRegex.test(categoria)) {
      errores.push("La categoría debe contener solo texto para asegurar una clasificación consistente del inventario.");
    }

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      errores.push("La cantidad inicial debe ser mayor que cero.");
    }

    if (!proveedor) {
      errores.push("Debe indicar el proveedor para mantener trazabilidad y control de abastecimiento.");
    } else if (!soloTextoRegex.test(proveedor)) {
      errores.push("El proveedor debe contener solo texto para mantener la trazabilidad correcta del abastecimiento.");
    }

    renderErrors(errorsContainer, errores);
  });

  renderCategoriasList();
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
