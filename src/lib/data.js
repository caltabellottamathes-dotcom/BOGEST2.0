// Bogèst — Real business data

const HOURS = {
  hasselt: {
    nl: [
      { day: 'Maandag', time: 'Gesloten' },
      { day: 'Dinsdag', time: '17:00 – 22:00' },
      { day: 'Woensdag', time: '17:00 – 22:00' },
      { day: 'Donderdag', time: 'Gesloten' },
      { day: 'Vrijdag', time: '17:00 – 22:00' },
      { day: 'Zaterdag', time: '17:00 – 22:00' },
      { day: 'Zondag', time: '17:00 – 22:00' },
    ],
    fr: [
      { day: 'Lundi', time: 'Fermé' },
      { day: 'Mardi', time: '17:00 – 22:00' },
      { day: 'Mercredi', time: '17:00 – 22:00' },
      { day: 'Jeudi', time: 'Fermé' },
      { day: 'Vendredi', time: '17:00 – 22:00' },
      { day: 'Samedi', time: '17:00 – 22:00' },
      { day: 'Dimanche', time: '17:00 – 22:00' },
    ],
    en: [
      { day: 'Monday', time: 'Closed' },
      { day: 'Tuesday', time: '17:00 – 22:00' },
      { day: 'Wednesday', time: '17:00 – 22:00' },
      { day: 'Thursday', time: 'Closed' },
      { day: 'Friday', time: '17:00 – 22:00' },
      { day: 'Saturday', time: '17:00 – 22:00' },
      { day: 'Sunday', time: '17:00 – 22:00' },
    ],
  },
  borgloon: {
    nl: [
      { day: 'Maandag', time: 'Gesloten' },
      { day: 'Dinsdag', time: 'Gesloten' },
      { day: 'Woensdag', time: '17:00 – 22:00' },
      { day: 'Donderdag', time: '17:00 – 22:00' },
      { day: 'Vrijdag', time: '17:00 – 22:00' },
      { day: 'Zaterdag', time: '17:00 – 22:00' },
      { day: 'Zondag', time: '11:30 – 14:00 / 17:00 – 22:00' },
    ],
    fr: [
      { day: 'Lundi', time: 'Fermé' },
      { day: 'Mardi', time: 'Fermé' },
      { day: 'Mercredi', time: '17:00 – 22:00' },
      { day: 'Jeudi', time: '17:00 – 22:00' },
      { day: 'Vendredi', time: '17:00 – 22:00' },
      { day: 'Samedi', time: '17:00 – 22:00' },
      { day: 'Dimanche', time: '11:30 – 14:00 / 17:00 – 22:00' },
    ],
    en: [
      { day: 'Monday', time: 'Closed' },
      { day: 'Tuesday', time: 'Closed' },
      { day: 'Wednesday', time: '17:00 – 22:00' },
      { day: 'Thursday', time: '17:00 – 22:00' },
      { day: 'Friday', time: '17:00 – 22:00' },
      { day: 'Saturday', time: '17:00 – 22:00' },
      { day: 'Sunday', time: '11:30 – 14:00 / 17:00 – 22:00' },
    ],
  },
  'heusden-zolder': {
    nl: [
      { day: 'Maandag', time: 'Gesloten' },
      { day: 'Dinsdag', time: 'Gesloten' },
      { day: 'Woensdag', time: '17:00 – 22:00' },
      { day: 'Donderdag', time: '17:00 – 22:00' },
      { day: 'Vrijdag', time: '17:00 – 22:00' },
      { day: 'Zaterdag', time: '17:00 – 22:00' },
      { day: 'Zondag', time: '11:30 – 14:00 / 17:00 – 22:00' },
    ],
    fr: [
      { day: 'Lundi', time: 'Fermé' },
      { day: 'Mardi', time: 'Fermé' },
      { day: 'Mercredi', time: '17:00 – 22:00' },
      { day: 'Jeudi', time: '17:00 – 22:00' },
      { day: 'Vendredi', time: '17:00 – 22:00' },
      { day: 'Samedi', time: '17:00 – 22:00' },
      { day: 'Dimanche', time: '11:30 – 14:00 / 17:00 – 22:00' },
    ],
    en: [
      { day: 'Monday', time: 'Closed' },
      { day: 'Tuesday', time: 'Closed' },
      { day: 'Wednesday', time: '17:00 – 22:00' },
      { day: 'Thursday', time: '17:00 – 22:00' },
      { day: 'Friday', time: '17:00 – 22:00' },
      { day: 'Saturday', time: '17:00 – 22:00' },
      { day: 'Sunday', time: '11:30 – 14:00 / 17:00 – 22:00' },
    ],
  },
  lommel: {
    nl: [{ day: 'Info', time: 'Binnenkort beschikbaar' }],
    fr: [{ day: 'Info', time: 'Bientôt disponible' }],
    en: [{ day: 'Info', time: 'Coming soon' }],
  },
};

const PARKING = {
  hasselt: {
    nl: 'U kan parkeren tegenover ons restaurant op de parking van de kerk, of op de openbare weg.',
    fr: 'Vous pouvez vous garer en face de notre restaurant sur le parking de l\'église, ou sur la voie publique.',
    en: 'You can park opposite our restaurant in the church car park, or on the public road.',
  },
  borgloon: {
    nl: 'Ruime parking vlak naast het restaurant. Rij de straat Graethempoort in, links ziet u de inrit.',
    fr: 'Grand parking juste à côté du restaurant. Engagez-vous dans la rue Graethempoort, l\'entrée se trouve à gauche.',
    en: 'Spacious parking right next to the restaurant. Drive into Graethempoort street, the entrance is on the left.',
  },
  'heusden-zolder': {
    nl: 'Parking achter het restaurant en aan het station.',
    fr: 'Parking derrière le restaurant et à la gare.',
    en: 'Parking behind the restaurant and at the station.',
  },
  lommel: { nl: '', fr: '', en: '' },
};

const BASE_LOCATIONS = [
  {
    slug: 'hasselt',
    name: 'Bogèst Hasselt',
    city: 'Hasselt',
    region: 'Limburg',
    address: 'Luikersteenweg 516, 3501 Wimmertingen',
    phone: '011 41 54 28',
    email: 'info@bogest-hasselt.be',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg',
    zenchefId: '368482',
    reserveUrl: 'https://bookings.zenchef.com/results?rid=368482&pid=1001',
    mapsUrl: 'https://www.google.be/maps/dir//Luikersteenweg+516,+3501+Wimmertingen',
    number: '01',
    lat: 50.9150, lng: 5.3750,
  },
  {
    slug: 'borgloon',
    name: 'Bogèst Borgloon',
    city: 'Borgloon',
    region: 'Limburg',
    address: 'Graethempoort 33, 3840 Borgloon',
    phone: '012 22 61 20',
    email: 'info@bogest-borgloon.be',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/ba4c98fb-2ded-4472-88d3-e42960e519bc/veranda+borgloon.jpeg',
    zenchefId: '368313',
    reserveUrl: 'https://bookings.zenchef.com/results?rid=368313&pid=1001',
    mapsUrl: 'https://www.google.be/maps/dir//Graethempoort+33,+3840+Borgloon',
    number: '02',
    lat: 50.8009, lng: 5.3449,
  },
  {
    slug: 'heusden-zolder',
    name: 'Bogèst Heusden-Zolder',
    city: 'Heusden-Zolder',
    region: 'Limburg',
    address: 'Stationsstraat 67, 3550 Heusden-Zolder',
    phone: '011 18 21 20',
    email: 'info@bogest-heusdenzolder.be',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg',
    zenchefId: '368311',
    reserveUrl: 'https://bookings.zenchef.com/results?rid=368311&pid=1001',
    mapsUrl: 'https://www.google.be/maps?q=Stationsstraat+67+Heusden-Zolder',
    number: '03',
    lat: 51.0331, lng: 5.2869,
  },
  {
    slug: 'lommel',
    name: 'Bogèst Lommel',
    city: 'Lommel',
    region: 'Limburg',
    address: 'Lommel, Limburg',
    phone: '',
    email: '',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg',
    reserveUrl: '',
    mapsUrl: '',
    number: '04',
    lat: 51.2296, lng: 5.3100,
  },
];

// Returns locations with localized hours and parking for the given language
export function getLocations(lang = 'nl') {
  return BASE_LOCATIONS.map(loc => ({
    ...loc,
    hours: (HOURS[loc.slug]?.[lang] || HOURS[loc.slug]?.nl || []),
    parking: (PARKING[loc.slug]?.[lang] || PARKING[loc.slug]?.nl || ''),
  }));
}

// Default export for backwards compatibility (Dutch)
export const LOCATIONS_DATA = BASE_LOCATIONS.map(loc => ({
  ...loc,
  hours: HOURS[loc.slug]?.nl || [],
  parking: PARKING[loc.slug]?.nl || '',
}));

// Helper to get localized value from either a string or {nl, fr, en} object
export function loc(val, lang = 'nl') {
  if (val == null) return val;
  if (typeof val === 'object') return val[lang] || val.nl || val.en || '';
  return val;
}

export const MENU_DATA = [
  {
    id: 'voorgerechten',
    key: 'cat_starters',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799926-VML5QXWO8V6D1NYAO2ZA/909af4c2-7392-4bbc-af18-2ea890714ecd-1.jpg',
    items: [
      { id: 'v1', name: { nl: 'Suggestiesoep van de dag', fr: "Soupe du jour", en: "Soup of the day" }, price: null },
      { id: 'v2', name: { nl: 'Tomatensoep', fr: "Soupe à la tomate", en: "Tomato soup" }, price: null },
      { id: 'v3', name: { nl: 'Gravad Lax (koud)', fr: "Gravad Lax (froid)", en: "Gravad Lax (cold)" }, price: null },
      { id: 'v4', name: { nl: 'Luikse Boulet — Huisbereid', fr: "Boulet liégeois — Maison", en: "Liège Meatball — Homemade" }, price: null },
      { id: 'v5', name: { nl: 'Zuiderse Bouletjes — Huisbereid', fr: "Boulettes méditerranéennes — Maison", en: "Mediterranean Meatballs — Homemade" }, price: null },
      { id: 'v6', name: { nl: 'Porco Tonato', fr: "Porco Tonato", en: "Porco Tonato" }, desc: { nl: 'Zacht gegaard varkensvlees, tonijnmayonaise en kappertjes', fr: "Porc fondant, mayonnaise au thon et câpres", en: "Slow-cooked pork, tuna mayonnaise and capers" }, price: null },
      { id: 'v7', name: { nl: 'Chili Bogèst', fr: "Chili Bogèst", en: "Chili Bogèst" }, desc: { nl: "Licht pittig met nacho's", fr: "Légèrement épicé avec nachos", en: "Mildly spicy with nachos" }, price: null },
      { id: 'v8', name: { nl: 'Duo vleeskroketjes (4st.)', fr: "Duo de croquettes de viande (4 pc.)", en: "Duo meat croquettes (4 pc.)" }, price: 5.50 },
      { id: 'v9', name: { nl: 'Huisbereide garnaalkroket', fr: "Croquette de crevettes maison", en: "Homemade shrimp croquette" }, price: 9.90 },
    ],
  },
  {
    id: 'runds',
    key: 'cat_beef',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799913-Y5ZEKPI4I2XXUTYC8W3T/d2db3621-8f9b-45f1-95c8-498c24ed15c3-1.jpg',
    items: [
      { id: 'r1', name: { nl: 'Steak Lady', fr: "Steak Lady", en: "Steak Lady" }, price: 32.90 },
      { id: 'r2', name: { nl: 'Steak Normaal', fr: "Steak Normal", en: "Steak Regular" }, price: 39.90 },
      { id: 'r3', name: { nl: 'Steak Maxi', fr: "Steak Maxi", en: "Steak Maxi" }, price: 45.90 },
      { id: 'r4', name: { nl: 'Rib Eye Lady', fr: "Rib Eye Lady", en: "Rib Eye Lady" }, price: 36.90 },
      { id: 'r5', name: { nl: 'Rib Eye Normaal', fr: "Rib Eye Normal", en: "Rib Eye Regular" }, price: 41.90 },
      { id: 'r6', name: { nl: 'Filet pur Lady', fr: "Filet pur Lady", en: "Filet pur Lady" }, price: 39.00 },
      { id: 'r7', name: { nl: 'Filet pur Normaal', fr: "Filet pur Normal", en: "Filet pur Regular" }, price: 49.00 },
      { id: 'r8', name: { nl: "Côte à l'os (2 pers.)", fr: "Côte à l'os (2 pers.)", en: "Côte à l'os (2 pers.)" }, price: 41.90 },
      { id: 'r9', name: { nl: 'Chateaubriand (2 pers.)', fr: "Chateaubriand (2 pers.)", en: "Chateaubriand (2 pers.)" }, price: 47.50 },
      { id: 'r10', name: { nl: 'Rundsbrochette', fr: "Brochette de bœuf", en: "Beef brochette" }, price: 37.90 },
    ],
  },
  {
    id: 'masters',
    key: 'cat_masters',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799913-Y5ZEKPI4I2XXUTYC8W3T/d2db3621-8f9b-45f1-95c8-498c24ed15c3-1.jpg',
    items: [
      { id: 'm1', name: { nl: 'Angus Ribeye', fr: "Angus Ribeye", en: "Angus Ribeye" }, desc: { nl: 'Aberdeen Angus, superieure vetmarmering, boterzacht en sappig', fr: "Aberdeen Angus, persillage supérieur, fondant et juteux", en: "Aberdeen Angus, superior marbling, tender and juicy" }, price: 56.00 },
      { id: 'm2', name: { nl: 'Hereford Ribeye', fr: "Hereford Ribeye", en: "Hereford Ribeye" }, desc: { nl: 'Zacht van beet, rijk van smaak met subtiele marmering', fr: "Texture tendre, saveur riche avec persillage subtil", en: "Tender bite, rich flavour with subtle marbling" }, price: 53.00 },
    ],
  },
  {
    id: 'kip',
    key: 'cat_chicken',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799922-SLXI4OSI7W3KWGKE3UFY/5a7c094c-9679-410a-bbc5-5f8c663d8a14.JPG',
    items: [
      { id: 'k1', name: { nl: 'Kippenbrochette', fr: "Brochette de poulet", en: "Chicken brochette" }, desc: { nl: 'Groot, sappig, mals met verse ananas', fr: "Grande, juteuse, tendre avec ananas frais", en: "Large, juicy, tender with fresh pineapple" }, price: 29.90 },
      { id: 'k2', name: { nl: "Kefte's Bogèst", fr: "Kefte's Bogèst", en: "Kefte's Bogèst" }, desc: { nl: "Huisbereide gehaktballetjes op z'n Grieks", fr: "Boulettes de viande maison à la grecque", en: "Homemade Greek-style meatballs" }, price: 28.90 },
      { id: 'k3', name: { nl: 'Vol au Vent', fr: "Vol au Vent", en: "Vol au Vent" }, desc: { nl: "Op Grootmoeders wijze, rijkelijk gevuld", fr: "Façon grand-mère, généreusement garni", en: "Grandmother's recipe, generously filled" }, price: 29.90 },
    ],
  },
  {
    id: 'vis',
    key: 'cat_fish',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/426ec0ed-f1b6-4eb0-90d5-ad7cea634e7c/7B0C379C-A65C-400B-83D7-C140E27E6ABF_1_201_a.jpeg',
    items: [
      { id: 'f1', name: { nl: 'Zeetong Meunière', fr: "Sole Meunière", en: "Dover sole Meunière" }, price: 47.50 },
      { id: 'f2', name: { nl: 'Zalmfilet', fr: "Filet de saumon", en: "Salmon fillet" }, price: 37.50 },
      { id: 'f3', name: { nl: 'Scampi Brochette', fr: "Brochette de scampis", en: "Scampi brochette" }, price: 34.90 },
      { id: 'f4', name: { nl: 'Veggie Lasagna', fr: "Lasagne végétarienne", en: "Veggie Lasagna" }, price: 25.90 },
      { id: 'f5', name: { nl: 'No Chicken Burger', fr: "No Chicken Burger", en: "No Chicken Burger" }, desc: { nl: 'Met couscous op zuiderse wijze', fr: "Avec couscous à la méditerranéenne", en: "With couscous, Mediterranean style" }, price: 27.90 },
    ],
  },
  {
    id: 'varken',
    key: 'cat_pork',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799926-VML5QXWO8V6D1NYAO2ZA/909af4c2-7392-4bbc-af18-2ea890714ecd-1.jpg',
    items: [
      { id: 'p1', name: { nl: 'Tomapork van Gaasterlander', fr: "Tomapork de Gaasterlander", en: "Tomapork from Gaasterlander" }, desc: { nl: "Botermals 'kotelet' met been", fr: "Côtelette fondante avec os", en: "Melt-in-your-mouth chop on the bone" }, price: 42.00 },
      { id: 'p2', name: { nl: 'Spare Ribs', fr: "Spare Ribs", en: "Spare Ribs" }, desc: { nl: 'Secret dipsausje, vlees valt van het bot', fr: "Sauce dip secrète, la viande se détache de l'os", en: "Secret dipping sauce, meat falls off the bone" }, price: 28.90 },
      { id: 'p3', name: { nl: 'Spare Ribs XL', fr: "Spare Ribs XL", en: "Spare Ribs XL" }, price: 37.90 },
      { id: 'p4', name: { nl: 'Varkenshaasje', fr: "Filet mignon de porc", en: "Pork tenderloin" }, desc: { nl: 'Volledig varkenshaasje, botermals en sappig', fr: "Filet mignon entier, fondant et juteux", en: "Whole pork tenderloin, tender and juicy" }, price: 34.90 },
    ],
  },
  {
    id: 'klassiekers',
    key: 'cat_classics',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799913-Y5ZEKPI4I2XXUTYC8W3T/d2db3621-8f9b-45f1-95c8-498c24ed15c3-1.jpg',
    items: [
      { id: 'cl1', name: { nl: 'Steak Tartaar', fr: "Steak tartare", en: "Steak tartare" }, desc: { nl: 'Handgesneden', fr: "Coupé au couteau", en: "Hand-cut" }, price: 35.90 },
      { id: 'cl2', name: { nl: 'Bouletten in Luikse Saus', fr: "Boulets sauce liégeoise", en: "Meatballs in Liège sauce" }, price: 26.90 },
      { id: 'cl3', name: { nl: 'Stoofvlees', fr: "Carbonnade flamande", en: "Beef stew" }, desc: { nl: 'Op Grootmoeders wijze', fr: "Façon grand-mère", en: "Grandmother's recipe" }, price: 29.00 },
      { id: 'cl4', name: { nl: 'Nieuw-Zeelandse Lamsschouder', fr: "Épaule d'agneau néo-zélandais", en: "New Zealand lamb shoulder" }, desc: { nl: 'Traag gegaard', fr: "Cuisson lente", en: "Slow-cooked" }, price: 49.90 },
    ],
  },
  {
    id: 'sauzen',
    key: 'cat_sauces',
    image: null,
    items: [
      { id: 's1', name: { nl: 'Peperroom / Blackwell / Graanmosterd / Provencaalse / Champignon / Stroganoff', fr: "Poivre / Blackwell / Moutarde aux grains / Provençale / Champignons / Stroganoff", en: "Pepper cream / Blackwell / Grain mustard / Provençal / Mushroom / Stroganoff" }, price: 4.50 },
      { id: 's2', name: { nl: 'Roquefort — vers geklopt', fr: "Roquefort — fouetté frais", en: "Roquefort — freshly whipped" }, price: 4.90 },
      { id: 's3', name: { nl: 'Béarnaise — vers geklopt', fr: "Béarnaise — fouettée fraîche", en: "Béarnaise — freshly whipped" }, price: 5.00 },
      { id: 's4', name: { nl: 'Gebakken champignons', fr: "Champignons poêlés", en: "Sautéed mushrooms" }, price: 4.90 },
      { id: 's5', name: { nl: 'Kruidenboter / Vleesjus', fr: "Beurre aux herbes / Jus de viande", en: "Herb butter / Meat jus" }, price: 3.50 },
    ],
  },
  {
    id: 'bijgerechten',
    key: 'cat_sides',
    image: null,
    items: [
      { id: 'b1', name: { nl: 'Verse kroketten', fr: "Croquettes fraîches", en: "Fresh croquettes" }, price: 3.00 },
      { id: 'b2', name: { nl: 'Aardappelpuree', fr: "Purée de pommes de terre", en: "Mashed potatoes" }, price: 3.00 },
      { id: 'b3', name: { nl: 'Spinazie met room', fr: "Épinards à la crème", en: "Creamed spinach" }, price: 5.50 },
      { id: 'b4', name: { nl: 'Gestoomde groenten', fr: "Légumes vapeur", en: "Steamed vegetables" }, price: 6.00 },
      { id: 'b5', name: { nl: 'Broccolini met groene asperges', fr: "Broccolini aux asperges vertes", en: "Broccolini with green asparagus" }, price: 8.50 },
    ],
  },
  {
    id: 'nagerechten',
    key: 'cat_desserts',
    image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799926-VML5QXWO8V6D1NYAO2ZA/909af4c2-7392-4bbc-af18-2ea890714ecd-1.jpg',
    items: [
      { id: 'd1', name: { nl: 'Crème Brûlée', fr: "Crème Brûlée", en: "Crème Brûlée" }, price: null },
      { id: 'd2', name: { nl: 'Dame Blanche', fr: "Dame Blanche", en: "Dame Blanche" }, price: null },
      { id: 'd3', name: { nl: 'Huisgedraaid vanille-ijs', fr: "Glace vanille maison", en: "House-churned vanilla ice cream" }, price: null },
      { id: 'd4', name: { nl: 'Stracciatella ijs', fr: "Glace stracciatella", en: "Stracciatella ice cream" }, price: null },
      { id: 'd5', name: { nl: 'Entremisu Bogèst', fr: "Entremisu Bogèst", en: "Entremisu Bogèst" }, desc: { nl: 'Onze versie van tiramisu', fr: "Notre version du tiramisu", en: "Our take on tiramisu" }, price: null },
      { id: 'd6', name: { nl: 'Panna Cotta', fr: "Panna Cotta", en: "Panna Cotta" }, desc: { nl: 'Met vruchtencoulis', fr: "Au coulis de fruits", en: "With fruit coulis" }, price: null },
      { id: 'd7', name: { nl: 'Twijfelaar Bogèst', fr: "L'Indécis Bogèst", en: "The Doubter Bogèst" }, desc: { nl: 'Chocolademousse & Entremisu', fr: "Mousse au chocolat & Entremisu", en: "Chocolate mousse & Entremisu" }, price: null },
    ],
  },
];

// Takeaway menu (simplified pricing)
export const TAKEAWAY_MENU = [
  {
    category: 'cat_beef',
    items: [
      { id: 'ta-r1', name: { nl: 'Steak (200g)', fr: "Steak (200g)", en: "Steak (200g)" }, price: 28.90 },
      { id: 'ta-r2', name: { nl: 'Rib Eye (250g)', fr: "Rib Eye (250g)", en: "Rib Eye (250g)" }, price: 34.90 },
      { id: 'ta-r3', name: { nl: 'Filet pur (200g)', fr: "Filet pur (200g)", en: "Filet pur (200g)" }, price: 36.90 },
      { id: 'ta-r4', name: { nl: 'Rundsbrochette', fr: "Brochette de bœuf", en: "Beef brochette" }, price: 32.90 },
    ],
  },
  {
    category: 'cat_chicken_pork',
    items: [
      { id: 'ta-k1', name: { nl: 'Kippenbrochette', fr: "Brochette de poulet", en: "Chicken brochette" }, price: 24.90 },
      { id: 'ta-p1', name: { nl: 'Spare Ribs', fr: "Spare Ribs", en: "Spare Ribs" }, price: 24.90 },
      { id: 'ta-p2', name: { nl: 'Varkenshaasje', fr: "Filet mignon de porc", en: "Pork tenderloin" }, price: 28.90 },
    ],
  },
  {
    category: 'cat_classics',
    items: [
      { id: 'ta-c1', name: { nl: 'Stoofvlees', fr: "Carbonnade flamande", en: "Beef stew" }, price: 22.90 },
      { id: 'ta-c2', name: { nl: 'Vol au Vent', fr: "Vol au Vent", en: "Vol au Vent" }, price: 22.90 },
      { id: 'ta-c3', name: { nl: 'Bouletten in Luikse Saus', fr: "Boulets sauce liégeoise", en: "Meatballs in Liège sauce" }, price: 19.90 },
    ],
  },
  {
    category: 'cat_sides',
    items: [
      { id: 'ta-b1', name: { nl: 'Verse kroketten', fr: "Croquettes fraîches", en: "Fresh croquettes" }, price: 3.00 },
      { id: 'ta-b2', name: { nl: 'Aardappelpuree', fr: "Purée de pommes de terre", en: "Mashed potatoes" }, price: 3.00 },
      { id: 'ta-b3', name: { nl: 'Gestoomde groenten', fr: "Légumes vapeur", en: "Steamed vegetables" }, price: 5.50 },
      { id: 'ta-b4', name: { nl: 'Spinazie met room', fr: "Épinards à la crème", en: "Creamed spinach" }, price: 4.50 },
    ],
  },
];

export const PICKUP_TIMES = [
  '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30',
];

export const RESERVATION_TIMES = [
  '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00',
  '19:30', '20:00', '20:30', '21:00', '21:30',
];