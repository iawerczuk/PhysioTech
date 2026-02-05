import { useState } from "react";
import { clearToken } from "./token";
import { login, register } from "./auth.api";

type Mode = "login" | "register";

export default function AuthPanel() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("test@physiotech.pl");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    if (!email.trim()) {
      setErr("Podaj e-mail.");
      return;
    }
    if (password.length < 8) {
      setErr("Hasło musi mieć min. 8 znaków.");
      return;
    }

    try {
      setBusy(true);

      if (mode === "register") {
        await register({ email, password });
        setMsg("Konto utworzone. Teraz możesz się zalogować.");
        setMode("login");
        setPassword("");
        return;
      }

      const res = await login({ email, password });
      setMsg(`Zalogowano. Token ważny do: ${new Date(res.expiresUtc).toLocaleString()}`);
      setPassword("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    clearToken();
    setMsg("Wylogowano. Token usunięty z przeglądarki.");
    setErr(null);
  }

  return (
    <section className="mt-14 scroll-mt-24" id="konto">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-semibold">Konto</h2>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { setMode("login"); setMsg(null); setErr(null); }}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              mode === "login"
                ? "bg-[#102363] text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-[#102363] hover:text-white",
            ].join(" ")}
          >
            Logowanie
          </button>

          <button
            type="button"
            onClick={() => { setMode("register"); setMsg(null); setErr(null); }}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              mode === "register"
                ? "bg-[#102363] text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-[#102363] hover:text-white",
            ].join(" ")}
          >
            Rejestracja
          </button>

          <button
            type="button"
            onClick={logout}
            className="ml-auto rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Wyloguj
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4 max-w-md">
          <label className="grid gap-1">
            <span className="text-sm text-slate-700">E-mail</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#102363]"
              placeholder="np. test@physiotech.pl"
              autoComplete="email"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-slate-700">Hasło</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#102363]"
              placeholder="min. 8 znaków"
              type="password"
              autoComplete={mode === "register" ? "new-password" : "current-password"}
            />
          </label>

          <button
            disabled={busy}
            type="submit"
            className="mt-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {busy ? "Przetwarzanie..." : mode === "register" ? "Załóż konto" : "Zaloguj"}
          </button>

          {msg && (
            <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200/60">
              {msg}
            </div>
          )}

          {err && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-200/60">
              {err}
            </div>
          )}

          <p className="text-xs text-slate-500">
            Tip: po zalogowaniu możesz sprawdzić /api/Me i /api/Rentals/me, bo token będzie wysyłany automatycznie.
          </p>
        </form>
      </div>
    </section>
  );
}