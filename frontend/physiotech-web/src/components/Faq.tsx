import { useState } from "react";

const items = [
  {
    q: "Jak mogę wypożyczyć sprzęt?",
    a: "Zarejestruj konto, zaloguj się, wybierz sprzęt, ustaw daty i potwierdź wypożyczenie.",
  },
  {
    q: "Czy mogę przedłużyć wypożyczenie?",
    a: "Tak. Docelowo będzie to opcja w panelu użytkownika, z automatycznym przeliczeniem kosztów.",
  },
  {
    q: "Jakie metody płatności akceptujecie?",
    a: "Na etapie MVP mamy proces mock. Później dojdą szybkie płatności i BLIK.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">FAQ</h2>

        <div className="mt-6 space-y-3">
          {items.map((it, idx) => {
            const isOpen = open === idx;
            return (
              <div key={it.q} className="rounded-2xl border border-slate-200 bg-white">
                <button
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? null : idx)}
                  type="button"
                >
                  <span className="text-sm font-semibold text-slate-900">{it.q}</span>
                  <span className="text-slate-500">{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
                    {it.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}