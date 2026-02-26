import { useMemo, useState, useEffect, useRef } from "react";
import { apiCreateRental, getToken } from "../../api";
import type { Cart } from "./rentalTypes";

type Props = {
  open: boolean;
  onClose: () => void;

  cart: Cart[];
  setQty: (deviceId: number, qty: number) => void;
  removeItem: (deviceId: number) => void;
  clearCart: () => void;

  setItemDates: (deviceId: number, startDate: string, endDate: string) => void;

  onRequireAuth: () => void;
};

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function daysBetweenInclusive(startISO?: string, endISO?: string) {
  if (!startISO || !endISO) return 0;

  const start = new Date(`${startISO}T00:00:00`);
  const end = new Date(`${endISO}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;

  const diff = Math.floor((end.getTime() - start.getTime()) / 86_400_000);
  return diff >= 0 ? diff + 1 : 0;
}

function pln(v: number) {
  if (!Number.isFinite(v)) return "0 zł";
  return `${Math.round(v)} zł`;
}

export default function RentalPanel({
  open,
  onClose,
  cart,
  setQty,
  removeItem,
  clearCart,
  setItemDates,
  onRequireAuth,
}: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const itemTotals = useMemo(() => {
    const items = cart.map((x) => {
      const start = x.startDate ?? todayISO();
      const end = x.endDate ?? todayISO();
      const days = daysBetweenInclusive(start, end);

      const perDay = x.pricePerDay * x.quantity;
      const deposit = x.deposit * x.quantity;
      const rentalTotal = perDay * Math.max(0, days);

      return {
        deviceId: x.deviceId,
        days,
        perDay,
        deposit,
        rentalTotal,
      };
    });

    const deposit = items.reduce((s, i) => s + i.deposit, 0);
    const rentalTotal = items.reduce((s, i) => s + i.rentalTotal, 0);

    return {
      items,
      deposit,
      rentalTotal,
      total: deposit + rentalTotal,
    };
  }, [cart]);

  const canSubmit = cart.length > 0 && consent && !busy;

  if (!open) return null;

  async function submit() {
    setError(null);
    setOkMsg(null);

    const token = getToken();
    if (!token) {
      onRequireAuth();
      return;
    }

    if (!cart.length) return setError("Dodaj sprzęt do wypożyczenia.");
    if (!consent) return setError("Zaznacz akceptację regulaminu.");

    for (const x of cart) {
      const start = x.startDate ?? todayISO();
      const end = x.endDate ?? todayISO();

      if (end < start) {
        return setError("W jednej z pozycji data końca jest wcześniejsza niż start.");
      }
      if (daysBetweenInclusive(start, end) <= 0) {
        return setError("W jednej z pozycji liczba dni jest niepoprawna.");
      }
    }

    setBusy(true);
    try {
      await apiCreateRental({
        items: cart.map((x) => ({
          deviceId: x.deviceId,
          quantity: x.quantity,
          startDate: x.startDate ?? todayISO(),
          endDate: x.endDate ?? todayISO(),
        })),
        startDate: "",
        endDate: ""
      });

      setOkMsg("Wypożyczenie utworzone.");
      clearCart();
      setConsent(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const fixedPanelH = "h-[360px]";
  const listH = "max-h-[240px]";
  const shouldScroll = cart.length >= 3;

  return (
    <div
      className="fixed inset-0 z-50"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-slate-900/20" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-6">
        <section
          ref={panelRef}
          className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Wypożyczenie</h2>
              <p className="mt-1 text-sm text-slate-600">
                Wybierz terminy dla każdej pozycji i wyślij wypożyczenie.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-full px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Zamknij
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
              {error}
            </div>
          )}

          {okMsg && (
            <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
              {okMsg}
            </div>
          )}

          {cart.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
              <h3 className="font-medium">Wybrane urządzenia</h3>
              <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-slate-200/70">
                <div className="text-sm text-slate-600">
                  Koszyk jest pusty. Kliknij Wypożycz przy wybranym sprzęcie.
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 items-start lg:grid-cols-3">
              <div className={["lg:col-span-2 min-w-0", fixedPanelH].join(" ")}>
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/60 h-full">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-medium">Wybrane urządzenia</h3>

                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-sm text-slate-600 hover:text-slate-900"
                      disabled={busy}
                    >
                      Wyczyść
                    </button>
                  </div>

                  <div
                    className={[
                      "mt-3 grid gap-2",
                      listH,
                      shouldScroll ? "overflow-y-auto pr-2" : "overflow-hidden",
                    ].join(" ")}
                  >
                    {cart.map((x) => {
                      const start = x.startDate ?? todayISO();
                      const end = x.endDate ?? todayISO();
                      const days = daysBetweenInclusive(start, end);

                      return (
                        <div
                          key={x.deviceId}
                          className="rounded-xl bg-white p-3 ring-1 ring-slate-200/70"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 leading-tight">
                                {x.name}
                              </div>
                              <div className="mt-0.5 text-xs text-slate-600">
                                {pln(x.pricePerDay)} / dzień, kaucja {pln(x.deposit)}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(x.deviceId)}
                              className="shrink-0 text-xs font-medium text-slate-600 hover:text-red-700"
                              disabled={busy}
                              title="Usuń pozycję"
                            >
                              Usuń
                            </button>
                          </div>

                          <div className="mt-2 grid gap-2 lg:grid-cols-3 items-end">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-600">Ilość</span>
                              <input
                                type="number"
                                min={1}
                                value={x.quantity}
                                onChange={(e) =>
                                  setQty(x.deviceId, Math.max(1, Number(e.target.value) || 1))
                                }
                                className="h-9 w-20 rounded-xl px-3 ring-1 ring-slate-200 bg-white text-sm"
                                disabled={busy}
                              />
                            </div>

                            <div>
                              <div className="text-[11px] font-medium text-slate-500">Start</div>
                              <input
                                type="date"
                                value={start}
                                onChange={(e) => setItemDates(x.deviceId, e.target.value, end)}
                                className="mt-1 h-9 w-full rounded-xl px-3 ring-1 ring-slate-200 bg-white text-sm"
                                disabled={busy}
                              />
                            </div>

                            <div>
                              <div className="text-[11px] font-medium text-slate-500">Koniec</div>
                              <input
                                type="date"
                                value={end}
                                onChange={(e) => setItemDates(x.deviceId, start, e.target.value)}
                                className="mt-1 h-9 w-full rounded-xl px-3 ring-1 ring-slate-200 bg-white text-sm"
                                disabled={busy}
                              />
                            </div>
                          </div>

                          <div className="mt-2 text-[11px] text-slate-500">
                            Liczba dni:{" "}
                            <span className="font-semibold text-slate-700">{days}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {cart.length >= 3 && (
                    <div className="mt-2 text-[11px] text-slate-500">
                      Lista ma przewijanie od 3 pozycji.
                    </div>
                  )}
                </div>
              </div>

              <div className={["lg:col-span-1", fixedPanelH].join(" ")}>
                <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 shadow-sm h-full">
                  <h3 className="font-medium">Podsumowanie</h3>

                  <div className="mt-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/60">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Suma</span>
                      <span className="font-semibold text-slate-900">
                        {pln(itemTotals.rentalTotal)}
                      </span>
                    </div>

                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-slate-600">Kaucja</span>
                      <span className="font-semibold text-slate-900">
                        {pln(itemTotals.deposit)}
                      </span>
                    </div>

                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-slate-600">Razem</span>
                      <span className="text-base font-semibold text-slate-900">
                        {pln(itemTotals.total)}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      Suma liczona osobno dla każdej pozycji według jej dat.
                    </div>
                  </div>

                  <label className="mt-4 flex items-start gap-2 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      className="mt-0.5 accent-emerald-600"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      disabled={busy}
                    />
                    <span>Akceptuję regulamin i politykę prywatności.</span>
                  </label>

                  <button
                    type="button"
                    onClick={submit}
                    disabled={!canSubmit}
                    className="mt-4 h-11 w-full rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-60"
                  >
                    Wypożycz
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}