const DEFAULT_API = "http://127.0.0.1:5231";

function getApiUrl() {
  const v = (import.meta.env.VITE_API_URL as string | undefined) ?? DEFAULT_API;
  return v.replace(/\/+$/, "");
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getApiUrl()}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}${txt ? `: ${txt}` : ""}`);
  }

  return (await res.json()) as T;
}