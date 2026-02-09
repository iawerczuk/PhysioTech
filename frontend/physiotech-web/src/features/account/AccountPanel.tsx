import { useEffect, useState } from "react";
import { apiLogin, apiMe, apiRegister, clearToken, getToken, setToken } from "../../api";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AccountPanel({ open, onClose }: Props) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");
  const [accept, setAccept] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [meEmail, setMeEmail] = useState<string | null>(null);

  async function refreshMe() {
    const token = getToken();
    if (!token) {
      setMeEmail(null);
      return;
    }
    try {
      const me = await apiMe();
      setMeEmail(me.email ?? "Zalogowano");
    } catch {
      setMeEmail(null);
    }
  }

  useEffect(() => {
    if (open) refreshMe();
  }, [open]);

  if (!open) return null;

  async function onLogin() {
    setError(null);
    setBusy(true);
    try {
      const res = await apiLogin(loginEmail.trim(), loginPassword);
      setToken(res.token);
      await refreshMe();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function onRegister() {
    setError(null);

    const email = regEmail.trim();
    if (!email) return setError("Podaj email.");
    if (regPassword.length < 6) return setError("Hasło musi mieć min. 6 znaków.");
    if (regPassword !== regPassword2) return setError("Hasła nie są takie same.");
    if (!accept) return setError("Zaznacz akceptację regulaminu.");

    setBusy(true);
    try {
      const res = await apiRegister(email, regPassword);
      setToken(res.token);
      await refreshMe();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function onLogout() {
    clearToken();
    setMeEmail(null);
  }

  return (
    <section className="mb-10 rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Konto</h2>
          <p className="mt-1 text-sm text-slate-600">
            Zaloguj się lub załóż konto, aby rozpocząć wypożyczenie.
          </p>

          {meEmail && (
            <p className="mt-2 text-sm">
              Zalogowana jako: <span className="font-medium">{meEmail}</span>
              <button
                type="button"
                onClick={onLogout}
                className="ml-3 rounded-full px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              >
                Wyloguj
              </button>
            </p>
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

      {error && (
        <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      )}

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
              disabled={busy}
            />
            <input
              className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
              placeholder="Hasło"
              type="password"
              autoComplete="current-password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              disabled={busy}
            />

            <button
              className="h-11 rounded-xl bg-[#102363] text-white font-medium hover:opacity-95 disabled:opacity-60"
              type="submit"
              disabled={busy}
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
            <input
              className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
              placeholder="Email"
              autoComplete="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              disabled={busy}
            />
            <input
              className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
              placeholder="Hasło"
              type="password"
              autoComplete="new-password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              disabled={busy}
            />
            <input
              className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
              placeholder="Powtórz hasło"
              type="password"
              autoComplete="new-password"
              value={regPassword2}
              onChange={(e) => setRegPassword2(e.target.value)}
              disabled={busy}
            />

            <label className="text-xs text-slate-600 flex gap-2 items-start">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={accept}
                onChange={(e) => setAccept(e.target.checked)}
                disabled={busy}
              />
              <span>
                Akceptuję regulamin i politykę prywatności oraz zapoznałam się z zasadami dostawy i zwrotu.
              </span>
            </label>

            <button
              className="h-11 rounded-xl bg-emerald-600 text-white font-medium hover:opacity-95 disabled:opacity-60"
              type="submit"
              disabled={busy}
            >
              Załóż konto
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}