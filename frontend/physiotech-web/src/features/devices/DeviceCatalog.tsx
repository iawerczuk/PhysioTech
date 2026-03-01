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

type Props = {
  onRequireAuth: () => void;
  onRentClick: (device: Device) => void;
};

export default function DeviceCatalog({ onRequireAuth, onRentClick }: Props) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("Wszystkie");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (selectedCategory === "Wszystkie") return devices;

    return devices.filter((d) => {
      const cats = DEVICE_CATEGORY_MAP[d.id] ?? [];
      return cats.includes(selectedCategory);
    });
  }, [devices, selectedCategory]);

  return (
    <section id="sprzęt" className="mt-16 scroll-mt-24">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-semibold">Sprzęt</h2>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={[
                "rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200",
                "ring-1",
                isActive
                  ? "bg-[#102363] text-white ring-[#102363]"
                  : "bg-white text-slate-700 ring-slate-200 hover:bg-[#102363] hover:text-white hover:ring-[#102363]",
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
                <DeviceCard 
                key={d.id} 
                device={d} 
                onRent={() => onRentClick(d)} 
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}