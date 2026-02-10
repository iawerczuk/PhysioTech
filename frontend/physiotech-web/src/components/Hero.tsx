import heroLogo from "../assets/logon.png";

export default function Hero() {
  return (
    <section id="top" className="mt-10">
      <div className="rounded-3xl bg-white p-10 ring-1 ring-slate-200/70 shadow-sm">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200/60">
              Sprzęt rehabilitacyjny online
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-[1.08]">
              <span className="block">Twoja determinacja.</span>
              <span className="block text-[#102363]">Nasza technologia.</span>
              <span className="block text-emerald-600">Wspólny cel.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600">
              Wypożycz profesjonalny sprzęt ortopedyczny sprawdzony w praktyce
              klinicznej. Skróć drogę do zdrowia dzięki technologii, której ufają
              fizjoterapeuci.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="#sprzet"
                className="
                  h-11 rounded-full bg-emerald-600 px-6
                  inline-flex items-center justify-center
                  text-sm font-medium text-white
                  transition hover:bg-emerald-700
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2
                  whitespace-nowrap
                "
              >
                Wybierz technologię
              </a>

              <a
                href="#jak-to-dziala"
                className="
                  h-11 rounded-full bg-white px-6
                  inline-flex items-center justify-center
                  text-sm font-medium text-slate-800
                  ring-1 ring-slate-200
                  transition hover:bg-slate-50
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#102363] focus-visible:ring-offset-2
                  whitespace-nowrap
                "
              >
                Jak to działa
              </a>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img
              src={heroLogo}
              alt="PhysioTech"
              className="h-44 w-auto object-contain drop-shadow-sm lg:-mr-6"
            />
          </div>
        </div>
      </div>
    </section>
  );
}