import { useMemo, useState } from "react";
import type { Step } from "../../types";

type Props = { steps: Step[] };

export default function HowItWorks({ steps }: Props) {
  const [active, setActive] = useState(0);

  const safeActive = useMemo(() => {
    if (!steps.length) return 0;
    if (active < 0) return 0;
    if (active >= steps.length) return steps.length - 1;
    return active;
  }, [active, steps.length]);

  const activeStep = steps[safeActive];

  return (
    <section id="jak-to-dziala" className="mt-14 scroll-mt-24">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-semibold">Jak to działa</h2>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        {steps.map((s, i) => {
          const isActive = i === safeActive;

          return (
            <div key={s.title} className="relative group h-full">
              <div
                className="
                  pointer-events-none
                  absolute -top-10 left-1/2 -translate-x-1/2
                  rounded-lg bg-slate-900 px-3 py-1.5
                  text-xs text-white
                  opacity-0 scale-95
                  transition
                  group-hover:opacity-100 group-hover:scale-100
                  whitespace-nowrap
                  shadow-lg
                "
              >
                Kliknij, aby zobaczyć szczegóły
              </div>

              <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className={[
                      "h-full min-h-[220px] w-full text-left rounded-2xl p-6 ring-1 shadow-sm transition-colors duration-200",
                      isActive
                        ? "bg-[#102363] text-white ring-[#102363]"
                        : "bg-white text-slate-900 ring-slate-200/70",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "h-10 w-10 rounded-full flex items-center justify-center font-semibold ring-1",
                        isActive
                          ? "bg-white/15 text-white ring-white/20"
                          : "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
                      ].join(" ")}
                    >
                      {i + 1}
                    </div>

  <h3 className="mt-4 font-medium text-lg">{s.title}</h3>

  <p className={["mt-2 text-sm", isActive ? "text-white/90" : "text-slate-600"].join(" ")}>
    {s.desc}
  </p>
</button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
        {!activeStep ? (
          <p className="text-sm text-slate-600">Brak kroków do wyświetlenia.</p>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {safeActive + 1}. {activeStep.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{activeStep.desc}</p>
              </div>

              <span className="text-xs text-slate-500">
                Krok {safeActive + 1} z {steps.length}
              </span>
            </div>

            <ul className="mt-4 list-disc pl-5 text-sm text-slate-700 space-y-1">
              {activeStep.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}