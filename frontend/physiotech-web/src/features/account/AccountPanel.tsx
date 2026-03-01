import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { apiMyRentals, apiUpdateMe } from "../../api";
import type { Cart, MyRental } from "../rentals/rentalTypes";

import { EMPTY_BILLING, type BillingErrors, type BillingForm, type Tab } from "./accountTypes";

import TabButton from "./components/TabButton";
import RentalSection from "./sections/RentalSection";
import BillingSection from "./sections/BillingSection";
import HistorySection from "./sections/HistorySection";

type Props = {
  open: boolean;
  onClose: () => void;

  cart: Cart[];
  setItemDates: (deviceId: number, startDate: string, endDate: string) => void;
  removeItem: (deviceId: number) => void;
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
  return `physiotech_account_${email}_billing`;
}

export default function AccountPanel({ open, onClose, cart, setItemDates, removeItem }: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  const { user, login, registerAndLogin, logout, refreshMe } = useAuth();

  const [tab, setTab] = useState<Tab>("wypożyczenie");

  const [busyAuth, setBusyAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");
  const [accept, setAccept] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [saveOk, setSaveOk] = useState<string | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const [billing, setBilling] = useState<BillingForm>(EMPTY_BILLING);
  const [billingErrors, setBillingErrors] = useState<BillingErrors>({});

  const [rentals, setRentals] = useState<MyRental[]>([]);
  const [rentalsBusy, setRentalsBusy] = useState(false);
  const [rentalsError, setRentalsError] = useState<string | null>(null);
  const [rentalsLoadedOnce, setRentalsLoadedOnce] = useState(false);

  useEffect(() => {
    if (open) refreshMe();
  }, [open, refreshMe]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (editMode) {
      setSaveErr(null);
      setSaveOk(null);
    }
  }, [editMode]);

  useEffect(() => {
    if (!open) return;

    if (!user) {
      setTab("wypożyczenie");
      setEditMode(false);
      setSaveOk(null);
      setSaveErr(null);
      setBillingErrors({});
      setBilling(EMPTY_BILLING);

      setAuthError(null);
      setBusyAuth(false);

      return;
    }

    setAuthError(null);
    setBusyAuth(false);

    setEditMode(false);
    setSaveOk(null);
    setSaveErr(null);
    setBillingErrors({});
    setBilling(EMPTY_BILLING);

    const key = storageKey(user.email);
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<BillingForm>;
        setBilling((prev) => ({
          ...prev,
          address: typeof parsed.address === "string" ? parsed.address : prev.address,
          city: typeof parsed.city === "string" ? parsed.city : prev.city,
          postalCode: typeof parsed.postalCode === "string" ? parsed.postalCode : prev.postalCode,
          needInvoice: typeof parsed.needInvoice === "boolean" ? parsed.needInvoice : prev.needInvoice,
          companyName: typeof parsed.companyName === "string" ? parsed.companyName : prev.companyName,
          nip: typeof parsed.nip === "string" ? parsed.nip : prev.nip,
        }));
      } catch {
      }
    }
  }, [open, user?.email]);

  useEffect(() => {
    if (!open || !user || tab !== "historia") return;

    setRentalsBusy(true);
    setRentalsError(null);

    apiMyRentals()
      .then((data) => setRentals(Array.isArray(data) ? data : []))
      .catch((e) => setRentalsError(e instanceof Error ? e.message : String(e)))
      .finally(() => {
        setRentalsBusy(false);
        setRentalsLoadedOnce(true);
      });
  }, [open, user, tab]);

  const cartSummary = useMemo(() => {
    const items = cart.map((x) => {
      const start = x.startDate ?? todayISO();
      const end = x.endDate ?? todayISO();
      const days = daysBetweenInclusive(start, end);

      const perDay = x.pricePerDay * x.quantity;
      const deposit = x.deposit * x.quantity;
      const rentalTotal = perDay * Math.max(0, days);

      return { deviceId: x.deviceId, days, perDay, deposit, rentalTotal };
    });

    const deposit = items.reduce((s, i) => s + i.deposit, 0);
    const rentalTotal = items.reduce((s, i) => s + i.rentalTotal, 0);

    return { items, deposit, rentalTotal, total: deposit + rentalTotal };
  }, [cart]);

  if (!open) return null;

  function inputCls(disabled: boolean, hasError?: boolean) {
    return [
      "h-10 w-full rounded-xl px-4 ring-1 bg-white",
      disabled ? "text-slate-500 ring-slate-200" : "text-slate-900 ring-slate-200",
      hasError ? "ring-red-300" : "",
    ].join(" ");
  }

  function validateBilling(next: BillingForm): BillingErrors {
    const e: BillingErrors = {};

    if (!next.address.trim()) e.address = "Podaj adres.";
    if (!next.city.trim()) e.city = "Podaj miasto.";
    if (!next.postalCode.trim()) e.postalCode = "Podaj kod pocztowy.";
    if (next.postalCode.trim() && !isValidPostalCode(next.postalCode)) e.postalCode = "Format: 00-000";

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

  async function onSave() {
    setSaveOk(null);
    setSaveErr(null);

    if (!user) return;

    const next: BillingForm = { ...billing, nip: normalizeNip(billing.nip) };
    const errs = validateBilling(next);
    setBillingErrors(errs);

    if (Object.keys(errs).length > 0) {
      setSaveErr("Popraw błędy w formularzu.");
      return;
    }

    try {
      localStorage.setItem(storageKey(user.email), JSON.stringify(next));

      await apiUpdateMe({
        address: next.address,
        city: next.city,
        postalCode: next.postalCode,
        needInvoice: next.needInvoice,
        companyName: next.companyName,
        nip: next.nip,
      });

      setBilling(next);
      setEditMode(false);
      setSaveOk("Zapisano.");
      await refreshMe();
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : String(e));
    }
  }

  async function onRefreshHistory() {
    setRentalsBusy(true);
    setRentalsError(null);

    try {
      const data = await apiMyRentals();
      setRentals(Array.isArray(data) ? data : []);
      setRentalsLoadedOnce(true);
    } catch (e) {
      setRentalsError(e instanceof Error ? e.message : String(e));
    } finally {
      setRentalsBusy(false);
    }
  }

  async function onLogin() {
    setAuthError(null);
    setBusyAuth(true);
    try {
      await login(loginEmail.trim(), loginPassword);
      await refreshMe();
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyAuth(false);
    }
  }

  async function onRegister() {
    setAuthError(null);

    const email = regEmail.trim();
    const firstName = regFirstName.trim();
    const lastName = regLastName.trim();

    if (!firstName) return setAuthError("Podaj imię.");
    if (!lastName) return setAuthError("Podaj nazwisko.");
    if (!email) return setAuthError("Podaj email.");
    if (regPassword.length < 8) return setAuthError("Hasło musi mieć min. 8 znaków.");
    if (regPassword !== regPassword2) return setAuthError("Hasła nie są takie same.");
    if (!accept) return setAuthError("Zaznacz akceptację regulaminu.");

    setBusyAuth(true);
    try {
      await registerAndLogin(email, regPassword);

      await apiUpdateMe({
        firstName,
        lastName,
      });

      await refreshMe();
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyAuth(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-slate-900/20" onMouseDown={onClose} aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-8">
        <div
          ref={panelRef}
          onMouseDown={(e) => e.stopPropagation()}
          className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Konto</h2>

              {user && (
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                  <div className="text-slate-900">
                    Zalogowana jako: <span className="font-medium">{user.email}</span>
                  </div>

                  <TabButton
                    active={tab === "wypożyczenie"}
                    onClick={() => {
                      setTab("wypożyczenie");
                      setEditMode(false);
                      setSaveOk(null);
                      setSaveErr(null);
                      setBillingErrors({});
                    }}
                  >
                    Wypożyczenie
                  </TabButton>

                  <TabButton
                    active={tab === "dane"}
                    onClick={() => {
                      setTab("dane");
                      setEditMode(false);
                      setSaveOk(null);
                      setSaveErr(null);
                      setBillingErrors({});
                    }}
                  >
                    Dane
                  </TabButton>

                  <TabButton
                    active={tab === "historia"}
                    onClick={() => {
                      setTab("historia");
                      setEditMode(false);
                      setSaveOk(null);
                      setSaveErr(null);
                      setBillingErrors({});
                    }}
                  >
                    Historia
                  </TabButton>

                  <TabButton
                    active={false}
                    onClick={() => {
                      logout();

                        setTab("wypożyczenie");
                      setEditMode(false);
                      setSaveOk(null);
                      setSaveErr(null);
                      setBillingErrors({});
                      setBilling(EMPTY_BILLING);

                      setLoginEmail("");
                      setLoginPassword("");
                      setRegFirstName("");
                      setRegLastName("");
                      setRegEmail("");
                      setRegPassword("");
                      setRegPassword2("");
                      setAccept(false);
                      setAuthError(null);
                    }}
                  >
                    Wyloguj
                  </TabButton>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Zamknij
            </button>
          </div>

          {authError && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
              {authError}
            </div>
          )}

          {!user && (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
                <h3 className="font-medium">Logowanie</h3>

                <form
                  className="mt-4 grid gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onLogin();
                  }}
                >
                  <input
                    className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
                    placeholder="Email"
                    autoComplete="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={busyAuth}
                  />

                  <input
                    className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
                    placeholder="Hasło"
                    type="password"
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={busyAuth}
                  />

                  <button
                    className="h-11 rounded-xl bg-[#102363] text-white font-medium hover:opacity-95 disabled:opacity-60"
                    type="submit"
                    disabled={busyAuth}
                  >
                    Zaloguj
                  </button>
                </form>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
                <h3 className="font-medium">Rejestracja</h3>

                <form
                  className="mt-4 grid gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onRegister();
                  }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
                      placeholder="Imię"
                      autoComplete="given-name"
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      disabled={busyAuth}
                    />
                    <input
                      className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
                      placeholder="Nazwisko"
                      autoComplete="family-name"
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      disabled={busyAuth}
                    />
                  </div>

                  <input
                    className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
                    placeholder="Email"
                    autoComplete="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    disabled={busyAuth}
                  />

                  <input
                    className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
                    placeholder="Hasło"
                    type="password"
                    autoComplete="new-password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    disabled={busyAuth}
                  />

                  <input
                    className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
                    placeholder="Powtórz hasło"
                    type="password"
                    autoComplete="new-password"
                    value={regPassword2}
                    onChange={(e) => setRegPassword2(e.target.value)}
                    disabled={busyAuth}
                  />

                  <label className="text-xs text-slate-600 flex gap-2 items-start">
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      checked={accept}
                      onChange={(e) => setAccept(e.target.checked)}
                      disabled={busyAuth}
                    />
                    <span>Akceptuję regulamin i politykę prywatności.</span>
                  </label>

                  <button
                    className="h-11 rounded-xl bg-emerald-600 text-white font-medium hover:opacity-95 disabled:opacity-60"
                    type="submit"
                    disabled={busyAuth}
                  >
                    Załóż konto
                  </button>

                  <div className="text-xs text-slate-500">
                    Adres i dane do faktury uzupełnisz później, przed wysłaniem zamówienia.
                  </div>
                </form>
              </div>
            </div>
          )}

          {user && tab === "wypożyczenie" && (
            <RentalSection
              cart={cart}
              setItemDates={setItemDates}
              removeItem={removeItem}
              todayISO={todayISO}
              daysBetweenInclusive={daysBetweenInclusive}
              pln={pln}
              cartSummary={{
                deposit: cartSummary.deposit,
                rentalTotal: cartSummary.rentalTotal,
                total: cartSummary.total,
              }}
            />
          )}

          {user && tab === "dane" && (
            <BillingSection
              userEmail={user.email}
              firstName={(user as any).firstName}
              lastName={(user as any).lastName}
              editMode={editMode}
              setEditMode={setEditMode}
              billing={billing}
              setField={setField}
              billingErrors={billingErrors}
              saveOk={saveOk}
              saveErr={saveErr}
              onSave={onSave}
              inputCls={inputCls}
            />
          )}

          {user && tab === "historia" && (
            <HistorySection
              rentals={rentals}
              rentalsBusy={rentalsBusy}
              rentalsError={rentalsError}
              rentalsLoadedOnce={rentalsLoadedOnce}
              onRefresh={onRefreshHistory}
              formatDate={formatDate}
              formatCreatedAt={formatCreatedAt}
            />
          )}
        </div>
      </div>
    </div>
  );
}