# PhysioTech

**System internetowy wspierający wypożyczanie nowoczesnego sprzętu rehabilitacyjnego.**

---

## Opis projektu

PhysioTech to aplikacja webowa umożliwiająca użytkownikom przeglądanie dostępnego sprzętu rehabilitacyjnego oraz jego wypożyczanie w trybie online. System został zaprojektowany z myślą o klientach oraz placówkach medycznych, które potrzebują szybkiego dostępu do specjalistycznych urządzeń wspomagających proces rekonwalescencji.

Projekt stanowi połączenie inżynierii oprogramowania z praktyką kliniczną i został zrealizowany jako część pracy dyplomowej.

---

## Główne funkcjonalności

* **Autoryzacja:** Rejestracja i logowanie użytkowników (mechanizm JWT).
* **Katalog:** Przegląd dostępnego sprzętu rehabilitacyjnego wraz ze szczegółami ofert.
* **Koszyk:** Dynamiczne dodawanie urządzeń i konfiguracja parametrów najmu.
* **Proces zamówienia:** Wybór okresu wypożyczenia, adresu dostawy oraz metody płatności.
* **Zarządzanie:** Podgląd historii wypożyczeń w panelu użytkownika.
* **Komunikacja:** Pełne wsparcie REST API (format JSON).
* **Testy:** Weryfikacja logiki backendowej (xUnit) oraz endpointów (Postman).

---

## Architektura systemu

Aplikacja opiera się na architekturze trójwarstwowej:

1.  **Frontend:** Interfejs użytkownika (React + TypeScript).
2.  **Backend:** Logika biznesowa (ASP.NET Core Web API).
3.  **Baza danych:** Przechowywanie danych w SQLite, z możliwością przyszłej migracji do PostgreSQL.
---

## Technologie

### Backend
* **Framework:** ASP.NET Core Web API (C#)
* **ORM:** Entity Framework Core
* **Security:** ASP.NET Identity, JWT (JSON Web Token)

### Frontend
* **Biblioteka:** React
* **Język:** TypeScript
* **Narzędzia:** Vite, React Router, Tailwind CSS

### Infrastruktura i Narzędzia
* **Baza danych:** SQLite (środowisko deweloperskie)
* **Testy:** xUnit, Postman
* **Kontrola wersji:** Git / GitHub

---

## Uruchomienie projektu

### Backend
```bash
cd backend
dotnet restore
dotnet run

```

*API będzie dostępne pod adresem: `https://localhost:5001*`

### Frontend

```bash
cd frontend
npm install
npm run dev

```

*Aplikacja będzie dostępna pod adresem: `http://localhost:5173*`

### Testy

```bash
dotnet test

```

---

## Zakres implementacji

W ramach projektu zrealizowano kluczowe moduły systemu:

* Kompletny mechanizm uwierzytelniania.
* Interaktywny katalog sprzętu z systemem kaucji.
* Logikę procesu wypożyczenia (checkout).
* Panel historii zamówień.

*Elementy takie jak integracja z bramkami płatności oraz automatyzacja logistyki kurierskiej zostały opracowane na poziomie projektowym i stanowią kierunek dalszego rozwoju.*

---

## Bezpieczeństwo

* Szyfrowanie haseł przy użyciu **ASP.NET Identity**.
* Autoryzacja operacji za pomocą tokenów **JWT**.
* Zabezpieczona komunikacja protokołem **HTTPS**.
* Pełna walidacja danych wejściowych po stronie serwera.

---

## Możliwości rozwoju

* Wdrożenie pełnej obsługi płatności elektronicznych.
* Integracja z API firm kurierskich (śledzenie przesyłek).
* System powiadomień e-mail/SMS o statusie zamówienia.
* Rozbudowany moduł administracyjny do zarządzania magazynem.
* Migracja bazy danych do środowiska produkcyjnego (PostgreSQL/Azure SQL).

---

**Autor:** *Projekt wykonany jako część pracy dyplomowej.*

```
```
