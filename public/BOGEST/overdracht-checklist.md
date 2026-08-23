# Bogèst 2.0 — Overdracht & externe acties

Deze checklist bevat de stappen die buiten de applicatie zelf moeten worden uitgevoerd om volledig aan de briefing te voldoen. De in-app punten zijn al doorgevoerd; hieronder volgt wat Bogèst of de webmaster zelf oppakt.

## 1. Google Analytics 4 (GA4)
- [ ] Maak een GA4-property aan op naam van Bogèst (niet van de webbouwer).
- [ ] Vervang in `index.html` de placeholder `G-XXXXXXXXXX` door de eigen GA4-measurement-ID en activeer de loader (verwijder de `return` in het GA4-blok).
- [ ] Koppel GA4 aan Google Search Console en Google Ads.
- [ ] Controleer of de events `phone_click`, `route_click` en `reserve_start` binnenkomen (uitgesplitst per vestiging).

## 2. 301-redirects (oude Squarespace-URL's)
Op hosting/CDN-niveau (niet in de app) moeten alle 34 oude URL's permanent worden doorverwezen naar de nieuwe pagina's. Voorbeeldmapping:
- `d-entrecote.be` en `bogest.be` oude paden → nieuwe Nederlandse paden.
- `/reserveren-hasselt`, `/reserveren-borgloon`, `/reserveren-heusden-zolder` → nieuwe reserveerpagina's.
- Oude menu-, vestigings- en contactpagina's → de nieuwe equivalenten.
- [ ] Stel een 301-redirect-map op op server/edge-niveau (nginx, Cloudflare, Vercel, of de hostingprovider).
- [ ] Test elke redirect met een redirect-checker (HTTP 301, juiste bestemming).

## 3. Nevendomeinen doorverwijzen (DNS)
- [ ] `bogest-online.be`, `bogest-borgloon.be`, `bogest-hasselt.be`, `bogest-heusdenzolder.be` (en evt. `d-entrecote.be`) → 301 naar `https://www.bogest.be`.
- [ ] Stel dit in bij de registrar/DNS-provider.

## 4. NAP-consistentie (Naam, Adres, Telefoon)
- [ ] Vergelijk adres, telefoon en uren met het Google Bedrijfsprofiel, Facebook en Instagram voor alle drie de vestigingen.
- [ ] Maak ze overal identiek (geen afwijkende uren of telefoonnummers).
- [ ] Advies: vervang `info@bogest-hasselt.be` enz. door `hasselt@bogest.be`, `borgloon@bogest.be`, `heusdenzolder@bogest.be` zodra die mailboxen bestaan.

## 5. Account-eigenaarschap
Zet alle accounts op naam van Bogèst (niet van de webbouwer):
- [ ] Hosting / CDN.
- [ ] Google Search Console.
- [ ] Google Bedrijfsprofiel (per vestiging).
- [ ] Zenchef.
- [ ] Google Analytics 4.
- [ ] Domeinnamen (registrar).
- [ ] Stripe (indien van toepassing).
- [ ] ElevenLabs / D-ID (indien van toepassing).

## 6. Assets door Bogèst te leveren
- [ ] **SVG-logo**: lever het stieren-en-mes-logo als vector (.svg) ter vervanging van de huidige PNG. (Wordt in de app vervangen zodra geleverd.)
- [ ] **Nieuwe reportagefoto's**: professionele foto's per vestiging en ruimte in WebP/AVIF, minstens 1200 px breed, om de Squarespace-JPEG's te vervangen.
- [ ] **Unieke vestigingsteksten**: per locatie een unieke "over ons"-tekst (meer dan 70% verschillend) die het karakter van die zaak benadrukt.

## 7. Sitemap & Search Console
- [ ] Dien `https://www.bogest.be/sitemap.xml` in bij Google Search Console.
- [ ] Dien `robots.txt` in en verifieer.
- [ ] Vraag indexering aan voor de hoofdpagina's na publicatie.

## 8. Historische data exporteren
- [ ] Exporteer minstens de laatste 12 maanden analytics, reserveringen en bestellingen uit Squarespace vóór het oude abonnement wordt opgezegd.

## 9. Back-up & herstel (zwart op wit)
- [ ] Beschrijf back-upfrequentie, bewaartermijn en hersteltijd (RTO/RPO) van het platform.

## 10. Taalkundige controle
- [ ] Eindcontrole op spelling en formuleringen in alle titels, knoppen, navigatie en koppen (NL/FR/EN) vóór publicatie.

---

_Status: in-app punten doorgevoerd; bovenstaande externe stappen in afwachting van Bogèst._
