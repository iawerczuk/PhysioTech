const categories = [
  "Elektrostymulatory",
  "iWalk",
  "Reboots",
  "GameReady",
  "Inne",
];

export function Categories() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Sprzęt</h2>

        <div className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          {categories.map((c) => (
            <button
              key={c}
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-100"
              type="button"
            >
              {c}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-600">
Filtr</p>
      </div>
    </section>
  );
}