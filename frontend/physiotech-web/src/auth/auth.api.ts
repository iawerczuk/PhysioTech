const KEY = "pt_access_token";
const DEFAULT_API = "http://127.0.0.1:5231";

export function getToken(): string | null {
  return localStorage.getItem(KEY);
}

export function setToken(token: string) {
  localStorage.setItem(KEY, token);
}

export function clearToken() {
  localStorage.removeItem(KEY);
}

function getApiUrl() {
  const v = (import.meta.env.VITE_API_URL as string | undefined) ?? DEFAULT_API;
  return v.replace(/\/+$/, "");
}

function buildUrl(path: string) {
  return `${getApiUrl()}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function readError(res: Response) {
  const txt = await res.text().catch(() => "");
  try {
    const json = txt ? JSON.parse(txt) : null;
    const msg = json?.message ?? json?.error ?? txt;
    return msg ? String(msg) : `HTTP ${res.status}`;
  } catch {
    return txt ? txt : `HTTP ${res.status}`;
  }
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit & { auth?: boolean }
): Promise<T> {
  const url = buildUrl(path);

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const auth = init?.auth ?? true;
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  if (init?.headers) {
    for (const [k, v] of Object.entries(init.headers as Record<string, string>)) {
      headers[k] = v;
    }
  }

  const res = await fetch(url, { ...init, headers });

  if (!res.ok) {
    const msg = await readError(res);
    throw new Error(`${res.status}: ${msg}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return (undefined as unknown) as T;
  }

  return (await res.json()) as T;
}

export function apiGet<T>(path: string, init?: RequestInit) {
  return apiRequest<T>(path, { ...init, method: "GET" });
}

export function apiPost<T>(
  path: string,
  body?: unknown,
  init?: RequestInit & { auth?: boolean }
) {
  return apiRequest<T>(path, {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    } as any,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export type AuthResponse = { token: string };

export function apiLogin(email: string, password: string) {
  return apiPost<AuthResponse>("/api/auth/login", { email, password }, { auth: false });
}

export function apiRegister(email: string, password: string) {
  return apiPost<AuthResponse>("/api/auth/register", { email, password }, { auth: false });
}

export type MeResponse = { email?: string };

export function apiMe() {
  return apiGet<MeResponse>("/api/me");
}

