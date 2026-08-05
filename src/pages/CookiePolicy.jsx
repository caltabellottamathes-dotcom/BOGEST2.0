import React from 'react';
import LegalPage from '@/components/LegalPage';

// Cookiebeleid — Dutch only (authoritative version).
const MARKDOWN = `# Cookiebeleid

Bij Bogèst geloven we dat gastvrijheid ook online begint. Daarom gebruiken we cookies en vergelijkbare technieken om onze website goed te laten werken én om **'Vraag het aan Bogèst!'** een persoonlijkere ervaring te laten bieden.

We vinden het belangrijk dat je weet welke gegevens hiervoor worden gebruikt, waarom we dat doen en welke keuzes je daarbij hebt.

*Laatst bijgewerkt: augustus 2026*

---

## 1. Wat zijn cookies?

Cookies zijn kleine tekstbestanden die door je browser op je apparaat worden opgeslagen wanneer je onze website bezoekt.

Daarnaast gebruiken we vergelijkbare technieken, zoals **lokale opslag (local storage)**. Hiermee kan informatie tijdelijk in je browser worden opgeslagen zodat onderdelen van de website goed blijven werken of jouw voorkeuren kunnen onthouden.

---

## 2. Waarom gebruiken wij cookies en lokale opslag?

Wij gebruiken cookies en vergelijkbare technieken om:

* de website veilig en correct te laten functioneren;
* jouw voorkeuren te onthouden;
* reserveringen en andere interactieve functies mogelijk te maken;
* **'Vraag het aan Bogèst!'** goed te laten werken;
* gesprekken persoonlijker te maken door relevante voorkeuren te onthouden;
* misbruik en beveiligingsproblemen te voorkomen;
* onze dienstverlening te verbeteren, voor zover dit volgens de geldende wetgeving is toegestaan.

Wij gebruiken cookies **niet** om je gedrag op andere websites te volgen of om zonder jouw toestemming gepersonaliseerde advertenties te tonen.

---

## 3. Hoe gebruikt 'Vraag het aan Bogèst!' deze informatie?

Wanneer je gebruikmaakt van **'Vraag het aan Bogèst!'**, kan de assistent informatie gebruiken om gesprekken natuurlijker en persoonlijker te laten verlopen.

Afhankelijk van jouw keuzes kan de assistent bijvoorbeeld relevante informatie onthouden, zoals:

* je naam;
* favoriete gerechten of dranken;
* dieetwensen of allergieën;
* eerdere voorkeuren;
* informatie die je vrijwillig tijdens gesprekken met ons deelt;
* de context van eerdere gesprekken.

Het doel hiervan is eenvoudig: je hoeft niet steeds dezelfde informatie opnieuw te geven en we kunnen je sneller en persoonlijker helpen bij een volgend bezoek.

Wij bewaren alleen informatie die relevant is voor onze dienstverlening. Meer hierover lees je in onze privacyverklaring.

---

## 4. Cookies en diensten van derden

Om onze website en **'Vraag het aan Bogèst!'** goed te laten functioneren, maken wij gebruik van een aantal zorgvuldig geselecteerde dienstverleners.

Afhankelijk van de functies die je gebruikt, kunnen deze diensten cookies of vergelijkbare technieken toepassen:

* **Base44**, voor de technische werking van de website, de digitale host en het bewaren van relevante gespreksinformatie;
* **ElevenLabs**, wanneer je gebruikmaakt van de spraakfunctie;
* **Zenchef**, voor reserveringen en reviews.

Deze partijen verwerken gegevens uitsluitend voor de diensten die zij namens Bogèst leveren en volgens de afspraken die daarvoor gelden.

---

## 5. Jouw keuze

Sommige cookies en technieken zijn noodzakelijk om de website goed te laten functioneren. Hiervoor is geen toestemming vereist.

Voor technieken waarmee wij jouw ervaring kunnen personaliseren of onze dienstverlening verbeteren, vragen wij waar dit wettelijk verplicht is vooraf jouw toestemming via onze cookiebanner.

Je kunt jouw voorkeuren op ieder moment wijzigen of eerder gegeven toestemming intrekken.

---

## 6. Cookies beheren

Je kunt cookies en lokaal opgeslagen gegevens altijd verwijderen of blokkeren via de instellingen van je browser.

Houd er wel rekening mee dat sommige onderdelen van de website hierdoor mogelijk minder goed werken. Ook kan **'Vraag het aan Bogèst!'** hierdoor eerdere voorkeuren of gesprekken niet meer onthouden.

---

## 7. Wijzigingen

Wij kunnen dit cookiebeleid aanpassen wanneer onze website, dienstverlening of de wetgeving verandert.

De meest recente versie is altijd beschikbaar op de website van Bogèst.

---

## 8. Vragen?

Heb je vragen over ons gebruik van cookies, lokale opslag of de manier waarop **'Vraag het aan Bogèst!'** jouw voorkeuren onthoudt?

Neem dan gerust contact met ons op via de contactpagina van Bogèst.
`;

export default function CookiePolicy() {
  return <LegalPage markdown={MARKDOWN} />;
}