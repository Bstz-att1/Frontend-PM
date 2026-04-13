# DOCUMENTACIÓN DEL PROYECTO
## Sistema de Gestión de Inventario - "El Rincón Gastronómico"

---

## 0. ESTRUCTURA DE RAMAS (GIT FLOW)

### Rama Principal – main
- Contiene el código estable y validado.
- Solo recibe merges desde la rama de verificación (release).
- Nunca se trabaja directamente en main.
- Representa la versión oficial del proyecto.

### Rama de Verificación – release
- Actúa como puente entre dev y main.
- Aquí se realizan las últimas pruebas de integración y verificación de errores.
- Solo se mergea a main cuando se confirma que todo funciona correctamente.
- Ejemplo de uso:
  - release/v1.0.0 → versión candidata a producción.

### Rama de Desarrollo – dev
- Es la rama donde se integran todas las funcionalidades en progreso.
- Recibe merges de las ramas de módulos o cambios específicos.
- Puede contener código en evolución, pero debe mantenerse funcional.

### Ramas de Funcionalidad – feature/*
- Cada módulo o cambio importante se desarrolla en su propia rama.
- Ejemplos:
  - feature/modulo-usuarios
  - feature/modulo-categorias
  - feature/modulo-productos
  - feature/filtros-producto
- Flujo:
  - Se crea la rama desde dev.
  - Se realizan commits documentados.
  - Se mergea a dev mediante Pull Request.

### Flujo de Integración
- Desarrollo: se trabaja en ramas feature/*.
- Integración inicial: se mergea cada feature/* en dev.
- Verificación final: se mergea dev en release para pruebas completas.
- Producción: se mergea release en main cuando todo está validado.

```
main  <---  release  <---  dev  <---  feature/modulo-usuarios
                               <---  feature/modulo-productos
                               <---  feature/modulo-categorias
```

---

## 1. REQUERIMIENTOS FUNCIONALES

### Módulo de Usuarios
- [ ] Crear usuarios (nombre, username, password, rol)
- [ ] Iniciar sesión (autenticación)
- [ ] Cerrar sesión
- [ ] Listar usuarios

### Módulo de Categorías
- [ ] Crear categorías (nombre, descripción)
- [ ] Listar categorías

### Módulo de Productos
- [ ] Crear productos (nombre, categoría, cantidad, unidad, precio)
- [ ] Asignar automáticamente el usuario creador
- [ ] Listar inventario completo
- [ ] Filtrar productos por categoría
- [ ] Buscar productos por nombre
- [ ] Auditoría: listar productos creados por cada usuario

---

## 2. ARQUITECTURA TÉCNICA

### Backend (Puerto 3000)
```
backend/
├── server.js          # Servidor Express
├── routes/
│   ├── users.js       # Endpoints de usuarios
│   ├── categories.js  # Endpoints de categorías
│   └── products.js    # Endpoints de productos
└── data/
    └── store.js       # Base de datos en memoria
```

### Frontend (Puerto 5500)
```
frontend/
├── index.html         # Esqueleto semántico
├── css/
│   ├── variables.css  # Variables CSS (:root)
│   ├── base.css       # Estilos base
│   ├── layout.css     # Grid main layout
│   └── components.css # Componentes BEM
├── js/
│   ├── api.js         # Cliente API
│   ├── auth.js        # Autenticación
│   ├── router.js      # Navegación
│   ├── users.js       # UI usuarios
│   ├── categories.js  # UI categorías
│   ├── products.js    # UI productos
│   ├── app.js         # Inicialización
│   └── index.js       # Archivo barril - exporta e importa todos los módulos
└── assets/
    └── images/
```

> **Nota Importante:** Se debe utilizar un archivo barril (`index.js`) como punto central para exportar e importar todos los módulos del frontend. Esto permite:
> - Importar todos los módulos desde un único punto
> - Facilitar la navegación y mantenimiento del código
> - Evitar rutas relativas extensas (ej: `../components/`)
> - Mantener un orden consistente en las importaciones

---

## 3. PLAN DE DESARROLLO (PASO A PASO)

### ETAPA 1: Backend - Estructura Base
- [ ] 1.1 Inicializar proyecto: `npm init -y`
- [ ] 1.2 Instalar dependencias: `npm install express cors body-parser`
- [ ] 1.3 Crear server.js con estructura básica Express
- [ ] 1.4 Crear store.js con arrays para users, categories, products
- [ ] 1.5 Probar servidor: `node server.js`

### ETAPA 2: Backend - Endpoints API
- [ ] 2.1 Implementar rutas de Usuarios (GET, POST, POST /login)
- [ ] 2.2 Implementar rutas de Categorías (GET, POST)
- [ ] 2.3 Implementar rutas de Productos (GET, POST, GET /user/:id)
- [ ] 2.4 Agregar usuario administrador inicial por defecto

### ETAPA 3: Frontend - Estructura HTML
- [ ] 3.1 Crear carpetas css/ y js/
- [ ] 3.2 Crear index.html con estructura semántica:
  - `<header>` para navegación
  - `<aside>` para menú lateral
  - `<main>` para contenido dinámico
- [ ] 3.3 Vincular archivos CSS y JS

### ETAPA 4: Frontend - Estilos CSS
- [ ] 4.1 Crear variables.css con :root (colores, fuentes)
- [ ] 4.2 Crear base.css (reset, tipografía)
- [ ] 4.3 Crear layout.css (CSS Grid: sidebar + main)
- [ ] 4.4 Crear components.css (BEM: botones, formularios, tablas, tarjetas)

### ETAPA 5: Frontend - JavaScript Core
- [ ] 5.1 Crear api.js (fetch wrapper con headers)
- [ ] 5.2 Crear auth.js (guardar usuario en localStorage, verificar sesión)
- [ ] 5.3 Crear router.js (mostrar/ocultar secciones)

### ETAPA 6: Frontend - Módulos UI
- [ ] 6.1 Implementar UI de Login
- [ ] 6.2 Implementar UI de Usuarios (crear, listar)
- [ ] 6.3 Implementar UI de Categorías (crear, listar)
- [ ] 6.4 Implementar UI de Productos (crear, listar, filtros, búsqueda)
- [ ] 6.5 Implementar auditoría por usuario

### ETAPA 7: Integración y Pruebas
- [ ] 7.1 Conectar todos los módulos con app.js
- [ ] 7.2 Probar flujo completo: login → crear categoría → crear producto
- [ ] 7.3 Probar filtros y búsqueda
- [ ] 7.4 Probar auditoría

---

## 4. ENDPOINTS API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/users/login | Autenticar usuario |
| GET | /api/users | Listar usuarios |
| POST | /api/users | Crear usuario |
| GET | /api/categories | Listar categorías |
| POST | /api/categories | Crear categoría |
| GET | /api/products | Listar productos (con filtros) |
| POST | /api/products | Crear producto |
| GET | /api/products/user/:userId | Productos por usuario (auditoría) |

---

## 5. MODELO DE DATOS

### Usuario
```json
{
  "id": 1,
  "name": "Admin",
  "username": "admin",
  "password": "admin123",
  "role": "administrator"
}
```

### Categoría
```json
{
  "id": 1,
  "name": "Carnes",
  "description": "Carnes y embutidos"
}
```

### Producto
```json
{
  "id": 1,
  "name": "Bistec",
  "categoryId": 1,
  "quantity": 10,
  "unit": "kg",
  "price": 15000,
  "createdBy": 1,
  "createdAt": "2026-04-13T10:00:00Z"
}
```

---

## 6. COMANDOS PARA INICIAR

```bash
# Backend
cd backend
npm init -y
npm install express cors body-parser
node server.js

# Frontend (usando Live Server o Python)
cd frontend
# VSCode: Live Server
# Python: python -m http.server 5500
```

---

## 7. NOTAS IMPORTANTES

- El backend usa base de datos en memoria (se borra al reiniciar)
- El frontend NO usa frameworks (Vanilla JS puro)
- Usar metodología BEM para clases CSS
- CSS Grid para layout principal, Flexbox para componentes
- El index.html debe estar vacío (contenido dinámico)
- Cada acción de producto guarda el ID del usuario creador

