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
      <div className="space-y-4">


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
      <div className="space-y-4">
        <p className="text-slate-600">
          Polityka prywatności. Do użytku produkcyjnego wymaga dopasowania do realnych procesów i konsultacji.
        </p>

        <div>
          <h4 className="font-semibold text-slate-900">1. Administrator danych</h4>
          <p className="mt-2">
            Administratorem danych jest PhysioTech, kontakt: kontakt@physiotech.pl.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">2. Jakie dane zbieramy</h4>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>konto: e-mail, hasło (w postaci zaszyfrowanej), identyfikator użytkownika</li>
            <li>zamówienia: wybrane urządzenia, terminy, statusy</li>
            <li>kontakt: treść wiadomości, e-mail nadawcy</li>
            <li>dane techniczne: logi bezpieczeństwa, dane diagnostyczne (minimalnie)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">3. Cele i podstawy przetwarzania</h4>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>realizacja umowy wypożyczenia</li>
            <li>obsługa konta i logowania</li>
            <li>kontakt i obsługa zgłoszeń</li>
            <li>bezpieczeństwo serwisu (np. zapobieganie nadużyciom)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">4. Przechowywanie danych</h4>
          <p className="mt-2">
            Dane przechowujemy przez czas niezbędny do realizacji usługi i obowiązków prawnych. Logi bezpieczeństwa mogą być przechowywane krócej.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">5. Odbiorcy danych</h4>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>dostawcy hostingu i infrastruktury</li>
            <li>dostawcy płatności (docelowo)</li>
            <li>firmy kurierskie (docelowo)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">6. Prawa użytkownika</h4>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>dostęp do danych</li>
            <li>sprostowanie</li>
            <li>usunięcie lub ograniczenie</li>
            <li>sprzeciw</li>
            <li>przenoszenie danych</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">7. Cookies</h4>
          <p className="mt-2">
            Serwis może używać cookies technicznych. Token logowania jest przechowywany w Local Storage jako <span className="font-medium">pt_access_token</span> (w projekcie).
          </p>
        </div>
      </div>
    ),
    []
  );

  return (
    <>
      <footer className="mt-16 border-t border-slate-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <img
                src={iaLogo}
                alt="PhysioTech"
                className="h-9 w-auto object-contain"
              />
              <span className="font-semibold text-slate-900">PhysioTech</span>
              <span className="text-slate-400">•</span>
              <span>© {year}</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <button
                type="button"
                onClick={() => setOpenDoc("terms")}
                className="rounded-full px-4 py-2 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-[#102363]"
              >
                Regulamin
              </button>

              <button
                type="button"
                onClick={() => setOpenDoc("privacy")}
                className="rounded-full px-4 py-2 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-[#102363]"
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