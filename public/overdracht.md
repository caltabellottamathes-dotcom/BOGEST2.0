# Bogèst — Overdrachtsdocument

Dit document beschrijft waar de website uit bestaat, hoe Bogèst zelf inhoud aanpast, welke externe diensten gekoppeld zijn, en hoe back-up, herstel en overdracht zijn geregeld. Het is geschreven voor de medewerkers van Bogèst en is bruikbaar zonder de bouwer.

---

## 1. Wat is deze website

Bogèst.be is een client-renderde single-page applicatie (React + Vite), gehost op het Base44-platform. Inhoud staat deels in de code en deels in een beheerbare database (entiteiten) die u zelf via het admin-dashboard aanpast. De site is meertalig (NL/FR/EN) via een taalschakelaar — er is één URL per pagina; de taal is een gebruikersvoorkeur, geen aparte URL.

---

## 2. Accounts & eigenaarschap

Bogèst is (of moet zijn) eigenaar of beheerder van al het onderstaande. De bouwer is toegevoegd als gebruiker, niet omgekeerd.

| Account | Eigenaar | Waar | Opmerking |
|---|---|---|---|
| Domein bogest.be | Bogèst | Registrar | Hoofddomein |
| Domeinen bogest-borgloon.be, bogest-hasselt.be, bogest-heusdenzolder.be | Bogèst | Registrar | Zet op registrar-niveau een 301 naar bogest.be (zie §5) |
| bogest-online.be | 3e partij | Externe bestelsite | Laten zoals het is — geen redirect zetten |
| Hosting / platform | Base44 | base44.com | Bogèst is beheerder van de app |
| Google Search Console | Bogèst | search.google.com/search-console | Beheerder; voeg de bouwer als gebruiker toe |
| Google Bedrijfsprofiel (per vestiging) | Bogèst | business.google.com | Beheerder per vestiging |
| Google Analytics 4 | Bogèst | analytics.google.com | Beheerder; bouwer als gebruiker (zie §6) |
| Zenchef (reserveren) | Bogèst | zenchef.com | Reserveringswidget per vestiging |
| Stripe (betalingen) | Bogèst | stripe.com | Cadeaubonnen / betalingen |
| ElevenLabs / D-ID (digitale gastheer) | Bogèst | elevenlabs.io / d-id.com | Digitale gastheer-stem |

**Te controleren vóór live:** of al deze accounts daadwerkelijk op naam van Bogèst staan en of de bouwer enkel gebruikersrechten heeft.

---

## 3. Waar staat welke inhoud

| Inhoud | Waar het staat | Hoe aan te passen |
|---|---|---|
| Menukaart & prijzen | Entiteit `MenuKnowledge` + statisch `src/lib/data.js` (fallback) | Via `/admin` → sectie Menu (prijzen live, direct zichtbaar) |
| Menucategorieën (secties) | Entiteit `MenuCategory` | Via `/admin` → sectie Menu |
| Openingsuren | Entiteit `OpeningHours` + fallback in `src/lib/data.js` | Via `/admin` → sectie Uren; pagina én JSON-LD-schema passen automatisch aan |
| Tijdelijke meldingen | Entiteit `Announcement` (met start/einddatum) | Via `/admin` → sectie Meldingen; verdwijnt automatisch na einddatum |
| Vacatures | Entiteit `Job` (met auto-vertaling FR/EN) | Via `/admin` → sectie Vacatures |
| Foto's op de site | `AssetArchive` (Beeldbank) + `SiteImageOverride` | Via `/admin` → sectie Beelden: upload, categoriseer en vervang foto's per positie |
| Paginateksten / vertalingen | `src/lib/i18n.js` + `SiteTextOverride`-entiteit | Via `/admin` tekstoverrides; structuur wijzigingen via bouwer |
| Contact-/reservatie-/sollicitatie-berichten | Entiteiten `ContactRequest`, `Reservation`, `Order` | Via `/admin` |
| Reviews | Entiteit `ZenchefReview` (gesynchroniseerd) | Via `/admin` |
| Instagram-berichten | Entiteit `InstagramPost` (gesynchroniseerd) | Via `/admin` |

**Belangrijk:** de huidige site gebruikt nog afbeeldingen van de oude Squarespace-CDN (`images.squarespace-cdn.com`). Vervang deze via de Beeldbank door eigen foto's vóór het Squarespace-abonnement wordt opgezegd — anders verdwijnen die afbeeldingen.

---

## 4. Hoe pas je zelf iets aan (zonder bouwer)

1. Ga naar `/admin` (login met een admin-account).
2. Kies de juiste sectie: Menu, Uren, Meldingen, Vacatures, Beelden, of Berichten.
3. Pas aan en bewaar — de wijziging is direct live op de website.

- **Prijs wijzigen:** Menu → gerecht → prijs aanpassen → bewaar. Binnen vijf minuten staat de nieuwe prijs op de site en in het menu-schema.
- **Openingsuur wijzigen:** Uren → vestiging → dag → tekst aanpassen. De pagina, het vestigingsschema én de openingsuren in Google-zoekresultaten worden uit dezelfde bron gevoed.
- **Melding plaatsen:** Meldingen → nieuwe melding met start- en einddatum. De balk verschijnt en verdwijnt automatisch.
- **Foto vervangen:** Beelden → upload een foto → koppel aan een positie (bv. hero, vestiging Hasselt, ruimte). De foto verschijnt op die plaats op de site.

---

## 5. Domeinen & redirects

- `bogest.be` is het hoofddomein.
- De nevendomeinen `bogest-borgloon.be`, `bogest-hasselt.be` en `bogest-heusdenzolder.be` moeten op **registrar-niveau** (waar u het domein kocht) worden doorverwezen met een 301 naar `bogest.be`. Dit kan de bouwer niet voor u doen.
- `bogest-online.be` is de externe bestelsite van een derde partij en blijft ongemoeid.
- Alle oude Squarespace-URL's (bv. `/zolder`, `/joinus`, `/cadeaubon`, `/dentrecote`, `/sfeerfotosborgloon`, `/nieuws`, `/shop`, …) zijn in de nieuwe site ingebouwd als doorverwijzing naar de juiste nieuwe pagina. Wie een oude link volgt, landt automatisch op de juiste plek — geen 404.

---

## 6. Analytics — Google Analytics 4

De GA4-koppeling staat klaar in `index.html`. Om meting te starten:

1. Maak een GA4-property aan op analytics.google.com (op het Google-account van Bogèst).
2. Kopieer de property-ID (vorm `G-XXXXXXXXXX`).
3. Open `index.html` en vervang `var BOGEST_GA_ID = 'G-XXXXXXXXXX';` door uw echte ID.
4. Publiceer de site opnieuw.

Vanaf dan registreren drie gebeurtenissen, uitgesplitst per vestiging:
- `reserve_start` — iemand start een reservering
- `phone_click` — iemand tikt op een telefoonnummer
- `route_click` — iemand vraagt een routebeschrijving

Bogèst is beheerder van de property; voeg de bouwer toe als gebruiker (Lees- of Analyseer-recht).

---

## 7. SEO & Search Console

- Elke pagina heeft een unieke titel, meta-description en Open Graph-gegevens.
- Gestructureerde data (JSON-LD): Restaurant-schema per vestiging (dynamisch uit de uren-entiteit), Organization-schema op de homepage, en Menu/MenuItem-schema op de menukaart.
- `robots.txt` staat in `/public/robots.txt` en verwijst naar de sitemap.
- `sitemap.xml` staat in `/public/sitemap.xml` en bevat alle routes.

**Bij livegang:**
1. Meld `bogest.be` aan in Google Search Console (op het Google-account van Bogèst).
2. Voeg de sitemap `https://www.bogest.be/sitemap.xml` toe.
3. Wacht tot Search Console de sitemap als succesvol verwerkt toont (zonder dekkingsfouten).
4. Controleer dat adres, telefoon en uren op de site identiek zijn aan het Google Bedrijfsprofiel van elke vestiging (NAP-consistentie).

---

## 8. Back-up & herstel

- **Database (entiteiten):** Base44 maakt automatisch back-ups van de database. Herstel kan via het Base44-dashboard of op vraag aan de support.
- **Code:** de volledige broncode staat in de Base44-werkruimte en kan op elk moment worden geëxporteerd.
- **Frequentie:** database-back-ups lopen continu (incrementeel) op het platform.
- **Bewaartermijn:** bepaald door het Base44-abonnement — controleer dit in het dashboard.
- **Hersteltijd:** kleine correcties door u zelf via `/admin` (onmiddellijk); groter herstel via Base44-support (doorgaans binnen één werkdag).

**Aanbevolen:** exporteer regelmatig een kopie van de belangrijkste entiteiten (Menu, Uren, Vacatures) via het admin-dashboard naar een eigen bestand, als extra veiligheid.

---

## 9. Historische cijfers oude site (Squarespace)

De ingebouwde statistieken van Squarespace zijn gekoppeld aan het abonnement en **verdwijnen bij opzegging**. Vóór u het Squarespace-abonnement opzegt:

1. Log in op de huidige Squarespace-site.
2. Ga naar Analytics en exporteer minstens de bezoekcijfers van de laatste 12 maanden (CSV/PDF).
3. Bewaar dit bestand lokaal of in de cloud op naam van Bogèst.

Zonder deze export is er geen vergelijkingspunt tussen oud en nieuw.

---

## 10. Toegankelijkheid & bekende beperkingen

- Tekstcontrast is aangescherpt op de belangrijkste lopende teksten; een volledige Lighthouse-toegankelijkheidsaudit (doel ≥ 90) wordt aangeraden vóór finale oplevering.
- Formulier-velden tonen een zichtbare gouden focusring voor toetsenbordgebruik.
- Reveal-animaties respecteren de systeemvoorkeur "minder beweging".
- **Bekende beperking:** de site is een client-renderde applicatie — inhoud vereist JavaScript. Volledige weergave zonder JavaScript (bv. voor heel oude crawlers) is daardoor beperkt; dit is een platformkeuze. Google kan de inhoud wel indexeren.
- Juridische teksten (Privacy, Voorwaarden, Cookies, AI-disclaimer) staan in het Nederlands; andere talen kunnen op vraag worden toegevoegd.

---

## 11. Opleveringscontrole (vink af vóór factuur)

- [ ] Reserveerknop zichtbaar zonder scrollen op elke pagina (mobiel + desktop)
- [ ] Reserveren verloopt op bogest.be (Zenchef ingebed)
- [ ] Ctrl+F op een gerechtnaam geeft een treffer op de menukaart
- [ ] JSON-LD Restaurant-schema: nul fouten op de drie vestigingspagina's (Schema.org-validator)
- [ ] JSON-LD Menu-schema herkend op de menukaart
- [ ] Alle paginatitels uniek; alle pagina's hebben een meta-description
- [ ] Oude Squarespace-URL's geven een redirect naar een bestaande pagina (geen 404)
- [ ] Vier nevendomeinen 301 naar bogest.be op registrar-niveau (bogest-online.be niet)
- [ ] Delen in WhatsApp toont Bogèst-beeld en Bogèst-tekst
- [ ] Bogèst wijzigt zelf een prijs, een openingsuur en een melding (gedemonstreerd)
- [ ] GA4 draait met Bogèst als beheerder; reserve_start, phone_click en route_click registreren per vestiging
- [ ] Historische cijfers oude site geëxporteerd vóór opzegging Squarespace
- [ ] Sitemap aangeboden in Search Console en succesvol verwerkt
- [ ] Squarespace-CDN-foto's vervangen door eigen beeld via de Beeldbank

---

Vragen of wijzigingen: contacteer de bouwer. Eigenaarschap en accounts blijven altijd bij Bogèst.
