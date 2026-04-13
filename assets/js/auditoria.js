export function renderAuditoriaSection(content) {
  content.innerHTML = `
    <h2>Auditoría</h2>
    <p>Consulta el historial de acciones internas para seguimiento y control administrativo.</p>

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
