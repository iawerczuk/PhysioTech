import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../../api";
import type { Device } from "../../types";
import DeviceCard from "./DeviceCard";

const CATEGORIES = [
  "Wszystkie",
  "Elektrostymulacja",
  "Wsparcie chodzenia",
  "Kompresjoterapia",
  "Terapia zimnem",
] as const;

type Category = (typeof CATEGORIES)[number];

const DEVICE_CATEGORY_MAP: Record<number, Category[]> = {
  1: ["Elektrostymulacja"],
  2: ["Wsparcie chodzenia"],
  3: ["Kompresjoterapia"],
  4: ["Wsparcie chodzenia"],
  5: ["Kompresjoterapia", "Terapia zimnem"],
};

export default function DeviceCatalog() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("Wszystkie");
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentCategory = hoveredCategory ?? selectedCategory;

  useEffect(() => {
    apiGet<Device[]>("/api/Devices")
      .then((data) => {
        setDevices(data.filter((d) => d.isActive));
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  const filteredDevices = useMemo(() => {
    if (currentCategory === "Wszystkie") return devices;

    return devices.filter((d) => {
      const cats = DEVICE_CATEGORY_MAP[d.id] ?? [];
      return cats.includes(currentCategory);
    });
  }, [devices, currentCategory]);

  return (
    <section id="sprzet" className="mt-16 scroll-mt-24">
      

      <div className="mt-6 flex flex-wrap gap-3">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              onMouseEnter={() => setHoveredCategory(cat)}
              onMouseLeave={() => setHoveredCategory(null)}
              onFocus={() => setHoveredCategory(cat)}
              onBlur={() => setHoveredCategory(null)}
              className={[
                "rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200",
                isActive
                  ? "bg-[#102363] text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200",
              ].join(" ")}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {loading && <p className="mt-8 text-slate-500">Ładowanie sprzętu…</p>}
      {error && <p className="mt-8 text-red-600">Błąd: {error}</p>}

      {!loading && !error && (
        <>
          {filteredDevices.length === 0 ? (
            <p className="mt-8 text-slate-500">Brak urządzeń w tej kategorii.</p>
          ) : (
            <div className="mt-8 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDevices.map((d) => (
                <DeviceCard key={d.id} device={d} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}