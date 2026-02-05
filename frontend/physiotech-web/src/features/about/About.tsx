export default function About() {
  return (
    <section id="o-nas" className="mt-14 scroll-mt-24">
      <h2 className="text-xl font-semibold">O nas</h2>

      <p className="mt-3 text-slate-600 max-w-3xl">
        PhysioTech to wypożyczalnia sprzętu rehabilitacyjnego online. Chcemy, żeby dostęp do dobrego
        sprzętu był prosty: wybierasz, zamawiasz, odbierasz i działasz.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 shadow-sm">
          <div className="text-sm text-slate-500">Przejrzyste warunki</div>
          <div className="mt-2 font-medium">Cena za dzień + kaucja</div>
        </div>

        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 shadow-sm">
          <div className="text-sm text-slate-500">Szybko</div>
          <div className="mt-2 font-medium">Zamówienie online</div>
        </div>

        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 shadow-sm">
          <div className="text-sm text-slate-500">Wsparcie</div>
          <div className="mt-2 font-medium">Kontakt i FAQ</div>
        </div>
      </div>
    </section>
  );
}