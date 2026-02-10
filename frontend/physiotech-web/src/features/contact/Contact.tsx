import { useMemo, useState } from "react";

type FormState = {
  name: string;
  email: string;
  message: string;
  consent: boolean;
};

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
    consent: false,
  });

  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    name: false,
    email: false,
    message: false,
    consent: false,
  });

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [busy, setBusy] = useState(false);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) e.name = "Podaj imię i nazwisko.";
    if (!form.email.trim()) e.email = "Podaj e mail.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      e.email = "Podaj poprawny e mail.";

    if (!form.message.trim()) e.message = "Wpisz wiadomość.";
    else if (form.message.trim().length < 10)
      e.message = "Wiadomość jest za krótka.";

    if (!form.consent)
      e.consent = "Zgoda jest wymagana, aby wysłać formularz.";

    return e;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function markTouched<K extends keyof FormState>(key: K) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);

    setTouched({
      name: true,
      email: true,
      message: true,
      consent: true,
    });

    if (hasErrors) return;

    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 500));

      setForm({ name: "", email: "", message: "", consent: false });
      setTouched({ name: false, email: false, message: false, consent: false });
      setSubmitAttempted(false);
      alert("Wiadomość wysłana.");
    } finally {
      setBusy(false);
    }
  }

  const showError = <K extends keyof FormState>(key: K) =>
    (touched[key] || submitAttempted) && !!errors[key];

  return (
    <section id="kontakt" className="mt-16 scroll-mt-24">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-semibold">Kontakt</h2>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
          <div className="grid gap-7">
            <div>
              <div className="text-sm text-slate-500">E mail</div>
              <a
                className="mt-2 block text-lg font-semibold text-slate-900 hover:underline"
                href="mailto:kontakt@physiotech.pl"
              >
                kontakt@physiotech.pl
              </a>
            </div>

            <div className="h-px bg-slate-200/70" />

            <div>
              <div className="text-sm text-slate-500">Godziny</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">
                Pon - Pt 9:00 - 19:00
              </div>
            </div>

            <div className="h-px bg-slate-200/70" />

            <div>
              <div className="text-sm text-slate-500">Dostawa i zwrot</div>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Wysyłka kurierem na terenie Polski.<br></br> Zwrot w paczce zwrotnej.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-sm">
          <h3 className="font-medium">Napisz do nas</h3>

          {submitAttempted && hasErrors && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
              Pola kontaktowe i zgoda są wymagane.
            </div>
          )}

          <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
            <div>
              <input
                className={[
                  "h-11 w-full rounded-xl px-4 bg-white ring-1",
                  showError("name") ? "ring-red-300" : "ring-slate-200",
                ].join(" ")}
                placeholder="Imię i nazwisko"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                onBlur={() => markTouched("name")}
                disabled={busy}
              />
              {showError("name") && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                className={[
                  "h-11 w-full rounded-xl px-4 bg-white ring-1",
                  showError("email") ? "ring-red-300" : "ring-slate-200",
                ].join(" ")}
                placeholder="E mail"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={() => markTouched("email")}
                disabled={busy}
              />
              {showError("email") && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <textarea
                className={[
                  "min-h-[120px] w-full rounded-xl px-4 py-3 bg-white ring-1 resize-y",
                  showError("message") ? "ring-red-300" : "ring-slate-200",
                ].join(" ")}
                placeholder="Wiadomość"
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                onBlur={() => markTouched("message")}
                disabled={busy}
              />
              {showError("message") && (
                <p className="mt-1 text-xs text-red-600">{errors.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs text-slate-600 flex gap-2 items-start">
                <input
                  type="checkbox"
                  className={[
                    "mt-0.5",
                    showError("consent")
                      ? "accent-red-600"
                      : "accent-emerald-600",
                  ].join(" ")}
                  checked={form.consent}
                  onChange={(e) => setField("consent", e.target.checked)}
                  onBlur={() => markTouched("consent")}
                  disabled={busy}
                />
                <span>
                  Wyrażam zgodę na przetwarzanie danych w celu udzielenia
                  odpowiedzi na zapytanie.
                </span>
              </label>

              {showError("consent") && (
                <p className="mt-1 text-xs text-red-600">{errors.consent}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="h-11 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-60"
            >
              Wyślij wiadomość
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}