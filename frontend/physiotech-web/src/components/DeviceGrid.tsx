import { useEffect, useMemo, useState } from "react";

type Device = {
  id: number;
  name: string;
  description: string;
  pricePerDay: number;
  deposit: number;
  availableQuantity: number;
  imageUrl?: string | null;
  isActive: boolean;
};

function formatPLN(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function DeviceGrid() {
  const apiUrl = useMemo(
    () =>
      (import.meta.env.VITE_API_URL as string | undefined) ??
      "http://127.0.0.1:5231",
    []
  );

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    async function load() {
      try {
        setError(null);
        const res = await fetch(`${apiUrl}/api/Devices`, {
          signal: ac.signal,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status} ${txt}`.trim());
        }

        const data = (await res.json()) as Device[];
        setDevices(data.filter((d) => d.isActive));
      } catch (e) {
        if ((e as any)?.name === "AbortError") return;
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => ac.abort();
  }, [apiUrl]);

  return (
    <section id="devices" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Lista urządzeń</h3>
            <p className="mt-1 text-sm text-slate-600">
              Dane z API: <span className="font-mono">{apiUrl}</span>
            </p>
          </div>
          <div className="text-sm text-slate-600">
            {loading ? "Ładowanie..." : `Wynik: ${devices.length}`}
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Błąd pobierania: <span className="font-mono">{error}</span>
          </div>
        )}

        {loading && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
              />
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {devices.map((d) => (
              <article
                key={d.id}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-base font-semibold text-slate-900">{d.name}</h4>
                  <span
                    className={[
                      "rounded-full px-2 py-1 text-xs",
                      d.availableQuantity > 0
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600",
                    ].join(" ")}
                  >
                    {d.availableQuantity > 0 ? `Dostępne: ${d.availableQuantity}` : "Brak"}
                  </span>
                </div>

                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{d.description}</p>

                <div className="mt-4 flex items-end justify-between">
                  <div className="text-sm">
                    <div className="text-slate-500">Cena za dzień</div>
                    <div className="text-lg font-semibold">{formatPLN(d.pricePerDay)}</div>
                  </div>

                  <div className="text-right text-sm">
                    <div className="text-slate-500">Kaucja</div>
                    <div className="font-semibold">{formatPLN(d.deposit)}</div>
                  </div>
                </div>

                <button
                  className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                  disabled={d.availableQuantity <= 0}
                  type="button"
                  onClick={() => alert(`Następny krok: szczegóły i wypożyczenie: ${d.name}`)}
                >
                  Wypożycz
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}