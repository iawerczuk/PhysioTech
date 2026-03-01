import { useEffect, useMemo, useState } from "react";
import { apiCreateRental, getToken } from "../../api";
import type { Cart } from "../rentals/rentalTypes";

type Props = {
  open: boolean;
  onClose: () => void;
  cart: Cart[];
  clearCart: () => void;
  onRequireAuth: () => void;
};

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function minISO(a: string, b: string) {
  return a <= b ? a : b;
}

function maxISO(a: string, b: string) {
  return a >= b ? a : b;
}

function computeRange(cart: Cart[]) {
  if (cart.length === 0) return { startDate: "", endDate: "" };
  const firstStart = cart[0].startDate ?? todayISO();
  const firstEnd = cart[0].endDate ?? todayISO();

  return cart.reduce(
    (acc, x) => {
      const s = x.startDate ?? todayISO();
      const e = x.endDate ?? todayISO();
      return { startDate: minISO(acc.startDate, s), endDate: maxISO(acc.endDate, e) };
    },
    { startDate: firstStart, endDate: firstEnd }
  );
}

type DeliveryForm = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryMethod: "kurier" | "odbior";
  paymentMethod: "online" | "przelew";
};

const EMPTY: DeliveryForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  deliveryMethod: "kurier",
  paymentMethod: "online",
};

function isValidPostalCode(v: string) {
  return /^\d{2}-\d{3}$/.test(v.trim());
}

export default function CheckoutPanel({ open, onClose, cart, clearCart, onRequireAuth }: Props) {
  const [form, setForm] = useState<DeliveryForm>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setErr(null);
    setOk(null);
  }, [open]);

  const range = useMemo(() => computeRange(cart), [cart]);

  function setField<K extends keyof DeliveryForm>(key: K, value: DeliveryForm[K]) {
    setErr(null);
    setOk(null);
    setForm((p) => ({ ...p, [key]: value }));
  }

  function validate(): string | null {
    if (!cart.length) return "Koszyk jest pusty.";
    if (!getToken()) return "Brak zalogowania.";

    if (!form.fullName.trim()) return "Podaj imię i nazwisko.";
    if (!form.phone.trim()) return "Podaj numer telefonu.";
    if (!form.email.trim()) return "Podaj email.";
    if (form.deliveryMethod === "kurier") {
      if (!form.address.trim()) return "Podaj adres dostawy.";
      if (!form.city.trim()) return "Podaj miasto.";
      if (!form.postalCode.trim()) return "Podaj kod pocztowy.";
      if (!isValidPostalCode(form.postalCode)) return "Kod pocztowy ma format 00-000.";
    }
    if (!range.startDate || !range.endDate) return "Brakuje dat wypożyczenia.";

    return null;
  }

  async function placeOrder() {
    setErr(null);
    setOk(null);

    const token = getToken();
    if (!token) {
      onRequireAuth();
      return;
    }

    const v = validate();
    if (v) {
      setErr(v);
      return;
    }

    setBusy(true);
    try {
      await apiCreateRental({
        startDate: range.startDate,
        endDate: range.endDate,
        items: cart.map((x) => ({
          deviceId: x.deviceId,
          quantity: x.quantity,
        })),
      });

      clearCart();

      setOk("Wypożyczenie w toku. Potwierdzenie otrzymasz mailem.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-slate-900/20" />

      <div className="relative mx-auto w-full max-w-3xl px-6 pt-10">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Dostawa i płatność</h2>
              <div className="mt-1 text-sm text-slate-600">
                Okres: <span className="font-medium">{range.startDate} do {range.endDate}</span>
              </div>
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

          {err && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
              {err}
            </div>
          )}

          {ok && (
            <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
              {ok}
            </div>
          )}

          <div className="mt-6 grid gap-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="text-xs font-medium text-slate-500">Imię i nazwisko</div>
                <input className="mt-1 h-11 w-full rounded-xl px-4 ring-1 ring-slate-200 bg-white"
                  value={form.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  disabled={busy}
                />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">Telefon</div>
                <input className="mt-1 h-11 w-full rounded-xl px-4 ring-1 ring-slate-200 bg-white"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  disabled={busy}
                />
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-500">Email</div>
              <input className="mt-1 h-11 w-full rounded-xl px-4 ring-1 ring-slate-200 bg-white"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                disabled={busy}
              />
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/60">
              <div className="text-sm font-semibold text-slate-900">Dostawa</div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setField("deliveryMethod", "kurier")}
                  className={[
                    "h-10 rounded-full px-4 text-sm font-medium ring-1 transition",
                    form.deliveryMethod === "kurier"
                      ? "bg-[#102363] text-white ring-[#102363]"
                      : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                  disabled={busy}
                >
                  Kurier
                </button>

                <button
                  type="button"
                  onClick={() => setField("deliveryMethod", "odbior")}
                  className={[
                    "h-10 rounded-full px-4 text-sm font-medium ring-1 transition",
                    form.deliveryMethod === "odbior"
                      ? "bg-[#102363] text-white ring-[#102363]"
                      : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                  disabled={busy}
                >
                  Odbiór osobisty
                </button>
              </div>

              {form.deliveryMethod === "kurier" && (
                <div className="mt-4 grid gap-3">
                  <div>
                    <div className="text-xs font-medium text-slate-500">Adres</div>
                    <input className="mt-1 h-11 w-full rounded-xl px-4 ring-1 ring-slate-200 bg-white"
                      value={form.address}
                      onChange={(e) => setField("address", e.target.value)}
                      disabled={busy}
                    />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-medium text-slate-500">Miasto</div>
                      <input className="mt-1 h-11 w-full rounded-xl px-4 ring-1 ring-slate-200 bg-white"
                        value={form.city}
                        onChange={(e) => setField("city", e.target.value)}
                        disabled={busy}
                      />
                    </div>

                    <div>
                      <div className="text-xs font-medium text-slate-500">Kod pocztowy</div>
                      <input className="mt-1 h-11 w-full rounded-xl px-4 ring-1 ring-slate-200 bg-white"
                        value={form.postalCode}
                        onChange={(e) => setField("postalCode", e.target.value)}
                        disabled={busy}
                        placeholder="00-000"
                      />
                    </div>
                  </div>
                </div>
              )}

              {form.deliveryMethod === "odbior" && (
                <div className="mt-3 text-sm text-slate-600">
                  Odbiór osobisty. Dane adresowe nie są wymagane.
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/60">
              <div className="text-sm font-semibold text-slate-900">Płatność</div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setField("paymentMethod", "online")}
                  className={[
                    "h-10 rounded-full px-4 text-sm font-medium ring-1 transition",
                    form.paymentMethod === "online"
                      ? "bg-emerald-600 text-white ring-emerald-600"
                      : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                  disabled={busy}
                >
                  Online
                </button>

                <button
                  type="button"
                  onClick={() => setField("paymentMethod", "przelew")}
                  className={[
                    "h-10 rounded-full px-4 text-sm font-medium ring-1 transition",
                    form.paymentMethod === "przelew"
                      ? "bg-emerald-600 text-white ring-emerald-600"
                      : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                  disabled={busy}
                >
                  Przelew
                </button>
              </div>

              <div className="mt-3 text-xs text-slate-600">
                W tej wersji to tylko wybór metody. Integrację płatności dołożymy potem.
              </div>
            </div>

            <button
              type="button"
              onClick={placeOrder}
              disabled={busy || !!ok}
              className="h-12 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-60"
            >
              {busy ? "Zamawiam..." : "Zamów i zapłać"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}