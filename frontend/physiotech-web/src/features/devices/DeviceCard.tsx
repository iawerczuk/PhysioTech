import type { Device } from "../../types";
import { DEVICE_IMAGE_BY_ID } from "./deviceImages";

type Props = {
  device: Device;
  onRent: () => void;
};

export default function DeviceCard({ device, onRent }: Props) {
  const img = DEVICE_IMAGE_BY_ID[device.id];

  return (
    <article className="rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm overflow-hidden flex flex-col">
      <div className="h-44 bg-slate-50 ring-1 ring-slate-200/60 overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={device.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-sm text-slate-400">
            Brak zdjęcia
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-900">{device.name}</h3>

        <p className="mt-2 text-sm text-slate-600">{device.shortDescription}</p>

        <dl className="mt-5 text-sm">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <dt className="text-slate-500">Cena za dzień</dt>
            <dd className="text-right font-semibold text-slate-900">
              {device.pricePerDay} zł
            </dd>

            <dt className="text-slate-500">Kaucja</dt>
            <dd className="text-right font-semibold text-slate-900">
              {device.deposit} zł
            </dd>

            <dt className="text-slate-500">Dostępne</dt>
            <dd className="text-right font-semibold text-slate-900">
              {device.availableCount}
              <div className="text-xs font-medium text-slate-500">szt.</div>
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <button
            type="button"
            onClick={onRent}
            className="h-11 w-full rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
          >
            Wypożycz
          </button>
        </div>
      </div>
    </article>
  );
}