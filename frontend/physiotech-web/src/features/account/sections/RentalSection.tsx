import type { Cart } from "../../rentals/rentalTypes";

type Props = {
  cart: Cart[];
  setItemDates: (deviceId: number, startDate: string, endDate: string) => void;
  removeItem: (deviceId: number) => void;

  fixedPanelH?: string;
  listH?: string;

  todayISO: () => string;
  daysBetweenInclusive: (startISO?: string, endISO?: string) => number;
  pln: (v: number) => string;

  cartSummary: {
    deposit: number;
    rentalTotal: number;
    total: number;
  };
};

export default function RentalSection({
  cart,
  setItemDates,
  removeItem,
  fixedPanelH = "h-[360px]",
  listH = "max-h-[240px]",
  todayISO,
  daysBetweenInclusive,
  pln,
  cartSummary,
}: Props) {
  const showSummary = cart.length > 0;

  return (
    <>
      {cart.length === 0 ? (
        <div className={["mt-8 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60", fixedPanelH].join(" ")}>
          <h3 className="text-base font-semibold text-slate-900">Aktualne wypożyczenie</h3>
          <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-slate-200/70">
            <div className="text-sm text-slate-600">Koszyk jest pusty.</div>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 items-start lg:grid-cols-3">
          <div
            className={[
              "lg:col-span-2 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/60 min-w-0",
              fixedPanelH,
            ].join(" ")}
          >
            <h3 className="text-base font-semibold text-slate-900">Aktualne wypożyczenie</h3>

            <div className={["mt-3 grid gap-2", listH, cart.length >= 3 ? "overflow-y-auto pr-2" : "overflow-hidden"].join(" ")}>
              {cart.map((x) => {
                const start = x.startDate ?? todayISO();
                const end = x.endDate ?? todayISO();
                const days = daysBetweenInclusive(start, end);

                return (
                  <div key={x.deviceId} className="rounded-xl bg-white p-3 ring-1 ring-slate-200/70">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 leading-tight">{x.name}</div>
                        <div className="mt-0.5 text-xs text-slate-600">
                          {pln(x.pricePerDay)} / dzień, kaucja {pln(x.deposit)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(x.deviceId)}
                        className="shrink-0 text-xs font-medium text-slate-600 hover:text-red-700"
                        title="Usuń pozycję"
                      >
                        Usuń
                      </button>
                    </div>

                    <div className="mt-2 grid gap-2 lg:grid-cols-2 items-end">
                      <div>
                        <div className="text-[11px] font-medium text-slate-500">Start</div>
                        <input
                          type="date"
                          value={start}
                          onChange={(e) => setItemDates(x.deviceId, e.target.value, end)}
                          className="mt-1 h-9 w-full rounded-xl px-3 ring-1 ring-slate-200 bg-white text-sm"
                        />
                      </div>

                      <div>
                        <div className="text-[11px] font-medium text-slate-500">Koniec</div>
                        <input
                          type="date"
                          value={end}
                          onChange={(e) => setItemDates(x.deviceId, start, e.target.value)}
                          className="mt-1 h-9 w-full rounded-xl px-3 ring-1 ring-slate-200 bg-white text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-500">
                      Liczba dni: <span className="font-semibold text-slate-700">{days}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {cart.length >= 3 && (
              <div className="mt-2 text-[11px] text-slate-500">Lista ma przewijanie od 3 pozycji.</div>
            )}
          </div>

          {showSummary && (
            <div className={["lg:col-span-1 rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 shadow-sm", fixedPanelH].join(" ")}>
              <h3 className="font-medium">Podsumowanie</h3>

              <div className="mt-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/60">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Suma</span>
                  <span className="font-semibold text-slate-900">{pln(cartSummary.rentalTotal)}</span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600">Kaucja</span>
                  <span className="font-semibold text-slate-900">{pln(cartSummary.deposit)}</span>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-600">Razem</span>
                  <span className="text-base font-semibold text-slate-900">{pln(cartSummary.total)}</span>
                </div>

                <div className="mt-2 text-xs text-slate-500">Suma liczona osobno dla każdej pozycji według jej dat.</div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}