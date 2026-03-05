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

function minISO(a: string, b: string) { return a <= b ? a : b; }
function maxISO(a: string, b: string) { return a >= b ? a : b; }

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
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
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

  const deliveryOptions = useMemo(() => [
    { id: "inpost" as const, label: "Kurier InPost", price: 24, eta: "1-2 dni" },
    { id: "dhl" as const, label: "Kurier DHL", price: 19, eta: "2-3 dni" },
    { id: "dpd" as const, label: "Kurier DPD", price: 18, eta: "2-3 dni" },
  ], []);

  const chosenDelivery = useMemo(() => 
    deliveryOptions.find((x) => x.id === delivery) ?? deliveryOptions[0]
  , [delivery, deliveryOptions]);

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
    const range = items.length === 0 ? { startDate: "", endDate: "" } : items.reduce(
      (acc, it) => ({ startDate: minISO(acc.startDate, it.start), endDate: maxISO(acc.endDate, it.end) }),
      { startDate: items[0].start, endDate: items[0].end }
    );
    return { deposit, rentalTotal, total: deposit + rentalTotal, range };
  }, [cart]);

  const totalWithDelivery = itemTotals.total + (step === "checkout" ? chosenDelivery.price : 0);

  async function prefillAddressFromProfile() {
    try {
      const me = await apiMe();
      setAddrLine((me?.address ?? "").trim());
      setAddrCity((me?.city ?? "").trim());
      setAddrPostalCode((me?.postalCode ?? "").trim());
    } catch { /* ignore */ }
  }

  function validateCartDates() {
    if (!cart.length) return "Dodaj sprzęt do wypożyczenia.";
    for (const x of cart) {
      const start = x.startDate ?? todayISO();
      const end = x.endDate ?? todayISO();
      if (end < start) return "Data końca jest wcześniejsza niż start.";
      if (daysBetweenInclusive(start, end) <= 0) return "Niepoprawna liczba dni.";
    }
    return null;
  }

  async function goToCheckout() {
    const token = getToken();
    if (!token) { onRequireAuth(); return; }
    const err = validateCartDates();
    if (err) { setError(err); return; }
    if (!consent) { setError("Zaznacz akceptację regulaminu."); return; }
    setStep("checkout");
    await prefillAddressFromProfile();
  }

  function validateAddress() {
    if (!addrLine.trim()) return "Podaj ulicę i numer.";
    if (!addrCity.trim()) return "Podaj miasto.";
    if (!/^\d{2}-\d{3}$/.test(addrPostalCode.trim())) return "Kod pocztowy w formacie 00-000.";
    return null;
  }

  function toggleAltAddress() {
    const next = !altAddress;
    setAltAddress(next);
    setAddrEditing(next);
    if (!next) void prefillAddressFromProfile();
  }

  async function payAndCreateRental() {
    const errAddr = validateAddress();
    if (errAddr) { setError(errAddr); return; }
    setBusy(true);
    try {
      await apiCreateRental({
        startDate: itemTotals.range.startDate,
        endDate: itemTotals.range.endDate,
        items: cart.map((x) => ({ deviceId: x.deviceId, quantity: x.quantity })),
      });
      clearCart();
      setStep("success");
      // Panel zamknie się automatycznie po 4 sekundach, dając czas na przeczytanie info
      window.setTimeout(() => onClose(), 4000);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />
      <section ref={panelRef} className="relative w-full max-w-6xl rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {step === "success" ? "Zamówienie zrealizowane" : step === "checkout" ? "Finalizacja zamówienia" : "Wypożyczenie"}
            </h2>
            <p className="text-sm text-slate-500">
              {step === "success" ? "Dziękujemy za skorzystanie z naszych usług." : step === "checkout" ? "Sprawdź dane i zapłać." : "Dostosuj urządzenia w koszyku."}
            </p>
          </div>
          <button onClick={onClose} className="h-10 rounded-xl px-4 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">Zamknij</button>
        </div>

        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}

        <div className="mt-6 overflow-y-auto flex-1 pr-2">
          {step === "cart" && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-3">
                {cart.length === 0 ? <p className="text-slate-500">Koszyk jest pusty.</p> : cart.map((x) => (
                  <div key={x.deviceId} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/60">
                    <div className="flex justify-between font-bold text-slate-900"><span>{x.name}</span><button onClick={() => removeItem(x.deviceId)} className="text-xs text-slate-400 hover:text-red-600">Usuń</button></div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3 items-end">
                      <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-400 uppercase">Ilość</span><input type="number" min={1} value={x.quantity} onChange={(e) => setQty(x.deviceId, Math.max(1, Number(e.target.value)))} className="h-10 rounded-lg px-3 ring-1 ring-slate-200" /></div>
                      <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-400 uppercase">Start</span><input type="date" value={x.startDate ?? todayISO()} onChange={(e) => setItemDates(x.deviceId, e.target.value, x.endDate ?? todayISO())} className="h-10 rounded-lg px-3 ring-1 ring-slate-200" /></div>
                      <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-400 uppercase">Koniec</span><input type="date" value={x.endDate ?? todayISO()} onChange={(e) => setItemDates(x.deviceId, x.startDate ?? todayISO(), e.target.value)} className="h-10 rounded-lg px-3 ring-1 ring-slate-200" /></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm h-fit">
                <h3 className="font-bold mb-4">Podsumowanie</h3>
                <div className="space-y-2 text-sm border-b pb-4">
                  <div className="flex justify-between"><span>Suma najmu</span><span className="font-bold">{pln(itemTotals.rentalTotal)}</span></div>
                  <div className="flex justify-between"><span>Kaucja zwrotna</span><span className="font-bold">{pln(itemTotals.deposit)}</span></div>
                </div>
                <div className="flex justify-between py-4 text-lg font-bold"><span>Razem</span><span>{pln(itemTotals.total)}</span></div>
                <label className="flex items-start gap-2 text-xs text-slate-500 mb-4 cursor-pointer"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-emerald-600" /><span>Akceptuję regulamin serwisu.</span></label>
                <button onClick={goToCheckout} disabled={cart.length === 0 || busy} className="w-full h-12 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-50 transition shadow-lg shadow-emerald-100">Przejdź dalej</button>
              </div>
            </div>
          )}

          {step === "checkout" && (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200/60">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">1</div>
                    <h3 className="font-bold text-slate-900">Dane dostawy</h3>
                  </div>

                  <div className="bg-white rounded-xl p-5 ring-1 ring-slate-200/70 space-y-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-800">Adres dostawy</span>
                      <button type="button" onClick={toggleAltAddress} className="text-xs font-bold text-emerald-600">
                        {altAddress ? "✕ Użyj adresu z profilu" : "✎ Inny adres?"}
                      </button>
                    </div>
                    <div className="relative">
                      <label className="text-[10px] font-bold text-slate-400 absolute left-4 top-2 uppercase">Ulica i numer</label>
                      <input className="w-full pt-6 pb-2 px-4 rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-50 transition" value={addrLine} onChange={(e) => setAddrLine(e.target.value)} disabled={busy || (!addrEditing && !altAddress)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="text-[10px] font-bold text-slate-400 absolute left-4 top-2 uppercase">Miasto</label>
                        <input className="w-full pt-6 pb-2 px-4 rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-50 transition" value={addrCity} onChange={(e) => setAddrCity(e.target.value)} disabled={busy || (!addrEditing && !altAddress)} />
                      </div>
                      <div className="relative">
                        <label className="text-[10px] font-bold text-slate-400 absolute left-4 top-2 uppercase">Kod pocztowy</label>
                        <input className="w-full pt-6 pb-2 px-4 rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-50 transition" placeholder="00-000" value={addrPostalCode} onChange={(e) => setAddrPostalCode(e.target.value)} disabled={busy || (!addrEditing && !altAddress)} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-sm font-bold text-slate-800 block mb-1">Wybierz kuriera</span>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {deliveryOptions.map((o) => (
                        <label key={o.id} className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col ${delivery === o.id ? 'border-emerald-500 bg-emerald-50/30' : 'border-white bg-white hover:border-slate-200'}`}>
                          <input type="radio" name="delivery" className="sr-only" checked={delivery === o.id} onChange={() => setDelivery(o.id)} />
                          <span className="text-sm font-bold text-slate-900">{o.label}</span>
                          <span className="text-[11px] text-slate-500 mt-1">{o.eta}</span>
                          <span className="text-sm font-bold text-emerald-700 mt-2">{pln(o.price)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200/60">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">2</div>
                    <h3 className="font-bold text-slate-900">Metoda płatności</h3>
                  </div>
                  <div className="grid gap-3">
                    {(['card', 'transfer'] as const).map(p => (
                      <label key={p} className={`flex items-center gap-4 p-4 rounded-xl bg-white ring-1 transition cursor-pointer ${payment === p ? 'ring-emerald-500 shadow-md' : 'ring-slate-200 hover:ring-slate-300'}`}>
                        <input type="radio" className="accent-emerald-600 h-4 w-4" checked={payment === p} onChange={() => setPayment(p)} />
                        <span className="text-sm font-bold text-slate-900">{p === 'card' ? 'Karta płatnicza' : 'Szybki przelew'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep("cart")} className="h-12 px-8 rounded-xl font-bold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">Wstecz</button>
                  <button onClick={payAndCreateRental} disabled={busy} className="flex-1 h-12 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition disabled:opacity-50">
                    {busy ? "Przetwarzanie..." : `Zapłać i zamów: ${pln(totalWithDelivery)}`}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-1 h-fit sticky top-6">
                <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
                  <h3 className="font-bold mb-4">Podsumowanie</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-500"><span>Sprzęt</span><span>{pln(itemTotals.rentalTotal)}</span></div>
                    <div className="flex justify-between text-slate-500"><span>Kaucja</span><span>{pln(itemTotals.deposit)}</span></div>
                    <div className="flex justify-between text-slate-500"><span>Dostawa</span><span>{pln(chosenDelivery.price)}</span></div>
                    <div className="flex justify-between pt-4 text-xl font-bold border-t mt-2"><span>Razem</span><span>{pln(totalWithDelivery)}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-12 px-4">
              <div className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-sm">✓</div>
              <h2 className="text-3xl font-bold mb-4 text-slate-900">Zamówienie zostało zrealizowane!</h2>
              <div className="max-w-md mx-auto space-y-4">
                <p className="text-lg text-slate-600 leading-relaxed">
                  Płatność została pomyślnie przetworzona, a Twój sprzęt medyczny został zarezerwowany.
                </p>
                <div className="p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-100">
                  <p className="text-sm font-medium text-slate-700">
                    O dalszych krokach, statusie wysyłki oraz numerze śledzenia przesyłki będziemy Cię informować drogą mailową.
                  </p>
                </div>
                <button 
                  onClick={onClose} 
                  className="mt-6 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition"
                >
                  Zamknij to okno
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}