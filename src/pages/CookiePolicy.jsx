import React from 'react';
import { useLang } from '@/lib/LangContext';
import LegalPage from '@/components/LegalPage';

const cookieContent = {
  nl: {
    title: 'Cookiebeleid',
    intro: 'Dit cookiebeleid legt uit hoe de website van Bogèst cookies en vergelijkbare technieken (zoals lokale opslag) gebruikt. Het beleid is afgestemd op onze privacyverklaring en de functionaliteiten van de website, inclusief de AI Digital Host.',
    updated: 'Laatst bijgewerkt: augustus 2026',
    sections: [
      { num: '1', title: 'Wat zijn cookies', content: 'Cookies zijn kleine tekstbestanden die op jouw apparaat opgeslagen worden wanneer je een website bezoekt. Daarnaast maken wij gebruik van vergelijkbare technieken zoals lokale opslag (localStorage), waarmee gegevens lokaal in jouw browser bewaard worden.' },
      { num: '2', title: 'Welke cookies en technieken gebruiken wij', content: 'Wij gebruiken hoofdzakelijk essentiële en functionele technieken. Daarnaast kunnen de diensten die wij gebruiken (zoals Wix, Base44 en ElevenLabs) eigen, beperkte technieken plaatsen voor de werking van hun dienst.', list: ['Essentiële technieken — nodig voor de basiswerking en beveiliging van de website, zoals het bijhouden van een bezoekersidentificatie', 'Voorkeuren — opslag van jouw taal- en themakeuze', 'Functionele opslag — jouw winkelmandje en bezoekersprofiel voor de AI-host', 'Analytics — enkel indien actief en, voor zover niet-essentieel, met jouw toestemming'], content2: 'Wij gebruiken geen marketing- of trackingcookies zonder jouw voorafgaande toestemming.' },
      { num: '3', title: 'AI Digital Host en lokale opslag', content: 'Om de AI Digital Host een vloeiend gesprek te laten voeren, kan lokaal een bezoekersprofiel en gesprekscontext bewaard worden in jouw browser. Deze gegevens blijven op jouw apparaat en helpen de host jouw voorkeuren binnen een bezoek te onthouden.' },
      { num: '4', title: 'Toestemming en cookiebanner', content: 'Omdat wij hoofdzakelijk essentiële en functionele cookies en lokale opslag gebruiken die geen toestemming vereisen, maakt deze website momenteel geen gebruik van een uitgebreide cookiebanner. Indien wij niet-essentiële cookies (zoals analytics of marketing) zouden toevoegen, zullen wij daarvoor vooraf jouw toestemming vragen via een duidelijke cookiebanner, in overeenstemming met de AVG/GDPR.' },
      { num: '5', title: 'Cookies van derden', content: 'Voor de werking van de website maken wij gebruik van derden die als verwerker optreden:', list: ['Wix — website-hosting en platform', 'Base44 — backend en de AI-host', 'ElevenLabs — spraakinteractie', 'Stripe — betalingen', 'Zenchef — reservaties en reviews'], content2: 'Deze partijen kunnen beperkte eigen technieken plaatsen, uitsluitend voor de uitvoering van hun dienst, en handelen volgens hun eigen privacybeleid.' },
      { num: '6', title: 'Beheer en uitschakelen', content: 'Je kan cookies en lokale opslag op elk moment beheren of verwijderen via de instellingen van jouw browser. Het uitschakelen van essentiële cookies kan de werking van de website beïnvloeden.' },
      { num: '7', title: 'Wijzigingen', content: 'Bogèst behoudt zich het recht voor dit cookiebeleid aan te passen. De meest recente versie is beschikbaar op deze website.' },
      { num: '8', title: 'Contact', content: 'Voor vragen over cookies kan je contact opnemen via de contactpagina van Bogèst.' },
    ],
  },
  en: {
    title: 'Cookie Policy',
    intro: 'This cookie policy explains how the Bogèst website uses cookies and similar technologies (such as local storage). It is aligned with our privacy policy and the functionalities of the website, including the AI Digital Host.',
    updated: 'Last updated: August 2026',
    sections: [
      { num: '1', title: 'What cookies are', content: 'Cookies are small text files stored on your device when you visit a website. We also use similar technologies such as local storage (localStorage), which stores data locally in your browser.' },
      { num: '2', title: 'Which cookies and technologies we use', content: 'We mainly use essential and functional technologies. In addition, the services we use (such as Wix, Base44 and ElevenLabs) may place their own limited technologies for the operation of their service.', list: ['Essential technologies — necessary for the basic operation and security of the website, such as a visitor identifier', 'Preferences — storing your language and theme choice', 'Functional storage — your shopping cart and visitor profile for the AI host', 'Analytics — only when active and, where non-essential, with your consent'], content2: 'We do not use marketing or tracking cookies without your prior consent.' },
      { num: '3', title: 'AI Digital Host and local storage', content: 'To allow the AI Digital Host to hold a smooth conversation, a visitor profile and conversation context may be stored locally in your browser. This data stays on your device and helps the host remember your preferences within a visit.' },
      { num: '4', title: 'Consent and cookie banner', content: 'Because we mainly use essential and functional cookies and local storage that do not require consent, this website currently does not use an extensive cookie banner. If we add non-essential cookies (such as analytics or marketing), we will ask for your prior consent via a clear cookie banner, in accordance with the GDPR.' },
      { num: '5', title: 'Third-party cookies', content: 'For the operation of the website we use third parties acting as processors:', list: ['Wix — website hosting and platform', 'Base44 — backend and the AI host', 'ElevenLabs — voice interaction', 'Stripe — payments', 'Zenchef — reservations and reviews'], content2: 'These parties may place limited own technologies, solely for the performance of their service, and act in accordance with their own privacy policy.' },
      { num: '6', title: 'Manage and disable', content: 'You can manage or delete cookies and local storage at any time via your browser settings. Disabling essential cookies may affect the operation of the website.' },
      { num: '7', title: 'Changes', content: 'Bogèst reserves the right to modify this cookie policy. The most recent version is available on this website.' },
      { num: '8', title: 'Contact', content: 'For questions about cookies, please contact us via the Bogèst contact page.' },
    ],
  },
  fr: {
    title: 'Politique de Cookies',
    intro: 'Cette politique de cookies explique comment le site web de Bogèst utilise les cookies et des techniques similaires (telles que le stockage local). Elle est alignée sur notre politique de confidentialité et sur les fonctionnalités du site web, y compris l’hôte digital IA.',
    updated: 'Dernière mise à jour : août 2026',
    sections: [
      { num: '1', title: 'Qu’est-ce qu’un cookie', content: 'Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez un site web. Nous utilisons également des techniques similaires telles que le stockage local (localStorage), qui conserve des données localement dans votre navigateur.' },
      { num: '2', title: 'Quels cookies et techniques utilisons-nous', content: 'Nous utilisons principalement des techniques essentielles et fonctionnelles. De plus, les services que nous utilisons (tels que Wix, Base44 et ElevenLabs) peuvent placer leurs propres techniques limitées pour le fonctionnement de leur service.', list: ['Techniques essentielles — nécessaires au fonctionnement de base et à la sécurité du site, tels qu’un identifiant de visiteur', 'Préférences — stockage de votre choix de langue et de thème', 'Stockage fonctionnel — votre panier et votre profil de visiteur pour l’hôte IA', 'Analytics — uniquement lorsque actif et, dans la mesure où ils ne sont pas essentiels, avec votre consentement'], content2: 'Nous n’utilisons pas de cookies marketing ou de suivi sans votre consentement préalable.' },
      { num: '3', title: 'Hôte Digital IA et Stockage Local', content: 'Pour permettre à l’hôte digital IA de mener une conversation fluide, un profil de visiteur et un contexte de conversation peuvent être stockés localement dans votre navigateur. Ces données restent sur votre appareil et aident l’hôte à mémoriser vos préférences au cours d’une visite.' },
      { num: '4', title: 'Consentement et Bannière de Cookies', content: 'Comme nous utilisons principalement des cookies et un stockage local essentiels et fonctionnels ne nécessitant pas de consentement, ce site web n’utilise actuellement pas de bannière de cookies étendue. Si nous ajoutons des cookies non essentiels (tels qu’analytics ou marketing), nous demanderons votre consentement préalable via une bannière de cookies claire, conformément au RGPD.' },
      { num: '5', title: 'Cookies Tiers', content: 'Pour le fonctionnement du site web, nous faisons appel à des tiers agissant comme sous-traitants :', list: ['Wix — hébergement et plateforme du site', 'Base44 — backend et l’hôte IA', 'ElevenLabs — interaction vocale', 'Stripe — paiements', 'Zenchef — réservations et avis'], content2: 'Ces parties peuvent placer des techniques propres limitées, uniquement pour l’exécution de leur service, et agissent conformément à leur propre politique de confidentialité.' },
      { num: '6', title: 'Gérer et Désactiver', content: 'Vous pouvez gérer ou supprimer les cookies et le stockage local à tout moment via les paramètres de votre navigateur. La désactivation des cookies essentiels peut affecter le fonctionnement du site web.' },
      { num: '7', title: 'Modifications', content: 'Bogèst se réserve le droit de modifier cette politique de cookies. La version la plus récente est disponible sur ce site web.' },
      { num: '8', title: 'Contact', content: 'Pour toute question sur les cookies, veuillez nous contacter via la page de contact de Bogèst.' },
    ],
  },
};

export default function CookiePolicy() {
  const { lang } = useLang();
  const content = cookieContent[lang] || cookieContent.nl;
  return <LegalPage content={content} />;
}