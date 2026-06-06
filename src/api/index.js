/**
 * Barrel de exportaciones — Capa API
 * Centraliza todos los accesos a la capa de datos.
 */

// Autenticación
export { authLogin, authLogout, authMe } from './auth.api.js';

// Usuarios
export { userGet, userGetById, userPost, userPut, userDelete } from './users.api.js';

// Categorías
export { categoryGet, categoryGetById, categoryPost, categoryPut, categoryDelete } from './categories.api.js';

// Productos
export { productGet, productGetById, productPost, productPut, productDelete } from './products.api.js';

// Auditoría
export { auditGet, auditPost } from './audit.api.js';
