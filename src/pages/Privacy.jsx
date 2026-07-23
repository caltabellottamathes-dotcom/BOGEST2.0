import React from 'react';
import { useLang } from '@/lib/LangContext';

const privacyContent = {
  nl: {
    title: 'Privacybeleid',
    sections: [
      {
        num: '1',
        title: 'Algemeen',
        content: 'Bogèst hecht veel belang aan de bescherming van jouw persoonsgegevens en privacy. In dit privacybeleid leggen wij uit welke gegevens wij verzamelen, waarom wij deze verzamelen en hoe wij hiermee omgaan. Door gebruik te maken van onze website ga je akkoord met dit privacybeleid.'
      },
      {
        num: '2',
        title: 'Welke gegevens verzamelen wij?',
        content: 'Wij kunnen volgende persoonsgegevens verzamelen:',
        list: ['Naam', 'E-mailadres', 'Telefoonnummer', 'Reservatiegegevens', 'Bestelgegevens', 'Facturatiegegevens', 'Eventuele informatie die je vrijwillig invult via contact- of reservatieformulieren'],
        list2title: 'Daarnaast kan onze website automatisch bepaalde technische gegevens verzamelen, zoals:',
        list2: ['IP-adres', 'Browsergegevens', 'Apparaatinformatie', 'Cookies en gebruiksgegevens']
      },
      {
        num: '3',
        title: 'Waarom verzamelen wij deze gegevens?',
        content: 'Wij gebruiken persoonsgegevens uitsluitend voor:',
        list: ['Het verwerken van reservaties', 'Het verwerken van takeaway bestellingen', 'Het verwerken van cadeaubon aankopen', 'Klantenservice en communicatie', 'Het verbeteren van onze website en dienstverlening', 'Wettelijke verplichtingen', 'Beveiliging en fraudepreventie']
      },
      {
        num: '4',
        title: 'Betalingen',
        content: 'Online betalingen verlopen via beveiligde betaalproviders. Bogèst bewaart geen volledige betaalkaartgegevens.'
      },
      {
        num: '5',
        title: 'Cookies',
        content: 'Onze website maakt gebruik van cookies om de website correct te laten functioneren en de gebruikservaring te verbeteren. Cookies kunnen gebruikt worden voor: Basisfunctionaliteiten van de website, Taalvoorkeuren, Statistieken en analyse, Verbetering van prestaties en gebruikservaring. Je kan cookies beheren of uitschakelen via de instellingen van jouw browser.'
      },
      {
        num: '6',
        title: 'Bewaartermijn',
        content: 'Persoonsgegevens worden niet langer bewaard dan noodzakelijk voor de doeleinden waarvoor ze verzameld werden of zolang wettelijk vereist.'
      },
      {
        num: '7',
        title: 'Delen van gegevens',
        content: 'Bogèst verkoopt geen persoonsgegevens aan derden. Gegevens kunnen enkel gedeeld worden met externe partners indien dit noodzakelijk is voor: Reservatiesystemen, Betaalverwerking, Hosting en technische ondersteuning, Wettelijke verplichtingen. Deze partners verwerken gegevens steeds op een veilige en vertrouwelijke manier.'
      },
      {
        num: '8',
        title: 'Beveiliging',
        content: 'Wij nemen passende technische en organisatorische maatregelen om persoonsgegevens te beschermen tegen verlies, misbruik of ongeoorloofde toegang.'
      },
      {
        num: '9',
        title: 'Jouw rechten',
        content: 'Je hebt steeds het recht om: Jouw gegevens in te kijken, Jouw gegevens te laten aanpassen, Jouw gegevens te laten verwijderen, Bezwaar te maken tegen verwerking, Toestemming in te trekken. Voor vragen of verzoeken kan je contact opnemen via de contactgegevens op onze website.'
      },
      {
        num: '10',
        title: 'Wijzigingen',
        content: 'Bogèst behoudt zich het recht voor om dit privacybeleid op elk moment aan te passen. De meest recente versie is steeds beschikbaar op deze website.'
      },
      {
        num: '11',
        title: 'Contact',
        content: 'Voor vragen rond privacy of gegevensverwerking kan je contact opnemen via de contactpagina van Bogèst.'
      }
    ]
  },
  en: {
    title: 'Privacy Policy',
    sections: [
      {
        num: '1',
        title: 'General',
        content: 'Bogèst places great importance on the protection of your personal data and privacy. In this privacy policy, we explain what data we collect, why we collect it, and how we handle it. By using our website, you agree to this privacy policy.'
      },
      {
        num: '2',
        title: 'What data do we collect?',
        content: 'We may collect the following personal data:',
        list: ['Name', 'Email address', 'Phone number', 'Reservation data', 'Order data', 'Billing data', 'Any information you voluntarily provide via contact or reservation forms'],
        list2title: 'Additionally, our website may automatically collect certain technical data, such as:',
        list2: ['IP address', 'Browser data', 'Device information', 'Cookies and usage data']
      },
      {
        num: '3',
        title: 'Why do we collect this data?',
        content: 'We use personal data exclusively for:',
        list: ['Processing reservations', 'Processing takeaway orders', 'Processing gift card purchases', 'Customer service and communication', 'Improving our website and services', 'Legal obligations', 'Security and fraud prevention']
      },
      {
        num: '4',
        title: 'Payments',
        content: 'Online payments are processed through secure payment providers. Bogèst does not store complete payment card data.'
      },
      {
        num: '5',
        title: 'Cookies',
        content: 'Our website uses cookies to ensure it functions correctly and to improve user experience. Cookies may be used for: Basic website functionality, Language preferences, Analytics and statistics, Performance and user experience improvements. You can manage or disable cookies through your browser settings.'
      },
      {
        num: '6',
        title: 'Retention Period',
        content: 'Personal data is retained only as long as necessary for the purposes for which it was collected or as legally required.'
      },
      {
        num: '7',
        title: 'Sharing Data',
        content: 'Bogèst does not sell personal data to third parties. Data may only be shared with external partners when necessary for: Reservation systems, Payment processing, Hosting and technical support, Legal obligations. These partners always process data safely and confidentially.'
      },
      {
        num: '8',
        title: 'Security',
        content: 'We take appropriate technical and organizational measures to protect personal data against loss, misuse, or unauthorized access.'
      },
      {
        num: '9',
        title: 'Your Rights',
        content: 'You always have the right to: View your data, Have your data corrected, Have your data deleted, Object to processing, Withdraw consent. For questions or requests, please contact us via the contact information on our website.'
      },
      {
        num: '10',
        title: 'Changes',
        content: 'Bogèst reserves the right to modify this privacy policy at any time. The most current version is always available on this website.'
      },
      {
        num: '11',
        title: 'Contact',
        content: 'For questions regarding privacy or data processing, please contact us via Bogèst\'s contact page.'
      }
    ]
  },
  fr: {
    title: 'Politique de Confidentialité',
    sections: [
      {
        num: '1',
        title: 'Général',
        content: 'Bogèst attache une grande importance à la protection de vos données personnelles et à votre confidentialité. Dans cette politique de confidentialité, nous expliquons quelles données nous collectons, pourquoi nous les collectons et comment nous les traitons. En utilisant notre site web, vous acceptez cette politique de confidentialité.'
      },
      {
        num: '2',
        title: 'Quelles données collectons-nous?',
        content: 'Nous pouvons collecter les données personnelles suivantes:',
        list: ['Nom', 'Adresse e-mail', 'Numéro de téléphone', 'Données de réservation', 'Données de commande', 'Données de facturation', 'Toute information que vous fournissez volontairement via des formulaires de contact ou de réservation'],
        list2title: 'De plus, notre site web peut automatiquement collecter certaines données techniques, telles que:',
        list2: ['Adresse IP', 'Données du navigateur', 'Informations sur l\'appareil', 'Cookies et données d\'utilisation']
      },
      {
        num: '3',
        title: 'Pourquoi collectons-nous ces données?',
        content: 'Nous utilisons les données personnelles exclusivement pour:',
        list: ['Traiter les réservations', 'Traiter les commandes à emporter', 'Traiter les achats de chèques-cadeaux', 'Service client et communication', 'Améliorer notre site web et nos services', 'Obligations légales', 'Sécurité et prévention de la fraude']
      },
      {
        num: '4',
        title: 'Paiements',
        content: 'Les paiements en ligne sont traités par des fournisseurs de paiement sécurisés. Bogèst ne conserve pas les données complètes de cartes de paiement.'
      },
      {
        num: '5',
        title: 'Cookies',
        content: 'Notre site web utilise des cookies pour assurer son bon fonctionnement et améliorer l\'expérience utilisateur. Les cookies peuvent être utilisés pour: Fonctionnalités de base du site web, Préférences de langue, Analyses et statistiques, Amélioration des performances et de l\'expérience utilisateur. Vous pouvez gérer ou désactiver les cookies via les paramètres de votre navigateur.'
      },
      {
        num: '6',
        title: 'Période de Conservation',
        content: 'Les données personnelles sont conservées uniquement aussi longtemps que nécessaire pour les fins pour lesquelles elles ont été collectées ou selon ce qui est légalement exigé.'
      },
      {
        num: '7',
        title: 'Partage de Données',
        content: 'Bogèst ne vend pas de données personnelles à des tiers. Les données ne peuvent être partagées avec des partenaires externes que si cela est nécessaire pour: Systèmes de réservation, Traitement des paiements, Hébergement et support technique, Obligations légales. Ces partenaires traitent toujours les données de manière sûre et confidentielle.'
      },
      {
        num: '8',
        title: 'Sécurité',
        content: 'Nous prenons des mesures techniques et organisationnelles appropriées pour protéger les données personnelles contre la perte, l\'abus ou l\'accès non autorisé.'
      },
      {
        num: '9',
        title: 'Vos Droits',
        content: 'Vous avez toujours le droit de: Consulter vos données, Faire corriger vos données, Faire supprimer vos données, Vous opposer au traitement, Retirer votre consentement. Pour des questions ou des demandes, veuillez nous contacter via les coordonnées sur notre site web.'
      },
      {
        num: '10',
        title: 'Modifications',
        content: 'Bogèst se réserve le droit de modifier cette politique de confidentialité à tout moment. La version la plus récente est toujours disponible sur ce site web.'
      },
      {
        num: '11',
        title: 'Contact',
        content: 'Pour des questions concernant la confidentialité ou le traitement des données, veuillez nous contacter via la page de contact de Bogèst.'
      }
    ]
  }
};

export default function Privacy() {
  const { lang } = useLang();
  const content = privacyContent[lang] || privacyContent.nl;

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
              {section.list && (
                <ul className="font-body text-base text-muted-foreground space-y-2 ml-4">
                  {section.list.map((item, i) => (
                    <li key={i} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {section.list2title && (
                <>
                  <p className="font-body text-base text-muted-foreground leading-relaxed mt-3">
                    {section.list2title}
                  </p>
                  <ul className="font-body text-base text-muted-foreground space-y-2 ml-4">
                    {section.list2.map((item, i) => (
                      <li key={i} className="list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}