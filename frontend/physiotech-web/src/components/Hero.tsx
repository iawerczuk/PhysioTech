export function Hero() {
  return (
    <section id="top" className="bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 md:grid-cols-2">
        <div>
          <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Sprzęt rehabilitacyjny na wynajem
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Wypożycz nowoczesny sprzęt rehabilitacyjny i wracaj do sprawności
          </h1>

          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Rezerwujesz online, wybierasz daty i dostawę. Prosto, bez stresu, z czytelnymi kosztami.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="#devices"
              className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-600"
            >
              Sprawdź naszą ofertę
            </a>
            <a
              href="#how"
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Jak to działa
            </a>
          </div>

          <div className="mt-6 text-xs text-slate-500">
            Płatności i wysyłka będą dodane później. Teraz budujemy katalog i proces wypożyczenia.
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="grid aspect-[4/3] place-items-center rounded-2xl bg-white shadow-sm">
            <div className="text-center">
              <div className="text-sm font-semibold text-slate-800">Logo / grafika</div>
              <div className="mt-2 text-xs text-slate-500">
                Tu później podepniemy Twoją grafikę
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}