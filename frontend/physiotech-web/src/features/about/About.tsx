export default function About() {
  return (
    <section id="o-nas" className="mt-14 scroll-mt-24">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-[1.25]">
        <span className="block text-[#102363]">
          Wiedza medyczna wsparta technologią.
        </span>
        <span className="block text-emerald-600">
          Praktyka poparta doświadczeniem.
        </span>
      </h2>

      <div className="mt-6 max-w-4xl text-slate-600 leading-relaxed">
       <p>
          <span className="font-extrabold tracking-tight">
          <span className="text-[#102363]">Physio</span>
          <span className="text-emerald-600">Tech</span>
          </span>{" "}
        powstało z prostej obserwacji: determinacja pacjenta to połowa sukcesu, ale drugą są odpowiednie narzędzia.
        Po latach pracy w rehabilitacji ortopedycznej wiem, że dostęp do nowoczesnych technologii w domu to jedna z najszybszych dróg do sprawności.
        </p>

        <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
          <p className="text-base text-slate-800">
            Wierzę, że zaawansowana technologia nie jest celem samym w sobie, lecz narzędziem, które w rękach specjalisty realnie przyspiesza powrót do zdrowia.
          </p>
        </div>

        <p className="mt-6">
          Udostępniam wyłącznie sprzęt, który osobiście stosuję w pracy z
          pacjentami. Bez przypadkowych rozwiązań, tylko technologie, które
          realnie przyspieszają regenerację i pomagają wrócić do aktywności.
        </p>
      </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 ring-1 ring-emerald-200/60 flex items-center justify-center">
                  <span className="text-emerald-700 font-semibold">✓</span>
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  Transparentność
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Jasna stawka dobowa i zwrotna kaucja. Skup się na regeneracji, nie
                na zawiłych umowach.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 flex items-center justify-center">
                  <span className="text-[#102363] font-semibold">⏱</span>
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  Czas to regeneracja
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Intuicyjne zamówienie online i błyskawiczna dostawa. Skracamy formalności do minimum, abyś mógł jak najszybciej rozpocząć proces powrotu do sprawności.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 flex items-center justify-center">
                  <span className="text-[#102363] font-semibold">★</span>
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  Wybór specjalisty
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Korzystasz ze sprzętu wyselekcjonowanego przez fizjoterapeutę
                ortopedycznego. To technologia, która realnie działa.
              </p>
            </div>
          </div>
    </section>
  );
}