// Per-pagina SEO-data (title 50–60 tekens, description 140–160).
// resolveSeo(pathname, lang) geeft { title, description, image, canonicalPath }.
import { getLocations } from '@/lib/data';

const SITE = 'Bogèst';
const DEFAULT_IMG = 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg';

// Per route: nl/fr/en. fr & en vallen terug op nl indien afwezig.
const PAGES = {
  '/': {
    nl: {
      title: 'Bogèst grillrestaurant | Hasselt, Borgloon & Heusden-Zolder',
      description: 'Bogèst is een grillrestaurant in Limburg met sfeervolle hoeves in Hasselt, Borgloon en Heusden-Zolder. Bij elk hoofdgerecht: voorgerecht + dessert inbegrepen. Reserveer online.',
    },
    fr: {
      title: 'Bogèst grill-restaurant | Hasselt, Borgloon & Heusden-Zolder',
      description: 'Bogèst est un grill-restaurant limbourgeois avec des fermes authentiques à Hasselt, Borgloon et Heusden-Zolder. Pour chaque plat principal : entrée + dessert inclus. Réservez en ligne.',
    },
    en: {
      title: 'Bogèst grill restaurant | Hasselt, Borgloon & Heusden-Zolder',
      description: 'Bogèst is a grill restaurant in Limburg with authentic farmhouses in Hasselt, Borgloon and Heusden-Zolder. Every main course includes a starter and a dessert. Book online.',
    },
  },
  '/menu': {
    nl: {
      title: 'Menukaart van Bogèst — grill, vlees & seizoensgerechten',
      description: 'Ontdek de menukaart van Bogèst: runds, Masters of Meat, kip, vis, klassiekers en seizoenssuggesties. Bij elk hoofdgerecht een voorgerecht en dessert inbegrepen.',
    },
    fr: {
      title: 'La carte de Bogèst — grill, viande & suggestions saisonnières',
      description: 'Découvrez la carte de Bogèst : bœuf, Masters of Meat, poulet, poisson, classiques et suggestions saisonnières. Entrée et dessert inclus avec chaque plat principal.',
    },
    en: {
      title: 'Bogèst menu — grill, meat & seasonal dishes',
      description: 'Discover the Bogèst menu: beef, Masters of Meat, chicken, fish, classics and seasonal suggestions. Every main course includes a starter and a dessert.',
    },
  },
  '/locations': {
    nl: {
      title: 'Onze vestigingen — Bogèst in Hasselt, Borgloon & Zolder',
      description: 'Bogèst heeft drie sfeervolle vestigingen in Limburg: Hasselt, Borgloon en Heusden-Zolder. Bekijk uren, adres, parking en ruimtes en reserveer direct.',
    },
    fr: {
      title: 'Nos établissements — Bogèst à Hasselt, Borgloon & Zolder',
      description: 'Bogèst compte trois établissements chaleureux au Limbourg : Hasselt, Borgloon et Heusden-Zolder. Horaires, adresse, parking et espaces. Réservez en ligne.',
    },
    en: {
      title: 'Our locations — Bogèst in Hasselt, Borgloon & Zolder',
      description: 'Bogèst has three welcoming locations in Limburg: Hasselt, Borgloon and Heusden-Zolder. See hours, address, parking and spaces and book right away.',
    },
  },
  '/reserve': {
    nl: {
      title: 'Reserveren bij Bogèst — Hasselt, Borgloon of Heusden-Zolder',
      description: 'Reserveer online een tafel bij Bogèst. Kies uw vestiging in Hasselt, Borgloon of Heusden-Zolder en kies een datum en tijdstip via Zenchef.',
    },
    fr: {
      title: 'Réserver chez Bogèst — Hasselt, Borgloon ou Heusden-Zolder',
      description: 'Réservez une table en ligne chez Bogèst. Choisissez votre établissement à Hasselt, Borgloon ou Heusden-Zolder et un horaire via Zenchef.',
    },
    en: {
      title: 'Book a table at Bogèst — Hasselt, Borgloon or Heusden-Zolder',
      description: 'Book a table online at Bogèst. Choose your location in Hasselt, Borgloon or Heusden-Zolder and pick a date and time via Zenchef.',
    },
  },
  '/about': {
    nl: { title: 'Over Bogèst — ons verhaal & vleesfilosofie | Limburg', description: 'Ontdek het verhaal achter Bogèst: een Beau Geste in Limburg. Vakmanschap, vuur en gastvrijheid in drie authentieke hoeves.' },
    fr: { title: 'À propos de Bogèst — notre histoire & philosophie | Limbourg', description: "Découvrez l'histoire de Bogèst : un Beau Geste au Limbourg. Savoir-faire, feu et hospitalité dans trois fermes authentiques." },
    en: { title: 'About Bogèst — our story & meat philosophy | Limburg', description: 'Discover the story behind Bogèst: a Beau Geste in Limburg. Craft, fire and hospitality in three authentic farmhouses.' },
  },
  '/about/ons-verhaal': {
    nl: { title: 'Ons verhaal — Bogèst, een Beau Geste in Limburg', description: 'Het verhaal van Bogèst: van d’Entrecôte tot een moderne grillbrasserie. Vakmanschap, vuur en een gul gebaar aan tafel.' },
    fr: { title: 'Notre histoire — Bogèst, un Beau Geste au Limbourg', description: "L'histoire de Bogèst : d'une entrecôte à une grill-brasserie moderne. Savoir-faire, feu et un geste généreux à table." },
    en: { title: 'Our story — Bogèst, a Beau Geste in Limburg', description: 'The story of Bogèst: from entrecôte to a modern grill brasserie. Craft, fire and a generous gesture at the table.' },
  },
  '/about/onze-filosofie': {
    nl: { title: 'Onze vleesfilosofie — Masters of Meat | Bogèst', description: 'De vleesfilosofie van Bogèst: Belgisch Witblauw, Angus en Hereford, ambachtelijke grillades en huisgemaakte sauzen.' },
    fr: { title: 'Notre philosophie de la viande — Masters of Meat | Bogèst', description: 'La philosophie viande de Bogèst : Blanc Bleu Belge, Angus et Hereford, grillades artisanales et sauces maison.' },
    en: { title: 'Our meat philosophy — Masters of Meat | Bogèst', description: 'The Bogèst meat philosophy: Belgian Blue, Angus and Hereford, artisanal grilling and homemade sauces.' },
  },
  '/takeaway': {
    nl: { title: 'Traiteur & afhalen bij Bogèst — bestel online', description: 'Bestel online bij Bogèst en haal af in Hasselt, Borgloon of Heusden-Zolder. Grillgerechten, spare ribs en klassiekers om mee naar huis te nemen.' },
    fr: { title: 'Traiteur & à emporter chez Bogèst — commande en ligne', description: 'Commandez en ligne chez Bogèst et retirez à Hasselt, Borgloon ou Heusden-Zolder. Grillades, spare ribs et classiques à emporter.' },
    en: { title: 'Takeaway & catering at Bogèst — order online', description: 'Order online at Bogèst and pick up in Hasselt, Borgloon or Heusden-Zolder. Grills, spare ribs and classics to take home.' },
  },
  '/gift-cards': {
    nl: { title: 'Cadeaubonnen van Bogèst — een geschenk in smaak', description: 'Geef een Bogèst-cadeaubon: een geschenk in smaak en vuur. Online te koop, digitaal of af te halen in de vestiging.' },
    fr: { title: 'Bons cadeaux de Bogèst — un cadeau de goût', description: 'Offrez un bon cadeau Bogèst : un cadeau de goût et de feu. En vente en ligne, numérique ou à retirer sur place.' },
    en: { title: 'Bogèst gift cards — a gift of taste', description: 'Give a Bogèst gift card: a gift of taste and fire. Buy online, digital or pick up at the restaurant.' },
  },
  '/contact': {
    nl: { title: 'Contact — Bogèst | Hasselt, Borgloon & Heusden-Zolder', description: 'Contacteer Bogèst: telefoon, e-mail en adres voor Hasselt, Borgloon en Heusden-Zolder. We helpen u graag verder.' },
    fr: { title: 'Contact — Bogèst | Hasselt, Borgloon & Heusden-Zolder', description: 'Contactez Bogèst : téléphone, e-mail et adresse pour Hasselt, Borgloon et Heusden-Zolder. À votre service.' },
    en: { title: 'Contact — Bogèst | Hasselt, Borgloon & Heusden-Zolder', description: 'Contact Bogèst: phone, email and address for Hasselt, Borgloon and Heusden-Zolder. We are happy to help.' },
  },
  '/groups': {
    nl: { title: 'Groepen & events bij Bogèst — feest op maat | Limburg', description: 'Vier uw feest bij Bogèst: bedrijfsdiners, verjaardagen en groepsreservaties in Hasselt, Borgloon of Heusden-Zolder.' },
    fr: { title: 'Groupes & événements chez Bogèst — sur mesure | Limbourg', description: 'Célébrez chez Bogèst : dîners d’entreprise, anniversaires et réservations de groupe à Hasselt, Borgloon ou Heusden-Zolder.' },
    en: { title: 'Groups & events at Bogèst — tailored | Limburg', description: 'Celebrate at Bogèst: company dinners, birthdays and group bookings in Hasselt, Borgloon or Heusden-Zolder.' },
  },
  '/jobs': {
    nl: { title: 'Werken bij Bogèst — vacatures in de horeca | Limburg', description: 'Solliciteer bij Bogèst: vacatures voor grilleurs, bediening en keuken in Hasselt, Borgloon en Heusden-Zolder. Sluit je aan bij ons team.' },
    fr: { title: 'Travailler chez Bogèst — offres d’emploi horeca | Limbourg', description: 'Postulez chez Bogèst : offres pour grillards, service et cuisine à Hasselt, Borgloon et Heusden-Zolder. Rejoignez l’équipe.' },
    en: { title: 'Work at Bogèst — hospitality vacancies | Limburg', description: 'Apply at Bogèst: vacancies for grillers, service and kitchen in Hasselt, Borgloon and Heusden-Zolder. Join our team.' },
  },
  '/privacy': {
    nl: { title: 'Privacyverklaring van Bogèst — AVG & gegevens', description: 'De privacyverklaring van Bogèst: hoe wij persoonsgegevens verwerken en beschermen volgens de AVG.' },
    fr: { title: 'Déclaration de confidentialité de Bogèst — RGPD', description: 'La déclaration de confidentialité de Bogèst : comment nous traitons et protégeons vos données selon le RGPD.' },
    en: { title: 'Privacy statement of Bogèst — GDPR', description: 'The privacy statement of Bogèst: how we process and protect personal data under the GDPR.' },
  },
  '/terms': {
    nl: { title: 'Algemene voorwaarden — Bogèst', description: 'De algemene voorwaarden van Bogèst voor reservaties, bestellingen, cadeaubonnen en diensten.' },
    fr: { title: 'Conditions générales — Bogèst', description: 'Les conditions générales de Bogèst pour réservations, commandes, bons cadeaux et services.' },
    en: { title: 'Terms & conditions — Bogèst', description: 'The general terms and conditions of Bogèst for reservations, orders, gift cards and services.' },
  },
  '/cookies': {
    nl: { title: 'Cookiebeleid van Bogèst — welke cookies we gebruiken', description: 'Het cookiebeleid van Bogèst: welke cookies wij plaatsen, waarvoor en hoe u uw voorkeuren beheert.' },
    fr: { title: 'Politique cookies de Bogèst — cookies que nous utilisons', description: 'La politique cookies de Bogèst : les cookies que nous plaçons, pourquoi et comment gérer vos préférences.' },
    en: { title: 'Cookie policy of Bogèst — cookies we use', description: 'The cookie policy of Bogèst: which cookies we set, why and how to manage your preferences.' },
  },
  '/ai-disclaimer': {
    nl: { title: 'AI-disclaimer van Bogèst — onze digitale gastheer', description: 'De AI-disclaimer van Bogèst: hoe onze digitale gastheer werkt, wat hij kan en hoe we uw gegevens beschermen.' },
    fr: { title: "Disclaimer IA de Bogèst — notre hôte numérique", description: "Le disclaimer IA de Bogèst : comment fonctionne notre hôte numérique et comment nous protégeons vos données." },
    en: { title: 'AI disclaimer of Bogèst — our digital host', description: 'The AI disclaimer of Bogèst: how our digital host works, what it can do and how we protect your data.' },
  },
  '/about/instagram': {
    nl: { title: 'Bogèst op Instagram — sfeer & wekelijkse specials', description: 'Volg Bogèst op Instagram voor sfeerbeelden, weekspecials en momenten achter de schermen, per vestiging.' },
    fr: { title: 'Bogèst sur Instagram — ambiance & specials', description: "Suivez Bogèst sur Instagram pour l'ambiance, les specials et les coulisses, par établissement." },
    en: { title: 'Bogèst on Instagram — atmosphere & weekly specials', description: 'Follow Bogèst on Instagram for atmosphere, weekly specials and behind-the-scenes moments, per location.' },
  },
  '/vraag-het-aan-bogest': {
    nl: { title: 'Vraag het aan Bogèst — onze digitale gastheer', description: 'Stel uw vraag aan de digitale gastheer van Bogèst: menuadvies, reserveren, vestigingen en meer, 24/7.' },
    fr: { title: "Demandez à Bogèst — notre hôte numérique", description: "Posez votre question à l'hôte numérique de Bogèst : conseil menu, réservation, adresses et plus, 24/7." },
    en: { title: 'Ask Bogèst — our digital host', description: 'Ask the Bogèst digital host anything: menu advice, booking, locations and more, 24/7.' },
  },
  '/restaurant-spaces/hasselt': {
    nl: { title: 'Ruimtes van Bogèst Hasselt — bar, living & terras', description: 'Ontdek de ruimtes van Bogèst Hasselt: de bar, open keuken, living en terras. Ideaal voor groepen en events.' },
    fr: { title: 'Espaces de Bogèst Hasselt — bar, living & terrasse', description: "Découvrez les espaces de Bogèst Hasselt : bar, cuisine ouverte, living et terrasse. Idéal pour groupes et événements." },
    en: { title: 'Spaces at Bogèst Hasselt — bar, living & terrace', description: 'Discover the spaces at Bogèst Hasselt: the bar, open kitchen, living room and terrace. Ideal for groups and events.' },
  },
  '/restaurant-spaces/borgloon': {
    nl: { title: 'Ruimtes van Bogèst Borgloon — koelcel & terras', description: 'Ontdek de ruimtes van Bogèst Borgloon: bar, living, toog, koelcel en terras met beweegbaar dak.' },
    fr: { title: 'Espaces de Bogèst Borgloon — cave & terrasse', description: "Découvrez les espaces de Bogèst Borgloon : bar, living, comptoir, cave réfrigérée et terrasse." },
    en: { title: 'Spaces at Bogèst Borgloon — cold room & terrace', description: 'Discover the spaces at Bogèst Borgloon: bar, living, counter, cold room and terrace with movable roof.' },
  },
  '/restaurant-spaces/heusden-zolder': {
    nl: { title: 'Ruimtes van Bogèst Heusden-Zolder — restaurant & terras', description: 'Ontdek de ruimtes van Bogèst Heusden-Zolder: een warm ingericht restaurant en ruim terras, gezinsvriendelijk.' },
    fr: { title: 'Espaces de Bogèst Heusden-Zolder — restaurant & terrasse', description: "Découvrez les espaces de Bogèst Heusden-Zolder : restaurant chaleureux et grande terrasse, familial." },
    en: { title: 'Spaces at Bogèst Heusden-Zolder — restaurant & terrace', description: 'Discover the spaces at Bogèst Heusden-Zolder: a warm restaurant and spacious terrace, family-friendly.' },
  },
};

function locationSeo(loc, lang) {
  const city = loc.city || '';
  const region = loc.region || 'Limburg';
  const title = `${loc.name} — grillrestaurant, uren & reserveren | ${region}`;
  const desc = lang === 'fr'
    ? `${loc.name} à ${city} — ${loc.address}. Entrée et dessert inclus avec chaque plat principal. Découvrez les horaires et réservez une table en ligne.`
    : lang === 'en'
      ? `${loc.name} in ${city} — ${loc.address}. Every main course includes a starter and a dessert. See opening hours and book a table online.`
      : `${loc.name} in ${city} — ${loc.address}. Bij elk hoofdgerecht een voorgerecht en dessert inbegrepen. Bekijk de openingsuren en reserveer online.`;
  return {
    title,
    description: desc,
    image: loc.image || DEFAULT_IMG,
    canonicalPath: `/locations/${loc.slug}`,
  };
}

export function resolveSeo(pathname, lang) {
  // Per-vestiging detail
  const locMatch = pathname.match(/^\/locations\/(.+)$/);
  if (locMatch) {
    const loc = getLocations(lang).find((l) => l.slug === locMatch[1]);
    if (loc) return locationSeo(loc, lang);
  }
  const entry = PAGES[pathname];
  if (entry) {
    const t = entry[lang] || entry.nl;
    return { title: t.title, description: t.description, image: DEFAULT_IMG, canonicalPath: pathname };
  }
  // Default
  return {
    title: `${SITE} — grillrestaurant in Limburg`,
    description: PAGES['/'][lang || 'nl'].description,
    image: DEFAULT_IMG,
    canonicalPath: pathname,
  };
}