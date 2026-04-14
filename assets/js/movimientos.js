import { createAuditLog, getAllUsers } from "./api.js";
import { getSessionUser } from "./auth.js";

export function renderMovimientosSection(content, options = {}) {
  content.innerHTML = `
    <h2>Movimientos</h2>
    <p>Registra entradas, salidas y ajustes para conservar trazabilidad diaria del inventario.</p>

    <form id="movimientos-form" novalidate>
      <label for="mov-tipo">Tipo de movimiento</label>
      <select id="mov-tipo" name="tipoMovimiento">
        <option value="">Seleccione una opción</option>
        <option value="entrada">Entrada</option>
        <option value="salida">Salida</option>
      </select>

      <label for="mov-producto">Producto</label>
      <input id="mov-producto" name="producto" type="text" />

      <label for="mov-cantidad">Cantidad</label>
      <input id="mov-cantidad" name="cantidad" type="number" step="1" />

      <label for="mov-motivo">Motivo</label>
      <input id="mov-motivo" name="motivo" type="text" />

      <button type="submit">Crear movimiento</button>
      <div id="movimientos-errors" aria-live="polite"></div>
    </form>
  `;

  const form = content.querySelector("#movimientos-form");
  const errorsContainer = content.querySelector("#movimientos-errors");

  let usuarios = [];

  async function initUsers() {
    try {
      const apiUsers = await getAllUsers();
      usuarios = Array.isArray(apiUsers) ? apiUsers : [];
    } catch {
      usuarios = [];
    }
  }

  if (options.defaultTipo) {
    form.tipoMovimiento.value = options.defaultTipo;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const errores = [];

    const tipo = form.tipoMovimiento.value;
    const producto = form.producto.value.trim();
    const cantidad = Number(form.cantidad.value);
    const motivo = form.motivo.value.trim();

const soloTextoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.,\-#()/_]+$/;

    if (!tipo) {
      errores.push("Debe seleccionar el tipo de movimiento.");
    }

    if (!producto) {
      errores.push("El nombre del producto es requerido.");
    } else if (!soloTextoRegex.test(producto)) {
      errores.push("El producto debe contener solo texto para mantener una identificación clara del movimiento.");
    }

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      errores.push("La cantidad debe ser un número válido mayor que cero.");
    }

    if (!motivo) {
      errores.push("El motivo es necesario para mayor informacion del producto.");
    } else if (!soloTextoRegex.test(motivo)) {
      errores.push("El motivo debe contener solo texto para documentar correctamente la trazabilidad del movimiento.");
    }

    if (errores.length > 0) {
      renderErrors(errorsContainer, errores);
      return;
    }

    const usuarioSesion = getSessionUser();
    const usuarioId =
      Number(usuarioSesion?.id) ||
      (usuarios.length > 0 ? Number(usuarios[0].id) : 1); // Fallback to admin for testing

    // No validation - use fallback if needed

    const accion = tipo === "entrada" ? "MOVIMIENTO_ENTRADA" : "MOVIMIENTO_SALIDA";
    const detalles = `Producto: ${producto} | Cantidad: ${cantidad} | Motivo: ${motivo}`;

    try {
      await createAuditLog({
        usuario_id: usuarioId,
        accion,
        tabla_afectada: "productos",
        registro_id: 0,
        detalles,
      });

      renderErrors(errorsContainer, []);
      errorsContainer.innerHTML = `<p>Movimiento registrado correctamente.</p>`;
      form.reset();
      if (options.defaultTipo) {
        form.tipoMovimiento.value = options.defaultTipo;
      }
    } catch (error) {
      const backendErrors = Array.isArray(error?.errors)
        ? error.errors
        : error?.payload?.errors
        ? [error.payload.errors]
        : [];

      renderErrors(errorsContainer, [
        error.message || "No se pudo registrar el movimiento en el backend.",
        ...backendErrors,
      ]);
    }
  });

  initUsers();
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
