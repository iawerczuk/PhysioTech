const KEY = "pt_access_token";
const DEFAULT_API = "http://127.0.0.1:5231";

function getApiUrl() {
  const v = (import.meta.env.VITE_API_URL as string | undefined) ?? DEFAULT_API;
  return v.replace(/\/+$/, "");
}

export function getToken(): string | null {
  return localStorage.getItem(KEY);
}

export function setToken(token: string) {
  localStorage.setItem(KEY, token);
}

export function clearToken() {
  localStorage.removeItem(KEY);
}

function buildUrl(path: string) {
  return `${getApiUrl()}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function readError(res: Response) {
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    const j = await res.json().catch(() => null);
    return j ? JSON.stringify(j) : `HTTP ${res.status}`;
  }
  const txt = await res.text().catch(() => "");
  return txt ? txt : `HTTP ${res.status}`;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const url = buildUrl(path);
  const token = getToken();

  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    if (res.status === 401) clearToken();
    throw new Error(await readError(res));
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : (null as T)) as T;
}

export function apiGet<T>(path: string, init?: RequestInit) {
  return apiRequest<T>(path, { ...init, method: "GET" });
}

export function apiPost<T>(path: string, body?: unknown, init?: RequestInit) {
  return apiRequest<T>(path, {
    ...init,
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function apiLogin(email: string, password: string) {
  const r = await apiPost<{ accessToken: string }>("/api/auth/login", { email, password });
  if (!r?.accessToken) throw new Error("Brak accessToken w odpowiedzi.");
  setToken(r.accessToken);
  return r.accessToken;
}

export async function apiRegister(email: string, password: string) {
  await apiPost("/api/auth/register", { email, password });
}

export type UserMeDto = {
  userId?: string;
  email: string;
  roles?: string[];
  firstName?: string | null;
  lastName?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  companyName?: string | null;
  nip?: string | null;
  needInvoice?: boolean;
};

export async function apiMe() {
  return apiGet<UserMeDto>("/api/me");
}

export async function apiUpdateMe(payload: any) {
  return apiRequest<void>("/api/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export type CreateRentalBody = {
  startDate: string;
  endDate: string;
  items: { deviceId: number; quantity: number }[];
};

//export async function apiCreateRental(body: CreateRentalBody) {
  //return apiPost<{ id: number; message?: string }>("/api/rentals", body);
//}

export async function apiCreateRental(body: CreateRentalBody) {
  return apiPost("/api/rentals", body);
}

export async function apiMyRentals() {
  return apiGet<any[]>("/api/rentals/my");
}

export type RentalDetailsDto = {
  id: number;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  createdAt?: string | null;
  items: {
    deviceId: number;
    deviceName: string;
    quantity: number;
    pricePerDay: number;
    deposit: number;
    itemDays: number;
    totalRental: number;
    totalDeposit: number;
  }[];
};

export function apiRentalDetails(id: number) {
  return apiGet<RentalDetailsDto>(`/api/rentals/${id}`);
}