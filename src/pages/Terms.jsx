import React from 'react';
import LegalPage from '@/components/LegalPage';

// Algemene voorwaarden — Dutch only (authoritative version).
const MARKDOWN = `# Algemene voorwaarden

Deze algemene voorwaarden zijn van toepassing op het gebruik van de website van Bogèst en de diensten die via deze website worden aangeboden, waaronder **'Vraag het aan Bogèst!'**, reserveringen, takeaway-bestellingen en cadeaubonnen.

Door onze website of diensten te gebruiken, ga je akkoord met deze algemene voorwaarden.

*Laatst bijgewerkt: augustus 2026*

---

## 1. Toepasselijkheid

Deze algemene voorwaarden zijn van toepassing op alle bezoekers van de website van Bogèst en op alle diensten die via de website worden aangeboden.

Bogèst behoudt zich het recht voor de website, haar diensten en deze voorwaarden op ieder moment aan te passen. De meest recente versie is steeds beschikbaar op onze website.

---

## 2. 'Vraag het aan Bogèst!'

Onze website bevat **'Vraag het aan Bogèst!'**, onze slimme digitale host.

De assistent helpt je onder andere met vragen over onze restaurants, de menukaart, reserveringen en praktische informatie.

Hoewel we er alles aan doen om de informatie zo volledig en actueel mogelijk te houden, blijven antwoorden van de digitale host automatisch gegenereerd. Daardoor kunnen antwoorden soms onvolledig, verouderd of onjuist zijn.

Aan antwoorden van **'Vraag het aan Bogèst!'** kunnen daarom geen rechten worden ontleend.

Voor reserveringen, prijzen, beschikbaarheid en andere officiële afspraken is een bevestiging van Bogèst altijd leidend.

Meer informatie vind je in onze AI-disclaimer.

---

## 3. Reserveringen

Een reservering is pas definitief nadat deze door Bogèst is bevestigd.

Bogèst behoudt zich het recht voor een reservering te weigeren, te wijzigen of te annuleren wanneer daar een geldige reden voor bestaat, bijvoorbeeld bij technische storingen, overmacht of misbruik.

Ben je verhinderd? Dan waarderen wij het wanneer je jouw reservering tijdig annuleert.

---

## 4. Takeaway

Takeaway-bestellingen worden verwerkt onder voorbehoud van beschikbaarheid.

Na een succesvolle bestelling ontvang je een bevestiging.

Wij doen ons best om de aangegeven afhaaltijden te respecteren, maar kunnen beperkte vertragingen door drukte, verkeer of andere onvoorziene omstandigheden niet altijd voorkomen.

---

## 5. Cadeaubonnen

Voor cadeaubonnen gelden de voorwaarden die op de cadeaubon of tijdens de aankoop zijn vermeld.

Cadeaubonnen zijn niet inwisselbaar voor contanten en kunnen uitsluitend worden terugbetaald wanneer de wet dit voorschrijft.

Bogèst is niet aansprakelijk voor verlies, diefstal of onbevoegd gebruik van een cadeaubon.

---

## 6. Prijzen en beschikbaarheid

Alle prijzen op onze website worden weergegeven in euro en zijn inclusief btw, tenzij anders vermeld.

Wij doen ons uiterste best om prijzen, beschikbaarheid en informatie actueel te houden.

Kennelijke fouten, vergissingen of technische storingen zijn niet bindend.

Bogèst behoudt zich het recht voor prijzen of beschikbaarheid op ieder moment aan te passen.

---

## 7. Betalingen

Wanneer online betalingen beschikbaar zijn, verlopen deze via beveiligde betaaloplossingen.

Bogèst behoudt zich het recht voor een bestelling of transactie te weigeren of te annuleren wanneer sprake is van fraude, misbruik, technische problemen of andere bijzondere omstandigheden.

---

## 8. Aansprakelijkheid

Wij doen ons best om onze website veilig, correct en actueel te houden.

Toch kunnen wij niet garanderen dat de website altijd zonder onderbrekingen of fouten beschikbaar is.

Bogèst is niet aansprakelijk voor schade die voortvloeit uit:

* tijdelijke onbeschikbaarheid van de website;
* technische storingen;
* storingen bij externe dienstverleners;
* verlies van gegevens;
* het vertrouwen op niet-bindende antwoorden van **'Vraag het aan Bogèst!'**;
* indirecte of gevolgschade, voor zover wettelijk toegestaan.

Deze beperking geldt niet wanneer aansprakelijkheid volgens de wet niet mag worden uitgesloten.

---

## 9. Intellectuele eigendom

Alle teksten, afbeeldingen, logo's, ontwerpen, foto's, video's en andere inhoud op deze website zijn eigendom van Bogèst of worden gebruikt met toestemming van de rechthebbenden.

Zonder voorafgaande schriftelijke toestemming mogen deze materialen niet worden gekopieerd, gepubliceerd, aangepast of op andere wijze worden gebruikt, tenzij de wet dit toestaat.

---

## 10. Privacy

Persoonsgegevens worden verwerkt overeenkomstig onze privacyverklaring.

Voor meer informatie verwijzen wij naar onze privacyverklaring, het cookiebeleid en de AI-disclaimer.

---

## 11. Wijzigingen

Bogèst kan deze algemene voorwaarden van tijd tot tijd aanpassen.

De meest recente versie is steeds beschikbaar op onze website.

---

## 12. Toepasselijk recht

Op deze algemene voorwaarden is Belgisch recht van toepassing.

Geschillen die voortvloeien uit het gebruik van de website of onze diensten worden voorgelegd aan de bevoegde Belgische rechtbank, tenzij dwingend recht anders bepaalt.

---

## 13. Contact

Heb je vragen over deze algemene voorwaarden?

Neem dan gerust contact met ons op via de contactpagina van Bogèst.
`;

export default function Terms() {
  return <LegalPage markdown={MARKDOWN} />;
}