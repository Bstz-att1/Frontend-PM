# Changelog

### 🎨 `assets/css/styles.css`
Se actualizó la paleta de colores y estilos base para un sistema interno de inventario orientado a confort visual y legibilidad.

#### Variables nuevas/actualizadas en `:root`
- `--color-primario: #2F5D8A`
- `--color-primario-hover: #244A6D`
- `--color-secundario: #4C8C7A`
- `--color-fondo: #F7F9FC`
- `--color-superficie: #FFFFFF`
- `--color-borde: #D9E1EC`
- `--color-texto: #1F2A37`
- `--color-texto-secundario: #4B5563`
- `--color-texto-tenue: #6B7280`
- `--color-texto-sobre-primario: #FFFFFF`
- `--color-exito: #2E7D32`
- `--color-advertencia: #D97706`
- `--color-error: #C62828`
- `--color-info: #2563EB`

#### Ajustes visuales
- `body`: se añadió `line-height: 1.5`.
- `.header` y `.footer`: texto con mejor contraste usando `--color-texto-sobre-primario`.
- `.nav a:hover`: mantiene subrayado y añade `opacity: 0.95`.
- `.sidebar`: fondo claro, texto oscuro y borde derecho (`--color-borde`).
- `.content`: fondo de superficie para mejorar lectura.

---

### 🧱 `index.html`
Se actualizó la estructura y contenido para reflejar el enfoque de gestión interna administrativa.

#### Cambios principales
- Título del encabezado actualizado a **“Gestión Interna de Inventario”**.
- Menú principal simplificado y alineado al flujo interno:
  - `Inventario`
  - `Movimientos`
  - `Auditoría`
  - `Administración` (añadido después por solicitud).
- Sidebar actualizado a **“Menú interno”** con accesos operativos.
- Sección principal enriquecida con:
  - Panel operativo diario
  - Resumen del día
  - Accesos rápidos
  - Estado operativo

---

### ⚙️ `assets/js/main.js`
Se ajustó la lógica de render para que los mensajes coincidan con el menú actual.

#### Cambios funcionales iniciales
- `renderWelcome()`:
  - Mensaje inicial actualizado al contexto interno operativo.
- `renderSection(section)`:
  - Se eliminaron casos obsoletos:
    - `Usuarios`
    - `Categorías`
    - `Productos`
  - Se implementaron casos vigentes:
    - `Inventario`
    - `Movimientos`
    - `Auditoría`
    - `Administración` (nuevo módulo para gestión de usuarios)

#### Estado actual
- `main.js` es el archivo que gestiona la lógica de la app (init, navegación y render).
- Consume los módulos mediante importaciones desde el archivo barril:
  - `./index.js`

---

### 🧩 Modularización por secciones (Frontend JS)
Se separó la lógica de render de cada sección en módulos independientes para mejorar escalabilidad, claridad y mantenimiento.

#### Nuevos módulos creados
- `assets/js/inventario.js`
  - Exporta `renderInventarioSection(content)` con el contenido de Inventario.
- `assets/js/movimientos.js`
  - Exporta `renderMovimientosSection(content)` con el contenido de Movimientos.
- `assets/js/auditoria.js`
  - Exporta `renderAuditoriaSection(content)` con el contenido de Auditoría.
- `assets/js/administracion.js`
  - Exporta `renderAdministracionSection(content)` con el contenido de Administración de usuarios.

---

### ⚙️ `assets/js/index.js` (archivo barril)
Se usa exclusivamente como archivo barril para centralizar exportaciones de módulos.

#### Contenido del barril
- `export { renderInventarioSection } from "./inventario.js";`
- `export { renderMovimientosSection } from "./movimientos.js";`
- `export { renderAuditoriaSection } from "./auditoria.js";`
- `export { renderAdministracionSection } from "./administracion.js";`

---

### 🧱 `index.html` (módulos ES)
Se configuró la carga del script principal con ES Modules para que `main.js` pueda importar desde `index.js`.

#### Cambio aplicado
- Antes:
  - `<script src="assets/js/main.js"></script>`
- Ahora:
  - `<script type="module" src="assets/js/main.js"></script>`

---

### 🧾 Formularios por módulo y validaciones (Frontend JS)
Se implementaron formularios funcionales en cada módulo con validaciones de negocio, mensajes específicos y enfoque de trazabilidad operativa.

#### `assets/js/inventario.js`
- Se reemplazó el contenido estático por formulario:
  - Campos: `nombre`, `categoría`, `cantidad inicial`, `proveedor`.
- Validaciones implementadas:
  - Nombre obligatorio:
    - `"El nombre del producto es requerido."`
  - Nombre solo texto:
    - `"El nombre del producto debe contener solo texto para una identificación clara."`
  - Categoría obligatoria:
    - `"Debe ingresar la categoría del producto para clasificar correctamente el inventario."`
  - Categoría solo texto:
    - `"La categoría debe contener solo texto para mantener una clasificación legible."`
  - Cantidad inicial mayor que cero (sin negativos ni 0):
    - `"La cantidad inicial debe ser mayor que cero."`
  - Proveedor obligatorio:
    - `"Debe ingresar el proveedor para mantener trazabilidad del abastecimiento."`
  - Proveedor solo texto:
    - `"El proveedor debe contener solo texto para mantener registros consistentes."`

#### `assets/js/movimientos.js`
- Se reemplazó el contenido estático por formulario:
  - Campos: `tipo de movimiento`, `producto`, `cantidad`, `motivo`.
- Validaciones implementadas:
  - Tipo obligatorio:
    - `"Debe seleccionar el tipo de movimiento."`
  - Producto obligatorio:
    - `"El nombre del producto es requerido."`
  - Producto solo texto (no números):
    - `"El producto debe contener solo texto para mantener una identificación clara del movimiento."`
  - Cantidad positiva (sin negativos ni 0):
    - `"La cantidad debe ser un número válido mayor que cero."`
  - Motivo obligatorio:
    - `"Debe ingresar el motivo del movimiento para conservar trazabilidad operativa."`
  - Motivo solo texto:
    - `"El motivo debe contener solo texto para mantener claridad en el registro del movimiento."`

#### `assets/js/auditoria.js`
- Se reemplazó el contenido estático por formulario:
  - Campos: `producto`, `hallazgo detectado`, `descripción del hallazgo`.
- Ajustes de estructura solicitados:
  - `hallazgo detectado` se cambió a texto (ya no numérico).
  - `descripción del hallazgo` se mantiene como texto descriptivo.
- Validaciones implementadas:
  - Producto obligatorio:
    - `"Debe indicar el producto auditado para mantener trazabilidad del registro."`
  - Producto solo texto (no números):
    - `"El producto debe contener solo texto para mantener una identificación clara en auditoría."`
  - Hallazgo detectado obligatorio:
    - `"Debe registrar el hallazgo detectado para sustentar la trazabilidad de la auditoría."`
  - Hallazgo detectado solo texto (no números):
    - `"El hallazgo detectado debe contener solo texto para mantener una auditoría clara y trazable."`
  - Descripción del hallazgo obligatoria:
    - `"Debe ingresar una descripción del hallazgo para documentar el contexto y asegurar seguimiento."`
  - Descripción del hallazgo solo texto:
    - `"La descripción del hallazgo debe contener solo texto para conservar evidencia clara en la auditoría."`

#### `assets/js/administracion.js`
- Se reemplazó el contenido estático por formulario:
  - Campos: `nombre`, `correo`, `rol`, `estado`.
- Validaciones implementadas:
  - Nombre obligatorio:
    - `"Debe ingresar el nombre del usuario para identificar correctamente el registro administrativo."`
  - Nombre solo texto (no números):
    - `"El nombre debe contener solo texto para mantener una identificación clara del usuario."`
  - Correo válido:
    - `"Debe ingresar un correo electrónico válido para garantizar notificaciones, acceso seguro y trazabilidad del usuario."`
  - Rol obligatorio:
    - `"Debe asignar un rol al usuario para definir permisos y responsabilidades dentro del sistema."`
  - Estado obligatorio:
    - `"Debe definir el estado del usuario para controlar si tendrá acceso activo o inactivo al sistema."`

#### Comportamiento común aplicado
- En cada formulario se captura el evento `submit`, se previene recarga (`event.preventDefault()`) y se renderizan errores en lista.
- Se mantiene mensaje de éxito base al no existir errores:
  - `"Formulario válido."`

---

### 🎨 Refinamiento visual de formularios (fase parcial)
Se añadieron estilos para los nuevos formularios con una apariencia más moderna y elegante, manteniendo el alcance acotado para esta etapa del desarrollo.

#### `assets/css/styles.css`
- Se agregaron nuevos tokens de interfaz en `:root`:
  - `--radio-base`
  - `--radio-sm`
  - `--sombra-suave`
  - `--transicion-base`
- Se incorporó estilo base para formularios en `.content form`:
  - borde suave
  - fondo con gradiente ligero
  - sombra sutil
  - espaciado consistente
- Se estilizaron campos y controles:
  - `input`, `select`, `textarea`
  - estados de foco accesibles con realce visual
- Se estilizó el botón de envío:
  - apariencia primaria
  - hover y active con microinteracciones
- Se añadieron estilos para mensajes de validación:
  - errores (`div[id$="-errors"] ul`)
  - estado válido (`div[id$="-errors"] p`)
- Se agregó responsive base (`@media (max-width: 860px)`):
  - layout de una columna
  - ajustes de `sidebar`, `header`, `nav` y `content`

#### Alcance de esta fase
- Se aplicó un refinamiento visual intermedio.
- No se realizaron aún ajustes de diseño avanzados/finales de UI (pendientes para fases posteriores).

---

### ✨ Ajuste visual moderno y elegante (fase parcial adicional)
Se aplicó una mejora estética ligera en la interfaz principal para lograr una apariencia más moderna y profesional, manteniendo el alcance acotado mientras continúa el desarrollo.

#### `index.html`
- Se añadieron clases estructurales para habilitar el nuevo estilo sin cambiar la lógica:
  - `<main class="main-layout main-container">`
  - `<aside class="sidebar card">`
  - `<section class="content card">`
- Se añadieron clases visuales a los bloques informativos:
  - `<article class="panel-card">` en:
    - Resumen del día
    - Accesos rápidos
    - Estado operativo

#### `assets/css/styles.css`
- Se refinaron tokens visuales:
  - `--radio-base` y `--radio-sm` con bordes más suaves.
  - Nuevo token `--sombra-media`.
- Header modernizado:
  - gradiente sutil (`linear-gradient`)
  - mejor jerarquía tipográfica en título
  - sombra para mayor profundidad visual.
- Navegación mejorada:
  - enlaces tipo “pill”
  - hover más limpio con fondo translúcido.
- Layout principal más elegante:
  - columna lateral un poco más amplia
  - `gap` entre paneles
  - contenedor centrado con `max-width` mediante `.main-container`.
- Tarjetas visuales:
  - `.card` para contenedores principales.
  - `.panel-card` para artículos de contenido con borde, radio, fondo suave y sombra.
- Limpieza de listas/enlaces:
  - mejor espaciado de listas (`padding-left`)
  - enlaces de sidebar/contenido con transición y hover consistente.
- Se mantiene responsive base sin cerrar aún el diseño final.

#### Alcance de esta iteración
- Mejora visual intermedia (moderna/elegante) aplicada.
- No corresponde todavía a la versión final de UI/UX del sistema.

---

### 🔄 Ajustes de bienvenida institucional y render dinámico (iteración reciente)

#### `index.html`
- Se simplificó la sección principal para evitar duplicación con el render dinámico:
  - Antes: la sección `.content` contenía contenido estático completo (panel + institucional + tarjetas).
  - Ahora: se deja como contenedor base:
    - `<section class="content card"></section>`
- Motivo:
  - `assets/js/main.js` reescribe `.content` al iniciar, por lo que mantener contenido estático generaba redundancia e inconsistencias.

#### `assets/js/main.js`
- Se actualizó `renderWelcome()` para que renderice de forma dinámica toda la vista inicial:
  - `Panel operativo diario`
  - Mensaje guía de operación
  - Sección institucional:
    - Introducción
    - Objetivo de la empresa
    - Visión
    - Opiniones de clientes
- Se actualizó el texto de **Objetivo de la empresa** con el nuevo contenido institucional proporcionado por el usuario:
  - Enfoque en experiencia gastronómica, calidad constante, servicio amable, higiene, ambiente acogedor, relación calidad/precio, conexión emocional, identidad e ingredientes frescos/locales.
- Se amplió la sección de testimonios con más reseñas y nombres simulados:
  - Laura Méndez
  - Carlos Ríos
  - Andrea Salazar
  - Felipe Montoya
  - Daniela Pardo
  - Julián Herrera

---

### 🎨 Ajuste visual de mayor vividez (iteración reciente)

#### `assets/css/styles.css`
Se aplicó una mejora visual enfocada en dar más vida al sistema, especialmente en bienvenida, menú interno y tarjetas:

- `body`:
  - Se añadieron fondos con gradientes radiales suaves para mayor profundidad visual.
- `.sidebar`:
  - Fondo degradado más limpio.
  - Borde refinado.
  - Acento superior con gradiente (`::before`).
  - Título más destacado.
  - Lista sin viñetas y mejor separación entre items.
- `.sidebar a`:
  - Estilo tipo píldora con hover más visible y amigable.
- `.institucional-intro`:
  - Borde/sombra mejorados.
  - Decoración visual con pseudo-elemento `::after`.
  - Apariencia más protagonista en la vista de bienvenida.
- `.institucional-card`:
  - Nuevo fondo degradado.
  - Sombra suave y microinteracción hover (elevación).
- `.testimonio-card`:
  - Acento lateral reforzado.
  - Fondo más cálido y sombra con color.
  - Hover ligero para dinamismo.
- `.panel-card`:
  - Borde, fondo y sombras más vivos.
  - Efecto hover coherente con el resto de tarjetas.
- Responsive:
  - Se mantiene comportamiento a una columna para grids institucionales y testimonios en `@media (max-width: 860px)`.

---

### 🖼️ Integración de logo institucional en encabezado (iteración reciente)

#### `index.html`
- Se actualizó el encabezado para incluir branding visual junto al título.
- Antes:
  - `<h1>Gestión Interna de Inventario</h1>`
- Ahora:
  - Contenedor de marca:
    - `<div class="brand">`
    - `<img class="brand-logo" src="assets/img/Gemini_Generated_Image_717eyy717eyy717e.png" alt="Logo de El Rincón Gastronómico">`
    - `<h1 class="brand-text">Gestión Interna de Inventario</h1>`
- Objetivo:
  - Reforzar identidad institucional y presencia de marca dentro del sistema.

#### `assets/css/styles.css`
- Se añadieron estilos para los nuevos elementos del encabezado:
  - `.brand`:
    - alineación horizontal del logo y texto
    - separación consistente
  - `.brand-logo`:
    - tamaño fijo
    - bordes redondeados
    - `object-fit: cover`
    - sombra para mejorar visibilidad sobre el header
  - `.brand-text`:
    - tipografía ajustada para conservar jerarquía del título
- Responsive (`@media (max-width: 860px)`):
  - ajuste de ancho del bloque `.brand`
  - reducción de tamaño del logo
  - `brand-text` permite salto de línea para mejorar lectura en móvil

---

### 🧭 Modularización del sidebar y redirección por acciones (iteración reciente)

#### `assets/js/sidebar.js` (nuevo)
Se creó un módulo dedicado para encapsular la lógica del menú lateral y mantener separación clara de responsabilidades.

- Exporta:
  - `setupSidebarNavigation({ onWelcome, onSectionNavigate, onMovimientosNavigate })`
- Comportamiento implementado:
  - `Panel principal` → `onWelcome()`
  - `Entradas de stock` → `onMovimientosNavigate("entrada")`
  - `Salidas de stock` → `onMovimientosNavigate("salida")`
  - `Ajustes de inventario` → `onSectionNavigate("Inventario")`
  - `Reportes` → `onSectionNavigate("Auditoría")`
- Se centralizó el `click handler` del sidebar usando `.sidebar a` y `event.preventDefault()` para navegación interna por render.

#### `assets/js/main.js`
Se integró el módulo del sidebar sin afectar el flujo del menú principal.

- Import nuevo:
  - `import { setupSidebarNavigation } from "./sidebar.js";`
- `initApp()` ahora inicializa:
  - `renderWelcome()`
  - `setupNavigation()` (menú principal)
  - `setupSidebar()` (menú lateral)
- Se añadieron funciones de soporte:
  - `renderMovimientosByTipo(tipo)` para renderizar Movimientos con tipo preseleccionado.
  - `setupSidebar()` para conectar callbacks del módulo sidebar con la lógica de render existente.

#### `assets/js/movimientos.js`
Se extendió el render para soportar preselección de tipo de movimiento desde el sidebar.

- Firma actualizada:
  - `renderMovimientosSection(content, options = {})`
- Nueva capacidad:
  - Si `options.defaultTipo` existe, se asigna automáticamente al campo `tipoMovimiento`.
- Resultado:
  - Al hacer clic en `Entradas de stock` o `Salidas de stock`, el formulario abre con el tipo correcto ya seleccionado.

#### Impacto funcional
- Se mantiene intacta la navegación del menú principal.
- Se habilita navegación del sidebar con redirección interna clara y consistente.
- Se mejora mantenibilidad al separar la lógica del sidebar en su propio módulo.

---

### 📝 Archivos de registro
- Se actualiza este archivo `changelog.md` para registrar los cambios realizados.
