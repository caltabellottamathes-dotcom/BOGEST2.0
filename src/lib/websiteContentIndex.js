import { MENU_DATA, getLocations } from '@/lib/data';

/**
 * Website Content Index — the complete, declarative map of everything on the
 * Bogèst site that the digital host can guide a visitor to.
 *
 * The conversational sync engine listens to what the ElevenLabs agent says and
 * matches it against this index. Coverage = this index = the real site, so it
 * is never limited to a predefined keyword list. Adding a page/section/dish is
 * one entry here (or, for dishes, just a row in MENU_DATA which this builds
 * from automatically).
 *
 * Each entry:
 *   { id, type, label, aliases:[...], page, action, target }
 *   - action: 'navigate' (go to a page) | 'scroll' (to a section id) | 'highlight' (a dish)
 *   - page:   route that must be active for scroll/highlight to work
 *   - target: dispatcher target — a navigate route-key, an element id, or a
 *             data-highlight slug
 */

const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function make(id, type, label, aliases, page, action, target) {
  return {
    id,
    type,
    label,
    aliases: [label, ...(aliases || [])].filter(Boolean),
    page,
    action,
    target: target || id,
  };
}

const INDEX = [];

// ── Pages ────────────────────────────────────────────────────────────────
INDEX.push(
  make('home', 'page', 'Home', ['home', 'start', 'homepage', 'welkom', 'accueil'], '/', 'navigate', 'home'),
  make('menu', 'page', 'Menu', ['menu', 'kaart', 'carte', 'the menu', 'full menu', 'speisekarte'], '/menu', 'navigate', 'menu'),
  make('about', 'page', 'About', ['about', 'over ons', 'verhaal', 'notre histoire', 'our story', 'filosofie', 'philosophy', 'qui sommes nous'], '/about', 'navigate', 'about'),
  make('locations', 'page', 'Locations', ['locations', 'vestigingen', 'locaties', 'adresses', 'our locations', 'where'], '/locations', 'navigate', 'locations'),
  make('reserve', 'page', 'Reserve', ['reserve', 'reserveer', 'reserveren', 'reservation', 'booking', 'table', 'tafel', 'réservation', 'reservering', 'book a table'], '/reserve', 'navigate', 'reserve'),
  make('takeaway', 'page', 'Takeaway', ['takeaway', 'afhalen', 'afhaal', 'take away', 'pickup', 'emporter', 'order online', 'bestellen'], '/takeaway', 'navigate', 'takeaway'),
  make('gift-cards', 'page', 'Gift cards', ['gift-cards', 'giftcards', 'cadeaubonnen', 'cadeaubon', 'cadeau', 'gift card', 'giftcard', 'bon cadeau', 'cadeaubonnen'], '/gift-cards', 'navigate', 'gift-cards'),
  make('contact', 'page', 'Contact', ['contact', 'contacteer', 'contactformulier', 'contact us', 'nous contacter', 'bericht'], '/contact', 'navigate', 'contact'),
  make('groups', 'page', 'Groups', ['groups', 'groepen', 'groep', 'group bookings', 'events', 'party', 'private dining', 'privé dining', 'groepsreservatie', 'company'], '/groups', 'navigate', 'groups'),
  make('jobs', 'page', 'Jobs', ['jobs', 'vacatures', 'vacature', 'careers', 'work', 'werken bij', 'travail', 'job'], '/jobs', 'navigate', 'jobs'),
  make('instagram', 'page', 'Instagram', ['instagram', 'social', 'socials', 'social media', 'photos', 'foto\'s'], '/instagram', 'navigate', 'instagram'),
);

// ── Locations ────────────────────────────────────────────────────────────
getLocations('nl').forEach((l) => {
  if (!l.phone) return; // skip "coming soon"
  INDEX.push(
    make(
      `loc-${l.slug}`,
      'location',
      l.name,
      [l.city, l.name, `bogèst ${l.city}`, `bogest ${l.city}`, `vestiging ${l.city}`],
      `/locations/${l.slug}`,
      'navigate',
      l.slug
    )
  );
});

// ── Home sections (scroll) ────────────────────────────────────────────────
INDEX.push(
  make('home-story', 'section', 'Story', ['verhaal', 'story', 'ons verhaal', 'our story', 'het verhaal', 'histoire'], '/', 'scroll', 'verhaal'),
  make('home-stats', 'section', 'Stats', ['stats', 'statistieken', 'cijfers', 'numbers', 'in cijfers'], '/', 'scroll', 'stats'),
  make('home-philosophy', 'section', 'Philosophy', ['filosofie', 'philosophy', 'onze filosofie', 'pillars', 'pijlers', 'what makes us unique', 'wat ons uniek maakt', 'formule', 'specialiteit', 'wijnen', 'sfeer'], '/', 'scroll', 'filosofie'),
  make('home-suggestions', 'section', 'Monthly suggestions', ['suggesties', 'maandelijkse suggesties', 'monthly suggestions', 'suggestions du mois', 'specials', 'seizoenspecials', 'suggestions of the month', 'seizoen', 'maand'], '/', 'scroll', 'suggesties'),
  make('home-cta', 'section', 'Actions', ['acties', 'reserveer nu', 'cta', 'actions', 'actiekaarten'], '/', 'scroll', 'acties'),
  make('home-locations-preview', 'section', 'Locations preview', ['vestigingen', 'our locations preview', 'locations on home', 'locaties preview'], '/', 'scroll', 'vestigingen'),
  make('home-reviews', 'section', 'Reviews', ['ervaringen', 'reviews', 'review', 'recensies', 'testimonials', 'klanten', 'beoordelingen'], '/', 'scroll', 'ervaringen'),
);

// ── Menu categories (scroll on /menu) ─────────────────────────────────────
const CAT_ALIASES = {
  voorgerechten: ['voorgerechten', 'starters', 'entrées', 'entrees', 'voor gerecht', 'soep', 'garnaalkroket'],
  runs: ['runds', 'beef', 'rundvlees', 'vlees', 'grill', 'steaks', 'bœuf', 'carne', 'steak', 'ribeye', 'filet pur', 'côte à l\'os', 'chateaubriand'],
  masters: ['masters', 'masters of meat', 'premium', 'premiumrunds', 'dry aged', 'premium beef', 'angus', 'hereford'],
  kip: ['kip', 'chicken', 'poulet', 'gevogelte', 'volaille', 'kefte', 'vol au vent', 'kippenbrochette'],
  vis: ['vis', 'fish', 'poisson', 'vegetarisch', 'veggie', 'veggie lasagna', 'zalm', 'scampi', 'zeetong', 'salmon', 'no chicken'],
  varken: ['varken', 'pork', 'porc', 'spare ribs', 'ribs', 'varkenshaasje', 'tomapork', 'spare-ribs'],
  klassiekers: ['klassiekers', 'classics', 'classiques', 'stoofvlees', 'tartaar', 'lamsschouder', 'stew', 'tartare', 'steak tartaar', 'bouletten'],
  sauzen: ['sauzen', 'sauces', 'sauces', 'saus', 'béarnaise', 'roquefort', 'peperroom', 'sausjes'],
  bijgerechten: ['bijgerechten', 'sides', 'accompagnements', 'kroketten', 'groenten', 'spinazie', 'bijgerecht'],
  nagerechten: ['nagerechten', 'desserts', 'dessert', 'nagerecht', 'crème brûlée', 'tiramisu', 'entremisu', 'panna cotta', 'ijs', 'dame blanche'],
};
MENU_DATA.forEach((cat) => {
  INDEX.push(
    make(`menu-cat-${cat.id}`, 'menu-category', cat.id, CAT_ALIASES[cat.id] || [cat.id], '/menu', 'scroll', cat.id)
  );
  cat.items.forEach((item) => {
    const nl = item.name?.nl || '';
    const fr = item.name?.fr || '';
    const en = item.name?.en || '';
    const slug = slugify(nl);
    if (!slug) return;
    const aliases = [nl, fr, en];
    if (item.desc) aliases.push(item.desc.nl, item.desc.fr, item.desc.en);
    INDEX.push(make(`menu-dish-${item.id}`, 'dish', nl, aliases.filter(Boolean), '/menu', 'highlight', slug));
  });
});

// ── Location sub-sections (scroll on /locations/{slug}) ───────────────────
['hasselt', 'borgloon', 'heusden-zolder'].forEach((slug) => {
  INDEX.push(make(`loc-${slug}-hours`, 'section', `Hours ${slug}`, ['openingsuren', 'opening hours', 'hours', 'uren', 'horaires', 'geopend', 'when open', 'openingstijden', 'openingstijd'], `/locations/${slug}`, 'scroll', 'openingsuren'));
  INDEX.push(make(`loc-${slug}-parking`, 'section', `Parking ${slug}`, ['parking', 'parkeren', 'car park', 'parkeerplaats'], `/locations/${slug}`, 'scroll', 'parking'));
  INDEX.push(make(`loc-${slug}-contact`, 'section', `Contact ${slug}`, ['contact', 'adres', 'address', 'phone', 'telefoon', 'email', 'telefoonnummer'], `/locations/${slug}`, 'scroll', 'contact'));
  INDEX.push(make(`loc-${slug}-spaces`, 'section', `Spaces ${slug}`, ['spaces', 'ruimtes', 'restaurant spaces', 'terras', 'terrace', 'zaal', 'salles', 'rooms', 'restaurant en ruimtes'], `/locations/${slug}`, 'scroll', 'spaces'));
});

export const CONTENT_INDEX = INDEX;

/** Compact list for the LLM router — keeps the prompt small (id + label + a few aliases). */
export function compactIndex() {
  return CONTENT_INDEX.map((e) => ({ id: e.id, label: e.label, aliases: e.aliases.slice(0, 6) }));
}

// ── Stage A: instant local fuzzy match (free, zero latency) ──────────────
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
  if (!t || t.length < 3) return null;
  let best = null;
  let bestScore = 0;
  for (const e of CONTENT_INDEX) {
    for (const a of e.aliases) {
      const an = norm(a);
      if (!an) continue;
      let score = 0;
      if (t === an) score = 1;
      else if (an.length >= 4 && t.includes(an)) score = 0.55 + an.length / (t.length + an.length);
      else if (t.length >= 4 && an.includes(t)) score = 0.5;
      if (score > bestScore) {
        bestScore = score;
        best = e;
      }
    }
  }
  return bestScore >= 0.5 ? best : null;
}