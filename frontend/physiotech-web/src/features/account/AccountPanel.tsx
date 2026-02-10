import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AccountPanel({ open, onClose }: Props) {
  const { user, login, registerAndLogin, logout, refreshMe } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");
  const [accept, setAccept] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) refreshMe();
  }, [open, refreshMe]);

  async function onLogin() {
    setError(null);
    setBusy(true);
    try {
      await login(loginEmail.trim(), loginPassword);
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
    if (regPassword.length < 8) return setError("Hasło musi mieć min. 8 znaków.");
    if (regPassword !== regPassword2) return setError("Hasła nie są takie same.");
    if (!accept) return setError("Zaznacz akceptację regulaminu.");

    setBusy(true);
    try {
      await registerAndLogin(email, regPassword);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/10"
        aria-label="Zamknij panel konta"
      />

      <div className="absolute inset-x-0 top-16">
        <div className="mx-auto max-w-6xl px-6">
          <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Konto</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Zaloguj się lub załóż konto, aby rozpocząć wypożyczenie.
                </p>

                {user && (
                  <p className="mt-2 text-sm">
                    Zalogowana jako: <span className="font-medium">{user.email}</span>
                    <button
                      type="button"
                      onClick={logout}
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
        </div>
      </div>
    </div>
  );
}