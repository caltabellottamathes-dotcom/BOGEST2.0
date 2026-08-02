import React from 'react';
import { useLang } from '@/lib/LangContext';
import LegalPage from '@/components/LegalPage';

const termsContent = {
  nl: {
    title: 'Algemene Voorwaarden',
    intro: 'Deze algemene voorwaarden zijn van toepassing op het gebruik van de website van Bogèst, inclusief reserveringen, takeaway-bestellingen, cadeaubonaankopen, het gebruik van de AI Digital Host en andere diensten die via de website aangeboden worden. Door gebruik te maken van deze website ga je akkoord met deze voorwaarden.',
    updated: 'Laatst bijgewerkt: augustus 2026',
    sections: [
      { num: '1', title: 'Algemeen', content: 'Deze voorwaarden regelen het gebruik van de website en de diensten van Bogèst. Bogèst kan de diensten op elk moment aanpassen of uitbreiden.' },
      { num: '2', title: 'AI Digital Host', content: 'De website bevat een AI Digital Host die bezoekers helpt via tekst en spraak. De AI-host is een hulpmiddel en geen medewerker van Bogèst. Antwoorden van de AI kunnen fouten, onvolledige of onjuiste informatie bevatten en hebben geen bindende werking. Voor bindende informatie of officiële afspraken baseer je je op de bevestiging van Bogèst of neem je contact op met een medewerker. Lees ook onze AI-disclaimer.' },
      { num: '3', title: 'Reserveringen', content: 'Reserveringen zijn pas definitief nadat je een bevestiging van Bogèst hebt ontvangen. De beschikbaarheid en prijzen vermeld op de website zijn leidend. Bogèst behoudt zich het recht voor om reserveringen te weigeren of te annuleren in uitzonderlijke situaties, zoals technische fouten, overmacht of misbruik. Indien je verhinderd bent, vragen wij om je reservering tijdig te annuleren.' },
      { num: '4', title: 'Takeaway-bestellingen', content: 'Bestellingen via takeaway zijn onder voorbehoud van beschikbaarheid. Na succesvolle betaling ontvang je een bevestiging van de bestelling. Bogèst streeft naar correcte timing van afhaalmomenten, maar kan niet aansprakelijk gesteld worden voor beperkte vertragingen door drukte of onvoorziene omstandigheden.' },
      { num: '5', title: 'Cadeaubonnen', content: 'Cadeaubonnen aangekocht via de website zijn geldig volgens de voorwaarden vermeld op de cadeaubon zelf. Cadeaubonnen zijn niet inwisselbaar voor contanten en kunnen niet terugbetaald worden, tenzij wettelijk anders bepaald. Bogèst is niet verantwoordelijk voor verlies, diefstal of misbruik van cadeaubonnen.' },
      { num: '6', title: 'Prijzen en beschikbaarheid', content: 'Alle prijzen vermeld op de website zijn in euro en inclusief btw, tenzij anders vermeld. De prijzen en beschikbaarheid op de website zijn leidend. Bogèst behoudt zich het recht voor om prijzen op elk moment aan te passen. Kennelijke fouten of vergissingen in prijsvermeldingen zijn niet bindend.' },
      { num: '7', title: 'Betalingen', content: 'Online betalingen verlopen via beveiligde betaalproviders. Bogèst behoudt zich het recht voor om bestellingen of transacties te weigeren bij vermoeden van fraude, misbruik of technische problemen.' },
      { num: '8', title: 'Aansprakelijkheid', content: 'Bogèst streeft naar correcte en actuele informatie op de website, maar kan niet garanderen dat alle informatie steeds volledig, foutloos of actueel is. Bogèst blijft verantwoordelijk voor officiële communicatie. Bogèst kan niet aansprakelijk gesteld worden voor:', list: ['Tijdelijke onbeschikbaarheid van de website', 'Technische storingen', 'Verlies van gegevens', 'Indirecte schade voortvloeiend uit het gebruik van de website', 'Schade voortvloeiend uit afgaan op niet-bindende antwoorden van de AI-host'] },
      { num: '9', title: 'Intellectuele eigendom', content: 'Alle inhoud van deze website, waaronder teksten, logo’s, foto’s, ontwerpen en grafische elementen, zijn eigendom van Bogèst of worden gebruikt met toestemming van de rechthebbenden. Deze inhoud mag niet gekopieerd, verspreid of gebruikt worden zonder voorafgaande schriftelijke toestemming.' },
      { num: '10', title: 'Privacy', content: 'Persoonsgegevens worden verwerkt volgens de privacyverklaring van Bogèst. Meer informatie vind je op de privacyverklaring-pagina.' },
      { num: '11', title: 'Wijzigingen', content: 'Bogèst behoudt zich het recht voor om deze algemene voorwaarden op elk moment aan te passen. De meest recente versie is steeds beschikbaar op deze website.' },
      { num: '12', title: 'Toepasselijk recht', content: 'Op deze voorwaarden is het Belgisch recht van toepassing. Eventuele geschillen vallen onder de bevoegde rechtbanken van België.' },
      { num: '13', title: 'Contact', content: 'Voor vragen over deze algemene voorwaarden kan je contact opnemen via de contactpagina van Bogèst.' },
    ],
  },
  en: {
    title: 'Terms & Conditions',
    intro: 'These terms and conditions apply to the use of the Bogèst website, including reservations, takeaway orders, gift card purchases, the use of the AI Digital Host and other services offered through the website. By using this website, you agree to these terms.',
    updated: 'Last updated: August 2026',
    sections: [
      { num: '1', title: 'General', content: 'These terms govern the use of the Bogèst website and services. Bogèst may adjust or extend the services at any time.' },
      { num: '2', title: 'AI Digital Host', content: 'The website features an AI Digital Host that helps visitors via text and voice. The AI host is a tool and not an employee of Bogèst. Answers from the AI may contain errors, incomplete or incorrect information and have no binding effect. For binding information or official agreements, rely on confirmation from Bogèst or contact a member of staff. Please also read our AI disclaimer.' },
      { num: '3', title: 'Reservations', content: 'Reservations are only definitive once you have received confirmation from Bogèst. The availability and prices stated on the website are leading. Bogèst reserves the right to refuse or cancel reservations in exceptional situations, such as technical errors, force majeure or misuse. If you are unable to attend, we ask that you cancel your reservation in a timely manner.' },
      { num: '4', title: 'Takeaway Orders', content: 'Takeaway orders are subject to availability. After successful payment, you receive an order confirmation. Bogèst aims for accurate pickup times but cannot be held liable for minor delays due to busy periods or unforeseen circumstances.' },
      { num: '5', title: 'Gift Cards', content: 'Gift cards purchased through the website are valid according to the terms stated on the gift card itself. Gift cards are not redeemable for cash and cannot be refunded unless legally required. Bogèst is not responsible for loss, theft or misuse of gift cards.' },
      { num: '6', title: 'Prices and availability', content: 'All prices listed on the website are in euros and include VAT, unless otherwise stated. Prices and availability on the website are leading. Bogèst reserves the right to adjust prices at any time. Obvious errors or mistakes in pricing are not binding.' },
      { num: '7', title: 'Payments', content: 'Online payments are processed through secure payment providers. Bogèst reserves the right to refuse orders or transactions if fraud, misuse or technical problems are suspected.' },
      { num: '8', title: 'Liability', content: 'Bogèst strives to provide accurate and current information on the website but cannot guarantee that all information is always complete, correct or current. Bogèst remains responsible for official communication. Bogèst cannot be held liable for:', list: ['Temporary website unavailability', 'Technical failures', 'Data loss', 'Indirect damage resulting from the use of the website', 'Damage resulting from reliance on non-binding answers from the AI host'] },
      { num: '9', title: 'Intellectual Property', content: 'All content on this website, including texts, logos, photos, designs and graphic elements, is owned by Bogèst or used with permission from the rights holders. This content may not be copied, distributed or used without prior written permission.' },
      { num: '10', title: 'Privacy', content: 'Personal data is processed according to Bogèst’s privacy policy. For more information, please visit the privacy policy page.' },
      { num: '11', title: 'Changes', content: 'Bogèst reserves the right to modify these terms and conditions at any time. The most current version is always available on this website.' },
      { num: '12', title: 'Applicable Law', content: 'Belgian law applies to these terms and conditions. Any disputes fall under the jurisdiction of the Belgian courts.' },
      { num: '13', title: 'Contact', content: 'For questions about these terms and conditions, please contact us via the Bogèst contact page.' },
    ],
  },
  fr: {
    title: 'Conditions Générales',
    intro: 'Ces conditions générales s’appliquent à l’utilisation du site web de Bogèst, y compris les réservations, les commandes à emporter, les achats de chèques-cadeaux, l’utilisation de l’hôte digital IA et autres services offerts via le site web. En utilisant ce site web, vous acceptez ces conditions.',
    updated: 'Dernière mise à jour : août 2026',
    sections: [
      { num: '1', title: 'Général', content: 'Ces conditions régissent l’utilisation du site web et des services de Bogèst. Bogèst peut adapter ou étendre les services à tout moment.' },
      { num: '2', title: 'Hôte Digital IA', content: 'Le site web dispose d’un hôte digital IA qui aide les visiteurs par texte et par voix. L’hôte IA est un outil et non un employé de Bogèst. Les réponses de l’IA peuvent contenir des erreurs, des informations incomplètes ou incorrectes et n’ont aucun effet contraignant. Pour des informations contraignantes ou des accords officiels, fiez-vous à la confirmation de Bogèst ou contactez un membre du personnel. Veuillez également lire notre avertissement IA.' },
      { num: '3', title: 'Réservations', content: 'Les réservations ne sont définitives qu’après réception d’une confirmation de Bogèst. La disponibilité et les prix indiqués sur le site web sont déterminants. Bogèst se réserve le droit de refuser ou d’annuler les réservations en cas exceptionnel, notamment en cas d’erreurs techniques, de force majeure ou d’abus. Si vous ne pouvez pas vous présenter, nous vous demandons d’annuler votre réservation en temps utile.' },
      { num: '4', title: 'Commandes à Emporter', content: 'Les commandes à emporter sont soumises à la disponibilité. Après un paiement réussi, vous recevez une confirmation de commande. Bogèst s’efforce de respecter les heures de retrait mais ne peut être tenu responsable des légers retards dus à l’affluence ou à des circonstances imprévues.' },
      { num: '5', title: 'Chèques-Cadeaux', content: 'Les chèques-cadeaux achetés via le site web sont valables selon les conditions mentionnées sur le chèque-cadeau lui-même. Les chèques-cadeaux ne sont pas remboursables en espèces et ne peuvent pas être échangés, sauf si la loi l’exige. Bogèst n’est pas responsable de la perte, du vol ou de l’abus de chèques-cadeaux.' },
      { num: '6', title: 'Prix et Disponibilité', content: 'Tous les prix affichés sur le site web sont en euros et incluent la TVA, sauf indication contraire. Les prix et la disponibilité sur le site web sont déterminants. Bogèst se réserve le droit de modifier les prix à tout moment. Les erreurs ou omissions évidentes dans les tarifs ne sont pas contraignantes.' },
      { num: '7', title: 'Paiements', content: 'Les paiements en ligne sont traités par des prestataires de paiement sécurisés. Bogèst se réserve le droit de refuser les commandes ou les transactions en cas de suspicion de fraude, d’abus ou de problèmes techniques.' },
      { num: '8', title: 'Responsabilité', content: 'Bogèst s’efforce de fournir des informations précises et à jour sur le site web mais ne peut garantir que toutes les informations sont toujours complètes, exactes ou actuelles. Bogèst reste responsable de la communication officielle. Bogèst ne peut être tenu responsable de :', list: ['L’indisponibilité temporaire du site web', 'Les défaillances techniques', 'La perte de données', 'Les dommages indirects résultant de l’utilisation du site web', 'Les dommages résultant de la confiance accordée aux réponses non contraignantes de l’hôte IA'] },
      { num: '9', title: 'Propriété Intellectuelle', content: 'Tout le contenu de ce site web, y compris les textes, logos, photos, conceptions et éléments graphiques, appartient à Bogèst ou est utilisé avec l’autorisation des titulaires de droits. Ce contenu ne peut pas être copié, distribué ou utilisé sans autorisation écrite préalable.' },
      { num: '10', title: 'Confidentialité', content: 'Les données personnelles sont traitées conformément à la politique de confidentialité de Bogèst. Pour plus d’informations, veuillez consulter la page de la politique de confidentialité.' },
      { num: '11', title: 'Modifications', content: 'Bogèst se réserve le droit de modifier ces conditions générales à tout moment. La version la plus récente est toujours disponible sur ce site web.' },
      { num: '12', title: 'Droit Applicable', content: 'Le droit belge s’applique à ces conditions générales. Tous les litiges relèvent de la juridiction des tribunaux belges.' },
      { num: '13', title: 'Contact', content: 'Pour des questions sur ces conditions générales, veuillez nous contacter via la page de contact de Bogèst.' },
    ],
  },
};

export default function Terms() {
  const { lang } = useLang();
  const content = termsContent[lang] || termsContent.nl;
  return <LegalPage content={content} />;
}