# Changelog — Frontend · El Rincón Gastronómico

> Registro completo de todos los archivos creados y modificados en el frontend del sistema de inventario.
> Proyecto académico SENA · Ficha 3233198

---

## [1.0.0] — Construcción completa del SPA

### Archivos de configuración y punto de entrada

#### `index.html` — Creado
Shell HTML mínimo del SPA. Contiene el contenedor `<div id="app">` que sirve como punto de montaje
dinámico para todo el contenido. Incluye:
- Meta SEO y `theme-color` naranja corporativo.
- Favicon y apple-touch-icon apuntando a la imagen del logo.
- Fuente **Inter** cargada desde Google Fonts con `preconnect`.
- Hoja de estilos global (`assets/css/styles.css`).
- Estado de carga inicial con spinner SVG inline mientras carga el bundle.
- Script `src/main.js` como módulo ES.

#### `package.json` — Creado
Manifiesto del proyecto Node/Vite con:
- `"type": "module"` para ES Modules nativos.
- Scripts `dev`, `build` y `preview` usando **Vite**.
- Dependencias de producción: `animate.css`, `lucide`, `sweetalert2`, `zod`.
- Dependencia de desarrollo: `vite`.

#### `src/main.js` — Creado
Punto de entrada del SPA. Responsabilidades:
1. Importa `animate.css` para las clases de animación declarativas.
2. Añade la clase `app` al `<body>` para activar los estilos globales del SPA.
3. Garantiza que el contenedor `#app` existe en el DOM (lo crea si no).
4. Llama a `initRouter()` para arrancar el router hash-based.

---

### Router

#### `src/router/router.js` — Creado
Router SPA basado en hash (`#`). Características:
- **Guard de autenticación**: `isProtected` redirige a `#/login` si no hay sesión; `onlyGuest` redirige a `#/home` si ya está autenticado.
- **Parámetros dinámicos**: soporta segmentos `:param` en las rutas (ej. `#/movimientos/:tipo`).
- **Cleanup de módulo**: llama a la función de limpieza del controlador anterior antes de montar el siguiente, evitando memory leaks de event listeners.
- **Actualización de título**: cambia `document.title` según la ruta.
- Exporta `renderRoute`, `navigateTo`, `initRouter` y `destroyRouter`.

#### `src/router/routes.js` — Creado
Tabla de rutas del SPA. Define:
- Ruta raíz `#/` y `#/login` → `loginView` + `loginController` (solo invitados).
- `#/home` → `homeView` + `homeController` (protegida).
- `#/inventario` → `homeView` + `inventarioController` (protegida).
- `#/movimientos` y `#/movimientos/:tipo` → `homeView` + `movimientosController` (protegida).
- `#/auditoria` → `homeView` + `auditoriaController` (protegida).
- `#/administracion` → `homeView` + `administracionController` (protegida).
- `notFoundRoute` con página 404 inline para rutas no encontradas.

---

### Núcleo (`src/core/`)

#### `src/core/config.js` — Creado
Configuración centralizada de la aplicación:
- `API_URL`: URL base del backend (lee `VITE_API_URL` de Vite env o usa `http://localhost:3000`).
- `APP_CONFIG`: constantes globales — `NOTIFICATION_DURATION` (3000 ms), `SESSION_KEY_TOKEN` (`rg_auth_token`), `SESSION_KEY_USER` (`rg_auth_user`), `REQUEST_TIMEOUT` (12 000 ms), `MAX_TABLE_ROWS` (100).

#### `src/core/permissions.js` — Creado
Sistema de permisos basado en roles. Lee los roles del usuario en sesión y expone:
- `hasRole(role)`, `hasAnyRole(...roles)` — comprobaciones genéricas.
- `isAdmin()` — solo rol `admin`.
- `isSupervisor()` — roles `admin` o `supervisor`.
- `isRegularUser()` — cualquier usuario autenticado.
- Funcionales: `canManageUsers()`, `canViewAudit()`, `canManageInventory()`, `canRegisterMovements()`, `canViewInventory()`.

---

### Capa API (`src/api/`)

#### `src/api/httpClient.js` — Creado
Cliente HTTP autenticado:
- `authFetch(url, options)`: inyecta el token JWT como header `Authorization: Bearer <token>` en cada petición.
- Detecta respuesta `401` y emite el evento global `auth:session-expired` para forzar logout automático.
- Maneja errores de red con mensaje descriptivo.

#### `src/api/auth.api.js` — Creado
Módulo de autenticación contra el backend (`/auth`):
- `authLogin(username, password)`: POST a `/auth/login`.
- `authLogout(token)`: POST a `/auth/logout` (fallo silencioso).
- `authMe()`: GET a `/auth/me` con token.

#### `src/api/categories.api.js` — Creado
CRUD de categorías (`/categories`):
- `categoryGet()` — listado completo.
- `categoryGetById(id)` — categoría por ID.
- `categoryPost({ name, description })` — creación.
- `categoryPut(id, { name, description })` — actualización.
- `categoryDelete(id)` — eliminación.
- Normaliza respuestas envolventes `{ data: [...] }` con `extractData()`.

#### `src/api/products.api.js` — Creado
CRUD de productos (`/products`):
- `productGet()` — listado completo.
- `productGetById(id)` — producto por ID.
- `productPost({ name, description, category_id, quantity })` — creación.
- `productPut(id, { ... })` — actualización.
- `productDelete(id)` — eliminación.

#### `src/api/audit.api.js` — Creado
Acceso a logs de auditoría (`/audit`):
- `auditGet()` — obtiene todos los logs.
- `auditPost({ user_id, action, affected_table, record_id, details })` — registra un evento. Normaliza `action` a mayúsculas.

#### `src/api/users.api.js` — Creado
CRUD de usuarios (`/users`):
- `userGet()`, `userGetById(id)`, `userPost(...)`, `userPut(id, ...)`, `userDelete(id)`.
- Payload: `{ document, name, username, password, roles: string[] }`.

#### `src/api/index.js` — Creado
Barrel de exportaciones de toda la capa API. Re-exporta todas las funciones de los módulos anteriores para importación unificada desde `'../api/index.js'`.

---

### Repositorio base (`src/repositories/`)

#### `src/repositories/baseRepository.js` — Creado
Abstracción HTTP genérica sobre `authFetch`:
- `buildUrl(endpoint, query)`: construye URLs con query params opcionales.
- `parseResponse(response)`: normaliza respuestas OK/error, extrae mensajes de error del payload JSON.
- `request(method, endpoint, { data, query, headers })`: método base autenticado.
- Expone `baseRepository.get`, `.post`, `.put`, `.patch`, `.delete`.

---

### Servicios (`src/services/`)

#### `src/services/authService.js` — Creado
Capa de sesión sobre `sessionStorage`:
- `saveSession({ token, user })` — persiste token y usuario.
- `getSession()` — lee sesión actual (con manejo de JSON malformado).
- `getToken()`, `getSessionUser()`, `isAuthenticated()`, `clearSession()`.
- `loginWithCredentials(username, password)` — llama a `authLogin`, guarda sesión, retorna `{ token, user }`.
- `logoutCurrentSession()` — llama a `authLogout` y borra `sessionStorage`.

#### `src/services/inventarioService.js` — Creado
Capa de servicio sobre la API de categorías y productos:
- `obtenerCategorias()`, `crearCategoria()`, `actualizarCategoria(id, ...)`, `eliminarCategoria(id)`.
- `obtenerProductos()`, `crearProducto()`, `actualizarProducto(id, ...)`, `eliminarProducto(id)`.
- Helper `resolverNombreCategoria(categorias, categoryId)` para resolver nombre de categoría por ID.

#### `src/services/movimientosService.js` — Creado / Modificado
Registra movimientos de stock como logs de auditoría. Mapeo de tipos:
- `entrada` → action `CREATE`
- `salida` → action `DELETE`
- `ajuste` → action `UPDATE` *(tipo añadido en sesión de correcciones)*

**Modificaciones aplicadas:**
- Añadido `ajuste: 'UPDATE'` al `ACTION_MAP`.
- Añadido objeto `TIPO_LABEL` con etiquetas en español (`Entrada`, `Salida`, `Ajuste`).
- Actualizado `details` para usar `TIPO_LABEL[tipo]` en lugar de ternario hardcodeado.
- `obtenerHistorialMovimientos()` filtra logs con acciones `CREATE`, `DELETE` y `UPDATE`.

#### `src/services/auditoriaService.js` — Creado
Servicio de auditoría:
- `obtenerLogsAuditoria()`: obtiene logs y usuarios en paralelo; enriquece cada log con `user_name`.
- `registrarHallazgo({ action, affected_table, record_id, details })`: registra evento manual identificando al usuario de sesión.
- `agruparPorUsuario(logs)`: agrupa logs por nombre de usuario para las vistas de resumen.

#### `src/services/administracionService.js` — Creado
Servicio de gestión de usuarios:
- `obtenerUsuarios()`, `obtenerUsuarioPorId(id)`, `crearUsuario(...)`, `actualizarUsuario(id, ...)`, `eliminarUsuario(id)`.
- Helper `filtrarUsuarios(usuarios, { search, roleFilter })`: filtra por nombre, username, documento y rol.

---

### Validaciones (`src/utils/`)

#### `src/utils/validaciones.js` — Creado / Modificado
Schemas Zod con mensajes de error en español:
- `loginSchema`: username (1–50 caracteres) + password (1–128 caracteres).
- `crearUsuarioSchema`: document (regex dígitos 5–20), name (letras/espacios), username (alfanumérico), password con reglas de complejidad (mayúscula, minúscula, número, carácter especial), roles array.
- `categoriaSchema`: name (2–100), description (opcional, máx. 500).
- `productoSchema`: name (2–150), category_id (entero positivo), quantity (≥ 0, default 0), description (opcional, máx. 1000).
- `movimientoSchema`: tipo enum `['entrada', 'salida', 'ajuste']` *(modificado: añadido `'ajuste'`)*, producto, cantidad (entero positivo), motivo (3–500 caracteres).
- `hallazgoSchema`: action (validado contra lista VALID_ACTIONS), affected_table (snake_case), record_id (entero positivo), details (opcional).
- Helper `validarConSchema(schema, data)`: wrapper sobre `schema.safeParse()` que retorna `{ success, data, errors }`.

---

### Componentes (`src/components/`)

#### `src/components/icons.js` — Creado
Centraliza la inicialización de iconos Lucide:
- `refreshIcons(scope?)`: reemplaza todos los `<i data-lucide="...">` del DOM (o de un scope específico) con sus SVG correspondientes. Captura errores sin romper la app.

---

### Módulos (`src/modules/`)

#### `src/modules/home/auth.js` — Creado
Vista y controlador del login:
- `loginView`: HTML de la tarjeta de login con logo, campos de usuario/contraseña y botón.
- `loginController`: valida con `loginSchema`, llama a `loginWithCredentials`, redirige a `#/home`. Restaura el botón en caso de error y retorna función cleanup.

#### `src/modules/home/home.js` — Creado
Vista shell de la aplicación (`homeView`):
- Genera el layout completo: header sticky con logo + nombre de usuario + botón logout, sidebar con links de navegación y estado activo resaltado, área `<main id="seccion-contenido">` y footer.
- Usa `.header-user-name` con icono `circle-user-round` para mostrar el nombre del usuario alineado. *(Clase añadida en correcciones)*
- Footer con créditos SENA Ficha 3233198.

#### `src/modules/home/homeControlador.js` — Creado
Controlador del panel de bienvenida:
- Renderiza `renderWelcomeContent()`: badge de bienvenida con nombre y rol del usuario, título "Panel operativo diario", grid de 4 tarjetas de acceso rápido (clickeables, navegan a cada sección), sección misión/visión y testimonios del equipo.
- Gestiona logout con confirmación SweetAlert2.
- Escucha `auth:session-expired` para redirigir automáticamente a login.
- Retorna función cleanup que desregistra todos los listeners.

#### `src/modules/home/shellController.js` — Creado
Helper compartido que configura el logout y la sesión expirada para todos los controladores de sección protegidos. Retorna `{ sectionEl, cleanup }`.

#### `src/modules/home/index.js` — Creado
Barrel: re-exporta `loginView`, `loginController`, `homeView`, `homeController`.

#### `src/modules/inventario/inventarioControlador.js` — Creado / Modificado
Controlador de inventario. Gestiona categorías y productos.

**Creado originalmente con:**
- `buildSectionHTML(canManage)`: formularios de creación de categoría y producto (visibles solo con permiso `isSupervisor()`); listas de categorías y productos.
- `cargarDatos(canManage)`: carga en paralelo categorías y productos con `Promise.all`.
- Formulario de categoría: valida con `categoriaSchema`, llama a `crearCategoria`.
- Formulario de producto: valida con `productoSchema`, llama a `crearProducto`.
- Delegación de eventos: `delete-cat` y `delete-prod` con confirmación.

**Modificaciones aplicadas:**
- Añadidos handlers `edit-cat` y `edit-prod` en `onSectionClick` mediante delegación de eventos.
- `edit-cat`: abre modal SweetAlert2 con `html` pre-rellenado (nombre y descripción), valida con `categoriaSchema` y llama a `actualizarCategoria(id, data)`.
- `edit-prod`: abre modal SweetAlert2 con todos los campos del producto. El `<select>` de categorías usa estilos inline explícitos que replican `swal2-input` (sin depender de la clase CSS de SweetAlert2 que no aplica a `<select>`). Valida con `productoSchema` y llama a `actualizarProducto(id, data)`.
- Añadidos imports: `Swal`, `actualizarCategoria`, `actualizarProducto`, `escapeHtml`.

#### `src/modules/inventario/index.js` — Creado
Barrel: re-exporta `inventarioController`.

#### `src/modules/movimientos/movimientosControlador.js` — Creado / Modificado
Controlador de movimientos de stock.

**Creado originalmente con:**
- `buildSectionHTML(defaultTipo)`: formulario con select de tipo, producto, cantidad y motivo; historial de movimientos.
- Soporte a tipo pre-seleccionado desde la ruta (`#/movimientos/entrada`, `/salida`).
- `refreshHistorial()`: recarga el historial tras cada registro.
- Formulario: valida con `movimientoSchema`, llama a `registrarMovimiento`.

**Modificaciones aplicadas:**
- Añadida variable `selectedAjuste` para pre-selección del tipo.
- Añadida opción `<option value="ajuste">Ajuste de stock</option>` al select de tipo.
- Actualizado texto descriptivo del módulo para mencionar ajustes.

#### `src/modules/movimientos/index.js` — Creado
Barrel: re-exporta `movimientosController`.

#### `src/modules/auditoria/auditoriaControlador.js` — Creado
Controlador de auditoría.
- `buildSectionHTML(canManage)`: grid de actividad por usuario (resumen + detalle), historial completo y formulario de hallazgo manual (solo supervisores/admin).
- `cargarAuditoria()`: carga logs enriquecidos con nombre de usuario, agrupa por usuario y renderiza las tres secciones.
- Formulario de hallazgo: valida con `hallazgoSchema`, llama a `registrarHallazgo`.

#### `src/modules/auditoria/index.js` — Creado
Barrel: re-exporta `auditoriaController`.

#### `src/modules/administracion/administracionControlador.js` — Creado / Modificado
Controlador de administración de usuarios (solo `admin`).

**Creado originalmente con:**
- `buildSectionHTML(canManage)`: formulario de nuevo usuario (documento, nombre, username, contraseña, rol) y lista de usuarios con buscador y filtro por rol.
- Formulario de creación: valida con `crearUsuarioSchema`, llama a `crearUsuario`.
- Delegación de eventos: `delete-user` con confirmación.
- Búsqueda en tiempo real y filtro por rol.

**Modificaciones aplicadas:**
- Añadido campo "Confirmar contraseña" con `.password-wrapper` y botón `.btn-password-toggle` (icono `eye`/`eye-off`).
- Añadida validación de coincidencia de contraseñas antes del schema Zod.
- Añadida lógica de toggle de visibilidad para ambos campos de contraseña en `onSectionClick`.
- Corregido el toolbar de búsqueda y filtro: eliminadas clases `form-group input` / `form-group select` que no corresponden a campos de formulario (son contenedores flex), dejando los elementos `<input>` y `<select>` desnudos para que los estile `.users-toolbar input/select`.

#### `src/modules/administracion/index.js` — Creado
Barrel: re-exporta `administracionController`.

---

### UI (`src/ui/`)

#### `src/ui/uiHelpers.js` — Creado
Utilidades compartidas de UI:
- `escapeHtml(value)`: escapa `& < > " '` para prevenir XSS.
- `formatDate(date)`: formatea ISO a `DD/MM/YYYY HH:mm` en locale `es-CO`.
- `emptyState(message, icon)`: genera HTML del estado vacío con icono Lucide.
- `errorState(message)`: genera HTML del estado de error con icono `wifi-off`.

#### `src/ui/notificationsUi.js` — Creado
Sistema de notificaciones con SweetAlert2:
- `showSuccess(message)` / `showError(message)` / `showInfo(message)`: toasts en `top-end` con temporizador y pausa al hover.
- `showValidationErrors(errors[])`: diálogo con lista `<ul>` de errores de validación.
- `showConfirm({ title, text, confirmButtonText, cancelButtonText, icon })`: diálogo de confirmación con botones invertidos y foco en cancelar. Retorna `boolean`.

#### `src/ui/inventarioUi.js` — Creado
Funciones puras de renderizado para inventario:
- `renderCategorias(categorias, canManage)`: tabla responsive con columnas ID, Nombre, Descripción y, si `canManage`, botones `edit-cat` y `delete-cat`.
- `renderProductos(productos, categorias, canManage)`: tabla con columnas ID, Producto, Categoría, Stock (badge verde/amarillo con alerta `⚠️` si stock ≤ 5), Descripción y, si `canManage`, botones `edit-prod` y `delete-prod`.
- `renderCategoryOptions(categorias, selectedId)`: genera opciones `<option>` para el select de categorías en formularios, marcando la seleccionada.

#### `src/ui/movimientosUi.js` — Creado
Renderizado del historial de movimientos:
- `renderHistorialMovimientos(logs)`: tabla con tipo de movimiento como badge de color (verde=Entrada, rojo=Salida, amarillo=Ajuste), tabla afectada en `<code>` y detalles. Máximo 100 registros.

#### `src/ui/auditoriaUi.js` — Creado
Renderizado de auditoría con tres funciones:
- `renderHistorialCompleto(logs)`: tabla completa con ID, usuario, acción (badge de color), tabla, registro y detalles.
- `renderResumenUsuarios(porUsuario)`: tabla de conteo de acciones por usuario.
- `renderDetallePorUsuario(porUsuario)`: tarjetas `audit-user-card` por usuario, cada una con su tabla de acciones.

#### `src/ui/administracionUi.js` — Creado
Renderizado de usuarios:
- `renderUsuarios(usuarios, canManage)`: tabla con ID, nombre, username, documento, roles (badges diferenciados: admin=azul, supervisor=dorado, user=gris) y, si `canManage`, botones `edit-user` y `delete-user`.

---

### Estilos (`assets/css/`)

#### `assets/css/styles.css` — Creado
Archivo de entrada CSS: importa todos los parciales en orden (`base.css`, `header.css`, `sidebar.css`, `content.css`, `footer.css`).

#### `assets/css/base.css` — Creado
Variables de diseño y estilos base:
- **Paleta**: azul marino profundo (`#1e3a5f`) + tonos madera/ámbar (`#c49a2e`), fondos crema cálida.
- Variables CSS para colores, tipografía (Inter), bordes redondeados, sombras y transiciones.
- Soporte a **modo oscuro** via `[data-theme="dark"]` con paleta adaptada.
- Reset `box-sizing: border-box` global.
- `body.app`: fondo crema con degradados radiales decorativos, fuente Inter, antialiasing.
- `.layout.layout--main`: grid de dos columnas (240 px sidebar + 1fr contenido), máximo 1220 px.
- Scrollbar minimalista webkit.
- Responsive: una sola columna en pantallas ≤ 860 px.

#### `assets/css/header.css` — Creado / Modificado
Estilos del encabezado corporativo:
- `.site-header`: sticky, gradiente azul marino, borde dorado inferior decorativo.
- `.site-header__brand`, `.site-header__logo`, `.site-header__title`, `.site-header__subtitle`.
- `.site-header__actions`, `.site-header__menu`, `.site-header__menu-link` con hover y estado activo.
- `.logout-btn`: botón ghost con hover rojo.

**Modificaciones aplicadas:**
- Añadida clase `.header-user-name`: `inline-flex`, `align-items: center`, `gap: 0.4rem`, color blanco semitransparente, `white-space: nowrap`. SVG hijo de 18 × 18 px. Asegura alineación perfecta entre el icono de perfil y el nombre del usuario.

#### `assets/css/sidebar.css` — Creado
Menú lateral:
- `.sidebar`: sticky, fondo `--color-surface`, borde decorativo superior con degradado azul→dorado.
- `.sidebar__link`: flex con icono, hover con `translateX(2px)` y cambio de color a azul.
- `.sidebar__link--active`: fondo azul semitransparente, peso 600.
- `.sidebar__divider`: separador horizontal.
- Responsive: posición estática y links en fila horizontal en móvil.

#### `assets/css/content.css` — Creado / Modificado
Estilos del panel de contenido principal. Abarca:
- `.main-content`: padding, fondo, bordes y flex vertical.
- `.section-header`, `.panel-card`, `.panel-desc`.
- `.form-grid`, `.form-group`, `.form-group--full`, `.form-group label/input/select/textarea` con focus ring azul.
- `.form-optional`, `.form-hint`.
- `.btn-primary`, `.btn-primary:hover/:active/:disabled`, `.btn-primary.btn--full`, `.btn-secondary`.
- `.table-wrapper`, `.table-pro` con cabeceras azul marino, filas alternas y `code` con fondo oscuro.
- `.role-badge` (admin, supervisor, user), `.action-badge` (success, warning, danger, info, muted), `.stock-badge` y `.stock-badge--low`.
- `.empty-state`, `.error-state`, `.access-denied`.
- Panel de bienvenida: `.welcome-header`, `.welcome-user-badge`, `.welcome-user-icon`, `.welcome-greeting`, `.welcome-role`, `.welcome-title`, `.welcome-subtitle`.
- Stats: `.stats-grid`, `.stat-card`, `.stat-icon`, `.stat-label`, `.stat-desc`.
- Info grid: `.welcome-info-grid`, `.info-card` y sub-elementos.
- Testimonios: `.testimonials-section`, `.testimonials-grid`, `.testimonial-card`.
- Login: `.login-wrapper`, `.login-card`, `.login-card__brand`, `.login-card__logo`, `.login-card__title`, `.login-card__subtitle`, `.field-error`.
- SweetAlert2: `.swal-error-list`.
- Auditoría: `.auditoria-grid`, `.audit-user-card` y sub-elementos.
- Responsive (≤ 860 px y ≤ 480 px).

**Modificaciones aplicadas:**
- Añadido `.password-wrapper`: `position: relative; display: flex; align-items: center` para envolver el input y el toggle.
- Añadido `.password-wrapper input`: `flex: 1; padding-right: 2.75rem !important` para no quedar tapado por el botón.
- Añadido `.btn-password-toggle`: posicionado absoluto a la derecha del input, sin borde ni fondo, cursor pointer, icono SVG de 16 × 16 px.
- Añadido `.users-toolbar`: `display: flex; gap: 0.75rem; flex-wrap: wrap` con estilos completos para sus `input` y `select` hijos (mismo estilo que `.form-group input/select` con focus ring y flecha SVG para el select).

#### `assets/css/footer.css` — Creado
Pie de página:
- `.site-footer`: gradiente azul marino, borde dorado superior, centrado flex.
- `.site-footer__text`: texto blanco al 85 % de opacidad.
- `.site-footer__text--muted`: opacidad 50 %.
- Responsive: columna centrada en móvil.

---

### Recursos estáticos

#### `public/assets/img/Gemini_Generated_Image_717eyy717eyy717e.png` — Añadido
Imagen de logo del establecimiento. Usada como:
- Favicon y apple-touch-icon en `index.html`.
- Logo en la tarjeta de login (`auth.js`).
- Logo en el header del shell (`home.js`).

---

## [1.0.1] — Correcciones y mejoras de sesión

### Backend

> Ver `Backend/changelog.md` para los cambios en la base de datos (hashes bcrypt y nombres de usuarios).

### Frontend

#### `assets/css/header.css` — Modificado
- Añadida clase `.header-user-name` (ver sección 1.0.0 anterior).

#### `assets/css/content.css` — Modificado
- Añadidos `.password-wrapper`, `.btn-password-toggle`, `.users-toolbar` y estilos de sus elementos hijo.

#### `src/modules/home/home.js` — Modificado
- El encabezado ahora muestra el nombre del usuario envuelto en `.header-user-name` con icono `circle-user-round`, garantizando alineación vertical con el ícono de perfil.

#### `src/modules/inventario/inventarioControlador.js` — Modificado
- Añadidos handlers `edit-cat` (modal SweetAlert2 + `actualizarCategoria`) y `edit-prod` (modal con select de categorías con estilos inline + `actualizarProducto`).

#### `src/modules/movimientos/movimientosControlador.js` — Modificado
- Añadida opción "Ajuste de stock" al select de tipo de movimiento.
- Añadida pre-selección del tipo `ajuste` desde la ruta.

#### `src/services/movimientosService.js` — Modificado
- Añadido `ajuste: 'UPDATE'` al `ACTION_MAP`.
- Añadido `TIPO_LABEL` y actualizado el campo `details` del log.

#### `src/utils/validaciones.js` — Modificado
- Extendido `movimientoSchema` para incluir `'ajuste'` en el enum de tipos.

#### `src/modules/administracion/administracionControlador.js` — Modificado
- Añadido campo de confirmación de contraseña con toggle de visibilidad.
- Añadida validación de coincidencia de contraseñas.
- Corregido el toolbar: eliminadas clases CSS incorrectas en `#search-users` y `#filter-role`.
