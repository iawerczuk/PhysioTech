import { useMemo, useState } from "react";
import iaLogo from "../assets/ia.png";
import Legal from "./Legal";

type LegalDoc = "none" | "terms" | "privacy";

export default function Footer() {
  const year = new Date().getFullYear();
  const [openDoc, setOpenDoc] = useState<LegalDoc>("none");

  const title = openDoc === "terms"
    ? "Regulamin"
    : openDoc === "privacy"
    ? "Polityka prywatności"
    : "";

  const terms = useMemo(
    () => (
      <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
        <div>
          <h4 className="font-semibold text-slate-900">1. Informacje ogólne</h4>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Serwis: PhysioTech, wypożyczalnia nowoczesnego sprzętu rehabilitacyjnego online.</li>
            <li>Usługodawca: PhysioTech.</li>
            <li>Kontakt: kontakt@physiotech.pl.</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">2. Konto i rejestracja</h4>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Do złożenia zamówienia wymagane jest konto klienta.</li>
            <li>Użytkownik podaje prawdziwe dane i dba o poufność hasła.</li>
            <li>Usługodawca może zablokować konto w razie nadużyć lub naruszeń regulaminu.</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">3. Wypożyczenie</h4>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Wypożyczenie obejmuje okres od daty startu do daty zakończenia wskazanej w zamówieniu.</li>
            <li>Warunkiem jest dostępność sprzętu oraz opłacenie należności i kaucji.</li>
            <li>Kaucja ma charakter zwrotny, po rozliczeniu stanu sprzętu.</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">4. Dostawa i zwrot</h4>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Sposób dostawy: kurier.</li>
            <li>Zwrot w terminie wskazanym w zamówieniu, w stanie niepogorszonym ponad normalne zużycie.</li>
            <li>W przypadku uszkodzeń, koszty naprawy mogą zostać potrącone z kaucji.</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">5. Płatności</h4>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Metody płatności: BLIK / karta / Apple Pay / Google Pay (docelowo).</li>
            <li>Aktualnie w projekcie płatności mogą działać w trybie testowym.</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">6. Reklamacje</h4>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Reklamacje można zgłaszać mailowo.</li>
            <li>Opis: numer zamówienia, opis problemu, zdjęcia jeśli potrzebne.</li>
            <li>Odpowiedź w terminie do 14 dni.</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">7. Postanowienia końcowe</h4>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Regulamin może być aktualizowany, a zmiany będą publikowane w serwisie.</li>
            <li>W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego.</li>
          </ul>
        </div>
      </div>
    ),
    []
  );

  const privacy = useMemo(
    () => (
      <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
        <p className="italic">
          Polityka prywatności. Do użytku produkcyjnego wymaga dopasowania do realnych procesów i konsultacji.
        </p>

        <div>
          <h4 className="font-semibold text-slate-900">1. Administrator danych</h4>
          <p className="mt-1">
            Administratorem danych jest PhysioTech, kontakt: kontakt@physiotech.pl.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">2. Jakie dane zbieramy</h4>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Konto: e-mail, hasło (zaszyfrowane), identyfikator użytkownika.</li>
            <li>Zamówienia: wybrane urządzenia, terminy, statusy.</li>
            <li>Kontakt: treść wiadomości, e-mail nadawcy.</li>
            <li>Dane techniczne: logi bezpieczeństwa, dane diagnostyczne (minimalnie).</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">3. Cele i podstawy przetwarzania</h4>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Realizacja umowy wypożyczenia.</li>
            <li>Obsługa konta i logowania.</li>
            <li>Kontakt i obsługa zgłoszeń.</li>
            <li>Bezpieczeństwo serwisu (np. zapobieganie nadużyciom).</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">4. Przechowywanie danych</h4>
          <p className="mt-1">
            Dane przechowujemy przez czas niezbędny do realizacji usługi i obowiązków prawnych. Logi bezpieczeństwa mogą być przechowywane krócej.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">5. Odbiorcy danych</h4>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Dostawcy hostingu i infrastruktury.</li>
            <li>Dostawcy płatności (docelowo).</li>
            <li>Firmy kurierskie (docelowo).</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">6. Prawa użytkownika</h4>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Dostęp do danych, sprostowanie, usunięcie lub ograniczenie.</li>
            <li>Sprzeciw oraz przenoszenie danych.</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">7. Cookies</h4>
          <p className="mt-1">
            Serwis może używać cookies technicznych. Token logowania jest przechowywany w Local Storage jako <span className="font-medium text-slate-900">pt_access_token</span>.
          </p>
        </div>
      </div>
    ),
    []
  );

  return (
    <>
      <footer className="mt-16 border-t border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            
            {/* Logo i Copyright */}
            <div className="flex items-center gap-4 text-sm tracking-tight">
              <div className="flex items-center gap-2.5">
                <img
                  src={iaLogo}
                  alt="PhysioTech"
                  className="h-8 w-auto object-contain brightness-95 grayscale-[20%] hover:grayscale-0 transition-all"
                />
                <span className="font-bold text-slate-800">PhysioTech</span>
              </div>
              <span className="hidden h-4 w-px bg-slate-200 sm:block" /> 
              <span className="text-slate-500 font-medium">© {year}</span>
            </div>

            {/* Przyciski */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpenDoc("terms")}
                className="rounded-full px-5 py-2 text-[13px] font-semibold text-slate-600 ring-1 ring-slate-200 transition-all duration-200 hover:bg-slate-50 hover:text-[#102363] hover:ring-slate-300 active:scale-95"
              >
                Regulamin
              </button>

              <button
                type="button"
                onClick={() => setOpenDoc("privacy")}
                className="rounded-full px-5 py-2 text-[13px] font-semibold text-slate-600 ring-1 ring-slate-200 transition-all duration-200 hover:bg-slate-50 hover:text-[#102363] hover:ring-slate-300 active:scale-95"
              >
                Polityka prywatności
              </button>
            </div>
          </div>
        </div>
      </footer>

      <Legal
        open={openDoc !== "none"}
        title={title}
        onClose={() => setOpenDoc("none")}
      >
        {openDoc === "terms" ? terms : openDoc === "privacy" ? privacy : null}
      </Legal>
    </>
  );
}