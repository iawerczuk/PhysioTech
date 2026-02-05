export default function Contact() {
  return (
    <section id="kontakt" className="mt-14 mb-6 scroll-mt-24">
      <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
        <h2 className="text-xl font-semibold">Kontakt</h2>
        <p className="mt-2 text-sm text-slate-600">
          Tu dodamy formularz kontaktowy. Na razie placeholder.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/60">
            <div className="text-xs text-slate-500">E-mail</div>
            <div className="mt-1 font-medium">kontakt@physiotech.pl</div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/60">
            <div className="text-xs text-slate-500">Godziny</div>
            <div className="mt-1 font-medium">Pon - Pt 9:00 - 17:00</div>
          </div>
        </div>
      </div>
    </section>
  );
}