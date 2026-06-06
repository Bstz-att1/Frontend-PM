# Changelog — Frontend · El Rincón Gastronómico

Todos los cambios relevantes del frontend se documentan en este archivo.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

---

## [Unreleased] — 2026-06-06

### Añadido

- **`assets/css/header.css`** — Nueva clase `.header-user-name` (`display:inline-flex`, `align-items:center`, `gap:0.4rem`, `svg 18×18px`) para alinear correctamente el icono de perfil con el nombre de usuario en el navbar.

- **`assets/css/content.css`** — Nuevas clases de UI:
  - `.password-wrapper` — contenedor flex con `position:relative`; el `input` interno recibe `padding-right` automático para no solaparse con el botón de ojo.
  - `.btn-password-toggle` — botón absoluto centrado verticalmente sobre el input; sin borde, hover en `var(--color-primary)`, icono SVG 16×16px con `pointer-events:none`.
  - `.users-toolbar` — barra de filtros con `display:flex`, `gap:0.75rem` y `flex-wrap:wrap`.
  - `.users-toolbar input` / `.users-toolbar select` — estilos completos de campo (borde, `border-radius`, `padding`, `font-size`, foco con glow azul), alineados con `.form-group input/select`. El select incluye flecha SVG personalizada y `padding-right` extra.

- **`src/modules/inventario/inventarioControlador.js`** — Implementación completa de edición para categorías y productos:
  - Acción `edit-cat`: abre modal SweetAlert2 pre-rellenado con nombre y descripción actuales; valida con `categoriaSchema` y llama a `actualizarCategoria(id, data)`.
  - Acción `edit-prod`: abre modal SweetAlert2 pre-rellenado con nombre, categoría (`<select>` estilizado con inline styles equivalentes a `swal2-input`), stock y descripción; valida con `productoSchema` y llama a `actualizarProducto(id, data)`.
  - Nuevos imports: `Swal` (sweetalert2), `actualizarCategoria`, `actualizarProducto`, `escapeHtml`.

- **`src/modules/movimientos/movimientosControlador.js`** — Nueva opción `<option value="ajuste">Ajuste de stock</option>` en el select de tipo, con variable `selectedAjuste` para pre-selección desde la ruta `#/movimientos/ajuste`.

- **`src/services/movimientosService.js`** — Soporte completo para el tipo `ajuste`:
  - `ACTION_MAP`: añadido `ajuste: 'UPDATE'`.
  - Nuevo objeto `TIPO_LABEL` (`entrada`, `salida`, `ajuste`) para construir el campo `details` del log de auditoría con texto legible en lugar de depender del ternario anterior.
  - JSDoc del parámetro `tipo` actualizado para incluir `'ajuste'`.

- **`src/modules/administracion/administracionControlador.js`** — Mejoras al formulario de creación de usuarios:
  - Nuevo campo **"Confirmar contraseña"** (`id="usr-pass-confirm"`, `name="password_confirm"`) con su propio `.password-wrapper` y botón `.btn-password-toggle`.
  - Handler en `onSectionClick`: detecta `.btn-password-toggle`, alterna `input.type` entre `password`/`text` y actualiza el icono `eye`/`eye-off` con `refreshIcons(toggleBtn)`.
  - Validación previa al schema Zod: si `password !== passwordConfirm` muestra `"Las contraseñas no coinciden."` sin continuar.

### Corregido

- **`src/modules/inventario/inventarioControlador.js`** — Los botones de editar (ícono lápiz) en las tablas de categorías y productos no ejecutaban ninguna acción: `onSectionClick` solo manejaba `delete-cat` y `delete-prod`. Añadidos los casos `edit-cat` y `edit-prod`.

- **`src/modules/inventario/inventarioControlador.js`** — El `<select>` de categoría en el modal de edición de productos no tenía el mismo aspecto que los `<input>` porque `class="swal2-input"` no aplica correctamente en `<select>`. Reemplazado con estilos inline explícitos (`border`, `border-radius`, `font-size`, `padding`, `height`, `font-family`).

- **`src/utils/validaciones.js`** — `movimientoSchema` solo aceptaba `'entrada'` y `'salida'`. Extendido el enum a `['entrada', 'salida', 'ajuste']` con mensaje de error actualizado.

- **`src/modules/administracion/administracionControlador.js`** — Los `<input>` y `<select>` del toolbar de usuarios tenían `class="form-group input"` y `class="form-group select"`, convirtiendo los propios campos en flex-containers (comportamiento incorrecto de `.form-group`). Clases eliminadas; el estilo lo proveen ahora las reglas `.users-toolbar input/select`.
