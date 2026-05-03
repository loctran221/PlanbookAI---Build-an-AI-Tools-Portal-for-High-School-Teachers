// Real authentication — calls Spring Boot /api/auth/login and /api/auth/me
export type UserRole = "teacher" | "admin" | "manager" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// =====================
// Internal helpers
// =====================
const TOKEN_KEY = "planbookai_token";
const USER_KEY  = "planbookai_user";

// Đọc URL từ file .env, mặc định là port 8080
const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8080";

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// =====================
// API calls
// =====================
async function apiPost<T>(path: string, body: unknown, withAuth = true): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (withAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "Yêu cầu thất bại");
  }
  return res.json() as Promise<T>;
}

async function apiGet<T>(path: string): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { method: "GET", headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "Yêu cầu thất bại");
  }
  return res.json() as Promise<T>;
}

async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "Yêu cầu thất bại");
  }
  return res.json() as Promise<T>;
}

async function apiDelete<T>(path: string): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { method: "DELETE", headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "Yêu cầu thất bại");
  }
  return res.json() as Promise<T>;
}

// =====================
// Public auth functions
// =====================

/** Cầu nối để các component khác như GenericManager gọi API */
export const api = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete
};

export async function loginWithCredentials(email: string, password: string): Promise<User> {
  const { token } = await apiPost<{ token: string }>("/api/auth/login", { email, password }, false);
  setToken(token);

  const me = await apiGet<{ id: number; email: string; fullName: string; roles: string[] }>("/api/auth/me");
  const user = mapMeToUser(me);
  saveUser(user);
  return user;
}

export const login = loginWithCredentials;

export async function refreshSessionUser(): Promise<User | null> {
  try {
    const me = await apiGet<{ id: number; email: string; fullName: string; roles: string[] }>("/api/auth/me");
    const user = mapMeToUser(me);
    saveUser(user);
    return user;
  } catch {
    logout();
    return null;
  }
}

export function logout(): void {
  clearToken();
}

export function getCurrentUser(): User | null {
  const str = localStorage.getItem(USER_KEY);
  if (!str) return null;
  try { return JSON.parse(str) as User; }
  catch { return null; }
}

export function saveUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAuthToken(): string | null {
  return getToken();
}

export function hasStoredSession(): boolean {
  return Boolean(getToken());
}

// =====================
// Helper
// =====================
const ROLE_PRIORITY: UserRole[] = ["admin", "manager", "staff", "teacher"];

function mapMeToUser(me: { id: number; email: string; fullName: string; roles: string[] }): User {
  const normalized = new Set(me.roles.map((r) => r.toUpperCase()));
  let primary: UserRole = "teacher";
  for (const candidate of ROLE_PRIORITY) {
    if (normalized.has(candidate.toUpperCase())) {
      primary = candidate;
      break;
    }
  }
  return {
    id: String(me.id),
    name: me.fullName || me.email,
    email: me.email,
    role: primary,
  };
}