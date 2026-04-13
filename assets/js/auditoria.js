export function renderAuditoriaSection(content) {
  const productos = loadProductosInventario();
  const productosPorUsuario = agruparProductosPorUsuario(productos);

  content.innerHTML = `
    <h2>Auditoría</h2>
    <p>Consulta el historial de acciones internas para seguimiento y control administrativo.</p>

    <section id="auditoria-reporte-productos" class="panel-card" aria-labelledby="auditoria-reporte-title">
      <h3 id="auditoria-reporte-title">Productos creados por cada usuario</h3>
      <div class="auditoria-grid">
        <div id="auditoria-resumen-usuarios"></div>
        <div id="auditoria-productos-por-usuario"></div>
      </div>
    </section>

    <form id="auditoria-form" novalidate>
      <label for="aud-producto">Producto</label>
      <input id="aud-producto" name="producto" type="text" />

      <label for="aud-hallazgo">Hallazgo detectado</label>
      <input id="aud-hallazgo" name="hallazgoDetectado" type="text" />

      <label for="aud-descripcion">Descripción del hallazgo</label>
      <textarea id="aud-descripcion" name="descripcionHallazgo"></textarea>

      <button type="submit">Registrar hallazgo</button>
      <div id="auditoria-errors" aria-live="polite"></div>
    </form>
  `;

  const resumenUsuariosContainer = content.querySelector("#auditoria-resumen-usuarios");
  const productosPorUsuarioContainer = content.querySelector("#auditoria-productos-por-usuario");
  renderResumenPorUsuario(resumenUsuariosContainer, productosPorUsuario);
  renderProductosPorUsuario(productosPorUsuarioContainer, productosPorUsuario);

  const form = content.querySelector("#auditoria-form");
  const errorsContainer = content.querySelector("#auditoria-errors");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const errores = [];

    const producto = form.producto.value.trim();
    const hallazgo = form.hallazgoDetectado.value.trim();
    const descripcion = form.descripcionHallazgo.value.trim();

    const soloTextoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

    if (!producto) {
      errores.push("Debe indicar el producto auditado para mantener trazabilidad del registro.");
    } else if (!soloTextoRegex.test(producto)) {
      errores.push("El producto debe contener solo texto para mantener una identificación clara en auditoría.");
    }

    if (!hallazgo) {
      errores.push("Debe registrar el hallazgo detectado para sustentar la trazabilidad de la auditoría.");
    } else if (!soloTextoRegex.test(hallazgo)) {
      errores.push("El hallazgo detectado debe contener solo texto para mantener una auditoría clara y trazable.");
    }

    if (!descripcion) {
      errores.push("Debe ingresar una descripción del hallazgo para documentar el contexto y asegurar seguimiento.");
    } else if (!soloTextoRegex.test(descripcion)) {
      errores.push("La descripción del hallazgo debe contener solo texto para conservar evidencia clara en la auditoría.");
    }

    renderErrors(errorsContainer, errores);
  });
}

function loadProductosInventario() {
  try {
    const raw = localStorage.getItem("inventarioProductos");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function agruparProductosPorUsuario(productos) {
  return productos.reduce((acc, producto) => {
    const usuario =
      producto && producto.creadoPor && String(producto.creadoPor).trim()
        ? String(producto.creadoPor).trim()
        : "Usuario no identificado";

    if (!acc[usuario]) {
      acc[usuario] = [];
    }

    acc[usuario].push(producto);
    return acc;
  }, {});
}

function renderResumenPorUsuario(container, productosPorUsuario) {
  const usuarios = Object.keys(productosPorUsuario);

  if (usuarios.length === 0) {
    container.innerHTML = `<p>No hay totales por usuario para mostrar.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="table-wrapper" role="region" aria-label="Resumen de productos por usuario">
      <table class="table-pro">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Total de productos</th>
          </tr>
        </thead>
        <tbody>
          ${usuarios
            .map((usuario) => {
              const total = (productosPorUsuario[usuario] || []).length;
              return `
                <tr>
                  <td>${usuario}</td>
                  <td>${total}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderProductosPorUsuario(container, productosPorUsuario) {
  const usuarios = Object.keys(productosPorUsuario);

  if (usuarios.length === 0) {
    container.innerHTML = `<p>No hay productos registrados para auditar.</p>`;
    return;
  }

  container.innerHTML = `
    ${usuarios
      .map((usuario) => {
        const productos = productosPorUsuario[usuario] || [];
        return `
          <article class="auditoria-usuario-card panel-card">
            <h4>${usuario}</h4>
            <p>Total de productos creados: <strong>${productos.length}</strong></p>
            <div class="table-wrapper" role="region" aria-label="Productos de ${usuario}">
              <table class="table-pro">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Fecha de creación</th>
                  </tr>
                </thead>
                <tbody>
                  ${productos
                    .map(
                      (producto) => `
                        <tr>
                          <td>${producto.nombre || "Producto sin nombre"}</td>
                          <td>${producto.categoria || "No definida"}</td>
                          <td>${producto.fechaCreacion || "Sin fecha"}</td>
                        </tr>
                      `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </article>
        `;
      })
      .join("")}
  `;
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
