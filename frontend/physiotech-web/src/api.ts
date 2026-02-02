const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://127.0.0.1:5231";

export async function apiGet<T>(path: string): Promise<T> {
  const url = API_URL.replace(/\/$/, "") + path;

  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return (await r.json()) as T;
}

export { API_URL };