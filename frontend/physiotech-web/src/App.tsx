import { useEffect, useMemo, useState } from "react";
import { apiGet, API_URL } from "./api";

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

export default function App() {
  const apiUrl = useMemo(() => API_URL, []);

  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Device[]>("/api/Devices")
      .then((data) => {
        setDevices(data);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="mx-auto max-w-6xl px-6 py-5">
        <nav className="flex items-center justify-between">
          <div className="text-lg font-semibold">PhysioTech</div>

          <div className="hidden gap-6 text-sm text-slate-600 md:flex">
            <a className="hover:text-slate-900" href="#about">O nas</a>
            <a className="hover:text-slate-900" href="#how">Jak to działa</a>
            <a className="hover:text-slate-900" href="#devices">Sprzęt</a>
            <a className="hover:text-slate-900" href="#faq">FAQ</a>
          </div>

          <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            Kontakt
          </button>
        </nav>

        <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Wypożycz nowoczesny sprzęt rehabilitacyjny i wróć do sprawności
            </h1>
            <p className="mt-4 max-w-prose text-slate-600">
              Prosty proces, jasne zasady, bezpieczne konto. Sprzęt dostępny od ręki.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="#devices"
                className="inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Sprawdź ofertę
              </a>
              <div className="text-xs text-slate-500">
                API: {apiUrl}
              </div>
            </div>

            {loading && <p className="mt-6 text-sm text-slate-600">Ładowanie sprzętu...</p>}
            {error && <p className="mt-6 text-sm text-rose-600">Błąd: {error}</p>}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="aspect-[16/10] w-full rounded-xl bg-white shadow-sm" />
            <p className="mt-4 text-sm text-slate-600">
              Tu wstawimy później logo lub mock produktu.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        <section id="how" className="mt-10">
          <h2 className="text-xl font-semibold">Jak to działa?</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-5">
              <div className="text-sm font-medium">1. Załóż konto</div>
              <div className="mt-1 text-sm text-slate-600">Rejestracja i logowanie przez JWT.</div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <div className="text-sm font-medium">2. Wybierz sprzęt</div>
              <div className="mt-1 text-sm text-slate-600">Lista urządzeń z ceną i kaucją.</div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5">
              <div className="text-sm font-medium">3. Złóż rezerwację</div>
              <div className="mt-1 text-sm text-slate-600">Termin, ilość, podsumowanie.</div>
            </div>
          </div>
        </section>

        <section id="devices" className="mt-12">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-semibold">Sprzęt</h2>
            <div className="text-sm text-slate-500">{devices.length} pozycji</div>
          </div>

          {!loading && !error && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {devices
                .filter((d) => d.isActive)
                .map((d) => (
                  <article key={d.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="text-base font-semibold">{d.name}</div>
                    <p className="mt-2 text-sm text-slate-600">{d.description}</p>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-600">
                      <div className="rounded-xl bg-slate-50 p-2">
                        <div className="text-slate-500">Dzień</div>
                        <div className="font-medium text-slate-900">{d.pricePerDay} zł</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2">
                        <div className="text-slate-500">Kaucja</div>
                        <div className="font-medium text-slate-900">{d.deposit} zł</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2">
                        <div className="text-slate-500">Dostępne</div>
                        <div className="font-medium text-slate-900">{d.availableQuantity}</div>
                      </div>
                    </div>

                    <button className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                      Dodaj do rezerwacji
                    </button>
                  </article>
                ))}
            </div>
          )}
        </section>

        <section id="faq" className="mt-12">
          <h2 className="text-xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-3">
            <details className="rounded-2xl border border-slate-200 p-5">
              <summary className="cursor-pointer text-sm font-medium">Jak mogę wypożyczyć sprzęt?</summary>
              <p className="mt-2 text-sm text-slate-600">
                Rejestrujesz konto, logujesz się, wybierasz sprzęt i wysyłasz rezerwację.
              </p>
            </details>
            <details className="rounded-2xl border border-slate-200 p-5">
              <summary className="cursor-pointer text-sm font-medium">Czy mogę przedłużyć wypożyczenie?</summary>
              <p className="mt-2 text-sm text-slate-600">
                Tak, zrobimy do tego endpoint i widok w panelu klienta.
              </p>
            </details>
          </div>
        </section>
      </main>
    </div>
  );
}