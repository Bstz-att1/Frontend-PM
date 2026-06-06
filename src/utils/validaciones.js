/**
 * Esquemas de validación Zod — El Rincón Gastronómico
 * Todos los mensajes de error están en español.
 */

import { z } from 'zod';

// ── Login ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  username: z
    .string({ required_error: 'El nombre de usuario es obligatorio.' })
    .trim()
    .min(1, 'El nombre de usuario no puede estar vacío.')
    .max(50, 'El nombre de usuario no puede superar 50 caracteres.'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria.' })
    .min(1, 'La contraseña no puede estar vacía.')
    .max(128, 'La contraseña no puede superar 128 caracteres.'),
});

// ── Usuarios ──────────────────────────────────────────────────────────────────

export const crearUsuarioSchema = z.object({
  document: z
    .string({ required_error: 'El documento es obligatorio.' })
    .trim()
    .regex(/^\d{5,20}$/, 'El documento debe contener entre 5 y 20 dígitos numéricos.'),
  name: z
    .string({ required_error: 'El nombre completo es obligatorio.' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(100, 'El nombre no puede superar 100 caracteres.')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/, 'El nombre solo puede contener letras y espacios.'),
  username: z
    .string({ required_error: 'El nombre de usuario es obligatorio.' })
    .trim()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres.')
    .max(50, 'El nombre de usuario no puede superar 50 caracteres.')
    .regex(/^[a-zA-Z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guion bajo.'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria.' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .max(72, 'La contraseña no puede superar 72 caracteres.')
    .superRefine((val, ctx) => {
      if (!/[A-Z]/.test(val)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La contraseña debe incluir al menos una letra mayúscula.' });
      }
      if (!/[a-z]/.test(val)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La contraseña debe incluir al menos una letra minúscula.' });
      }
      if (!/\d/.test(val)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La contraseña debe incluir al menos un número.' });
      }
      if (!/[^A-Za-z0-9]/.test(val)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La contraseña debe incluir al menos un carácter especial.' });
      }
    }),
  roles: z
    .array(z.string(), { required_error: 'Debe asignar al menos un rol.' })
    .min(1, 'Debe asignar al menos un rol.'),
});

// ── Categorías ────────────────────────────────────────────────────────────────

export const categoriaSchema = z.object({
  name: z
    .string({ required_error: 'El nombre de la categoría es obligatorio.' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(100, 'El nombre no puede superar 100 caracteres.'),
  description: z
    .string()
    .trim()
    .max(500, 'La descripción no puede superar 500 caracteres.')
    .optional()
    .nullable(),
});

// ── Productos ─────────────────────────────────────────────────────────────────

export const productoSchema = z.object({
  name: z
    .string({ required_error: 'El nombre del producto es obligatorio.' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(150, 'El nombre no puede superar 150 caracteres.'),
  category_id: z
    .number({ required_error: 'La categoría es obligatoria.' })
    .int('La categoría debe ser un número entero.')
    .positive('Selecciona una categoría válida.'),
  quantity: z
    .number()
    .int('La cantidad debe ser un número entero.')
    .min(0, 'La cantidad no puede ser negativa.')
    .default(0),
  description: z
    .string()
    .trim()
    .max(1000, 'La descripción no puede superar 1000 caracteres.')
    .optional()
    .nullable(),
});

// ── Movimientos ───────────────────────────────────────────────────────────────

export const movimientoSchema = z.object({
  tipo: z.enum(['entrada', 'salida', 'ajuste'], {
    required_error: 'Debes seleccionar el tipo de movimiento.',
    invalid_type_error: "El tipo debe ser 'entrada', 'salida' o 'ajuste'.",
  }),
  producto: z
    .string({ required_error: 'El nombre del producto es obligatorio.' })
    .trim()
    .min(2, 'El nombre del producto debe tener al menos 2 caracteres.')
    .max(150, 'El nombre del producto no puede superar 150 caracteres.'),
  cantidad: z
    .number({ required_error: 'La cantidad es obligatoria.' })
    .int('La cantidad debe ser un número entero.')
    .positive('La cantidad debe ser mayor que cero.'),
  motivo: z
    .string({ required_error: 'El motivo del movimiento es obligatorio.' })
    .trim()
    .min(3, 'El motivo debe tener al menos 3 caracteres.')
    .max(500, 'El motivo no puede superar 500 caracteres.'),
});

// ── Auditoría ─────────────────────────────────────────────────────────────────

const VALID_ACTIONS = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'READ', 'RESTORE', 'ASSIGN', 'REVOKE'];

export const hallazgoSchema = z.object({
  action: z
    .string({ required_error: 'La acción es obligatoria.' })
    .trim()
    .toUpperCase()
    .refine(
      (v) => VALID_ACTIONS.includes(v),
      (v) => ({ message: `"${v}" no es una acción válida. Permitidas: ${VALID_ACTIONS.join(', ')}.` })
    ),
  affected_table: z
    .string({ required_error: 'La tabla afectada es obligatoria.' })
    .trim()
    .toLowerCase()
    .min(1, 'La tabla afectada no puede estar vacía.')
    .max(100, 'La tabla afectada no puede superar 100 caracteres.')
    .regex(/^[a-z][a-z0-9_]*$/, 'La tabla debe estar en snake_case (ej: products, audit_logs).'),
  record_id: z
    .number({ required_error: 'El ID del registro es obligatorio.' })
    .int('El ID debe ser un número entero.')
    .positive('El ID del registro debe ser mayor que cero.'),
  details: z
    .string()
    .trim()
    .max(1000, 'Los detalles no pueden superar 1000 caracteres.')
    .optional(),
});

// ── Helper genérico de validación ─────────────────────────────────────────────

/**
 * Valida datos con un schema Zod.
 * @param {z.ZodSchema} schema
 * @param {unknown} data
 * @returns {{ success: boolean, data?: any, errors?: string[] }}
 */
export function validarConSchema(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors = result.error.issues.map((i) => i.message);
  return { success: false, errors };
}
