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
- Ruta del script corregida a:
  - `assets/js/main.js`

---

### ⚙️ `assets/js/main.js`
Se ajustó la lógica de render para que los mensajes coincidan con el menú actual.

#### Cambios funcionales
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

#### Módulo “Administración”
Muestra contenido inicial para:
- Crear usuarios administrativos
- Actualizar roles y permisos
- Activar/desactivar accesos

---

### 📝 Archivos de registro
- Se crea este archivo `changelog.md` para registrar los cambios realizados.