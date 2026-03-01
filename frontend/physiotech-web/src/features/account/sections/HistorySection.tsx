import { useEffect, useState } from "react";
import type { MyRental } from "../../rentals/rentalTypes";
import { apiRentalDetails } from "../../../api";
import type { RentalDetailsDto } from "../../../api";

type Props = {
  rentals: MyRental[];
  rentalsBusy: boolean;
  rentalsError: string | null;
  rentalsLoadedOnce: boolean;

  onRefresh: () => void;

  formatDate: (iso: string) => string;
  formatCreatedAt: (iso?: string | null) => string | null;
};

function pln(v: number) {
  if (!Number.isFinite(v)) return "0 zł";
  return `${Math.round(v)} zł`;
}

export default function HistorySection({
  rentals,
  rentalsBusy,
  rentalsError,
  rentalsLoadedOnce,
  onRefresh,
  formatDate,
  formatCreatedAt,
}: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailsErr, setDetailsErr] = useState<string | null>(null);
  const [detailsBusy, setDetailsBusy] = useState(false);
  const [details, setDetails] = useState<RentalDetailsDto | null>(null);

  useEffect(() => {
    if (selectedId == null) return;

    setDetails(null);
    setDetailsErr(null);
    setDetailsBusy(true);

    apiRentalDetails(selectedId)
      .then((d) => setDetails(d))
      .catch((e) => setDetailsErr(e instanceof Error ? e.message : String(e)))
      .finally(() => setDetailsBusy(false));
  }, [selectedId]);

  function closeModal() {
    setSelectedId(null);
    setDetails(null);
    setDetailsErr(null);
    setDetailsBusy(false);
  }

  const totals = (() => {
    if (!details?.items?.length) return { rental: 0, deposit: 0, total: 0 };
    const rental = details.items.reduce((s, i) => s + (i.totalRental ?? 0), 0);
    const deposit = details.items.reduce((s, i) => s + (i.totalDeposit ?? 0), 0);
    return { rental, deposit, total: rental + deposit };
  })();

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
          Odswiez
        </button>
      </div>

      {rentalsError && (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
          {rentalsError}
        </div>
      )}

      {rentalsBusy && <p className="mt-4 text-sm text-slate-500">Ladowanie wypożyczeń...</p>}

      {!rentalsBusy && rentalsLoadedOnce && rentals.length === 0 && (
        <p className="mt-4 text-sm text-slate-600">Brak wypożyczeń.</p>
      )}

      {!rentalsBusy && rentals.length > 0 && (
        <div className="mt-4 grid gap-3">
          {rentals.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedId(r.id)}
              className="text-left rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 hover:ring-slate-400 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900">Wypożyczenie #{r.id}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {formatDate(r.startDate)} do {formatDate(r.endDate)}
                  </div>
                  {r.createdAt && (
                    <div className="mt-2 text-xs text-slate-500">Utworzone: {formatCreatedAt(r.createdAt)}</div>
                  )}
                </div>

                <div className="text-xs font-medium text-slate-600">{r.status ?? "Brak statusu"}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedId != null && (
        <div
          className="fixed inset-0 z-50"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="absolute inset-0 bg-slate-900/20" />

          <div className="relative mx-auto w-full max-w-3xl px-6 pt-24">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">Wypożyczenie #{selectedId}</h3>

                  {details && (
                    <div className="mt-1 text-sm text-slate-600">
                      {formatDate(details.startDate)} do {formatDate(details.endDate)} | {details.days} dni |{" "}
                      {details.status}
                    </div>
                  )}

                  {details?.createdAt && (
                    <div className="mt-1 text-xs text-slate-500">Utworzone: {formatCreatedAt(details.createdAt)}</div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="h-10 rounded-full px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Zamknij
                </button>
              </div>

              {detailsBusy && <div className="mt-4 text-sm text-slate-600">Ladowanie szczegolow...</div>}

              {detailsErr && (
                <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
                  {detailsErr}
                </div>
              )}

              {details && !detailsBusy && !detailsErr && (
                <>
                  <div className="mt-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/60">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Wypożyczenie</span>
                      <span className="font-semibold text-slate-900">{pln(totals.rental)}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-slate-600">Kaucja</span>
                      <span className="font-semibold text-slate-900">{pln(totals.deposit)}</span>
                    </div>
                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-slate-600">Razem</span>
                      <span className="text-base font-semibold text-slate-900">{pln(totals.total)}</span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="text-sm font-semibold text-slate-900">Pozycje</div>

                    {details.items?.length ? (
                      <div className="mt-3 grid gap-2">
                        {details.items.map((i) => (
                          <div key={i.deviceId} className="rounded-xl bg-white p-4 ring-1 ring-slate-200/70">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="font-medium text-slate-900">{i.deviceName}</div>
                                <div className="mt-1 text-sm text-slate-600">
                                  Ilosc: {i.quantity} | {i.itemDays} dni
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                  {pln(i.pricePerDay)} / dzien, kaucja {pln(i.deposit)}
                                </div>
                              </div>

                              <div className="text-right text-sm text-slate-700">
                                <div>
                                  Wypożyczenie: <span className="font-semibold">{pln(i.totalRental)}</span>
                                </div>
                                <div>
                                  Kaucja: <span className="font-semibold">{pln(i.totalDeposit)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 text-sm text-slate-600">Brak pozycji.</div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}