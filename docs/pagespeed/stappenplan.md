# Stappenplan — Performance, Toegankelijkheid & Paginagewicht

> Doel: de rijke beleving (digitale gastheer, spraak, live menu's, reserveringen) behouden,
> én de site sneller en toegankelijker maken. Videobeslissing loopt voorop.

## F1 — Mobiele laadtijd omlaag
- Afhankelijk van de videobeslissing (zie `lighthouse-mobile.md`).
- Optie A: video lichter/korter comprimeren.
- Optie B: op mobiel overstappen naar stilstaand hero-beeld.
- Optie C: video alleen op desktop/wifi, beeld op mobiel.
- **Doel:** LCP < 2,5 s op mobiel.

## F2 — Paginagewicht terugbrengen
- Hero-video verlichten of vervangen (afhankelijk van videobeslissing).
- Niet-kritieke scripts uitstellen (F3).
- **Doel:** paginagewicht van ~30 MB naar < 5 MB.

## F3 — Start van de pagina sneller
- Weer-API, lettertypen en menu-data pas ná eerste weergave laden.
- Google Fonts: `@import` → `preconnect` + `display=swap`.
- **Doel:** eerste tekstweergave direct zichtbaar.

## G2 — Beschrijvende alt-teksten
- Lighthouse meldt groen ("alt aanwezig"), maar eis is *beschrijvend*.
- Door alle inhoudelijke afbeeldingen: logo, panel-foto's, Beeldbank, menu-foto's, locatiekaarten → échte beschrijving van wat je ziet.
- Decoratieve beelden (ghost-bull, panel-achtergronden) expliciet leeg (`alt=""` + `aria-hidden`).
- *Let op: pas echt compleet als de definitieve foto's binnen zijn — voorlopige beschrijvingen er nu al in.*

## G4 — Toegankelijkheid naar 90+
- Alle knoppen/links voorzien van `aria-label`.
- Kopstructuur footer corrigeren.
- Video van ondertiteling/`<track>` voorzien.
- Samen met G2 in één ronde oppakken.

## Afbeeldingen comprimeren (uitgesteld)
- *Let op: ik wacht nog op de definitieve foto's, dus dit kan pas helemaal rond als die binnen zijn.*
- Zodra binnen: omzetten naar WebP, verkleinen naar werkelijke weergavegrootte.
- Goed voor ~1,5 MB aan laadtijd.

## Volgorde
1. Videobeslissing (klant) → bepaalt F1/F2.
2. F3 — scripts uitstellen (onafhankelijk van videobeslissing).
3. G2 + G4 — toegankelijkheid in één ronde.
4. Afbeeldingen comprimeren — zodra definitieve beelden binnen zijn.