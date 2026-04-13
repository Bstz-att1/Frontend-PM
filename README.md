# El Rincón Gastronómico - Frontend

Aplicación frontend para gestión visual de módulos del sistema (usuarios, inventario, auditoría, administración y movimientos), desarrollada con **HTML + CSS + JavaScript (Vanilla)**.

---

## Estado actual del repositorio

Este repositorio contiene actualmente **solo la capa frontend**.

No incluye backend/API en esta estructura.

---

## Estructura real del proyecto

```txt
Frontend/
├── changelog.md
├── index.html
├── README.md
└── assets/
    ├── css/
    │   ├── base.css
    │   ├── content.css
    │   ├── footer.css
    │   ├── header.css
    │   ├── sidebar.css
    │   └── styles.css
    ├── img/
    │   └── Gemini_Generated_Image_717eyy717eyy717e.png
    └── js/
        ├── administracion.js
        ├── auditoria.js
        ├── index.js
        ├── inventario.js
        ├── main.js
        ├── movimientos.js
        ├── sidebar.js
        └── usuarios.js
```

---

## Descripción de archivos principales

### Raíz

- `index.html`  
  Punto de entrada de la interfaz.

- `changelog.md`  
  Historial de cambios del proyecto.

- `README.md`  
  Documentación del estado actual del frontend.

---

### CSS (`assets/css`)

- `base.css`  
  Estilos base globales (reset/base tipográfica/comportamiento común).

- `header.css`  
  Estilos del encabezado.

- `sidebar.css`  
  Estilos de barra lateral y navegación.

- `content.css`  
  Estilos del área principal de contenido.

- `footer.css`  
  Estilos del pie de página.

- `styles.css`  
  Hoja agregadora o complementaria de estilos generales del sistema.

---

### JavaScript (`assets/js`)

- `index.js`  
  Punto de inicialización/entrada JS del frontend.

- `main.js`  
  Coordinación general de lógica principal y flujo base de la interfaz.

- `sidebar.js`  
  Comportamiento de navegación lateral y cambios de sección.

- `usuarios.js`  
  Funcionalidad de módulo de usuarios.

- `inventario.js`  
  Funcionalidad de módulo de inventario.

- `movimientos.js`  
  Funcionalidad de módulo de movimientos.

- `auditoria.js`  
  Funcionalidad de módulo de auditoría.

- `administracion.js`  
  Funcionalidad de módulo administrativo.

---

### Recursos (`assets/img`)

- `Gemini_Generated_Image_717eyy717eyy717e.png`  
  Recurso gráfico actual incluido en el proyecto.

---

## Cómo ejecutar el proyecto

### Opción 1: Live Server (recomendado en VSCode)

1. Abrir la carpeta del proyecto en VSCode.
2. Abrir `index.html`.
3. Ejecutar **Open with Live Server**.

---

### Opción 2: Servidor local con Python

En la carpeta raíz del proyecto:

```bash
python -m http.server 5500
```

Abrir en navegador:

```txt
http://localhost:5500
```

---

## Stack actual

- HTML5
- CSS3 (estilos modulares por secciones)
- JavaScript Vanilla (sin framework frontend)

---

## Alcance actual

- Interfaz frontend modular por secciones.
- Organización de estilos por componentes visuales principales.
- Organización de scripts por módulos funcionales de negocio.

---

## Notas de mantenimiento

- Mantener la estructura de carpetas `assets/css`, `assets/js`, `assets/img`.
- Mantener nombres de archivos coherentes con su módulo.
- Documentar nuevos cambios en `changelog.md`.
- Si se agrega backend en el futuro, documentarlo en una sección separada para no mezclar estado real vs planificación.
