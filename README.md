# Vajčo — e-shop s čerstvými vejci

Moderní e-shop pro prodej čerstvých vajec z volného chovu z farmy v Krnici,
postavený na Next.js (App Router), Prisma/SQLite, Tailwind CSS a Framer Motion.

## Funkce

- Prezentační web (hero s interaktivním 3D vejcem, benefity, příběh farmy,
  proces „Od slepice až k vám", recenze, FAQ)
- E-shop s produkty, košíkem (Zustand) a kompletním objednávkovým procesem
- Výdejní místa s mapou (Leaflet/OpenStreetMap) a rezervací konkrétního termínu
- Ochrana proti dvojité rezervaci stejného slotu (kapacita se kontroluje
  transakčně při vytváření objednávky)
- Administrace (produkty, objednávky a jejich stav, výdejní místa, termíny
  a kapacity, recenze)

## Spuštění

```bash
npm install
npx prisma migrate dev   # vytvoří SQLite databázi a aplikuje schéma
npx prisma db seed       # naplní ukázkovými daty (produkty, výdejní místa, termíny, recenze, FAQ)
npm run dev
```

Aplikace poběží na [http://localhost:3000](http://localhost:3000).

## Administrace

Administrace je na `/admin` (odkaz i v patičce webu). Heslo se nastavuje
proměnnou prostředí `ADMIN_PASSWORD` v `.env` (výchozí vývojové heslo:
`vajco2026`).

## Konfigurace prostředí

Zkopírujte `.env.example` do `.env` a upravte dle potřeby:

- `DATABASE_URL` — cesta k SQLite databázi
- `ADMIN_PASSWORD` — heslo do administrace
- `AUTH_SECRET` — tajný klíč pro podepisování admin session cookie (v
  produkci nastavte na dlouhý náhodný řetězec)

## Poznámky

- Fotografie jsou zatím nahrazeny jasně označenými zástupnými symboly
  (`FOTO: …`) — stačí je v komponentách nahradit skutečnými obrázky.
- Mapa používá dlaždice OpenStreetMap, které vyžadují běžný přístup k
  internetu (v izolovaných sandboxech se nemusí načíst).
