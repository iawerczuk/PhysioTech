export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <a href="#top" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-slate-900" />
          <div className="leading-tight">
            <div className="text-sm font-semibold">PhysioTech</div>
            <div className="text-xs text-slate-500">wypożyczalnia online</div>
          </div>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
          <a className="hover:text-slate-900" href="#about">O nas</a>
          <a className="hover:text-slate-900" href="#how">Jak to działa</a>
          <a className="hover:text-slate-900" href="#devices">Sprzęt</a>
          <a className="hover:text-slate-900" href="#faq">FAQ</a>
          <a className="hover:text-slate-900" href="#contact">Kontakt</a>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href="#devices"
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
          >
            Sprawdź ofertę
          </a>

          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 hover:bg-slate-50"
            aria-label="Profil"
            title="Profil"
          >
            <span className="text-sm">👤</span>
          </button>
        </div>
      </div>
    </header>
  );
}