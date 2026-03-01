import { useMemo, useState, useEffect, useRef } from "react";
import { apiCreateRental, apiMe, getToken } from "../../api";
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

type Step = "cart" | "checkout" | "success";

type DeliveryMethod = "inpost" | "dhl" | "dpd";
type PaymentMethod = "card" | "transfer";

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

function minISO(a: string, b: string) {
  return a <= b ? a : b;
}

function maxISO(a: string, b: string) {
  return a >= b ? a : b;
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

  const [step, setStep] = useState<Step>("cart");

  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [delivery, setDelivery] = useState<DeliveryMethod>("inpost");
  const [payment, setPayment] = useState<PaymentMethod>("card");

  const [addrLine, setAddrLine] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrPostalCode, setAddrPostalCode] = useState("");

  const [altAddress, setAltAddress] = useState(false);
  const [addrEditing, setAddrEditing] = useState(false);

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

  useEffect(() => {
    if (!open) return;

    setError(null);
    setBusy(false);
    setStep("cart");
    setConsent(false);
    setAltAddress(false);
    setAddrEditing(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setError(null);
  }, [cart, open]);

  const deliveryOptions = useMemo(() => {
    return [
      { id: "inpost" as const, label: "Kurier InPost", price: 24, eta: "1-2 dni" },
      { id: "dhl" as const, label: "Kurier DHL", price: 19, eta: "2-3 dni" },
      { id: "dpd" as const, label: "Kurier DPD", price: 18, eta: "2-3 dni" },
    ];
  }, []);

  const chosenDelivery = useMemo(() => {
    return deliveryOptions.find((x) => x.id === delivery) ?? deliveryOptions[0];
  }, [delivery, deliveryOptions]);

  const itemTotals = useMemo(() => {
    const items = cart.map((x) => {
      const start = x.startDate ?? todayISO();
      const end = x.endDate ?? todayISO();
      const days = daysBetweenInclusive(start, end);

      const perDay = x.pricePerDay * x.quantity;
      const deposit = x.deposit * x.quantity;
      const rentalTotal = perDay * Math.max(0, days);

      return { start, end, days, perDay, deposit, rentalTotal };
    });

    const deposit = items.reduce((s, i) => s + i.deposit, 0);
    const rentalTotal = items.reduce((s, i) => s + i.rentalTotal, 0);

    const range =
      items.length === 0
        ? { startDate: "", endDate: "" }
        : items.reduce(
            (acc, it) => ({
              startDate: minISO(acc.startDate, it.start),
              endDate: maxISO(acc.endDate, it.end),
            }),
            { startDate: items[0].start, endDate: items[0].end }
          );

    return {
      deposit,
      rentalTotal,
      total: deposit + rentalTotal,
      range,
    };
  }, [cart]);

  const totalWithDelivery = itemTotals.total + (step === "checkout" ? chosenDelivery.price : 0);

  if (!open) return null;

  function validateCartDates(): string | null {
    if (!cart.length) return "Dodaj sprzęt do wypożyczenia.";

    for (const x of cart) {
      const start = x.startDate ?? todayISO();
      const end = x.endDate ?? todayISO();

      if (end < start) return "W jednej z pozycji data konca jest wczesniejsza niz start.";
      if (daysBetweenInclusive(start, end) <= 0) return "W jednej z pozycji liczba dni jest niepoprawna.";
    }

    const startDate = itemTotals.range.startDate;
    const endDate = itemTotals.range.endDate;
    if (!startDate || !endDate) return "Brakuje dat wypożyczenia.";

    return null;
  }

  async function prefillAddressFromProfile() {
    try {
      const me = await apiMe();
      const a = (me?.address ?? "").trim();
      const c = (me?.city ?? "").trim();
      const p = (me?.postalCode ?? "").trim();

      setAddrLine(a);
      setAddrCity(c);
      setAddrPostalCode(p);
    } catch {
      // ignore 
    }
  }

  async function goToCheckout() {
    setError(null);

    const token = getToken();
    if (!token) {
      onRequireAuth();
      return;
    }

    const err = validateCartDates();
    if (err) {
      setError(err);
      return;
    }

    if (!consent) {
      setError("Zaznacz akceptacje regulaminu.");
      return;
    }

    setStep("checkout");
    await prefillAddressFromProfile();
  }

  function validateAddress(): string | null {
    if (!addrLine.trim()) return "Podaj ulice i numer.";
    if (!addrCity.trim()) return "Podaj miasto.";
    if (!/^\d{2}-\d{3}$/.test(addrPostalCode.trim())) return "Kod pocztowy w formacie 00-000.";
    return null;
  }

  function toggleAltAddress() {
    const next = !altAddress;
    setAltAddress(next);
    setAddrEditing(next);

    if (!next) {
      void prefillAddressFromProfile();
    }
  }

  function saveAltAddress() {
    const err = validateAddress();
    if (err) {
      setError(err);
      return;
    }
    setAddrEditing(false);
    setError(null);
  }

  async function payAndCreateRental() {
    setError(null);

    const token = getToken();
    if (!token) {
      onRequireAuth();
      return;
    }

    const errDates = validateCartDates();
    if (errDates) {
      setStep("cart");
      setError(errDates);
      return;
    }

    const errAddr = validateAddress();
    if (errAddr) {
      setError(errAddr);
      return;
    }

    setBusy(true);
    try {
      await apiCreateRental({
        startDate: itemTotals.range.startDate,
        endDate: itemTotals.range.endDate,
        items: cart.map((x) => ({ deviceId: x.deviceId, quantity: x.quantity })),
      });

      clearCart();
      setConsent(false);
      setStep("success");

      window.setTimeout(() => onClose(), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

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
          className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm max-h-[92vh] overflow-hidden"
          onMouseDown={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                {step === "checkout" ? "Platnosc i dostawa" : "Wypożyczenie"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {step === "checkout"
                  ? "Wybierz metode dostawy i platnosci, uzupelnij dane, a potem zaplac i zloz zamowienie."
                  : "Wybierz terminy dla kazdej pozycji i przejdz dalej."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-full px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              disabled={busy}
            >
              Zamknij
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
              {error}
            </div>
          )}

          {step === "success" && (
            <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-200">
              <div className="font-semibold">Wypożyczenie udane.</div>
              <div className="mt-1">O postepach zamowienia bedziemy informowac mailem.</div>
            </div>
          )}

          <div className="mt-6 overflow-y-auto pr-2" style={{ maxHeight: "calc(92vh - 140px)" }}>
            {step === "cart" && (
              <>
                {cart.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
                    <h3 className="font-medium">Wybrane urządzenia</h3>
                    <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-slate-200/70">
                      <div className="text-sm text-slate-600">
                        Koszyk jest pusty. Kliknij Wypożycz przy wybranym sprzęcie.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 items-start lg:grid-cols-3">
                    <div className="lg:col-span-2 min-w-0">
                      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/60">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="font-medium">Wybrane urządzenia</h3>

                          <button
                            type="button"
                            onClick={clearCart}
                            className="text-sm text-slate-600 hover:text-slate-900"
                            disabled={busy}
                          >
                            Wyczysc
                          </button>
                        </div>

                        <div className={["mt-3 grid gap-2", cart.length >= 3 ? "max-h-[420px] overflow-y-auto pr-2" : ""].join(" ")}>
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
                                      {pln(x.pricePerDay)} / dzien, kaucja {pln(x.deposit)}
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => removeItem(x.deviceId)}
                                    className="shrink-0 text-xs font-medium text-slate-600 hover:text-red-700"
                                    disabled={busy}
                                  >
                                    Usun
                                  </button>
                                </div>

                                <div className="mt-2 grid gap-2 lg:grid-cols-3 items-end">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-600">Ilosc</span>
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
                                  Liczba dni: <span className="font-semibold text-slate-700">{days}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-1">
                      <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 shadow-sm">
                        <h3 className="font-medium">Podsumowanie</h3>

                        <div className="mt-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/60">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Suma</span>
                            <span className="font-semibold text-slate-900">{pln(itemTotals.rentalTotal)}</span>
                          </div>

                          <div className="mt-2 flex justify-between text-sm">
                            <span className="text-slate-600">Kaucja</span>
                            <span className="font-semibold text-slate-900">{pln(itemTotals.deposit)}</span>
                          </div>

                          <div className="mt-3 flex justify-between text-sm">
                            <span className="text-slate-600">Razem</span>
                            <span className="text-base font-semibold text-slate-900">{pln(itemTotals.total)}</span>
                          </div>

                          <div className="mt-3 text-xs text-slate-600">
                            Zakres:{" "}
                            <span className="font-medium text-slate-900">
                              {itemTotals.range.startDate} do {itemTotals.range.endDate}
                            </span>
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
                          <span>Akceptuje regulamin i polityke prywatnosci.</span>
                        </label>

                        <button
                          type="button"
                          onClick={goToCheckout}
                          disabled={cart.length === 0 || busy}
                          className="mt-4 h-11 w-full rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-60"
                        >
                          Przejdz do platnosci
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {step === "checkout" && (
              <div className="grid gap-6 lg:grid-cols-3 items-start">
                <div className="lg:col-span-2 min-w-0">
                  <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
                    <div className="text-sm font-semibold text-slate-900">Dostawa</div>
                    <div className="mt-3 grid gap-2">
                      {deliveryOptions.map((o) => (
                        <label
                          key={o.id}
                          className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200/70 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="delivery"
                              className="accent-emerald-600"
                              checked={delivery === o.id}
                              onChange={() => setDelivery(o.id)}
                              disabled={busy}
                            />
                            <div>
                              <div className="text-sm font-medium text-slate-900">{o.label}</div>
                              <div className="text-xs text-slate-500">Czas dostawy: {o.eta}</div>
                            </div>
                          </div>

                          <div className="text-sm font-semibold text-slate-900">{pln(o.price)}</div>
                        </label>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-slate-900">Adres dostawy</div>

                      <button
                        type="button"
                        onClick={toggleAltAddress}
                        className="rounded-full px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-white disabled:opacity-60"
                        disabled={busy}
                      >
                        Dostawa na inny adres?
                      </button>
                    </div>

                    <div className="mt-3 grid gap-3">
                      <input
                        className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white disabled:bg-slate-50"
                        placeholder="Ulica i numer"
                        value={addrLine}
                        onChange={(e) => setAddrLine(e.target.value)}
                        disabled={busy || (!addrEditing && !altAddress)}
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white disabled:bg-slate-50"
                          placeholder="Miasto"
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                          disabled={busy || (!addrEditing && !altAddress)}
                        />
                        <input
                          className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white disabled:bg-slate-50"
                          placeholder="Kod pocztowy 00-000"
                          value={addrPostalCode}
                          onChange={(e) => setAddrPostalCode(e.target.value)}
                          disabled={busy || (!addrEditing && !altAddress)}
                          inputMode="numeric"
                        />
                      </div>

                      {altAddress && (
                        <div className="flex gap-2">
                          {!addrEditing ? (
                            <button
                              type="button"
                              onClick={() => setAddrEditing(true)}
                              className="h-10 rounded-xl px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-white"
                              disabled={busy}
                            >
                              Edytuj
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={saveAltAddress}
                              className="h-10 rounded-xl px-4 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
                              disabled={busy}
                            >
                              Zapisz
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setAltAddress(false);
                              setAddrEditing(false);
                              void prefillAddressFromProfile();
                            }}
                            className="h-10 rounded-xl px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-white"
                            disabled={busy}
                          >
                            Anuluj
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 text-sm font-semibold text-slate-900">Platnosc</div>
                    <div className="mt-3 grid gap-2">
                      <label className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200/70 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            className="accent-emerald-600"
                            checked={payment === "card"}
                            onChange={() => setPayment("card")}
                            disabled={busy}
                          />
                          <div>
                            <div className="text-sm font-medium text-slate-900">Karta</div>
                            <div className="text-xs text-slate-500">Platnosc karta online</div>
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200/70 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            className="accent-emerald-600"
                            checked={payment === "transfer"}
                            onChange={() => setPayment("transfer")}
                            disabled={busy}
                          />
                          <div>
                            <div className="text-sm font-medium text-slate-900">Przelew</div>
                            <div className="text-xs text-slate-500">Szybki przelew online</div>
                          </div>
                        </div>
                      </label>

                      <div className="mt-2 rounded-xl bg-white p-4 ring-1 ring-slate-200/70 opacity-60">
                        <div className="text-sm font-medium text-slate-900">Apple Pay</div>
                        <div className="text-xs text-slate-500">Pracujemy nad tym, dostepne wkrotce.</div>
                      </div>

                      <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200/70 opacity-60">
                        <div className="text-sm font-medium text-slate-900">Google Pay</div>
                        <div className="text-xs text-slate-500">Pracujemy nad tym, dostepne wkrotce.</div>
                      </div>

                      <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200/70 opacity-60">
                        <div className="text-sm font-medium text-slate-900">PayPo</div>
                        <div className="text-xs text-slate-500">Pracujemy nad tym, dostepne wkrotce.</div>
                      </div>

                      <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200/70 opacity-60">
                        <div className="text-sm font-medium text-slate-900">Klarna</div>
                        <div className="text-xs text-slate-500">Pracujemy nad tym, dostepne wkrotce.</div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setStep("cart")}
                        className="h-11 rounded-xl px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-white"
                        disabled={busy}
                      >
                        Wstecz
                      </button>

                      <button
                        type="button"
                        onClick={payAndCreateRental}
                        className="h-11 flex-1 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-60"
                        disabled={busy}
                      >
                        {busy ? "Przetwarzanie..." : `Zaplac i wypożycz (${pln(totalWithDelivery)})`}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 shadow-sm">
                    <div className="text-sm font-semibold text-slate-900">Podsumowanie</div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/60">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Wypożyczony sprzęt</span>
                        <span className="font-semibold text-slate-900">{pln(itemTotals.rentalTotal)}</span>
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <span className="text-slate-600">Kaucja</span>
                        <span className="font-semibold text-slate-900">{pln(itemTotals.deposit)}</span>
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <span className="text-slate-600">Dostawa</span>
                        <span className="font-semibold text-slate-900">{pln(chosenDelivery.price)}</span>
                      </div>
                      <div className="mt-3 flex justify-between text-sm">
                        <span className="text-slate-600">Razem</span>
                        <span className="text-base font-semibold text-slate-900">{pln(totalWithDelivery)}</span>
                      </div>

                      <div className="mt-3 text-xs text-slate-600">
                        Zakres:{" "}
                        <span className="font-medium text-slate-900">
                          {itemTotals.range.startDate} do {itemTotals.range.endDate}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-slate-500">
                      Platnosc: {payment === "card" ? "Karta" : "Przelew"} | Dostawa: {chosenDelivery.label} ({chosenDelivery.eta})
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}