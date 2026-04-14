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
    - `<h

#### `assets/js/inventario.js`
Se amplió el módulo de Inventario para incluir gestión básica de categorías en la interfaz, manteniendo el formulario de productos como flujo principal.

#### Cambios funcionales
- Se añadieron categorías iniciales en memoria:
  - `cocina`
  - `barra`1 class="brand-text">Gestión Interna de Inventario</h1>`
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

### 🔐 Módulo de Usuarios + Autenticación básica (iteración reciente)

#### `assets/js/usuarios.js` (nuevo)
Se incorporó el módulo de usuarios con persistencia local y autenticación básica.

- Persistencia:
  - `localStorage` para usuarios (`rg_users`).
  - `sessionStorage` para sesión activa (`rg_current_user`).
- Datos base:
  - Usuario semilla: `admin / admin123` (rol Administrador).
- Funciones principales:
  - `renderUsuariosSection(content)`:
    - Formulario de creación (nombre, username, password, rol).
    - Listado dinámico de usuarios en tabla.
    - Validaciones de campos y username único.
  - `renderLoginSection(content, onLoginSuccess)`:
    - Formulario de login básico con validación de credenciales.
  - `tryLogin(username, password)`, `getCurrentSessionUser()`, `logoutSessionUser()`.
- Seguridad de salida UI:
  - Escapado HTML en render de datos (`escapeHtml`) para prevenir inyección en el DOM.

#### `assets/js/index.js`
Se amplió el archivo barril para exponer funciones del módulo de usuarios y sesión:

- `renderUsuariosSection`
- `renderLoginSection`
- `getCurrentSessionUser`
- `logoutSessionUser`

---

### 🧭 Integración de autenticación en flujo principal (iteración reciente)

#### `assets/js/main.js`
Se adaptó la inicialización de la app para exigir autenticación antes de usar navegación operativa.

- Flujo de arranque:
  - Si hay sesión activa: habilita navegación y renderiza bienvenida.
  - Si no hay sesión: deshabilita navegación y muestra login.
- Se añadió gestión visual de navegación:
  - `setNavigationEnabled(enabled)` para bloquear/desbloquear links de menú y sidebar.
- Botón de sesión:
  - `ensureLogoutButton()` crea/inyecta botón `Cerrar sesión` dentro de `#session-actions`.
  - El botón **solo se muestra cuando hay sesión iniciada**.
  - Al cerrar sesión:
    - limpia sesión
    - oculta botón
    - vuelve a pantalla de login
    - deshabilita navegación.

---

### 🧱 Ajustes estructurales en cabecera y navegación (iteración reciente)

#### `index.html`
Se actualizó la cabecera para soportar acciones de sesión sin romper la navegación existente:

- Nuevo contenedor:
  - `<div class="header-actions">`
  - `<div class="session-actions" id="session-actions"></div>`
- Menú principal:
  - Se elimina opción separada “Usuarios”.
  - Se mantiene “Administración” como punto único para gestión de usuarios.

---

### 🗂️ Consolidación de Administración con Usuarios (iteración reciente)

#### `assets/js/administracion.js`
Se simplificó el módulo para evitar contenido duplicado.

- Antes:
  - Renderizaba título/texto propios + wrapper, y luego render de usuarios.
- Ahora:
  - `renderAdministracionSection(content)` delega directamente en `renderUsuariosSection(content)`.

Resultado:
- Administración muestra directamente el módulo de usuarios.
- Se elimina el doble encabezado/texto innecesario.

---

### 🎨 Estilos para acciones de sesión en header (iteración reciente)

#### `assets/css/styles.css`
Se añadieron estilos coherentes con el tema para sesión/logout (sin estilos inline en JS):

- `.header-actions`
- `.session-actions`
- `.logout-btn`
- Estados `:hover` y `:active`
- Ajustes responsive para cabecera y distribución de acciones de sesión.

---

### 🧩 Módulo de Categorías dentro de Inventario (iteración reciente)
  - `suministros`
- Se incorporó una nueva sección `Categorías` con:
  - Formulario de creación (`#categoria-form`)
  - Campo `Nueva categoría` (`categoriaNombre`)
  - Botón `Crear categoría`
  - Contenedor de mensajes (`#categoria-messages`)
  - Listado dinámico (`#categorias-list`)
- Se implementó renderizado dinámico del listado de categorías mediante `renderCategoriasList()`.

#### Validaciones de creación de categoría
- Campo obligatorio:
  - `"El nombre de la categoría es requerido."`
- Solo texto:
  - `"La categoría debe contener solo texto."`
- Sin duplicados:
  - `"La categoría ya existe en el listado."`
- Normalización previa para consistencia:
  - `trim`
  - `toLowerCase`
  - compactación de espacios múltiples.

#### Mensajería y UX
- En error: se muestran mensajes en lista dentro de `#categoria-messages`.
- En éxito: se muestra
  - `"Categoría creada correctamente."`
- Se limpia el formulario tras creación válida y se actualiza inmediatamente el listado.

#### Reorganización solicitada
- Se ajustó el orden visual para que **Crear producto** (`#inventario-form`) aparezca primero.
- La sección **Categorías** queda después del formulario principal, sin afectar validaciones existentes del módulo Inventario.

---

### 📦 Módulo de Productos en Inventario (iteración reciente)

#### `assets/js/inventario.js`
Se amplió el módulo para cubrir el flujo completo solicitado de productos con categoría obligatoria, trazabilidad de creador, inventario listado y filtros.

#### Cambios funcionales principales
- **Categoría obligatoria al crear producto**
  - El campo categoría del formulario de producto cambió de `input` a `select`.
  - El `select` se alimenta dinámicamente desde el arreglo de categorías.
  - Se valida que la categoría exista en el listado permitido.
- **Registro automático de usuario creador**
  - Se añade la función `getSessionUser()` para resolver el usuario actual desde almacenamiento local:
    - `localStorage.sessionUser`
    - `localStorage.currentUser`
    - `localStorage.username`
  - Incluye soporte para valores tipo string u objeto serializado.
  - Fallback:
    - `"Usuario no identificado"`
- **Listado de inventario completo**
  - Se incorpora estado en memoria `productos`.
  - Al registrar un producto válido, se guarda con estructura:
    - `nombre`
    - `categoria`
    - `cantidadInicial`
    - `proveedor`
    - `creadoPor`
    - `fechaCreacion`
  - Se renderiza una tabla dinámica con el inventario completo.
- **Filtros de búsqueda por nombre y categoría**
  - Nueva sección de filtros:
    - `#filtro-nombre` (texto)
    - `#filtro-categoria` (select)
  - Se implementa `applyFilters()` para filtrar en tiempo real por:
    - coincidencia parcial en nombre
    - coincidencia exacta de categoría
  - El filtrado combinado actualiza la tabla sin recargar.
- **Sincronización de categorías en UI**
  - `renderCategoriaOptions()` actualiza opciones tanto en:
    - selector de categoría del formulario de producto
    - selector de categoría del filtro
  - Al crear categoría nueva, se refresca inmediatamente el listado y filtros.

#### Validaciones mantenidas/ajustadas
- Producto:
  - nombre obligatorio y solo texto
  - categoría obligatoria y válida del catálogo
  - cantidad inicial > 0
  - proveedor obligatorio y solo texto
- Categorías:
  - obligatorio
  - solo texto
  - no duplicados

---

### 🎨 Estilos para cambios del módulo de Productos (iteración reciente)

#### `assets/css/styles.css`
Se añadieron estilos específicos para las nuevas secciones de Inventario, conservando la línea visual del sistema.

#### Nuevos bloques estilizados
- `#inventario-filtros`
- `#inventario-listado`

Ambos con:
- borde y radio coherentes con tarjetas del sistema
- fondo degradado suave
- sombra sutil
- espaciado uniforme

#### Filtros de búsqueda
- Estilos para labels, `input` y `select` en `#inventario-filtros`.
- Estados `:focus` con realce accesible.

#### Tabla de inventario completo
- Contenedor con scroll horizontal:
  - `#inventario-table-container { overflow-x: auto; }`
- Tabla con:
  - encabezado con gradiente de marca
  - celdas con bordes suaves
  - zebra rows (`nth-child(even)`)
  - hover en filas para facilitar lectura

#### Responsive
- En `@media (max-width: 860px)`:
  - se ajusta padding de secciones nuevas
  - se reduce `min-width` de la tabla para mejorar visualización en móvil

---

### 🧾 Auditoría: productos creados por cada usuario (iteración reciente)

#### `assets/js/inventario.js`
Se incorporó persistencia del inventario en almacenamiento local para habilitar consulta transversal desde otros módulos.

- Nuevo almacenamiento:
  - Clave: `inventarioProductos` en `localStorage`.
- Comportamiento agregado:
  - `loadProductos()` carga productos guardados al renderizar Inventario.
  - `saveProductos()` persiste productos cada vez que se registra uno nuevo.
- Efecto funcional:
  - Los productos ya no viven solo en memoria temporal del módulo.
  - Se conserva trazabilidad (`creadoPor`, `fechaCreacion`) para auditoría.

#### `assets/js/auditoria.js`
Se agregó reporte de auditoría para visualizar productos creados por usuario.

- Nueva sección de reporte:
  - Título: **Productos creados por cada usuario**.
- Flujo implementado:
  - Lectura de productos desde `localStorage` (`inventarioProductos`).
  - Agrupación por campo `creadoPor`.
  - Render por usuario con:
    - nombre de usuario,
    - total de productos creados,
    - listado de productos (nombre, categoría, fecha).
- Estado sin datos:
  - Mensaje: `"No hay productos registrados para auditar."`

#### Resultado de negocio
- Auditoría ahora muestra trazabilidad real de creación de productos por responsable.
- Se mantiene el formulario de hallazgos existente sin romper su validación.

---

### 📝 Archivos de registro
- Se actualiza este archivo `changelog.md` para registrar los cambios realizados.

---

### 🧱 Estructura visual profesional en módulos (iteración más reciente)

#### `assets/css/content.css`
Se reforzó la estructura global del área principal para unificar presentación, jerarquía visual y tablas dinámicas en los módulos.

- Se mejoró `.main-content` con:
  - mayor padding
  - distribución en columna con `gap`
- Se añadieron reglas globales para centrar y ordenar contenido:
  - `.main-content > h2` (título principal centrado)
  - `.main-content > p` (subtítulo centrado con ancho máximo)
  - `.main-content > section, .main-content > form` (ancho controlado y centrado)
- Se consolidó estilo reutilizable de módulos:
  - `.panel-card` y `.panel-card h3`
- Se añadió sistema profesional para tablas:
  - `.table-wrapper` (contenedor responsive con scroll horizontal)
  - `.table-pro` (tabla base reutilizable)
  - estilos de encabezado, celdas, zebra rows y hover
- Se añadieron utilidades para listas y distribución:
  - `.list-clean`
  - `.auditoria-grid`
- Se reforzó el comportamiento responsive:
  - ajuste de `gap` y anchos en móvil
  - `min-width` de `.table-pro` para mantener legibilidad

#### `assets/js/usuarios.js`
Se profesionalizó el render del listado dinámico de usuarios.

- `renderUsersTable(container, users)` ahora renderiza:
  - contenedor semántico `.table-wrapper` con `role="region"` y `aria-label`
  - tabla con clases `users-table table-pro` para heredar estilo unificado
- Se actualizó el texto introductorio del módulo para reflejar un enfoque más claro y profesional.

#### `assets/js/auditoria.js`
Se reorganizó la sección de auditoría para mostrar información más estructurada y fácil de revisar.

- El bloque de reporte se convirtió en tarjeta visual:
  - `section#auditoria-reporte-productos` ahora usa `class="panel-card"`
- Se añadió layout de reporte:
  - `div.auditoria-grid` para separar resumen y detalle
- `renderResumenPorUsuario(...)`:
  - pasó de lista simple a tabla profesional (`.table-wrapper` + `.table-pro`)
  - columnas: Usuario / Total de productos
- `renderProductosPorUsuario(...)`:
  - cada usuario ahora se muestra en una `panel-card`
  - detalle en tabla profesional por usuario con columnas:
    - Producto
    - Categoría
    - Fecha de creación

#### Estado de implementación
- Cambios visuales y estructurales aplicados en los módulos de Usuarios y Auditoría.
- Se deja registrado que falta completar la iteración con ajuste final en `assets/js/main.js` y validación visual completa por pruebas.

---

### 🧱 Arquitectura CSS por componentes con BEM (iteración más reciente)

#### `index.html`
Se migró la estructura de clases hacia convención BEM para mejorar mantenibilidad y escalabilidad visual.

- Header:
  - `header` → `site-header`
  - `brand` → `site-header__brand`
  - `brand-logo` → `site-header__logo`
  - `brand-text` → `site-header__title`
  - `header-actions` → `site-header__actions`
  - `nav`/`ul`/`a` → `site-header__nav`, `site-header__menu`, `site-header__menu-link`
  - `session-actions` → `site-header__session-actions`
- Layout principal:
  - `main-layout main-container` → `layout layout--main`
- Sidebar:
  - `sidebar card` → `sidebar sidebar--card`
  - título/lista/enlaces migrados a `sidebar__title`, `sidebar__menu`, `sidebar__item`, `sidebar__link`
- Contenido principal:
  - `content card` → `main-content main-content--card`
- Footer:
  - `footer` → `site-footer`
  - párrafo a `site-footer__text`
- `<body>` actualizado a clase base `app`.

#### Nueva estructura CSS por bloques
Se separó el CSS en archivos por componente siguiendo arquitectura modular.

- `assets/css/base.css`
  - Tokens globales (`:root`), reset, tipografía, fondos, layout principal y breakpoints base.
- `assets/css/header.css`
  - Estilos del bloque `site-header` y elementos de navegación/sesión.
- `assets/css/sidebar.css`
  - Estilos del bloque `sidebar` y sus elementos BEM.
- `assets/css/content.css`
  - Estilos del bloque `main-content`, formularios, tarjetas y secciones de inventario/tabla.
- `assets/css/footer.css`
  - Estilos del bloque `site-footer`.

#### `assets/css/styles.css`
Se convirtió en archivo de agregación/compatibilidad usando imports:

- `@import url('/assets/css/base.css');`
- `@import url('/assets/css/header.css');`
- `@import url('/assets/css/sidebar.css');`
- `@import url('/assets/css/content.css');`
- `@import url('/assets/css/footer.css');`

#### Corrección funcional derivada de la migración BEM

##### `assets/js/main.js`
Se ajustaron selectores para que el render dinámico (incluyendo login) funcione con las nuevas clases BEM:

- `.content` → `.main-content` en:
  - `getContentElement()`
  - `renderWelcome()`
  - `renderSection()`
  - `renderMovimientosByTipo()`
- `.nav a` → `.site-header__menu-link`
- `.sidebar a` → `.sidebar__link`
- `.header` → `.site-header`
- `.nav` (referencia interna en header) → `.site-header__nav`

#### Resultado de la iteración
- UI más moderna, dinámica y profesional.
- CSS desacoplado por componentes (arquitectura escalable).
- Convención BEM aplicada en estructura principal.
- Flujo de login/render restablecido tras alinear selectores JS con el nuevo HTML.

---

### 🌐 Integración Frontend ↔ Backend con API centralizada (iteración reciente)

Se conectó el frontend con el backend REST manteniendo la modularización existente (una vista por archivo) y exportaciones centralizadas desde el barril `assets/js/index.js`.

#### `assets/js/api.js` (nuevo)
Se creó un módulo de acceso a datos para centralizar todas las llamadas `fetch` al backend.

- URL base:
  - `API_BASE_URL = "http://localhost:3000"`
- Wrapper interno:
  - `request(endpoint, options)` con:
    - headers JSON por defecto
    - parseo de respuesta JSON
    - manejo de error cuando `success === false`
- Funciones expuestas:

Usuarios:
- `getAllUsers()`
- `getUserById(id)`
- `createUser(payload)`

Categorías:
- `getAllCategories()`
- `getCategoryById(id)`
- `createCategory(payload)`

Productos:
- `getAllProducts()`
- `getProductById(id)`
- `createProduct(payload)`

Auditoría:
- `getAllAuditLogs()`
- `getAuditLogById(id)`
- `createAuditLog(payload)`

#### `assets/js/index.js`
Se amplió el barril para exportar también las funciones del módulo API, manteniendo una única puerta de entrada para imports del frontend.

#### `assets/js/usuarios.js`
Se migró el consumo principal de usuarios de almacenamiento local a backend:

- Listado remoto de usuarios:
  - `getAllUsers()`
- Creación remota de usuarios:
  - `createUser({ documento, nombre, rol })`
- Tabla ajustada:
  - se muestra `documento` (en lugar de `username` en el flujo administrativo conectado a API).
- Se conserva autenticación demo (`admin/admin123`) para no romper flujo de acceso existente.
- Se mantiene fallback visual para continuidad de UI si hay falla de red/API.

#### `assets/js/inventario.js`
Se integró con backend para categorías/productos y trazabilidad:

- Inicialización asíncrona de datos:
  - carga de categorías, productos y usuarios.
- Categorías:
  - listado y selects dinámicos con `getAllCategories()`
  - creación con `createCategory()`
- Productos:
  - render de inventario con datos de `getAllProducts()`
  - creación con `createProduct()` enviando JSON al backend
- Auditoría complementaria:
  - al crear producto se intenta registrar evento con `createAuditLog()`.
- Se eliminaron dependencias principales de `localStorage` para inventario como fuente de verdad.

#### `assets/js/auditoria.js`
Se reemplazó lógica basada en inventario local por consumo backend:

- Carga de logs:
  - `getAllAuditLogs()`
- Resolución de usuarios:
  - `getAllUsers()`
- Registro de hallazgos:
  - `createAuditLog()` enviando JSON
- Reporte:
  - agrupación por usuario con datos reales del backend
  - render en tabla/resumen dinámicos.

#### `assets/js/movimientos.js`
Se conectó el módulo de Movimientos con el backend actual reutilizando el endpoint de auditoría.

- Antes:
  - Solo validaba datos localmente y no persistía nada en backend.
- Ahora:
  - Importa funciones API:
    - `createAuditLog`
    - `getAllUsers`
  - En `submit`, tras validar:
    - resuelve `usuario_id` desde sesión (`rg_current_user`) con fallback al primer usuario del backend o `1`.
    - mapea tipo de movimiento a acción de auditoría:
      - `entrada` → `MOVIMIENTO_ENTRADA`
      - `salida` → `MOVIMIENTO_SALIDA`
    - construye `detalles` con `producto`, `cantidad` y `motivo`.
    - envía payload compatible con `/auditoria`:
      - `usuario_id`
      - `accion`
      - `tabla_afectada: "productos"`
      - `registro_id: 0`
      - `detalles`
  - Agrega carga inicial de usuarios (`initUsers`) para mejorar resolución de autor.
  - Mantiene validaciones existentes y ahora muestra:
    - éxito real de persistencia: `"Movimiento registrado correctamente."`
    - error real de API cuando falle la petición.

#### Resultado funcional de la integración
- Frontend consumiendo endpoints REST reales:
  - `/usuarios`
  - `/categorias`
  - `/productos`
  - `/auditoria`
- Formularios principales enviando JSON al backend.
- Render dinámico de tablas/listados basado en respuesta del servidor.
- Se preserva arquitectura modular del frontend y estilo visual existente.

---

### 🔐 Autenticación JWT + autorización por rol (admin/user) en frontend

Se migró la autenticación de demo local a autenticación real contra backend y se agregó manejo de token para consumir rutas protegidas.

#### `assets/js/auth.js` (nuevo)
Se creó un módulo centralizado de autenticación/sesión:

- `login(username, password)`
  - consume `POST /auth/login`
  - almacena token y usuario autenticado en `sessionStorage`
- `logout()`
  - limpia sesión/token
- `getToken()`
  - retorna JWT actual
- `getSessionUser()`
  - retorna usuario autenticado en sesión
- `hasRole(role)`
  - helper para validación de rol en UI

#### `assets/js/api.js`
Se actualizó el cliente API para enviar JWT automáticamente en cada petición:

- Se importa `getToken()` desde `auth.js`
- En `request(...)` se agrega header:
  - `Authorization: Bearer <token>` (cuando existe token)
- Se mantiene manejo estandarizado de errores y parseo JSON.

#### `assets/js/usuarios.js`
Se reemplazó el login demo por login real de backend y se aplicó control por rol en UI:

- Login:
  - elimina validación hardcoded `admin/admin123`
  - ahora usa `login(...)` del módulo `auth.js`
- Sesión:
  - `getCurrentSessionUser()` y `logoutSessionUser()` delegan al módulo `auth.js`
- Administración de usuarios:
  - módulo restringido visualmente a rol `admin`
  - usuarios `user` ven mensaje de acceso denegado para gestión administrativa
- Formulario de creación:
  - ahora incluye `username` y `password` para alinear con backend seguro
- Tabla:
  - muestra columna `username` junto a `id`, `nombre`, `documento`, `rol`

### Resultado en frontend
- Flujo de sesión real contra backend JWT.
- Persistencia de token para consumir endpoints protegidos.
- Control de visibilidad por rol en la interfaz de administración.
- Estructura modular mantenida (`auth.js` + `api.js` + módulos de vista).

---

### 🧩 Ajuste de rutas CSS en hoja agregadora

Se corrigieron las rutas `@import` del archivo agregador de estilos para mantener resolución consistente de hojas CSS en distintos contextos de despliegue estático.

#### `assets/css/styles.css`
- Antes (rutas absolutas):
  - `@import url('/assets/css/base.css');`
  - `@import url('/assets/css/header.css');`
  - `@import url('/assets/css/sidebar.css');`
  - `@import url('/assets/css/content.css');`
  - `@import url('/assets/css/footer.css');`
- Ahora (rutas relativas al mismo directorio):
  - `@import url('./base.css');`
  - `@import url('./header.css');`
  - `@import url('./sidebar.css');`
  - `@import url('./content.css');`
  - `@import url('./footer.css');`

#### Resultado
- La carga de estilos vuelve a resolverse correctamente desde `styles.css`.
- Se conserva la arquitectura modular por archivos (`base`, `header`, `sidebar`, `content`, `footer`).
