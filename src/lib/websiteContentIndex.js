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
  make('about', 'page', 'About / Story', ['about', 'over ons', 'verhaal', 'filosofie', 'philosophy', 'qui sommes nous', 'wie zijn wij', 'wie we zijn'], '/about', 'navigate', 'about', 'The about / philosophy overview page'),
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
  { id: 'about', words: ['over ons', 'geschiedenis', 'wie zijn wij', 'who are we', 'wie we zijn', 'wie zijn jullie', 'story', 'our story', 'notre histoire', 'missie', 'waarden', 'values', 'waarom bogest', 'bestaan', 'opgericht', 'arden', 'boffe', 'leniere'] },
  { id: 'about-ons-verhaal', words: ['ons verhaal', 'het verhaal', 'onze geschiedenis', 'verhaal van bogest'] },
  { id: 'about-onze-filosofie', words: ['onze filosofie', 'filosofie pagina', 'de filosofie', 'pijlers', 'pillars', 'our philosophy', 'notre philosophie', 'belofte', 'filosofie van bogest', 'what makes us unique', 'wat ons uniek maakt'] },
  { id: 'instagram', words: ['instagram', 'insta', 'social', 'socials', 'social media', 'foto', 'fotos', 'photo', 'photos', 'pictures', 'beeld', 'beelden', 'sfeerbeeld', 'sfeerbeelden', 'feed', 'posts'] },
  { id: 'home-story', words: ['verhaal'] },
  { id: 'home-philosophy', words: ['filosofie', 'philosophy', 'formule', 'specialiteit', 'wijnen', 'sfeer'] },
  { id: 'home-suggestions', words: ['suggesties', 'maandelijkse suggesties', 'monthly suggestions', 'specials', 'seizoenspecials', 'suggestions du mois', 'seizoen', 'seizoensgerecht', 'chef suggestie'] },
  { id: 'home-reviews', words: ['ervaringen', 'reviews', 'recensies', 'testimonials', 'beoordelingen', 'wat zeggen klanten', 'avis', 'guest reviews', 'gasten'] },
  { id: 'home-stats', words: ['stats', 'statistieken', 'cijfers', 'in cijfers', 'chiffres', 'in numbers', 'jaar ervaring'] },
  { id: 'home-cta', words: ['acties', 'reserveer nu', 'actiekaarten', 'bestel nu', 'reserveer direct'] },
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