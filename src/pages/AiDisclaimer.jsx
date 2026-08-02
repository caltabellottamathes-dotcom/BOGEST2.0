import React from 'react';
import { useLang } from '@/lib/LangContext';
import LegalPage from '@/components/LegalPage';

const aiContent = {
  nl: {
    title: 'AI-disclaimer',
    intro: 'Deze disclaimer informeert je over het gebruik van de AI Digital Host op de website van Bogèst, over de gegevens die tijdens een gesprek verwerkt worden en over de beperkingen van de AI.',
    updated: 'Laatst bijgewerkt: augustus 2026',
    sections: [
      { num: '1', title: 'Je communiceert met een AI-assistent', content: 'Op deze website kan je contact opnemen met onze AI Digital Host. De AI-host is een automatische assististent die jou helpt via tekst en, indien ingeschakeld, via spraak. Je communiceert met een systeem op basis van een Large Language Model (LLM) en, voor spraak, de stemtechnologie van ElevenLabs — niet met een menselijke medewerker.' },
      { num: '2', title: 'Welke gegevens worden verwerkt', content: 'Tijdens een gesprek met de AI-host kunnen de volgende gegevens verwerkt worden:', list: ['De tekstberichten die je invoert', 'Gesproken audio via de microfoon', 'Transcripties van je gesprek', 'De context van je vraag en eerdere opmerkingen in hetzelfde gesprek', 'Persoonsgegevens die je vrijwillig deelt, zoals je naam of reserveringsgegevens'], content2: 'Deze gegevens worden verwerkt om jouw vraag te begrijpen en te beantwoorden. Meer informatie vind je in onze privacyverklaring.' },
      { num: '3', title: 'Verbetering van de dienstverlening', content: 'Indien dit daadwerkelijk gebeurt, kunnen gesprekken of samenvattingen daarvan gebruikt worden om de AI-host en onze dienstverlening te verbeteren. Daarbij werken wij waar mogelijk met geanonimiseerde of samengevatte gegevens en respecteren wij jouw toestemming en de bewaartermijnen uit onze privacyverklaring.' },
      { num: '4', title: 'De AI kan fouten maken', content: 'De antwoorden van de AI-host worden automatisch gegenereerd en kunnen fouten, onvolledige of verouderde informatie bevatten. Antwoorden hebben geen bindende werking. Verifieer voor belangrijke zaken — zoals reserveringen, prijzen, allergie-informatie of openingstijden — steeds de informatie op de website of in de bevestiging van Bogèst.' },
      { num: '5', title: 'Reserveringen en officiële communicatie', content: 'Reserveringen via de AI-host zijn pas definitief na bevestiging door Bogèst. Prijzen en beschikbaarheid op de website zijn leidend. Voor officiële communicatie en bindende afspraken blijft Bogèst verantwoordelijk.' },
      { num: '6', title: 'Contact met een medewerker', content: 'Je kan op elk moment contact opnemen met een menselijke medewerker, via de contactpagina op deze website of tijdens je bezoek in één van onze restaurants. De AI-host kan je doorverwijzen naar de juiste plek op de website.' },
      { num: '7', title: 'Toestemming', content: 'Door de AI-host te gebruiken, ga je akkoord met de verwerking van je gespreksgegevens zoals beschreven in deze disclaimer en onze privacyverklaring. Voor het opnemen van gesproken audio is je toestemming vereist; je kan de spraakfunctie op elk moment niet gebruiken.' },
      { num: '8', title: 'Contact', content: 'Voor vragen over deze AI-disclaimer kan je contact opnemen via de contactpagina van Bogèst.' },
    ],
  },
  en: {
    title: 'AI Disclaimer',
    intro: 'This disclaimer informs you about the use of the AI Digital Host on the Bogèst website, about the data processed during a conversation and about the limitations of the AI.',
    updated: 'Last updated: August 2026',
    sections: [
      { num: '1', title: 'You are communicating with an AI assistant', content: 'On this website you can contact our AI Digital Host. The AI host is an automatic assistant that helps you via text and, when enabled, via voice. You are communicating with a system based on a Large Language Model (LLM) and, for voice, the voice technology of ElevenLabs — not with a human member of staff.' },
      { num: '2', title: 'What data is processed', content: 'During a conversation with the AI host, the following data may be processed:', list: ['The text messages you enter', 'Spoken audio via the microphone', 'Transcripts of your conversation', 'The context of your question and previous remarks in the same conversation', 'Personal data you voluntarily share, such as your name or reservation details'], content2: 'This data is processed to understand and answer your question. For more information, see our privacy policy.' },
      { num: '3', title: 'Improvement of the service', content: 'Where this actually happens, conversations or summaries of them may be used to improve the AI host and our service. We work with anonymised or summarised data where possible and respect your consent and the retention periods in our privacy policy.' },
      { num: '4', title: 'The AI can make mistakes', content: 'Answers from the AI host are generated automatically and may contain errors, incomplete or outdated information. Answers have no binding effect. For important matters — such as reservations, prices, allergy information or opening hours — always verify the information on the website or in the confirmation from Bogèst.' },
      { num: '5', title: 'Reservations and official communication', content: 'Reservations via the AI host are only definitive after confirmation by Bogèst. Prices and availability on the website are leading. Bogèst remains responsible for official communication and binding agreements.' },
      { num: '6', title: 'Contact with a member of staff', content: 'You can contact a human member of staff at any time, via the contact page on this website or during your visit to one of our restaurants. The AI host can refer you to the right place on the website.' },
      { num: '7', title: 'Consent', content: 'By using the AI host, you agree to the processing of your conversation data as described in this disclaimer and our privacy policy. Recording spoken audio requires your consent; you can choose not to use the voice function at any time.' },
      { num: '8', title: 'Contact', content: 'For questions about this AI disclaimer, please contact us via the Bogèst contact page.' },
    ],
  },
  fr: {
    title: 'Avertissement IA',
    intro: 'Cet avertissement vous informe sur l’utilisation de l’hôte digital IA sur le site web de Bogèst, sur les données traitées lors d’une conversation et sur les limites de l’IA.',
    updated: 'Dernière mise à jour : août 2026',
    sections: [
      { num: '1', title: 'Vous communiquez avec un assistant IA', content: 'Sur ce site web, vous pouvez contacter notre hôte digital IA. L’hôte IA est un assistant automatique qui vous aide par texte et, lorsqu’il est activé, par voix. Vous communiquez avec un système basé sur un grand modèle de langage (LLM) et, pour la voix, la technologie vocale d’ElevenLabs — et non avec un membre du personnel humain.' },
      { num: '2', title: 'Quelles données sont traitées', content: 'Lors d’une conversation avec l’hôte IA, les données suivantes peuvent être traitées :', list: ['Les messages texte que vous saisissez', 'L’audio parlé via le microphone', 'Les transcriptions de votre conversation', 'Le contexte de votre question et de vos remarques précédentes dans la même conversation', 'Les données personnelles que vous partagez volontairement, telles que votre nom ou vos données de réservation'], content2: 'Ces données sont traitées pour comprendre et répondre à votre question. Pour plus d’informations, consultez notre politique de confidentialité.' },
      { num: '3', title: 'Amélioration du Service', content: 'Dans la mesure où cela se fait effectivement, les conversations ou leurs résumés peuvent être utilisés pour améliorer l’hôte IA et notre service. Nous travaillons autant que possible avec des données anonymisées ou résumées et respectons votre consentement et les durées de conservation de notre politique de confidentialité.' },
      { num: '4', title: 'L’IA peut faire des erreurs', content: 'Les réponses de l’hôte IA sont générées automatiquement et peuvent contenir des erreurs, des informations incomplètes ou obsolètes. Les réponses n’ont aucun effet contraignant. Pour les questions importantes — telles que réservations, prix, informations sur les allergies ou horaires d’ouverture — vérifiez toujours les informations sur le site web ou dans la confirmation de Bogèst.' },
      { num: '5', title: 'Réservations et Communication Officielle', content: 'Les réservations via l’hôte IA ne sont définitives qu’après confirmation par Bogèst. Les prix et la disponibilité sur le site web sont déterminants. Bogèst reste responsable de la communication officielle et des accords contraignants.' },
      { num: '6', title: 'Contact avec un Membre du Personnel', content: 'Vous pouvez à tout moment contacter un membre du personnel humain, via la page de contact de ce site web ou lors de votre visite dans l’un de nos restaurants. L’hôte IA peut vous orienter vers le bon endroit du site web.' },
      { num: '7', title: 'Consentement', content: 'En utilisant l’hôte IA, vous acceptez le traitement de vos données de conversation tel que décrit dans cet avertissement et notre politique de confidentialité. L’enregistrement de l’audio parlé nécessite votre consentement ; vous pouvez à tout moment choisir de ne pas utiliser la fonction vocale.' },
      { num: '8', title: 'Contact', content: 'Pour toute question sur cet avertissement IA, veuillez nous contacter via la page de contact de Bogèst.' },
    ],
  },
};

export default function AiDisclaimer() {
  const { lang } = useLang();
  const content = aiContent[lang] || aiContent.nl;
  return <LegalPage content={content} />;
}