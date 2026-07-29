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
  make('about', 'page', 'About / Story', ['about', 'over ons', 'verhaal', 'notre histoire', 'our story', 'filosofie', 'philosophy', 'qui sommes nous', 'het verhaal', 'ons verhaal', 'wie zijn wij', 'wie we zijn'], '/about', 'navigate', 'about', 'The story / about / philosophy page'),
  make('locations', 'page', 'Locations overview', ['locations', 'vestigingen', 'locaties', 'adresses', 'our locations', 'where', 'where are you', 'where are we', 'which cities', 'welke steden', 'waar zitten jullie', 'waar zijn jullie', 'adres', 'addresses', 'all locations', 'adressen'], '/locations', 'navigate', 'locations', 'Overview of ALL restaurants / where to find us / which cities'),
  make('reserve', 'page', 'Reserve', ['reserve', 'reserveer', 'reserveren', 'reservation', 'booking', 'table', 'tafel', 'réservation', 'reservering', 'book a table', 'tafel reserveren', 'een tafel', 'plaats', 'book', 'reserveren bij'], '/reserve', 'navigate', 'reserve', 'Make a reservation / book a table'),
  make('takeaway', 'page', 'Takeaway', ['takeaway', 'afhalen', 'afhaal', 'take away', 'pickup', 'emporter', 'order online', 'bestellen', 'afhalen bestellen', 'take-out', 'meenemen'], '/takeaway', 'navigate', 'takeaway', 'Takeaway / pickup / order online'),
  make('gift-cards', 'page', 'Gift cards', ['gift-cards', 'giftcards', 'cadeaubonnen', 'cadeaubon', 'cadeau', 'gift card', 'giftcard', 'bon cadeau', 'cadeaubonnen', 'een cadeaubon', 'cadeau doen', 'voucher'], '/gift-cards', 'navigate', 'gift-cards', 'Gift cards / vouchers'),
  make('contact', 'page', 'Contact', ['contact', 'contacteer', 'contactformulier', 'contact us', 'nous contacter', 'bericht', 'stuur een bericht', 'een vraag stellen', 'contact opnemen'], '/contact', 'navigate', 'contact', 'Contact form / send a message'),
  make('groups', 'page', 'Groups', ['groups', 'groepen', 'groep', 'group bookings', 'events', 'party', 'private dining', 'privé dining', 'groepsreservatie', 'company', 'met een groep', 'groepsboeking', 'bedrijf', 'teamuitje'], '/groups', 'navigate', 'groups', 'Group bookings / events / private dining'),
  make('jobs', 'page', 'Jobs', ['jobs', 'vacatures', 'vacature', 'careers', 'work', 'werken bij', 'travail', 'job', 'werken', 'solliciteren', 'vacature'], '/jobs', 'navigate', 'jobs', 'Jobs / careers / work with us'),
  make('instagram', 'page', 'Instagram', ['instagram', 'social', 'socials', 'social media', 'photos', "foto's", 'fotos', 'feed', 'posts'], '/instagram', 'navigate', 'instagram', 'Instagram feed / social photos'),
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
      'openLocation',
      l.slug,
      `Specific restaurant in ${l.city} — opens its info page and its restaurant-and-spaces panel`
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
  INDEX.push(make(`loc-${slug}-spaces`, 'section', `Spaces ${slug}`, ['spaces', 'ruimtes', 'restaurant spaces', 'terras', 'terrace', 'zaal', 'salles', 'rooms', 'restaurant en ruimtes', 'de ruimtes', 'zalen', 'terrassen'], `/locations/${slug}`, 'openLocation', slug, `Terrace / spaces / rooms of ${slug} — opens the spaces panel`));
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
export function matchFuzzy(text) {
  const t = norm(text);
  if (!t || t.length < 2) return null;
  let best = null;
  let bestLen = 0;
  for (const e of CONTENT_INDEX) {
    if (!['dish', 'menu-category', 'location', 'section'].includes(e.type)) continue;
    for (const a of e.aliases) {
      const an = norm(a);
      if (an.length < 4) continue;
      if (t.includes(an) && an.length > bestLen) {
        best = e;
        bestLen = an.length;
      }
    }
  }
  return best;
}