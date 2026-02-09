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

async function apiRequest<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
  init?: RequestInit
): Promise<T> {
  const url = `${getApiUrl()}${path.startsWith("/") ? "" : "/"}${path}`;

  const token = getToken();

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    ...init,
    headers: { ...headers, ...(init?.headers ?? {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      if (isJson) {
        const data = (await res.json()) as any;
        message = data?.message ? String(data.message) : JSON.stringify(data);
      } else {
        const txt = await res.text();
        if (txt) message = txt;
      }
    } catch {}
    throw new Error(message);
  }

  if (isJson) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

export function apiGet<T>(path: string, init?: RequestInit) {
  return apiRequest<T>("GET", path, undefined, init);
}

export function apiPost<T>(path: string, body?: unknown, init?: RequestInit) {
  return apiRequest<T>("POST", path, body, init);
}


type LoginResponse = {
  accessToken?: string;
  token?: string;
  expiresUtc?: string;
  roles?: string[];
};

export async function apiLogin(email: string, password: string) {
  const data = await apiPost<LoginResponse>("/api/Auth/login", { email, password });

  const token = data.accessToken ?? data.token;
  if (!token) {
    throw new Error("Backend nie zwrócił tokena (brak accessToken/token w odpowiedzi).");
  }

  setToken(token);
  return data;
}

export async function apiRegister(email: string, password: string) {
  return apiPost<{ message?: string }>("/api/Auth/register", { email, password });
}

export type MeResponse = {
  userId: string;
  email: string;
  roles: string[];
};

export function apiMe() {
  return apiGet<MeResponse>("/api/Me");
}