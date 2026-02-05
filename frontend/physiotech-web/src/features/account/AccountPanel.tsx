type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AccountPanel({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <section className="mb-10 rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Konto</h2>
          <p className="mt-1 text-sm text-slate-600">
            Zaloguj się lub załóż konto, aby rozpocząć wypożyczenie.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
        >
          Zamknij
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
          <h3 className="font-medium">Logowanie</h3>
          <form className="mt-4 grid gap-3">
            <input
              className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
              placeholder="Email"
              autoComplete="email"
            />
            <input
              className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
              placeholder="Hasło"
              type="password"
              autoComplete="current-password"
            />
            <button
              className="h-11 rounded-xl bg-[#102363] text-white font-medium hover:opacity-95"
              type="button"
            >
              Zaloguj
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
          <h3 className="font-medium">Rejestracja</h3>
          <form className="mt-4 grid gap-3">
            <input
              className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
              placeholder="Email"
              autoComplete="email"
            />
            <input
              className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
              placeholder="Hasło"
              type="password"
              autoComplete="new-password"
            />
            <input
              className="h-11 rounded-xl px-4 ring-1 ring-slate-200 bg-white"
              placeholder="Powtórz hasło"
              type="password"
              autoComplete="new-password"
            />
            <label className="text-xs text-slate-600 flex gap-2 items-start">
              <input type="checkbox" className="mt-0.5" />
              <span>
                Akceptuję regulamin i politykę prywatności oraz zapoznałam się z zasadami dostawy i zwrotu.
              </span>
            </label>
            <button
              className="h-11 rounded-xl bg-emerald-600 text-white font-medium hover:opacity-95"
              type="button"
            >
              Załóż konto
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}