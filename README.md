# Gym App - System Zarządzania Treningami

Aplikacja internetowa typu full-stack przeznaczona do planowania i monitorowania treningów, zarządzania katalogiem ćwiczeń. 
System zapewnia wysoki poziom bezpieczeństwa dzięki autoryzacji opartej na tokenach JWT (asymetryczne klucze RSA) oraz opcjonalnemu uwierzytelnianiu dwuskładnikowemu (2FA/TOTP).

---

## Spis treści

1. [Architektura i technologie](#architektura-i-technologie)
2. [Wymagania systemowe](#wymagania-systemowe)
3. [Instrukcja instalacji i uruchomienia](#instrukcja-instalacji-i-uruchomienia)
   - [Baza danych](#1-uruchomienie-bazy-danych)
   - [Backend (API)](#2-uruchomienie-serwera-backend)
   - [Frontend (Klient SPA)](#3-uruchomienie-aplikacji-frontendowej)
4. [Struktura repozytorium](#struktura-repozytorium)
5. [Kluczowe funkcjonalności](#kluczowe-funkcjonalnosci)

---

## Architektura i technologie

### Backend
* **Język i środowisko:** Java 21, Spring Boot 4
* **Warstwa danych:** Spring Data JPA, Hibernate
* **Migracje bazodanowe:** Liquibase
* **Baza danych:** PostgreSQL (konteneryzowana za pośrednictwem Docker Compose)
* **Bezpieczeństwo:** Spring Security, JWT (algorytm RSA), TOTP
* **Budowanie projektu:** Apache Maven (Maven Wrapper)

### Frontend
* **Środowisko:** Node.js, Vite
* **Framework:** React 18
* **Język programowania:** TypeScript
* **Zarządzanie zależnościami:** Yarn

---

## Wymagania systemowe

Przed przystąpieniem do instalacji należy upewnić się, że na środowisku lokalnym zainstalowane są następujące narzędzia:

* **Java Development Kit (JDK):** wersja 17 lub wyższa
* **Node.js:** wersja 18 LTS lub nowsza
* **Yarn:** wersja 1.22+
* **Docker Engine** oraz wtyczka **Docker Compose**
* **OpenSSL**

---

## Instrukcja instalacji i uruchomienia

### 1. Uruchomienie bazy danych

Projekt wykorzystuje konteneryzację środowiska bazy danych. W katalogu backendu znajduje się plik konfiguracyjny `compose.yaml`.

```bash
cd backend
docker compose up -d
```

*Po uruchomieniu kontenera baza danych będzie dostępna na domyślnym porcie, a struktura tabel zostanie zainicjalizowana przez Liquibase podczas startu serwera.*

### 2. Generowanie kluczy RSA (JWT)

Aplikacja wykorzystuje asymetryczną parę kluczy RSA (`public.pem` oraz `private.pem`) do podpisywania i weryfikacji tokenów JWT. Klucze te muszą znajdować się w katalogu `backend/src/main/resources/certs/`.

1. Utwórz katalog docelowy i przejdź do niego:
   ```bash
   mkdir -p backend/src/main/resources/certs
   cd backend/src/main/resources/certs
   ```

2. Wygeneruj klucz prywatny RSA (2048-bit):
   ```bash
   openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048
   ```

3. Wyodrębnij odpowiadający mu klucz publiczny:
   ```bash
   openssl rsa -pubout -in private.pem -out public.pem
   ```

4. Wróć do katalogu głównego projektu:
   ```bash
   cd ../../../../..
   ```

### 3. Uruchomienie serwera backend

1. Przejdź do katalogu backendu:
   ```bash
   cd backend
   ```

2. Uruchom aplikację za pomocą dołączonego skryptu Maven Wrapper:

   * **Systemy Linux / macOS:**
     ```bash
     ./mvnw spring-boot:run
     ```

   * **Systemy Windows:**
     ```cmd
     mvnw.cmd spring-boot:run
     ```

Serwer REST API zostanie uruchomiony pod adresem: `http://localhost:8080`.

### 4. Uruchomienie aplikacji frontendowej

1. Otwórz nową sesję terminala i przejdź do katalogu frontendu:
   ```bash
   cd frontend
   ```
2. utwórz plik `.env` w katalogu frontend i wklej do pliku poniższą konfigurację endpointów API:
   ```bash
   ### BASE URL
   VITE_URL_BASE_BACKEND = /api
   
   ### AUTH
   VITE_ENDPOINT_AUTH_REGISTER = /auth/register
   VITE_ENDPOINT_AUTH_REFRESH = /auth/refresh
   VITE_ENDPOINT_AUTH_LOGOUT = /auth/logout
   VITE_ENDPOINT_AUTH_LOGIN = /auth/login
   
   ### USER
   VITE_ENDPOINT_USER_UPDATE = /user/update
   VITE_ENDPOINT_USER_ME = /user/me
   
   ### EXERCISES
   VITE_ENDPOINT_EXERCISE = /exercise
   VITE_ENDPOINT_EXERCISE_SEARCH = /exercise/search
   
   ### TRAINING PLAN
   VITE_ENDPOINT_TRAININGPLAN = /trainingplan
   VITE_ENDPOINT_TRAININGPLAN_SEARCH = /trainingplan/search
   VITE_ENDPOINT_TRAININGPLAN_EXERCISE = /exercises
   
   ### WORKOUT
   VITE_ENDPOINT_WORKOUT = /workout
   VITE_ENDPOINT_WORKOUT_SEARCH = /workout/search
   VITE_ENDPOINT_WORKOUT_EXERCISE = /exercises
   
   ### SESSIONS
   VITE_ENDPOINT_USER_SESSIONS = /user/sessions
   
   ### TOTP
   VITE_ENDPOINT_TOTP_SETUP = /user/totp/setup
   VITE_ENDPOINT_TOTP_ENABLE = /user/totp/enable
   VITE_ENDPOINT_TOTP_DISABLE = /user/totp/disable
   ```

4. Pobierz i zainstaluj wymagane pakiety:
   ```bash
   yarn install
   ```

5. Uruchom serwer deweloperski Vite:
   ```bash
   yarn dev
   ```

Aplikacja kliencka zostanie udostępniona lokalnie pod adresem: `http://localhost:5173`.

---

## Struktura repozytorium

```text
Gym_App-validations/
├── backend/
│   ├── compose.yaml                      # Definicja usług Docker Compose
│   ├── pom.xml                           # Zarządzanie zależnościami Maven
│   ├── mvnw, mvnw.cmd                    # Narzędzia Maven Wrapper
│   └── src/
│       ├── main/
│           ├── java/com/filipwiecha/gym/
│           │   ├── auth/                 # Logika autentykacji, obsługa JWT i TOTP
│           │   ├── config/               # Konfiguracja Spring Security i handlery wyjątków
│           │   ├── exercises/            # Moduł encji i kontrolerów ćwiczeń
│           │   ├── trainingPlan/         # Zarządzanie schematami planów treningowych
│           │   ├── user/                 # Obsługa kont i aktywnych sesji użytkownika
│           │   ├── validators/           # Niestandardowe walidatory Bean Validation
│           │   └── workout/              # Rejestracja zrealizowanych jednostek treningowych
│           └── resources/
│               ├── application.properties
│               └── db/changelog/         # Skrypty migracji bazy danych Liquibase
│                                
│
└── frontend/
    ├── package.json                      # Definicje zależności i skryptów Node.js
    ├── vite.config.ts                    # Konfiguracja środowiska Vite
    └── src/
        ├── components/                   # Generyczne komponenty interfejsu
        ├── context/                      # Konteksty stanu globalnego (autoryzacja)
        ├── features/                     # Moduły domenowe aplikacji (auth, user, workout, etc.)
        ├── pages/                        # Komponenty widoków
        ├── routes/                       # Definicje tras i ochrona dostępu (Guards)
        └── services/                     # Klient HTTP oraz integracje API
```

---

## Kluczowe funkcjonalności

* **Bezpieczeństwo i uwierzytelnianie:**
  * Rejestracja i logowanie użytkowników z wielopoziomową walidacją danych wejściowych.
  * Bezstanowa autoryzacja za pomocą tokenów JWT podpisywanych kluczem asymetrycznym RSA.
  * Opcjonalne dwuetapowe logowanie oparte na protokole TOTP (integracja z aplikacjami mobilnymi typu Google Authenticator).
  * Panel zarządzania i unieważniania aktywnych sesji użytkownika.

* **Moduły ćwiczeń/planów/aktywności**
  * Wsparcie operacji CRUD wraz z stronicowaniem wyników.
  * Wyszukiwanie i filtrowanie według nazwy.
  * Wykorzystanie dodanych ćwiczeń w planach treningowych oraz aktywnościach
