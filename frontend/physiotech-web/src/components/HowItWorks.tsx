const steps = [
  { title: "Zarejestruj się", desc: "Załóż konto i zaloguj się." },
  { title: "Wybierz sprzęt", desc: "Zobacz dostępność i koszty." },
  { title: "Zamów online", desc: "Wybierz daty i złóż wypożyczenie." },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Jak to działa</h2>
        <p className="mt-2 text-sm text-slate-600">
          Trzy kroki, zero kombinowania.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((s, idx) => (
            <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                  {idx + 1}
                </div>
                <div className="text-base font-semibold text-slate-900">{s.title}</div>
              </div>
              <div className="mt-3 text-sm text-slate-600">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}