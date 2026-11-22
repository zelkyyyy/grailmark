# Grailmark

Aplikacja webowa do zapisywania produktów i sklepów w jednym miejscu, stworzona w Next.js.
Po wklejeniu linku do produktu aplikacja sama pobiera jego nazwę, zdjęcie i cenę za pomocą własnego endpointu API do scrapingu. Dane każdego użytkownika są przechowywane w bazie Supabase (PostgreSQL).

## Demo

Link do działającej aplikacji:
https://grailmark.vercel.app

## Technologie

- Next.js (App Router)
- React
- JavaScript
- Tailwind CSS
- Supabase (PostgreSQL, autoryzacja)
- Cheerio (scraping HTML)
- REST API (Next.js Route Handlers)
- Git

## Funkcjonalności

- Rejestracja i logowanie użytkowników (Supabase Auth)
- Dodawanie produktów na podstawie samego linku
- Automatyczne pobieranie nazwy, zdjęcia i ceny produktu
- Zapisywanie ulubionych sklepów z automatycznie pobieranym logo
- Usuwanie produktów i sklepów
- Responsywny interfejs z animacjami

## API

### Scrapowanie produktu:
`POST /api/scrape`

Przyjmuje link do produktu i zwraca jego nazwę, zdjęcie, cenę oraz walutę. Endpoint wymaga zalogowanego użytkownika (token w nagłówku `Authorization`).

Dane są wyszukiwane po kolei w kilku źródłach. Jeśli jedno nie zadziała, sprawdzane jest kolejne:
1. Dane strukturalne JSON-LD (`schema.org/Product`)
2. Meta tagi Open Graph i Twitter
3. Elementy HTML strony (np. `<h1>`, zdjęcia produktu)

### Logo sklepów

Logo sklepu jest pobierane z serwisu unavatar.io. Jeśli się nie uda, aplikacja korzysta z zapasowego źródła (Google Favicons).

## Bezpieczeństwo

- Blokowanie zapytań do adresów wewnętrznych i prywatnych (ochrona przed SSRF), również po przekierowaniach
- Limit czasu zapytania (8 s) i maksymalny rozmiar pobieranej strony (3 MB)
- Klucze dostępowe przechowywane w zmiennych środowiskowych (`.env` nie trafia do repozytorium)
