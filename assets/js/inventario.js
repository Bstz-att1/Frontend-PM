export function renderInventarioSection(content) {
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
  `;

  const form = content.querySelector("#inventario-form");
  const errorsContainer = content.querySelector("#inventario-errors");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const errores = [];

    const nombre = form.nombre.value.trim();
    const categoria = form.categoria.value.trim();
    const cantidad = Number(form.cantidadInicial.value);
    const proveedor = form.proveedor.value.trim();

    const soloTextoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

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
