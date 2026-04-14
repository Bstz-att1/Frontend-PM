const AUTH_TOKEN_KEY = "rg_auth_token";
const AUTH_USER_KEY = "rg_auth_user";
const API_BASE_URL = "http://localhost:3000";

export function setAuthSession({ token, user }) {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function getSessionUser() {
  const raw = sessionStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    sessionStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken() && getSessionUser());
}

export function logout() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
}

export function hasRole(role) {
  const user = getSessionUser();
  return user?.rol === role;
}

export function canManageUsers() {
  return hasRole("admin");
}

export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.success === false) {
    const message = payload?.message || "No fue posible iniciar sesión";
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  const data = payload?.data || {};
  setAuthSession({
    token: data.token,
    user: data.user,
  });

  return data.user;
}
