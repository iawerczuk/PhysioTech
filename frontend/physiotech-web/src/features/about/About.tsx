export default function About() {
  return (
    <section id="o-nas" className="mt-14 scroll-mt-24">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-semibold">O nas</h2>
      </div>

      <h3 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight leading-[1.25]">
        <span className="block text-[#102363]">
          Wiedza medyczna wsparta technologią.
        </span>
        <span className="block text-emerald-600">
          Praktyka poparta doświadczeniem.
        </span>
      </h3>

      <div className="mt-6 max-w-4xl text-slate-600 leading-relaxed">
        <p>
          <span className="font-semibold text-[#102363]">Physio</span>
          <span className="font-semibold text-emerald-600">Tech</span>{" "}
          powstało z prostej obserwacji: determinacja pacjenta to połowa sukcesu,
          ale drugą są odpowiednie narzędzia. Po latach pracy w rehabilitacji
          ortopedycznej wiem, że dostęp do nowoczesnych technologii w domu to
          jedna z najszybszych dróg do sprawności.
        </p>

        <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
          <p className="text-base text-slate-800 leading-relaxed">
            Wierzę, że technologia nie jest celem samym w sobie, lecz sprawdzonym narzędziem
            w rękach specjalisty.
          </p>
        </div>

        <p className="mt-6">
        Zyskaj dostęp do technologii, które osobiście wykorzystuję w profesjonalnej opiece nad pacjentami. Stawiam na zaawansowane 
        rozwiązania przyspieszające odnowę biologiczną, aby Twój powrót do sprawności był maksymalnie efektywny i komfortowy.</p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 ring-1 ring-emerald-200/60 flex items-center justify-center">
              <span className="text-emerald-700 font-semibold">✓</span>
            </div>
            <div className="text-sm font-semibold text-slate-900">
              Jasne zasady
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
           Proste rozliczenia to komfort i spokojna głowa. Dzięki przejrzystej stawce dobowej oraz zwrotnej kaucji możesz w pełni skoncentrować 
           się na tym, co dla Ciebie najważniejsze – na regeneracji oraz skutecznym powrocie do pełnej sprawności. </p>
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-50 ring-1 ring-slate-200/60 flex items-center justify-center">
              <span className="text-[#102363] font-semibold">⏱</span>
            </div>
            <div className="text-sm font-semibold text-slate-900">
              Czas na Twoją odnowę
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
           Twoja odnowa biologiczna zaczyna się tutaj. Intuicyjny proces zamówienia online sprawia, że profesjonalne wsparcie 
           trafia do Ciebie błyskawicznie, zapewniając Twojemu organizmowi optymalne warunki do regeneracji już od pierwszego dnia. </p>
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
            Korzystasz z rozwiązań, którym ufają profesjonaliści. Sprzęt został starannie wyselekcjonowany przez fizjoterapeutę ortopedycznego,
             co gwarantuje Ci dostęp do bezpiecznej i najskuteczniejszej technologii stosowanej w nowoczesnej rehabilitacji.
             </p>
        </div>
      </div>
    </section>
  );
}