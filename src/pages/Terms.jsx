import React from 'react';
import { useLang } from '@/lib/LangContext';

const termsContent = {
  nl: {
    title: 'Algemene Voorwaarden',
    sections: [
      {
        num: '1',
        title: 'Algemeen',
        content: 'Deze algemene voorwaarden zijn van toepassing op het gebruik van de website van Bogèst, inclusief reservaties, takeaway bestellingen, cadeaubon aankopen en andere diensten die via de website aangeboden worden. Door gebruik te maken van deze website ga je akkoord met deze voorwaarden.'
      },
      {
        num: '2',
        title: 'Reservaties',
        content: 'Reservaties zijn pas definitief nadat de gebruiker een bevestiging ontvangt. Bogèst behoudt zich het recht voor om reservaties te weigeren of te annuleren in uitzonderlijke situaties, waaronder technische fouten, overmacht of misbruik. Indien je verhinderd bent, vragen wij om reservaties tijdig te annuleren.'
      },
      {
        num: '3',
        title: 'Takeaway Bestellingen',
        content: 'Bestellingen via takeaway zijn onder voorbehoud van beschikbaarheid. Na succesvolle betaling ontvangt de klant een bevestiging van de bestelling. Bogèst streeft naar correcte timing van afhaalmomenten, maar kan niet aansprakelijk gesteld worden voor beperkte vertragingen door drukte of onvoorziene omstandigheden.'
      },
      {
        num: '4',
        title: 'Cadeaubonnen',
        content: 'Cadeaubonnen aangekocht via de website zijn geldig volgens de vermelde voorwaarden op de cadeaubon zelf. Cadeaubonnen zijn niet inwisselbaar voor contanten en kunnen niet terugbetaald worden, tenzij wettelijk anders bepaald. Bogèst is niet verantwoordelijk voor verlies, diefstal of misbruik van cadeaubonnen.'
      },
      {
        num: '5',
        title: 'Prijzen',
        content: 'Alle prijzen vermeld op de website zijn in euro en inclusief btw, tenzij anders vermeld. Bogèst behoudt zich het recht voor om prijzen op elk moment aan te passen. Kennelijke fouten of vergissingen in prijsvermeldingen zijn niet bindend.'
      },
      {
        num: '6',
        title: 'Betalingen',
        content: 'Online betalingen verlopen via beveiligde betaalproviders. Bogèst behoudt zich het recht voor om bestellingen of transacties te weigeren bij vermoeden van fraude, misbruik of technische problemen.'
      },
      {
        num: '7',
        title: 'Aansprakelijkheid',
        content: 'Bogèst streeft naar correcte en actuele informatie op de website, maar kan niet garanderen dat alle informatie steeds volledig foutloos of actueel is. Bogèst kan niet aansprakelijk gesteld worden voor: Tijdelijke onbeschikbaarheid van de website, Technische storingen, Verlies van gegevens, Indirecte schade voortvloeiend uit het gebruik van de website.'
      },
      {
        num: '8',
        title: 'Intellectuele Eigendom',
        content: 'Alle inhoud van deze website, waaronder teksten, logo\'s, foto\'s, ontwerpen en grafische elementen, zijn eigendom van Bogèst of worden gebruikt met toestemming van de rechthebbenden. Deze inhoud mag niet gekopieerd, verspreid of gebruikt worden zonder voorafgaande schriftelijke toestemming.'
      },
      {
        num: '9',
        title: 'Privacy',
        content: 'Persoonsgegevens worden verwerkt volgens het privacybeleid van Bogèst. Meer informatie hierover vind je op de privacybeleid pagina.'
      },
      {
        num: '10',
        title: 'Wijzigingen',
        content: 'Bogèst behoudt zich het recht voor om deze algemene voorwaarden op elk moment aan te passen. De meest recente versie is steeds beschikbaar op deze website.'
      },
      {
        num: '11',
        title: 'Toepasselijk Recht',
        content: 'Op deze voorwaarden is het Belgisch recht van toepassing. Eventuele geschillen vallen onder de bevoegde rechtbanken van België.'
      },
      {
        num: '12',
        title: 'Contact',
        content: 'Voor vragen over deze algemene voorwaarden kan je contact opnemen via de contactpagina van Bogèst.'
      }
    ]
  },
  en: {
    title: 'Terms & Conditions',
    sections: [
      {
        num: '1',
        title: 'General',
        content: 'These terms and conditions apply to the use of Bogèst\'s website, including reservations, takeaway orders, gift card purchases, and other services offered through the website. By using this website, you agree to these terms.'
      },
      {
        num: '2',
        title: 'Reservations',
        content: 'Reservations are only definitive after the user receives confirmation. Bogèst reserves the right to refuse or cancel reservations in exceptional situations, including technical errors, force majeure, or misuse. If you are unable to attend, we ask that you cancel your reservation in a timely manner.'
      },
      {
        num: '3',
        title: 'Takeaway Orders',
        content: 'Takeaway orders are subject to availability. After successful payment, the customer receives an order confirmation. Bogèst aims for accurate pickup times but cannot be held liable for minor delays due to busy periods or unforeseen circumstances.'
      },
      {
        num: '4',
        title: 'Gift Cards',
        content: 'Gift cards purchased through the website are valid according to the terms stated on the gift card itself. Gift cards are not redeemable for cash and cannot be refunded unless legally required. Bogèst is not responsible for loss, theft, or misuse of gift cards.'
      },
      {
        num: '5',
        title: 'Prices',
        content: 'All prices listed on the website are in euros and include VAT, unless otherwise stated. Bogèst reserves the right to adjust prices at any time. Obvious errors or mistakes in pricing are not binding.'
      },
      {
        num: '6',
        title: 'Payments',
        content: 'Online payments are processed through secure payment providers. Bogèst reserves the right to refuse orders or transactions if fraud, misuse, or technical problems are suspected.'
      },
      {
        num: '7',
        title: 'Liability',
        content: 'Bogèst strives to provide accurate and current information on the website but cannot guarantee that all information is always completely error-free or current. Bogèst cannot be held liable for: Temporary website unavailability, Technical failures, Data loss, Indirect damage resulting from website use.'
      },
      {
        num: '8',
        title: 'Intellectual Property',
        content: 'All content on this website, including texts, logos, photos, designs, and graphic elements, are owned by Bogèst or used with permission from the rights holders. This content may not be copied, distributed, or used without prior written permission.'
      },
      {
        num: '9',
        title: 'Privacy',
        content: 'Personal data is processed according to Bogèst\'s privacy policy. For more information, please visit the privacy policy page.'
      },
      {
        num: '10',
        title: 'Changes',
        content: 'Bogèst reserves the right to modify these terms and conditions at any time. The most current version is always available on this website.'
      },
      {
        num: '11',
        title: 'Applicable Law',
        content: 'Belgian law applies to these terms and conditions. Any disputes fall under the jurisdiction of Belgian courts.'
      },
      {
        num: '12',
        title: 'Contact',
        content: 'For questions about these terms and conditions, please contact us via Bogèst\'s contact page.'
      }
    ]
  },
  fr: {
    title: 'Conditions Générales',
    sections: [
      {
        num: '1',
        title: 'Général',
        content: 'Ces conditions générales s\'appliquent à l\'utilisation du site web de Bogèst, y compris les réservations, les commandes à emporter, les achats de chèques-cadeaux et autres services offerts via le site web. En utilisant ce site web, vous acceptez ces conditions.'
      },
      {
        num: '2',
        title: 'Réservations',
        content: 'Les réservations ne sont définitives qu\'après réception d\'une confirmation par l\'utilisateur. Bogèst se réserve le droit de refuser ou d\'annuler les réservations en cas exceptionnel, notamment en cas d\'erreurs techniques, de force majeure ou d\'abus. Si vous ne pouvez pas vous présenter, nous vous demandons d\'annuler votre réservation en temps utile.'
      },
      {
        num: '3',
        title: 'Commandes à Emporter',
        content: 'Les commandes à emporter sont soumises à la disponibilité. Après un paiement réussi, le client reçoit une confirmation de commande. Bogèst s\'efforce de respecter les heures de retrait, mais ne peut être tenu responsable des légers retards dus à l\'affluence ou à des circonstances imprévues.'
      },
      {
        num: '4',
        title: 'Chèques-Cadeaux',
        content: 'Les chèques-cadeaux achetés via le site web sont valables selon les conditions mentionnées sur le chèque-cadeau lui-même. Les chèques-cadeaux ne sont pas remboursables en espèces et ne peuvent pas être échangés, sauf si la loi l\'exige. Bogèst n\'est pas responsable de la perte, du vol ou de l\'abus de chèques-cadeaux.'
      },
      {
        num: '5',
        title: 'Prix',
        content: 'Tous les prix affichés sur le site web sont en euros et incluent la TVA, sauf indication contraire. Bogèst se réserve le droit de modifier les prix à tout moment. Les erreurs ou omissions évidentes dans les tarifs ne sont pas contraignantes.'
      },
      {
        num: '6',
        title: 'Paiements',
        content: 'Les paiements en ligne sont traités par des fournisseurs de paiement sécurisés. Bogèst se réserve le droit de refuser les commandes ou les transactions en cas de suspicion de fraude, d\'abus ou de problèmes techniques.'
      },
      {
        num: '7',
        title: 'Responsabilité',
        content: 'Bogèst s\'efforce de fournir des informations précises et à jour sur le site web, mais ne peut pas garantir que toutes les informations sont toujours complètement exactes ou actuelles. Bogèst ne peut être tenu responsable de: L\'indisponibilité temporaire du site web, Les défaillances techniques, La perte de données, Les dommages indirects résultant de l\'utilisation du site web.'
      },
      {
        num: '8',
        title: 'Propriété Intellectuelle',
        content: 'Tout le contenu de ce site web, y compris les textes, logos, photos, conceptions et éléments graphiques, appartient à Bogèst ou est utilisé avec la permission des titulaires de droits. Ce contenu ne peut pas être copié, distribué ou utilisé sans autorisation écrite préalable.'
      },
      {
        num: '9',
        title: 'Confidentialité',
        content: 'Les données personnelles sont traitées conformément à la politique de confidentialité de Bogèst. Pour plus d\'informations, veuillez consulter la page de la politique de confidentialité.'
      },
      {
        num: '10',
        title: 'Modifications',
        content: 'Bogèst se réserve le droit de modifier ces conditions générales à tout moment. La version la plus récente est toujours disponible sur ce site web.'
      },
      {
        num: '11',
        title: 'Droit Applicable',
        content: 'Le droit belge s\'applique à ces conditions générales. Tous les litiges relèvent de la juridiction des tribunaux belges.'
      },
      {
        num: '12',
        title: 'Contact',
        content: 'Pour des questions sur ces conditions générales, veuillez nous contacter via la page de contact de Bogèst.'
      }
    ]
  }
};

export default function Terms() {
  const { lang } = useLang();
  const content = termsContent[lang] || termsContent.nl;

  return (
    <div className="w-full">
      <section className="w-full pt-32 md:pt-40 pb-12 px-6 md:px-10 lg:px-16">
        <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4 block">Juridisch</span>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">{content.title}</h1>
      </section>

      <section className="w-full px-6 md:px-10 lg:px-16 pb-24 max-w-4xl">
        <div className="space-y-8">
          {content.sections.map((section) => (
            <div key={section.num} className="space-y-3">
              <h2 className="font-heading text-lg md:text-xl font-bold text-foreground">
                {section.num}. {section.title}
              </h2>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}