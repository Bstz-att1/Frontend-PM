import { getAllAuditLogs, createAuditLog, getAllUsers } from "./api.js";

export function renderAuditoriaSection(content) {

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
  const form = content.querySelector("#auditoria-form");
  const errorsContainer = content.querySelector("#auditoria-errors");

  async function refreshAuditData() {
    try {
      const [auditLogs, users] = await Promise.all([
        getAllAuditLogs(),
        getAllUsers(),
      ]);

      const normalizedAudit = Array.isArray(auditLogs) ? auditLogs : [];
      const usersById = (Array.isArray(users) ? users : []).reduce((acc, user) => {
        acc[String(user.id)] = user.nombre || `Usuario ${user.id}`;
        return acc;
      }, {});

      const enrichedAudit = normalizedAudit.map((item) => ({
        ...item,
        usuario_nombre: usersById[String(item.usuario_id)] || `Usuario ${item.usuario_id}`,
      }));

      const auditoriaPorUsuario = agruparAuditoriaPorUsuario(enrichedAudit);
      renderResumenPorUsuario(resumenUsuariosContainer, auditoriaPorUsuario);
      renderAuditoriaPorUsuario(productosPorUsuarioContainer, auditoriaPorUsuario);
    } catch (error) {
      renderErrors(errorsContainer, [
        error.message || "No fue posible cargar los registros de auditoría.",
      ]);
      renderResumenPorUsuario(resumenUsuariosContainer, {});
      renderAuditoriaPorUsuario(productosPorUsuarioContainer, {});
    }
  }

  form.addEventListener("submit", async (event) => {
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

    if (errores.length > 0) {
      renderErrors(errorsContainer, errores);
      return;
    }

    const usuarioSesion = getSessionUser();
    const usuarioId = usuarioSesion?.id || 1;

    try {
      await createAuditLog({
        usuario_id: usuarioId,
        accion: hallazgo.toUpperCase(),
        tabla_afectada: "productos",
        registro_id: 0,
        detalles: `${producto}: ${descripcion}`,
      });

      renderErrors(errorsContainer, []);
      form.reset();
      await refreshAuditData();
    } catch (error) {
      renderErrors(errorsContainer, [
        error.message || "No fue posible registrar el hallazgo.",
      ]);
    }
  });

  refreshAuditData();
}

function getSessionUser() {
  try {
    const sessionRaw = sessionStorage.getItem("rg_current_user");
    if (!sessionRaw) return null;
    const parsed = JSON.parse(sessionRaw);
    if (parsed?.id) return parsed;
    return null;
  } catch {
    return null;
  }
}

function agruparAuditoriaPorUsuario(registros) {
  return registros.reduce((acc, registro) => {
    const usuario =
      registro && registro.usuario_nombre && String(registro.usuario_nombre).trim()
        ? String(registro.usuario_nombre).trim()
        : "Usuario no identificado";

    if (!acc[usuario]) {
      acc[usuario] = [];
    }

    acc[usuario].push(registro);
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

function renderAuditoriaPorUsuario(container, productosPorUsuario) {
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
            <p>Total de registros: <strong>${productos.length}</strong></p>
            <div class="table-wrapper" role="region" aria-label="Auditoría de ${usuario}">
              <table class="table-pro">
                <thead>
                  <tr>
                    <th>Acción</th>
                    <th>Tabla afectada</th>
                    <th>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  ${productos
                    .map(
                      (producto) => `
                        <tr>
                          <td>${producto.accion || "Sin acción"}</td>
                          <td>${producto.tabla_afectada || "No definida"}</td>
                          <td>${producto.detalles || "Sin detalles"}</td>
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
