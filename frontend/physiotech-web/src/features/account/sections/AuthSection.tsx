import PasswordField from "../components/PasswordField";

type Props = {
  busy: boolean;
  authError: string | null;

  loginEmail: string;
  setLoginEmail: (v: string) => void;
  loginPassword: string;
  setLoginPassword: (v: string) => void;
  onLogin: () => void;

  regFirstName: string;
  setRegFirstName: (v: string) => void;
  regLastName: string;
  setRegLastName: (v: string) => void;
  regEmail: string;
  setRegEmail: (v: string) => void;
  regPassword: string;
  setRegPassword: (v: string) => void;
  regPassword2: string;
  setRegPassword2: (v: string) => void;
  accept: boolean;
  setAccept: (v: boolean) => void;
  onRegister: () => void;
};

export default function AuthSection(p: Props) {
  return (
    <>
      {p.authError && (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
          {p.authError}
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
          <h3 className="font-medium">Logowanie</h3>

          <form
            className="mt-4 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              p.onLogin();
            }}
          >
            <input
              className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
              placeholder="Email"
              autoComplete="email"
              value={p.loginEmail}
              onChange={(e) => p.setLoginEmail(e.target.value)}
              disabled={p.busy}
            />

            <PasswordField
              value={p.loginPassword}
              onChange={p.setLoginPassword}
              placeholder="Hasło"
              autoComplete="current-password"
              disabled={p.busy}
            />

            <button
              className="h-11 rounded-xl bg-[#102363] text-white font-medium hover:opacity-95 disabled:opacity-60"
              type="submit"
              disabled={p.busy}
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
              p.onRegister();
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <input
                className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
                placeholder="Imię"
                autoComplete="given-name"
                value={p.regFirstName}
                onChange={(e) => p.setRegFirstName(e.target.value)}
                disabled={p.busy}
              />
              <input
                className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
                placeholder="Nazwisko"
                autoComplete="family-name"
                value={p.regLastName}
                onChange={(e) => p.setRegLastName(e.target.value)}
                disabled={p.busy}
              />
            </div>

            <input
              className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
              placeholder="Email"
              autoComplete="email"
              value={p.regEmail}
              onChange={(e) => p.setRegEmail(e.target.value)}
              disabled={p.busy}
            />

            <PasswordField
              value={p.regPassword}
              onChange={p.setRegPassword}
              placeholder="Hasło"
              autoComplete="new-password"
              disabled={p.busy}
            />

            <PasswordField
              value={p.regPassword2}
              onChange={p.setRegPassword2}
              placeholder="Powtórz hasło"
              autoComplete="new-password"
              disabled={p.busy}
            />

            <label className="text-xs text-slate-600 flex gap-2 items-start">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={p.accept}
                onChange={(e) => p.setAccept(e.target.checked)}
                disabled={p.busy}
              />
              <span>Akceptuję regulamin i politykę prywatności.</span>
            </label>

            <button
              className="h-11 rounded-xl bg-emerald-600 text-white font-medium hover:opacity-95 disabled:opacity-60"
              type="submit"
              disabled={p.busy}
            >
              Załóż konto
            </button>

            <div className="text-xs text-slate-500">
              Adres i dane do faktury uzupełnisz później, przed wysłaniem zamówienia.
            </div>
          </form>
        </div>
      </div>
    </>
  );
}