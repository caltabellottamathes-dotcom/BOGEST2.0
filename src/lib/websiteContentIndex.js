import { MENU_DATA, getLocations } from '@/lib/data';

/**
 * Website Content Index — the complete, declarative map of EVERYTHING on the
 * Bogèst site that the digital host can guide a visitor to.
 *
 * The conversational sync engine listens to what the ElevenLabs agent says and
 * matches it against this index. Coverage = this index = the real site, so it
 * is never limited to a predefined keyword list. Adding a page/section/dish is
 * one entry here (or, for dishes, just a row in MENU_DATA which this builds
 * from automatically).
 *
 * Each entry:
 *   { id, type, label, aliases:[...], page, action, target, desc }
 *   - action: 'navigate' (go to a page) | 'scroll' (to a section id)
 *            | 'highlight' (a dish) | 'openLocation' (a location page + its
 *              restaurant-and-spaces panel) | 'close' (dismiss an open panel)
 *   - page:   route that must be active for scroll/highlight/openLocation to work
 *   - target: dispatcher target — a navigate route-key, an element id, a
 *             data-highlight slug, or a location slug
 *   - desc:   short human hint for the LLM router (intent / meaning)
 */

const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function make(id, type, label, aliases, page, action, target, desc) {
  return {
    id,
    type,
    label,
    aliases: [label, ...(aliases || [])].filter(Boolean),
    page,
    action,
    target: target || id,
    desc: desc || '',
  };
}

const INDEX = [];

// ── Pages ────────────────────────────────────────────────────────────────
INDEX.push(
  make('home', 'page', 'Home', ['home', 'start', 'homepage', 'welkom', 'accueil', 'accueil page', 'terug naar begin', 'naar begin', 'beginpagina'], '/', 'navigate', 'home', 'The homepage / start'),
  make('menu', 'page', 'Menu', ['menu', 'kaart', 'carte', 'the menu', 'full menu', 'speisekarte', 'menukaart', 'de kaart', 'wat staat op het menu', 'gerechten'], '/menu', 'navigate', 'menu', 'The full menu page'),
  make('about', 'page', 'About / Story', ['about', 'over ons', 'verhaal', 'filosofie', 'philosophy', 'qui sommes nous', 'wie zijn wij', 'wie we zijn', 'bogest', 'bogèst', 'over bogest', 'over het restaurant', 'about bogest', 'about the restaurant', 'vertel over', 'vertel me over', 'tell me about', 'de zaak', 'over de zaak', 'het restaurant', 'ons restaurant', 'wie is bogest', 'wat is bogest'], '/about', 'navigate', 'about', 'The about / philosophy overview page — opens when a visitor asks to learn about the restaurant or Bogèst'),
  make('about-ons-verhaal', 'page', 'Ons verhaal', ['ons verhaal', 'het verhaal', 'onze geschiedenis', 'our story', 'notre histoire', 'het verhaal van bogest', 'ons verhaal pagina'], '/about/ons-verhaal', 'navigate', '/about/ons-verhaal', 'The dedicated story page — ons verhaal'),
  make('about-onze-filosofie', 'page', 'Onze filosofie', ['onze filosofie', 'filosofie pagina', 'de filosofie', 'pijlers', 'our philosophy', 'notre philosophie', 'belofte', 'filosofie van bogest'], '/about/onze-filosofie', 'navigate', '/about/onze-filosofie', 'The philosophy page — pijlers van Bogèst (formule, ambacht, wijnen, sfeer)'),
  make('locations', 'page', 'Locations overview', ['locations', 'vestigingen', 'locaties', 'adresses', 'our locations', 'where', 'where are you', 'where are we', 'which cities', 'welke steden', 'waar zitten jullie', 'waar zijn jullie', 'adres', 'addresses', 'all locations', 'adressen'], '/locations', 'navigate', 'locations', 'Overview of ALL restaurants / where to find us / which cities'),
  make('reserve', 'page', 'Reserve', ['reserve', 'reserveer', 'reserveren', 'reservation', 'booking', 'table', 'tafel', 'réservation', 'reservering', 'book a table', 'tafel reserveren', 'een tafel', 'plaats', 'book', 'reserveren bij'], '/reserve', 'navigate', 'reserve', 'Make a reservation / book a table'),
  make('takeaway', 'page', 'Takeaway', ['takeaway', 'afhalen', 'afhaal', 'take away', 'pickup', 'emporter', 'order online', 'bestellen', 'afhalen bestellen', 'take-out', 'meenemen'], '/takeaway', 'navigate', 'takeaway', 'Takeaway / pickup / order online'),
  make('gift-cards', 'page', 'Gift cards', ['gift-cards', 'giftcards', 'cadeaubonnen', 'cadeaubon', 'cadeau', 'gift card', 'giftcard', 'bon cadeau', 'cadeaubonnen', 'een cadeaubon', 'cadeau doen', 'voucher'], '/gift-cards', 'navigate', 'gift-cards', 'Gift cards / vouchers'),
  make('contact', 'page', 'Contact', ['contact', 'contacteer', 'contactformulier', 'contact us', 'nous contacter', 'bericht', 'stuur een bericht', 'een vraag stellen', 'contact opnemen'], '/contact', 'navigate', 'contact', 'Contact form / send a message'),
  make('groups', 'page', 'Groups', ['groups', 'groepen', 'groep', 'group bookings', 'events', 'party', 'private dining', 'privé dining', 'groepsreservatie', 'company', 'met een groep', 'groepsboeking', 'bedrijf', 'teamuitje'], '/groups', 'navigate', 'groups', 'Group bookings / events / private dining'),
  make('jobs', 'page', 'Jobs', ['jobs', 'vacatures', 'vacature', 'careers', 'work', 'werken bij', 'travail', 'job', 'werken', 'solliciteren', 'vacature'], '/jobs', 'navigate', 'jobs', 'Jobs / careers / work with us'),
  make('instagram', 'page', 'Instagram', ['instagram', 'social', 'socials', 'social media', 'photos', "foto's", 'fotos', 'feed', 'posts'], '/about/instagram', 'navigate', '/about/instagram', 'Instagram feed / social photos'),
);

// ── Locations (specific) ──────────────────────────────────────────────────
// A specific location mention opens that location's info page AND immediately
// opens its "restaurant en ruimtes" (spaces) panel.
getLocations('nl').forEach((l) => {
  if (!l.phone) return; // skip "coming soon"
  INDEX.push(
    make(
      `loc-${l.slug}`,
      'location',
      l.name,
      [l.city, l.name, `bogèst ${l.city}`, `bogest ${l.city}`, `vestiging ${l.city}`, `restaurant ${l.city}`, `in ${l.city}`, `te ${l.city}`, `à ${l.city}`, `at ${l.city}`, `naar ${l.city}`],
      `/locations/${l.slug}`,
      'navigate',
      l.slug,
      `Specific restaurant in ${l.city} — opens its info page (spaces are shown on the page)`
    )
  );
});

// ── Home sections (scroll) ────────────────────────────────────────────────
INDEX.push(
  make('home-story', 'section', 'Story', ['verhaal', 'story', 'ons verhaal', 'our story', 'het verhaal', 'histoire', 'notre histoire', 'wie we zijn'], '/', 'scroll', 'verhaal', 'The story section on the home page'),
  make('home-stats', 'section', 'Stats', ['stats', 'statistieken', 'cijfers', 'numbers', 'in cijfers', 'chiffres', 'in numbers'], '/', 'scroll', 'stats', 'The numbers / stats section on the home page'),
  make('home-philosophy', 'section', 'Philosophy', ['filosofie', 'philosophy', 'onze filosofie', 'pillars', 'pijlers', 'what makes us unique', 'wat ons uniek maakt', 'formule', 'specialiteit', 'wijnen', 'sfeer', 'wat onderscheidt ons', 'pillars of bogèst'], '/', 'scroll', 'filosofie', 'The philosophy / pillars section on the home page'),
  make('home-suggestions', 'section', 'Monthly suggestions', ['suggesties', 'maandelijkse suggesties', 'monthly suggestions', 'suggestions du mois', 'specials', 'seizoenspecials', 'suggestions of the month', 'seizoen', 'maand', 'maandsuggesties', 'suggestion du mois'], '/', 'scroll', 'suggesties', 'Monthly / seasonal suggestions section on the home page'),
  make('home-cta', 'section', 'Actions', ['acties', 'reserveer nu', 'cta', 'actions', 'actiekaarten', 'kaarten'], '/', 'scroll', 'acties', 'Action cards section on the home page'),
  make('home-locations-preview', 'section', 'Locations preview', ['vestigingen preview', 'our locations preview', 'locations on home', 'locaties preview', 'preview vestigingen'], '/', 'scroll', 'vestigingen', 'Locations preview section on the home page'),
  make('home-reviews', 'section', 'Reviews', ['ervaringen', 'reviews', 'review', 'recensies', 'testimonials', 'klanten', 'beoordelingen', 'wat zeggen klanten', 'klantbeoordelingen', 'avis'], '/', 'scroll', 'ervaringen', 'Reviews / testimonials section on the home page'),
  make('home-einde', 'section', 'Closing', ['einde', 'closing', 'afsluiting', 'slot', 'onderaan', 'naar beneden', 'laatste'], '/', 'scroll', 'einde', 'The closing section at the bottom of the home page'),
  make('menu-maandselectie', 'section', 'Monthly selection', ['maandselectie', 'maandelijkse selectie', 'chef suggestie', 'suggestions du mois', 'monthly selection', 'seizoensuggesties', 'specials', 'suggestie van de chef'], '/menu', 'scroll', 'maandselectie', 'The chef monthly / seasonal selection on the menu page'),
);

// ── Menu categories (scroll on /menu) ─────────────────────────────────────
const CAT_ALIASES = {
  voorgerechten: ['voorgerechten', 'starters', 'entrées', 'entrees', 'voor gerecht', 'soep', 'garnaalkroket', 'voorgerecht'],
  runs: ['runds', 'beef', 'rundvlees', 'vlees', 'grill', 'steaks', 'bœuf', 'carne', 'steak', 'ribeye', 'filet pur', "côte à l'os", 'chateaubriand', 'rund'],
  masters: ['masters', 'masters of meat', 'premium', 'premiumrunds', 'dry aged', 'premium beef', 'angus', 'hereford', 'the masters'],
  kip: ['kip', 'chicken', 'poulet', 'gevogelte', 'volaille', 'kefte', 'vol au vent', 'kippenbrochette', 'kippen'],
  vis: ['vis', 'fish', 'poisson', 'vegetarisch', 'veggie', 'veggie lasagna', 'zalm', 'scampi', 'zeetong', 'salmon', 'no chicken', 'vegetarisch'],
  varken: ['varken', 'pork', 'porc', 'spare ribs', 'ribs', 'varkenshaasje', 'tomapork', 'spare-ribs', 'varkens'],
  klassiekers: ['klassiekers', 'classics', 'classiques', 'stoofvlees', 'tartaar', 'lamsschouder', 'stew', 'tartare', 'steak tartaar', 'bouletten', 'klassieker'],
  sauzen: ['sauzen', 'sauces', 'sauces', 'saus', 'béarnaise', 'roquefort', 'peperroom', 'sausjes', 'saus'],
  bijgerechten: ['bijgerechten', 'sides', 'accompagnements', 'kroketten', 'groenten', 'spinazie', 'bijgerecht', 'bijgerechten'],
  nagerechten: ['nagerechten', 'desserts', 'dessert', 'nagerecht', 'crème brûlée', 'tiramisu', 'entremisu', 'panna cotta', 'ijs', 'dame blanche', 'zoet'],
};
MENU_DATA.forEach((cat) => {
  INDEX.push(
    make(`menu-cat-${cat.id}`, 'menu-category', cat.id, CAT_ALIASES[cat.id] || [cat.id], '/menu', 'scroll', cat.id, `Menu category: ${cat.id}`)
  );
  cat.items.forEach((item) => {
    const nl = item.name?.nl || '';
    const fr = item.name?.fr || '';
    const en = item.name?.en || '';
    const slug = slugify(nl);
    if (!slug) return;
    const aliases = [nl, fr, en];
    if (item.desc) aliases.push(item.desc.nl, item.desc.fr, item.desc.en);
    INDEX.push(make(`menu-dish-${item.id}`, 'dish', nl, aliases.filter(Boolean), '/menu', 'highlight', slug, `Menu dish: ${nl}`));
  });
});

// ── Location sub-sections (scroll on /locations/{slug}) ───────────────────
['hasselt', 'borgloon', 'heusden-zolder'].forEach((slug) => {
  INDEX.push(make(`loc-${slug}-hours`, 'section', `Hours ${slug}`, ['openingsuren', 'opening hours', 'hours', 'uren', 'horaires', 'geopend', 'when open', 'openingstijden', 'openingstijd', 'wanneer open', 'hoe laat open', 'tijden'], `/locations/${slug}`, 'scroll', 'openingsuren', `Opening hours of ${slug}`));
  INDEX.push(make(`loc-${slug}-parking`, 'section', `Parking ${slug}`, ['parking', 'parkeren', 'car park', 'parkeerplaats', 'waar parkeren', 'parkeergarage'], `/locations/${slug}`, 'scroll', 'parking', `Parking info for ${slug}`));
  INDEX.push(make(`loc-${slug}-contact`, 'section', `Contact ${slug}`, ['contact', 'adres', 'address', 'phone', 'telefoon', 'email', 'telefoonnummer', 'telefoon', 'how to reach'], `/locations/${slug}`, 'scroll', 'contact', `Contact / address of ${slug}`));
  // Terrace / spaces → open the restaurant-and-spaces panel (same as the location itself)
  INDEX.push(make(`loc-${slug}-spaces`, 'section', `Spaces ${slug}`, ['spaces', 'ruimtes', 'restaurant spaces', 'terras', 'terrace', 'zaal', 'salles', 'rooms', 'restaurant en ruimtes', 'de ruimtes', 'zalen', 'terrassen'], `/locations/${slug}`, 'scroll', 'spaces', `Terrace / spaces / rooms of ${slug} — scrolls to the spaces section on that location's page`));
});

// ── Panel & page sections (scroll) ─────────────────────────────────────────
INDEX.push(
  // /about
  make('about-quote', 'section', 'About quote', ['over ons quote', 'quote', 'citaten', 'de belofte', 'belofte quote'], '/about', 'scroll', 'about-quote', 'The opening quote on the about page'),
  make('about-cards', 'section', 'About cards', ['over ons kaarten', 'verhaal filosofie social', 'drie kaarten', 'about cards', 'over ons kaarten'], '/about', 'scroll', 'about-cards', 'The three about cards (story, philosophy, social)'),
  // /about/ons-verhaal
  make('verhaal-header', 'section', 'Story header', ['verhaal header', 'verhaal intro', 'ons verhaal intro', 'story header'], '/about/ons-verhaal', 'scroll', 'verhaal-header', 'The story header on Ons Verhaal'),
  make('verhaal-hoofdstukken', 'section', 'Story chapters', ['hoofdstukken', 'chapters', 'verhaal hoofdstukken', 'story chapters', 'de hoofdstukken'], '/about/ons-verhaal', 'scroll', 'verhaal-hoofdstukken', 'The story chapters container on Ons Verhaal'),
  make('verhaal-h-01', 'section', 'Chapter 01', ['hoofdstuk 1', 'hoofdstuk 01', 'chapter 1', 'chapitre 1', 'hoofdstuk een'], '/about/ons-verhaal', 'scroll', 'verhaal-hoofdstuk-01', 'Story chapter 01'),
  make('verhaal-h-02', 'section', 'Chapter 02', ['hoofdstuk 2', 'hoofdstuk 02', 'chapter 2', 'chapitre 2', 'hoofdstuk twee'], '/about/ons-verhaal', 'scroll', 'verhaal-hoofdstuk-02', 'Story chapter 02'),
  make('verhaal-h-03', 'section', 'Chapter 03', ['hoofdstuk 3', 'hoofdstuk 03', 'chapter 3', 'chapitre 3', 'hoofdstuk drie'], '/about/ons-verhaal', 'scroll', 'verhaal-hoofdstuk-03', 'Story chapter 03'),
  make('verhaal-h-04', 'section', 'Chapter 04', ['hoofdstuk 4', 'hoofdstuk 04', 'chapter 4', 'chapitre 4', 'hoofdstuk vier'], '/about/ons-verhaal', 'scroll', 'verhaal-hoofdstuk-04', 'Story chapter 04'),
  // /about/onze-filosofie
  make('filosofie-header', 'section', 'Philosophy header', ['filosofie header', 'filosofie intro', 'pijlers intro', 'philosophy header'], '/about/onze-filosofie', 'scroll', 'filosofie-header', 'The philosophy header'),
  make('filosofie-pijlers', 'section', 'Pillars', ['de pijlers', 'filosofie pijlers', 'the pillars', 'vijf pijlers', 'pijlers container'], '/about/onze-filosofie', 'scroll', 'filosofie-pijlers', 'The five pillars container of Bogèst'),
  make('filosofie-p-01', 'section', 'Pillar 01 — formula', ['pijler 01', 'pijler 1', 'de formule', 'formule pijler', 'the formula', 'la formule', 'onze formule'], '/about/onze-filosofie', 'scroll', 'filosofie-pijler-01', 'Pillar 01 — the formula'),
  make('filosofie-p-02', 'section', 'Pillar 02 — craft', ['pijler 02', 'pijler 2', 'de specialiteit', 'vleesambacht', 'the craft', 'la specialite', 'specialiteit pijler'], '/about/onze-filosofie', 'scroll', 'filosofie-pijler-02', 'Pillar 02 — the meat craft'),
  make('filosofie-p-03', 'section', 'Pillar 03 — everyone', ['pijler 03', 'pijler 3', 'voor iedereen', 'kip vis veggie', 'for everyone', 'pour tous'], '/about/onze-filosofie', 'scroll', 'filosofie-pijler-03', 'Pillar 03 — for everyone'),
  make('filosofie-p-04', 'section', 'Pillar 04 — wines', ['pijler 04', 'pijler 4', 'de wijnen', 'wijnen pijler', 'huislabel', 'the wines', 'les vins'], '/about/onze-filosofie', 'scroll', 'filosofie-pijler-04', 'Pillar 04 — the wines'),
  make('filosofie-p-05', 'section', 'Pillar 05 — atmosphere', ['pijler 05', 'pijler 5', 'de sfeer', 'sfeer pijler', 'the atmosphere', 'l ambiance', 'authentieke hoeves'], '/about/onze-filosofie', 'scroll', 'filosofie-pijler-05', 'Pillar 05 — the atmosphere'),
  // /locations overview cards
  make('loc-card-hasselt', 'section', 'Hasselt card', ['hasselt kaart', 'hasselt vestiging', 'hasselt card', 'kaart hasselt'], '/locations', 'scroll', 'loc-card-hasselt', 'The Hasselt location card on the locations overview'),
  make('loc-card-borgloon', 'section', 'Borgloon card', ['borgloon kaart', 'borgloon vestiging', 'borgloon card', 'kaart borgloon'], '/locations', 'scroll', 'loc-card-borgloon', 'The Borgloon location card on the locations overview'),
  make('loc-card-heusden-zolder', 'section', 'Heusden-Zolder card', ['heusden kaart', 'heusden-zolder vestiging', 'heusden card', 'kaart heusden', 'zolder kaart'], '/locations', 'scroll', 'loc-card-heusden-zolder', 'The Heusden-Zolder location card on the locations overview'),
  make('loc-card-lommel', 'section', 'Lommel card', ['lommel kaart', 'lommel vestiging', 'lommel card', 'kaart lommel'], '/locations', 'scroll', 'loc-card-lommel', 'The Lommel (coming soon) card on the locations overview'),
  // /restaurant-spaces/{location}
  make('spaces-hero', 'section', 'Spaces hero', ['ruimtes hero', 'spaces header', 'ruimtes header'], null, 'scroll', 'spaces-hero', 'The spaces page hero'),
  make('spaces-grid', 'section', 'Spaces grid', ['ruimtes grid', 'spaces overzicht', 'ruimtes overzicht', 'de ruimtes grid'], null, 'scroll', 'spaces-grid', 'The spaces grid'),
  // /reserve
  make('reserveer-vestigingen', 'section', 'Reserve locations', ['reserveer vestiging', 'vestiging kiezen', 'kies vestiging', 'waar tafel', 'choose location', 'waar mag de tafel'], '/reserve', 'scroll', 'reserveer-vestigingen', 'The location picker on the reserve page'),
  // /takeaway
  make('takeaway-story', 'section', 'Takeaway story', ['traiteur verhaal', 'takeaway verhaal', 'onze keuken thuis', 'traiteur', 'keuken thuis'], '/takeaway', 'scroll', 'takeaway-story', 'The traiteur story section'),
  make('takeaway-pakketten', 'section', 'Gift packages', ['cadeaupakketten', 'gift packages', 'pakketten', 'wijn pakket', 'gin pakket', 'cadeaupakket'], '/takeaway', 'scroll', 'takeaway-pakketten', 'The gift packages section on takeaway'),
  make('takeaway-order', 'section', 'Order takeaway', ['bestel takeaway', 'bestel nu', 'bestellen', 'order takeaway', 'bestel'], '/takeaway', 'scroll', 'takeaway-order', 'The order CTA on the takeaway page'),
  // /gift-cards
  make('cadeaubon-highlights', 'section', 'Gift card highlights', ['cadeaubon highlights', 'gift card highlights', 'highlights'], '/gift-cards', 'scroll', 'cadeaubon-highlights', 'The gift card highlights section'),
  make('cadeaubon-bestel', 'section', 'Order gift card', ['cadeaubon bestel', 'bestel cadeaubon', 'buy gift card', 'koop cadeaubon', 'bestel cadeaubon'], '/gift-cards', 'scroll', 'bestel', 'The order gift card CTA'),
  make('cadeaubon-saldo', 'section', 'Check balance', ['saldo', 'saldo controleren', 'check balance', 'controleer saldo', 'restwaarde', 'saldo check'], '/gift-cards', 'scroll', 'cadeaubon-saldo', 'The check gift card balance section'),
  // /contact
  make('contact-formulier', 'section', 'Contact form', ['contact formulier', 'contactformulier', 'stuur bericht', 'formulier', 'contact form', 'stuur een bericht'], '/contact', 'scroll', 'contact-formulier', 'The contact form'),
  make('contact-vestigingen', 'section', 'Contact locations', ['contact vestigingen', 'vestigingen contact', 'locations contact', 'locaties contact'], '/contact', 'scroll', 'contact-vestigingen', 'The locations list on the contact page'),
  // /groups
  make('groepen-concept', 'section', 'Groups concept', ['groepen concept', 'concept', 'groepsformule', 'group concept'], '/groups', 'scroll', 'groepen-concept', 'The groups concept section'),
  make('groepen-aanvraag', 'section', 'Group request', ['groepen aanvraag', 'aanvraag', 'groepsaanvraag', 'group request', 'request form', 'aanvraag formulier'], '/groups', 'scroll', 'groepen-aanvraag', 'The group request form'),
  make('groepen-evenementen', 'section', 'Group events', ['groepen evenementen', 'evenementen', 'soorten evenementen', 'group events', 'events list'], '/groups', 'scroll', 'groepen-evenementen', 'The events list on the groups page'),
  // /jobs
  make('vacatures', 'section', 'Job openings', ['vacatures', 'openstaande vacatures', 'jobs list', 'job openings', 'open positions'], '/jobs', 'scroll', 'vacatures', 'The job openings list'),
  make('langskomen', 'section', 'Walk in', ['langskomen', 'langslopen', 'walk in', 'drop by', 'spontaan solliciteren', 'spontaan langskomen'], '/jobs', 'scroll', 'langskomen', 'The walk-in / drop-by info card'),
  make('solliciteren', 'section', 'Apply', ['solliciteren', 'sollicitatie', 'sollicitatieformulier', 'apply', 'candidature', 'apply form'], '/jobs', 'scroll', 'solliciteren', 'The job application form'),
  // /about/instagram
  make('instagram-feed', 'section', 'Instagram feed', ['instagram feed', 'instagram berichten', 'ig feed', 'instagram posts'], '/about/instagram', 'scroll', 'instagram-feed', 'The Instagram feed section'),
  make('facebook-feed', 'section', 'Facebook feed', ['facebook feed', 'facebook berichten', 'fb feed', 'facebook posts'], '/about/instagram', 'scroll', 'facebook-feed', 'The Facebook feed section'),
  make('social-accounts', 'section', 'Social accounts', ['social accounts', 'accounts', 'volg ons', 'vestiging accounts', 'social media accounts', 'volg onze vestigingen'], '/about/instagram', 'scroll', 'social-accounts', 'The location social account links'),
  // Shared CTAs — page = null so they always scroll on the CURRENT page
  make('reserveer-cta', 'section', 'Reserve CTA', ['reserveer', 'reserveer nu', 'reserveer cta', 'reserve button', 'reserveren cta'], null, 'scroll', 'reserveer', 'The reserve call-to-action banner on the current page'),
  make('bestel-cta', 'section', 'Order CTA', ['bestel', 'bestel nu', 'bestel cta', 'order button'], null, 'scroll', 'bestel', 'The order call-to-action banner on the current page'),
  // Legal pages — shared content section (page = null → current legal page)
  make('legal-content', 'section', 'Legal content', ['juridische tekst', 'legal content', 'privacy tekst', 'terms tekst', 'cookies tekst', 'ai disclaimer tekst'], null, 'scroll', 'legal-content', 'The legal document content section'),
  // Restaurant spaces overlay
  make('ruimtes-overlay', 'section', 'Spaces overlay', ['ruimtes overlay', 'restaurant en ruimtes overlay', 'spaces overlay'], null, 'scroll', 'ruimtes-overlay', 'The restaurant-and-spaces overlay panel'),
);

// ── Close (dismiss an open panel) ──────────────────────────────────────────
INDEX.push(
  make('close-panel', 'close', 'Close panel', ['close', 'sluiten', 'sluit', 'dicht', 'fermer', 'ferme', 'close panel', 'sluit panel', 'sluit het panel', 'never mind', 'laat maar', 'laat maar zitten', 'stop', 'annuleer', 'cancel', 'terug', 'go back', 'back', 'hide panel', 'verberg', 'sluit dit', 'weg ermee', 'dismiss', 'verberg panel', 'sluit de ruimtes', 'sluit ruimtes'], null, 'close', 'panel', 'Close / dismiss the currently open panel (e.g. the restaurant-and-spaces panel)')
);

export const CONTENT_INDEX = INDEX;

/** Compact list for the LLM router — keeps the prompt informative but small. */
export function compactIndex() {
  return CONTENT_INDEX.map((e) => ({
    id: e.id,
    type: e.type,
    label: e.label,
    aliases: e.aliases.slice(0, 6),
    desc: e.desc,
  }));
}

// ── Stage A: instant local exact match (free, zero latency) ───────────────
// Only EXACT matches short-circuit — everything else goes to the LLM, which
// understands intent/paraphrase and picks the most specific target, so the
// navigation follows meaning rather than literal keywords.
function norm(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    // Collapse the many spoken/written pronunciations of "Bogèst" so the
    // router recognises the brand however the visitor says or spells it.
    .replace(/\b(bojest|boguest|boghes|bokest|boghest|bogesth|bogestt|boghst|bokest|boguesth)\b/g, 'bogest')
    .replace(/\bbo\s*gest\b/g, 'bogest')
    .trim();
}

export function matchLocal(text) {
  const t = norm(text);
  if (!t || t.length < 2) return null;
  for (const e of CONTENT_INDEX) {
    for (const a of e.aliases) {
      if (norm(a) === t) return e;
    }
  }
  return null;
}

/**
 * Stage A.5 — instant local FUZZY match (free, zero latency).
 *
 * If a specific dish / menu category / location / section alias appears inside
 * the (often long) agent transcript, route to it immediately — no LLM
 * round-trip — so the website scrolls to and highlights what the host is
 * talking about the instant the words are spoken. Only specific entry types
 * are considered (pages are left to the keyword fast-path / agent tool call)
 * and the longest alias match wins, so "spare ribs" beats "ribs" and a dish
 * beats its category.
 */
const TYPE_PRIORITY = { dish: 3, location: 2, section: 1, 'menu-category': 1 };
export function matchFuzzy(text) {
  const t = norm(text);
  if (!t || t.length < 2) return null;
  let best = null;
  let bestLen = 0;
  let bestPri = 0;
  for (const e of CONTENT_INDEX) {
    if (!['dish', 'menu-category', 'location', 'section'].includes(e.type)) continue;
    const pri = TYPE_PRIORITY[e.type] || 0;
    for (const a of e.aliases) {
      const an = norm(a);
      if (an.length < 4) continue;
      if (!t.includes(an)) continue;
      // Longest alias wins; on a tie, a dish beats its category, and a
      // specific location beats a generic section — so "spare ribs" highlights
      // the dish, not the pork category.
      const better = an.length > bestLen || (an.length === bestLen && pri > bestPri);
      if (better) {
        best = e;
        bestLen = an.length;
        bestPri = pri;
      }
    }
  }
  return best;
}

// ── Stage A.6: instant semantic (intent) match ───────────────────────────
// A curated, multilingual cluster map. Each cluster groups the RANGE of ways
// a visitor might refer to a section — synonyms, associated words, related
// categories, paraphrases — not just its literal name. matchSemantic scans
// the (often long) agent topic for any cluster word on a WORD BOUNDARY and
// returns the best entry (longest word, then most specific type) — instantly,
// with no LLM round-trip. This is what makes "I love a good steak",
// "where are you guys", "a birthday with 20 people" or "do you have gift cards"
// navigate the moment the DIRECTION of the conversation becomes clear, before
// any exact section name is spoken.
const SEMANTIC_CLUSTERS = [
  { id: 'menu', words: ['menu', 'kaart', 'carte', 'speisekarte', 'menukaart', 'dish', 'dishes', 'gerecht', 'gerechten', 'food', 'eten', 'maaltijd', 'cuisine', 'keuken', 'plats', 'nourriture', 'wat staat er op het menu', 'kaart bekijken', 'what do you serve', 'wat serveer je', 'wat eten jullie', 'the menu'] },
  { id: 'menu-cat-runs', words: ['meat', 'vlees', 'beef', 'rundvlees', 'steak', 'steaks', 'grill', 'gegrild', 'grilled', 'bbq', 'barbecue', 'braai', 'biefstuk', 'entrecote', 'entrecôte', 'côte à l os', 'cote a l os', 'chateaubriand', 'filet pur', 'ossehaas', 'haas', 'ribeye', 'rib eye', 'tbone', 't bone', 'dry aged', 'dry-aged', 'carne', 'bœuf', 'boeuf', 'stuk vlees', 'piece of meat', 'vleesgerecht', 'vleesgerechten', 'rund', 'mals', 'rosé', 'rare', 'medium', 'gaar', 'vleeskenner', 'vleesliefhebber'] },
  { id: 'menu-cat-masters', words: ['masters', 'masters of meat', 'premium beef', 'angus', 'hereford', 'premiumrunds'] },
  { id: 'menu-cat-kip', words: ['kip', 'kippen', 'chicken', 'poulet', 'gevogelte', 'volaille', 'poultry', 'kefte', 'vol au vent'] },
  { id: 'menu-cat-vis', words: ['vis', 'visgerechten', 'fish', 'poisson', 'zalm', 'salmon', 'scampi', 'zeetong', 'vegetarisch', 'vegetarische', 'veggie', 'vegetarian', 'groenten', 'groente', 'no chicken', 'zalmfilet', 'vegetarisch gerecht'] },
  { id: 'menu-cat-varken', words: ['varken', 'varkens', 'pork', 'porc', 'spare ribs', 'spare-ribs', 'ribs', 'varkenshaasje', 'tomapork', 'ribbetjes'] },
  { id: 'menu-cat-klassiekers', words: ['klassieker', 'klassiekers', 'classics', 'classiques', 'stoofvlees', 'tartaar', 'tartare', 'steak tartaar', 'lamsschouder', 'stew', 'bouletten'] },
  { id: 'menu-cat-sauzen', words: ['saus', 'sauzen', 'sauce', 'sauces', 'béarnaise', 'bearnaise', 'roquefort', 'peperroom', 'sausjes'] },
  { id: 'menu-cat-bijgerechten', words: ['bijgerecht', 'bijgerechten', 'sides', 'accompagnements', 'kroketten', 'spinazie'] },
  { id: 'menu-cat-nagerechten', words: ['nagerecht', 'nagerechten', 'dessert', 'desserts', 'zoet', 'crème brûlée', 'tiramisu', 'panna cotta', 'dame blanche', 'sweet', 'sweets', 'ijs'] },
  { id: 'menu-cat-voorgerechten', words: ['voorgerecht', 'voorgerechten', 'starter', 'starters', 'entrée', 'entrees', 'soep', 'garnaalkroket'] },
  { id: 'menu-cat-kinderen', words: ['kinderen', 'kindermenu', 'kids menu', 'kids', 'children', 'voor de kinderen', 'met kinderen'] },
  { id: 'reserve', words: ['reserveer', 'reserveren', 'reservatie', 'reservaties', 'reservering', 'reservation', 'booking', 'boek', 'boeken', 'tafel', 'table', 'tafel boeken', 'tafel reserveren', 'een tafel', 'book a table', 'reservatie maken', 'diner reserveren', 'lunch reserveren', 'plaats', 'zitplaats', 'seat', 'vrije tafel', 'een plek'] },
  { id: 'locations', words: ['vestigingen', 'vestiging', 'locaties', 'locatie', 'adres', 'address', 'adressen', 'waar zitten jullie', 'waar zijn jullie', 'waar zitten', 'where are you', 'where are we', 'which cities', 'welke steden', 'cities', 'steden', 'find us', 'drie vestigingen', 'three restaurants', 'waar zit bogest', 'terras', 'terrace', 'buiten', 'outdoor', 'veranda', 'patio', 'buiten eten', 'eten buiten', 'gezinsvriendelijk', 'family friendly', 'family'] },
  { id: 'loc-hasselt', words: ['hasselt', 'bogest hasselt', 'bogèst hasselt', 'vestiging hasselt', 'restaurant hasselt', 'in hasselt', 'te hasselt', 'à hasselt', 'at hasselt'] },
  { id: 'loc-borgloon', words: ['borgloon', 'bogest borgloon', 'bogèst borgloon', 'vestiging borgloon', 'restaurant borgloon', 'in borgloon', 'te borgloon', 'à borgloon'] },
  { id: 'loc-heusden-zolder', words: ['heusden zolder', 'heusden-zolder', 'heusden', 'zolder', 'bogest heusden', 'vestiging heusden', 'restaurant heusden', 'in heusden', 'te heusden', 'à heusden'] },
  { id: 'gift-cards', words: ['cadeaubon', 'cadeaubonnen', 'cadeau', 'cadeaus', 'giftcard', 'giftcards', 'gift card', 'gift', 'voucher', 'bon cadeau', 'kado', 'kadotje', 'kerstcadeau', 'verjaardagscadeau', 'cadeau doen', 'present', 'cadeaubon kopen'] },
  { id: 'takeaway', words: ['afhalen', 'afhaal', 'takeaway', 'take away', 'take-away', 'takeout', 'take out', 'pickup', 'pick up', 'meenemen', 'emporter', 'a emporter', 'à emporter', 'order online', 'bestellen', 'bestel', 'thuis', 'delivery', 'levering', 'afhaalmenu'] },
  { id: 'contact', words: ['contact', 'contacteer', 'contactformulier', 'bericht', 'sturen', 'vraag', 'question', 'email', 'mail', 'phone', 'bellen', 'klacht', 'complaint', 'contact form', 'contact opnemen', 'een vraag', 'stuur een bericht'] },
  { id: 'groups', words: ['groep', 'groepen', 'group', 'groups', 'event', 'events', 'feest', 'feestje', 'party', 'verjaardag', 'anniversary', 'celebration', 'bedrijf', 'company', 'team', 'teamuitje', 'business', 'privé', 'private', 'private dining', 'groepsboeking', 'groepsreservatie', 'receptie', 'reception', 'met een groep', 'met de groep', 'communie', 'doopsel', 'huwelijk', 'wedding', 'trouwerij', 'met 20 personen', 'met twintig personen', 'grote groep'] },
  { id: 'jobs', words: ['job', 'jobs', 'vacature', 'vacatures', 'vacancy', 'career', 'careers', 'werk', 'werken', 'work', 'solliciteren', 'apply', 'hiring', 'werk bij', 'werken bij', 'job offer'] },
  { id: 'about', words: ['over ons', 'geschiedenis', 'wie zijn wij', 'who are we', 'wie we zijn', 'wie zijn jullie', 'story', 'our story', 'notre histoire', 'missie', 'waarden', 'values', 'waarom bogest', 'bestaan', 'opgericht', 'arden', 'boffe', 'leniere', 'bogest', 'restaurant', 'het restaurant', 'de zaak', 'over het restaurant', 'over bogest', 'over de zaak', 'about bogest', 'about the restaurant', 'vertel me over', 'vertel over', 'vertel me meer', 'meer over', 'tell me about', 'tell me more', 'wie is bogest', 'wat is bogest', 'ons restaurant', 'over het restaurant'] },
  { id: 'about-ons-verhaal', words: ['ons verhaal', 'het verhaal', 'onze geschiedenis', 'verhaal van bogest'] },
  { id: 'about-onze-filosofie', words: ['onze filosofie', 'filosofie pagina', 'de filosofie', 'pijlers', 'pillars', 'our philosophy', 'notre philosophie', 'belofte', 'filosofie van bogest', 'what makes us unique', 'wat ons uniek maakt'] },
  { id: 'instagram', words: ['instagram', 'insta', 'social', 'socials', 'social media', 'foto', 'fotos', 'photo', 'photos', 'pictures', 'beeld', 'beelden', 'sfeerbeeld', 'sfeerbeelden', 'feed', 'posts', 'facebook', 'fb', 'facebook pagina', 'achter de schermen', 'behind the scenes', 'social media pagina'] },
  { id: 'home-story', words: ['verhaal'] },
  { id: 'home-philosophy', words: ['filosofie', 'philosophy', 'formule', 'specialiteit', 'wijnen', 'sfeer'] },
  { id: 'home-suggestions', words: ['suggesties', 'maandelijkse suggesties', 'monthly suggestions', 'specials', 'seizoenspecials', 'suggestions du mois', 'seizoen', 'seizoensgerecht', 'chef suggestie'] },
  { id: 'home-reviews', words: ['ervaringen', 'reviews', 'recensies', 'testimonials', 'beoordelingen', 'wat zeggen klanten', 'avis', 'guest reviews', 'gasten'] },
  { id: 'home-stats', words: ['stats', 'statistieken', 'cijfers', 'in cijfers', 'chiffres', 'in numbers', 'jaar ervaring'] },
  { id: 'home-cta', words: ['acties', 'reserveer nu', 'actiekaarten', 'bestel nu', 'reserveer direct'] },
  { id: 'verhaal-hoofdstukken', words: ['hoofdstukken', 'verhaal hoofdstukken', 'story chapters', 'de hoofdstukken'] },
  { id: 'filosofie-pijlers', words: ['de pijlers', 'filosofie pijlers', 'the pillars', 'vijf pijlers'] },
  { id: 'groepen-concept', words: ['groepen concept', 'groepsformule', 'group concept'] },
  { id: 'groepen-aanvraag', words: ['groepsaanvraag', 'groep aanvraag', 'group request', 'aanvraag formulier'] },
  { id: 'groepen-evenementen', words: ['soorten evenementen', 'evenementen lijst', 'group events list'] },
  { id: 'vacatures', words: ['vacatures', 'openstaande vacatures', 'job openings', 'open positions'] },
  { id: 'langskomen', words: ['langskomen', 'langslopen', 'spontaan langskomen', 'walk in', 'drop by'] },
  { id: 'solliciteren', words: ['solliciteren', 'sollicitatie', 'sollicitatieformulier', 'apply form'] },
  { id: 'instagram-feed', words: ['instagram feed', 'ig feed', 'instagram berichten'] },
  { id: 'facebook-feed', words: ['facebook feed', 'fb feed', 'facebook berichten'] },
  { id: 'social-accounts', words: ['social accounts', 'volg onze vestigingen', 'social media accounts'] },
  { id: 'contact-formulier', words: ['contact formulier', 'contactformulier', 'stuur een bericht', 'contact form'] },
  { id: 'contact-vestigingen', words: ['contact vestigingen', 'vestigingen contact', 'locations contact'] },
  { id: 'cadeaubon-highlights', words: ['cadeaubon highlights', 'gift card highlights'] },
  { id: 'cadeaubon-saldo', words: ['saldo controleren', 'check balance', 'restwaarde', 'saldo check'] },
  { id: 'takeaway-story', words: ['traiteur verhaal', 'takeaway verhaal', 'onze keuken thuis'] },
  { id: 'takeaway-pakketten', words: ['cadeaupakketten', 'gift packages', 'pakketten'] },
  { id: 'takeaway-order', words: ['bestel takeaway', 'bestel nu takeaway', 'order takeaway'] },
  { id: 'reserveer-vestigingen', words: ['kies vestiging', 'vestiging kiezen', 'choose location', 'waar tafel'] },
  { id: 'reserveer-cta', words: ['reserveer nu', 'reserveer cta', 'reserve button'] },
  { id: 'bestel-cta', words: ['bestel nu', 'bestel cta', 'order button'] },
  { id: 'home-einde', words: ['einde', 'closing', 'afsluiting', 'onderaan', 'naar beneden', 'laatste'] },
  { id: 'menu-maandselectie', words: ['maandselectie', 'maandelijkse selectie', 'chef suggestie', 'suggestions du mois', 'monthly selection', 'seizoensuggesties', 'suggestie van de chef'] },
  { id: 'close-panel', words: ['close', 'sluiten', 'sluit', 'dicht', 'fermer', 'ferme', 'never mind', 'laat maar', 'laat maar zitten', 'stop', 'annuleer', 'cancel', 'terug', 'go back', 'back', 'verberg', 'sluit dit', 'weg ermee', 'dismiss', 'sluit het panel', 'sluit het'] },
];

const SEM_PRIORITY = { 'close': 5, dish: 4, location: 3, 'menu-category': 2, section: 2, page: 1 };

function containsWord(t, term) {
  const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('(^|\\W)' + esc + '(\\W|$)').test(t);
}

export function matchSemantic(text) {
  const t = norm(text);
  if (!t || t.length < 2) return null;
  let bestId = null;
  let bestLen = 0;
  let bestPri = 0;
  for (const cluster of SEMANTIC_CLUSTERS) {
    const entry = CONTENT_INDEX.find((e) => e.id === cluster.id);
    const pri = SEM_PRIORITY[entry?.type] || 1;
    for (const w of cluster.words) {
      const wn = norm(w);
      if (wn.length < 3) continue;
      if (!containsWord(t, wn)) continue;
      // Longest word wins; on a tie, the more specific type wins — so
      // "spare ribs" highlights the dish/category, "meat" opens the beef
      // category, and "close / laat maar" dismisses the panel.
      const better = wn.length > bestLen || (wn.length === bestLen && pri > bestPri);
      if (better) {
        bestId = cluster.id;
        bestLen = wn.length;
        bestPri = pri;
      }
    }
  }
  if (!bestId) return null;
  return CONTENT_INDEX.find((e) => e.id === bestId) || null;
}