import type { FaqItem } from "../../types";

type Props = { items: FaqItem[] };

export function Faq({ items }: Props) {
  return (
    <section id="faq" className="mt-14 scroll-mt-24">
      <h2 className="text-xl font-semibold">FAQ</h2>

      <div className="mt-6 grid gap-4">
        {items.map((f) => (
          <details key={f.q} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
            <summary className="cursor-pointer font-medium text-slate-800">{f.q}</summary>
            <p className="mt-3 text-sm text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}