const API_BASE_URL = "http://localhost:3000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || (payload && payload.success === false)) {
    const message =
      payload?.message ||
      `Error en la petición ${options.method || "GET"} ${endpoint}`;
    const errors = payload?.errors || [];
    const error = new Error(message);
    error.status = response.status;
    error.errors = errors;
    error.payload = payload;
    throw error;
  }

  return payload;
}

// =========================
// Usuarios
// =========================
export async function getAllUsers() {
  const result = await request("/usuarios");
  return result?.data ?? [];
}

export async function getUserById(id) {
  const result = await request(`/usuarios/${id}`);
  return result?.data ?? null;
}

export async function createUser(userData) {
  const result = await request("/usuarios", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  return result?.data ?? null;
}

// =========================
// Categorías
// =========================
export async function getAllCategories() {
  const result = await request("/categorias");
  return result?.data ?? [];
}

export async function getCategoryById(id) {
  const result = await request(`/categorias/${id}`);
  return result?.data ?? null;
}

export async function createCategory(categoryData) {
  const result = await request("/categorias", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
  return result?.data ?? null;
}

// =========================
// Productos
// =========================
export async function getAllProducts() {
  const result = await request("/productos");
  return result?.data ?? [];
}

export async function getProductById(id) {
  const result = await request(`/productos/${id}`);
  return result?.data ?? null;
}

export async function createProduct(productData) {
  const result = await request("/productos", {
    method: "POST",
    body: JSON.stringify(productData),
  });
  return result?.data ?? null;
}

// =========================
// Auditoría
// =========================
export async function getAllAuditLogs() {
  const result = await request("/auditoria");
  return result?.data ?? [];
}

export async function getAuditLogById(id) {
  const result = await request(`/auditoria/${id}`);
  return result?.data ?? null;
}

export async function createAuditLog(auditData) {
  const result = await request("/auditoria", {
    method: "POST",
    body: JSON.stringify(auditData),
  });
  return result?.data ?? null;
}
