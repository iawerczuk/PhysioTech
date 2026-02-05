import logon from "../assets/logon.png";

type Props = {
  apiUrl: string;
};

export default function Hero({ apiUrl }: Props) {
  return (
    <section className="grid gap-8 lg:grid-cols-2 items-center">
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Wypożycz nowoczesny sprzęt rehabilitacyjny i odzyskaj pełną sprawność
        </h1>

        <p className="mt-4 text-slate-600">
          Prosty proces, przejrzyste ceny i szybkie zamówienie online.
        </p>

        <div className="mt-6 flex gap-3">
          <a
            href="#sprzet"
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition"
          >
            Sprawdź naszą ofertę
          </a>

          <a
            href="#jak-to-dziala"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 transition"
          >
            Jak to działa
          </a>
        </div>

        <p className="mt-6 text-xs text-slate-500">API: {apiUrl}</p>
      </div>

      <div className="rounded-2xl bg-white p-8 ring-1 ring-slate-200/70 shadow-sm">
        <div className="aspect-[4/3] rounded-xl bg-slate-50 ring-1 ring-slate-200/60 flex items-center justify-center">
          <img
            src={logon}
            alt="PhysioTech"
            className="max-h-40 w-auto object-contain opacity-90"
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-slate-600">
          <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/60">Bezpiecznie</div>
          <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/60">Szybko</div>
          <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/60">Czytelnie</div>
        </div>
      </div>
    </section>
  );
}