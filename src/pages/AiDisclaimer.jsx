import React from 'react';
import LegalPage from '@/components/LegalPage';

// AI-disclaimer — Dutch only (authoritative version).
const MARKDOWN = `# AI-disclaimer

**Onze slimme digitale host 'Vraag het aan Bogèst!' helpt je graag verder. En als je pas halverwege dit gesprek doorhad dat je met AI praatte... dan zien we dat stiekem als een compliment.**

Hier lees je wat dat betekent voor jou, je gegevens en de antwoorden die je krijgt.

*Laatst bijgewerkt: augustus 2026*

## 1. Even voorstellen.

Op onze website kun je chatten of praten met **'Vraag het aan Bogèst!'**, onze slimme digitale host.

Hij helpt je graag met vragen over onze restaurants, de menukaart, gerechten, reserveringen of het vinden van de juiste informatie op onze website.

Je praat hierbij met kunstmatige intelligentie en niet met een medewerker van Bogèst. Voor gesprekken via spraak maken we gebruik van de stemtechnologie van ElevenLabs.

## 2. Wat onthoudt de host?

Om je goed te kunnen helpen, verwerkt **'Vraag het aan Bogèst!'** informatie uit jullie gesprek.

Dat kan bijvoorbeeld zijn:

* wat je typt;
* wat je zegt wanneer je de spraakfunctie gebruikt;
* een transcriptie van het gesprek;
* eerdere berichten binnen hetzelfde gesprek;
* informatie die je zelf deelt, zoals je naam, voorkeuren of gegevens voor een reservering.

We gebruiken deze informatie om je vraag goed te begrijpen en je zo relevant mogelijk te helpen.

Meer over hoe we met persoonsgegevens omgaan lees je in onze privacyverklaring.

## 3. Om steeds een beetje beter te worden.

We kunnen informatie uit gesprekken gebruiken om **'Vraag het aan Bogèst!'** en onze dienstverlening verder te verbeteren, voor zover dit volgens onze privacyverklaring is toegestaan.

Waar mogelijk gebruiken we hiervoor geanonimiseerde, samengevatte of niet direct herleidbare informatie.

Welke gegevens we bewaren, waarom en voor hoe lang staat beschreven in onze privacyverklaring.

## 4. AI blijft AI.

Hoewel **'Vraag het aan Bogèst!'** verrassend veel weet over Bogèst, blijft het kunstmatige intelligentie. Dat betekent dat een antwoord soms onvolledig, verouderd of simpelweg niet helemaal juist kan zijn.

Gaat het om iets belangrijks, zoals **allergenen, prijzen, beschikbaarheid, openingstijden of een reservering?** Controleer dan altijd de informatie op onze website of in een officiële bevestiging van Bogèst.

## 5. Wanneer is iets definitief?

Een reservering via **'Vraag het aan Bogèst!'** is pas definitief zodra deze door Bogèst is bevestigd.

Hetzelfde geldt voor andere afspraken of toezeggingen: alleen een officiële bevestiging van Bogèst is bindend.

Actuele prijzen en beschikbaarheid zoals door Bogèst gepubliceerd of bevestigd zijn altijd leidend.

## 6. Liever een mens?

Dat begrijpen we. Mensen hebben tenslotte nog altijd een paar voordelen.

Je kunt altijd contact opnemen met het team van Bogèst via onze contactpagina of natuurlijk gewoon met ons praten tijdens je bezoek.

**'Vraag het aan Bogèst!'** helpt je graag om de juiste informatie of de juiste persoon te vinden.

## 7. Jij houdt de keuze.

Je kiest zelf of je **'Vraag het aan Bogèst!'** gebruikt.

Voor functies waarvoor afzonderlijke toestemming nodig is, vragen we die voordat de verwerking plaatsvindt.

Wil je praten met de host? Dan heeft je browser toegang tot je microfoon nodig. Je kunt die toestemming op ieder moment weer intrekken en gewoon blijven chatten.

Meer informatie over de verwerking van gegevens en de bijbehorende rechtsgrond vind je in onze privacyverklaring.

## 8. Nog vragen?

Heb je vragen over **'Vraag het aan Bogèst!'**, je gegevens of deze disclaimer?

Neem dan gerust contact met ons op via de contactpagina van Bogèst.
`;

export default function AiDisclaimer() {
  return <LegalPage markdown={MARKDOWN} />;
}