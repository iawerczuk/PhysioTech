import type { Device } from "../../types";
import { DEVICE_IMAGE_BY_ID } from "./deviceImages";


function formatPLN(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value);
}

type Props = {
  device: Device;
};

export default function DeviceCard({ device }: Props) {
  const img = DEVICE_IMAGE_BY_ID[device.id];

  return (
    <article className="h-full rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {img && (
        <img
          src={img}
          alt={device.name}
          className="mb-4 h-40 w-full rounded-xl object-cover bg-slate-100"
          loading="lazy"
        />
      )}

      <h3 className="text-lg font-medium text-slate-900">{device.name}</h3>
      <p className="mt-2 text-sm text-slate-600 line-clamp-3">{device.description}</p>

      <div className="mt-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/60">
        <div className="text-xs text-slate-500">Cena za dzień</div>
        <div className="mt-1 text-2xl font-semibold text-slate-900">
          {formatPLN(device.pricePerDay)}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-700">
        <span>Kaucja</span>
        <span className="font-medium text-slate-900">{formatPLN(device.deposit)}</span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-slate-700">Dostępne</span>
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200/60">
          Dostępne: {device.availableQuantity}
        </span>
      </div>

      <div className="mt-auto pt-6">
        <button
          type="button"
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition"
          onClick={() => alert(`Wkrótce: dodawanie do wypożyczenia (deviceId=${device.id})`)}
        >
          Wypożycz
        </button>
      </div>
    </article>
  );
}