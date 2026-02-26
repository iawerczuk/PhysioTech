import type { MyRental } from "../../rentals/rentalTypes";

type Props = {
  rentals: MyRental[];
  rentalsBusy: boolean;
  rentalsError: string | null;
  rentalsLoadedOnce: boolean;

  onRefresh: () => void;

  formatDate: (iso: string) => string;
  formatCreatedAt: (iso?: string | null) => string | null;
};

export default function HistorySection({
  rentals,
  rentalsBusy,
  rentalsError,
  rentalsLoadedOnce,
  onRefresh,
  formatDate,
  formatCreatedAt,
}: Props) {
  return (
    <div className="mt-8 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-slate-900">Historia wypożyczeń</h3>

        <button
          type="button"
          onClick={onRefresh}
          className="rounded-full px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-white disabled:opacity-60"
          disabled={rentalsBusy}
        >
          Odśwież
        </button>
      </div>

      {rentalsError && (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
          {rentalsError}
        </div>
      )}

      {rentalsBusy && <p className="mt-4 text-sm text-slate-500">Ładowanie wypożyczeń...</p>}

      {!rentalsBusy && rentalsLoadedOnce && rentals.length === 0 && (
        <p className="mt-4 text-sm text-slate-600">Brak wypożyczeń.</p>
      )}

      {!rentalsBusy && rentals.length > 0 && (
        <div className="mt-4 grid gap-3">
          {rentals.map((r) => (
            <div key={r.id} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-900">Wypożyczenie #{r.id}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {formatDate(r.startDate)} do {formatDate(r.endDate)}
                  </div>
                  {r.createdAt && (
                    <div className="mt-2 text-xs text-slate-500">
                      Utworzone: {formatCreatedAt(r.createdAt)}
                    </div>
                  )}
                </div>

                <div className="text-xs font-medium text-slate-600">{r.status ?? "Brak statusu"}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}