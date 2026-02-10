const DEFAULT_API = "http://127.0.0.1:5231";
const TOKEN_KEY = "pt_access_token";

function getApiUrl() {
  const v = (import.meta.env.VITE_API_URL as string | undefined) ?? DEFAULT_API;
  return v.replace(/\/+$/, "");
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

type ApiError = Error & { status?: number };

async function apiRequest<T>(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  init?: RequestInit
): Promise<T> {
  const url = `${getApiUrl()}${path.startsWith("/") ? "" : "/"}${path}`;

  const token = getToken();

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(body ? { "Content-Type": "application/json" } : {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    ...init,
    headers: { ...headers, ...(init?.headers as any) },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    const err: ApiError = new Error(`HTTP ${res.status}${txt ? `: ${txt}` : ""}`);
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}

export function apiGet<T>(path: string, init?: RequestInit) {
  return apiRequest<T>("GET", path, undefined, init);
}

export function apiPost<T>(path: string, body?: unknown, init?: RequestInit) {
  return apiRequest<T>("POST", path, body, init);
}

export type AuthTokenResponse = {
  accessToken: string;
  expiresUtc: string;
  roles: string[];
};

export type MeResponse = {
  userId: string;
  email: string;
  roles: string[];
};

export async function apiLogin(email: string, password: string) {
  const res = await apiPost<AuthTokenResponse>("/api/Auth/login", { email, password });
  setToken(res.accessToken);
  return res;
}

export async function apiRegister(email: string, password: string) {
  return apiPost<{ ok: boolean } | any>("/api/Auth/register", { email, password });
}

export async function apiMe() {
  return apiGet<MeResponse>("/api/Me");
}