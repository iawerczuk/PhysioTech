import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { apiMyRentals } from "../../api";
import type { Cart, MyRental } from "../rentals/rentalTypes";

type Props = {
  cart: Cart[];
  setItemDates: (deviceId: number, startDate: string, endDate: string) => void;
};

type Tab = "wypożyczenie" | "dane" | "historia";

type BillingForm = {
  needInvoice: boolean;
  companyName: string;
  nip: string;

  firstName: string;
  lastName: string;
  email: string;

  address: string;
  city: string;
  postalCode: string;
};

type BillingErrors = Partial<Record<keyof BillingForm, string>>;

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

function formatDate(iso: string) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

function formatCreatedAt(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pl-PL");
}

function isValidPostalCode(v: string) {
  return /^\d{2}-\d{3}$/.test(v.trim());
}

function normalizeNip(v: string) {
  return v.replace(/\D/g, "");
}

function isValidNip(v: string) {
  const nip = normalizeNip(v);
  if (nip.length !== 10) return false;

  const w = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  const sum = w.reduce((acc, wi, i) => acc + wi * Number(nip[i]), 0);
  const mod = sum % 11;
  if (mod === 10) return false;
  return mod === Number(nip[9]);
}

function storageKey(email: string) {
  return `physiotech_account_${email}_billing_v2`;
}

export default function AccountDashboard({ cart, setItemDates }: Props) {
  const { user, logout, refreshMe } = useAuth();
  const isAuthed = !!user?.email;

  const [tab, setTab] = useState<Tab>("wypożyczenie");

  const [editMode, setEditMode] = useState(false);
  const [saveOk, setSaveOk] = useState<string | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const [billing, setBilling] = useState<BillingForm>({
    needInvoice: false,
    companyName: "",
    nip: "",

    firstName: "(z backendu)",
    lastName: "(z backendu)",
    email: "",

    address: "",
    city: "",
    postalCode: "",
  });
  const [billingErrors, setBillingErrors] = useState<BillingErrors>({});

  const [rentals, setRentals] = useState<MyRental[]>([]);
  const [rentalsBusy, setRentalsBusy] = useState(false);
  const [rentalsError, setRentalsError] = useState<string | null>(null);
  const [rentalsLoadedOnce, setRentalsLoadedOnce] = useState(false);

  useEffect(() => {
    if (!isAuthed) return;
    refreshMe();
  }, [isAuthed, refreshMe]);

  useEffect(() => {
    if (!isAuthed || !user) return;

    setEditMode(false);
    setSaveOk(null);
    setSaveErr(null);
    setBillingErrors({});

    setBilling((prev) => ({
      ...prev,
      email: user.email,
    }));

    const raw = localStorage.getItem(storageKey(user.email));
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<BillingForm>;
      setBilling((prev) => ({
        ...prev,
        needInvoice: typeof parsed.needInvoice === "boolean" ? parsed.needInvoice : prev.needInvoice,
        companyName: typeof parsed.companyName === "string" ? parsed.companyName : prev.companyName,
        nip: typeof parsed.nip === "string" ? parsed.nip : prev.nip,
        address: typeof parsed.address === "string" ? parsed.address : prev.address,
        city: typeof parsed.city === "string" ? parsed.city : prev.city,
        postalCode: typeof parsed.postalCode === "string" ? parsed.postalCode : prev.postalCode,
      }));
    } catch {
      // ignore
    }
  }, [isAuthed, user]);

  useEffect(() => {
    if (!isAuthed || !user) return;
    if (tab !== "historia") return;

    setRentalsBusy(true);
    setRentalsError(null);

    apiMyRentals()
      .then((data) => setRentals(Array.isArray(data) ? data : []))
      .catch((e) => setRentalsError(e instanceof Error ? e.message : String(e)))
      .finally(() => {
        setRentalsBusy(false);
        setRentalsLoadedOnce(true);
      });
  }, [isAuthed, user, tab]);

  const totals = useMemo(() => {
    const deposit = cart.reduce((s, x) => s + x.deposit * x.quantity, 0);

    const rentalTotal = cart.reduce((s, x) => {
      const start = x.startDate ?? todayISO();
      const end = x.endDate ?? todayISO();
      const days = daysBetweenInclusive(start, end);
      return s + x.pricePerDay * x.quantity * Math.max(0, days);
    }, 0);

    const total = rentalTotal + deposit;

    const sumDays = cart.reduce((s, x) => {
      const start = x.startDate ?? todayISO();
      const end = x.endDate ?? todayISO();
      const days = daysBetweenInclusive(start, end);
      return s + Math.max(0, days);
    }, 0);

    return { deposit, rentalTotal, total, sumDays };
  }, [cart]);

  if (!isAuthed || !user) return null;

  function tabBtn(active: boolean) {
    return [
      "h-10 rounded-full px-4 text-sm font-medium",
      "ring-1 transition",
      active
        ? "bg-[#102363] text-white ring-[#102363]"
        : "bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200",
    ].join(" ");
  }

  function actionBtn(active: boolean, variant: "edit" | "save") {
    if (variant === "save") {
      return [
        "h-10 rounded-full px-4 text-sm font-medium ring-1 transition",
        active
          ? "bg-emerald-600 text-white ring-emerald-600 hover:bg-emerald-700"
          : "bg-slate-100 text-slate-400 ring-slate-200 cursor-not-allowed",
      ].join(" ");
    }

    return [
      "h-10 rounded-full px-4 text-sm font-medium ring-1 transition",
      active
        ? "bg-[#102363] text-white ring-[#102363]"
        : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50",
    ].join(" ");
  }

  function inputCls(disabled: boolean, hasError?: boolean) {
    return [
      "h-11 w-full rounded-xl px-4 ring-1 bg-white",
      disabled ? "text-slate-500 ring-slate-200" : "text-slate-900 ring-slate-200",
      hasError ? "ring-red-300" : "",
    ].join(" ");
  }

  function validateBilling(next: BillingForm): BillingErrors {
    const e: BillingErrors = {};

    if (!next.address.trim()) e.address = "Podaj adres.";
    if (!next.city.trim()) e.city = "Podaj miasto.";
    if (!next.postalCode.trim()) e.postalCode = "Podaj kod pocztowy.";
    if (next.postalCode.trim() && !isValidPostalCode(next.postalCode)) {
      e.postalCode = "Format: 00-000";
    }

    if (next.needInvoice) {
      if (!next.companyName.trim()) e.companyName = "Podaj nazwę firmy.";
      if (!next.nip.trim()) e.nip = "Podaj NIP.";
      if (next.nip.trim() && !isValidNip(next.nip)) e.nip = "Nieprawidłowy NIP.";
    }

    return e;
  }

  function setField<K extends keyof BillingForm>(key: K, value: BillingForm[K]) {
    setSaveOk(null);
    setSaveErr(null);

    setBilling((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "needInvoice" && value === false) {
        next.companyName = "";
        next.nip = "";
      }

      return next;
    });
  }

  function onSave() {
    setSaveOk(null);
    setSaveErr(null);

    const next: BillingForm = {
      ...billing,
      nip: normalizeNip(billing.nip),
      email: user.email,
      firstName: billing.firstName,
      lastName: billing.lastName,
    };

    const errs = validateBilling(next);
    setBillingErrors(errs);

    if (Object.keys(errs).length > 0) {
      setSaveErr("Popraw błędy w formularzu.");
      return;
    }

    try {
      localStorage.setItem(storageKey(user.email), JSON.stringify(next));
      setBilling(next);
      setEditMode(false);
      setSaveOk("Zapisano.");
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : String(e));
    }
  }

  const lockedTitle = "Pole zablokowane. Zmiana będzie dostępna po podłączeniu danych z backendu.";

  return (
    <>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="text-slate-900">
          Zalogowana jako: <span className="font-medium">{user.email}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTab("wypożyczenie");
              setEditMode(false);
              setSaveOk(null);
              setSaveErr(null);
              setBillingErrors({});
            }}
            className={tabBtn(tab === "wypożyczenie")}
          >
            Wypożyczenie
          </button>

          <button
            type="button"
            onClick={() => {
              setTab("dane");
              setEditMode(false);
              setSaveOk(null);
              setSaveErr(null);
              setBillingErrors({});
            }}
            className={tabBtn(tab === "dane")}
          >
            Dane
          </button>

          <button
            type="button"
            onClick={() => {
              setTab("historia");
              setEditMode(false);
              setSaveOk(null);
              setSaveErr(null);
              setBillingErrors({});
            }}
            className={tabBtn(tab === "historia")}
          >
            Historia
          </button>

          <button type="button" onClick={logout} className={tabBtn(false)}>
            Wyloguj
          </button>
        </div>
      </div>

      {tab === "dane" && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditMode(true);
              setSaveOk(null);
              setSaveErr(null);
            }}
            className={actionBtn(editMode, "edit")}
          >
            Edytuj
          </button>

          <button
            type="button"
            onClick={onSave}
            className={actionBtn(editMode, "save")}
            disabled={!editMode}
          >
            Zapisz
          </button>

          {saveOk && <span className="text-sm text-emerald-700">{saveOk}</span>}
          {saveErr && <span className="text-sm text-red-700">{saveErr}</span>}
        </div>
      )}

      {tab === "wypożyczenie" && (
        <div className="mt-8 grid gap-6 lg:grid-cols-4 items-start">
          <div className="lg:col-span-2 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
            <h3 className="text-base font-semibold text-slate-900">Aktualne wypożyczenie</h3>

            <div className="mt-4 grid gap-3">
              {cart.length === 0 ? (
                <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200/70">
                  <div className="text-sm text-slate-600">Koszyk jest pusty.</div>
                </div>
              ) : (
                cart.map((x) => {
                  const start = x.startDate ?? todayISO();
                  const end = x.endDate ?? todayISO();
                  const days = daysBetweenInclusive(start, end);

                  return (
                    <div key={x.deviceId} className="rounded-xl bg-white p-4 ring-1 ring-slate-200/70">
                      <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900">{x.name}</div>
                          <div className="mt-1 text-sm text-slate-600">
                            {pln(x.pricePerDay)} / dzień, kaucja {pln(x.deposit)}
                          </div>
                          <div className="mt-2 text-sm text-slate-700">
                            Ilość: <span className="font-semibold">{x.quantity}</span>
                          </div>
                        </div>

                        <div className="shrink-0 w-[320px]">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs font-medium text-slate-500">Start</div>
                              <input
                                type="date"
                                value={start}
                                onChange={(e) => setItemDates(x.deviceId, e.target.value, end)}
                                className="mt-1 h-10 w-full rounded-xl px-3 ring-1 ring-slate-200 bg-white"
                              />
                            </div>

                            <div>
                              <div className="text-xs font-medium text-slate-500">Koniec</div>
                              <input
                                type="date"
                                value={end}
                                onChange={(e) => setItemDates(x.deviceId, start, e.target.value)}
                                className="mt-1 h-10 w-full rounded-xl px-3 ring-1 ring-slate-200 bg-white"
                              />
                            </div>
                          </div>

                          <div className="mt-2 text-xs text-slate-500">
                            Liczba dni: <span className="font-semibold text-slate-700">{days}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 shadow-sm">
            <h3 className="font-medium">Podsumowanie</h3>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/60">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Liczba dni</span>
                <span className="font-semibold text-slate-900">{cart.length ? totals.sumDays : 0}</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-600">Suma</span>
                <span className="font-semibold text-slate-900">{pln(cart.length ? totals.rentalTotal : 0)}</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-600">Kaucja</span>
                <span className="font-semibold text-slate-900">{pln(cart.length ? totals.deposit : 0)}</span>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-600">Razem</span>
                <span className="text-base font-semibold text-slate-900">{pln(cart.length ? totals.total : 0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "dane" && (
        <div className="mt-8 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
          <div className="grid gap-4 lg:grid-cols-3 items-start">
            <div className="lg:col-span-1">
              <div className="text-base font-semibold text-slate-900">Dane</div>
              <div className="mt-1 text-sm text-slate-600">
                Pola zablokowane będą edytowalne po podłączeniu backendu.
              </div>
            </div>

            <div className="lg:col-span-2 grid gap-3">
              <label className="flex items-start gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="mt-1 accent-emerald-600"
                  checked={billing.needInvoice}
                  onChange={(e) => setField("needInvoice", e.target.checked)}
                  disabled={!editMode}
                />
                <span>Potrzebuję faktury</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-medium text-slate-500">Nazwa firmy</div>
                  <input
                    className={inputCls(!editMode || !billing.needInvoice, !!billingErrors.companyName)}
                    value={billing.companyName}
                    onChange={(e) => setField("companyName", e.target.value)}
                    disabled={!editMode || !billing.needInvoice}
                    placeholder={billing.needInvoice ? "Wymagane" : "Opcjonalnie"}
                  />
                  {billingErrors.companyName && (
                    <div className="mt-1 text-xs text-red-700">{billingErrors.companyName}</div>
                  )}
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500">NIP</div>
                  <input
                    className={inputCls(!editMode || !billing.needInvoice, !!billingErrors.nip)}
                    value={billing.nip}
                    onChange={(e) => setField("nip", e.target.value)}
                    disabled={!editMode || !billing.needInvoice}
                    placeholder={billing.needInvoice ? "Wymagane" : "Opcjonalnie"}
                    inputMode="numeric"
                  />
                  {billingErrors.nip && <div className="mt-1 text-xs text-red-700">{billingErrors.nip}</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-medium text-slate-500">Imię</div>
                  <input
                    className={inputCls(true)}
                    value={billing.firstName}
                    disabled
                    title={lockedTitle}
                  />
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500">Nazwisko</div>
                  <input
                    className={inputCls(true)}
                    value={billing.lastName}
                    disabled
                    title={lockedTitle}
                  />
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-slate-500">Email</div>
                <input className={inputCls(true)} value={user.email} disabled title="Email jest stały i nie można go zmienić." />
              </div>

              <div>
                <div className="text-xs font-medium text-slate-500">Adres</div>
                <input
                  className={inputCls(!editMode, !!billingErrors.address)}
                  value={billing.address}
                  onChange={(e) => setField("address", e.target.value)}
                  disabled={!editMode}
                />
                {billingErrors.address && <div className="mt-1 text-xs text-red-700">{billingErrors.address}</div>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-medium text-slate-500">Miasto</div>
                  <input
                    className={inputCls(!editMode, !!billingErrors.city)}
                    value={billing.city}
                    onChange={(e) => setField("city", e.target.value)}
                    disabled={!editMode}
                  />
                  {billingErrors.city && <div className="mt-1 text-xs text-red-700">{billingErrors.city}</div>}
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500">Kod pocztowy</div>
                  <input
                    className={inputCls(!editMode, !!billingErrors.postalCode)}
                    value={billing.postalCode}
                    onChange={(e) => setField("postalCode", e.target.value)}
                    disabled={!editMode}
                    placeholder="00-000"
                  />
                  {billingErrors.postalCode && (
                    <div className="mt-1 text-xs text-red-700">{billingErrors.postalCode}</div>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-500">
                Edycja działa lokalnie. Zapis jest do localStorage, dopóki backend nie będzie gotowy.
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "historia" && (
        <div className="mt-8 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-semibold text-slate-900">Historia wypożyczeń</h3>

            <button
              type="button"
              onClick={() => {
                setRentalsBusy(true);
                setRentalsError(null);

                apiMyRentals()
                  .then((data) => setRentals(Array.isArray(data) ? data : []))
                  .catch((e) => setRentalsError(e instanceof Error ? e.message : String(e)))
                  .finally(() => {
                    setRentalsBusy(false);
                    setRentalsLoadedOnce(true);
                  });
              }}
              className="rounded-full px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-white"
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

                    <div className="text-xs font-medium text-slate-600">
                      {r.status ?? "Brak statusu"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}