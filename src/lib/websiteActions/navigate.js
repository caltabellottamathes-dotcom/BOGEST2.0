import { registerAction } from '../websiteDispatcher';

/**
 * Navigate to a page/route.
 * Targets are resolved case-insensitively against a multilingual alias map
 * (nl / fr / en). Raw paths (e.g. "/menu") are also accepted.
 */

// Module-level reference to the router's navigate(), set by the React bridge.
// Falls back to window.location.assign if the bridge hasn't mounted yet.
let navigateFn = null;
export function setNavigateFn(fn) { navigateFn = fn; }

const ROUTES = {
  // Nederlandse canonical routes (B3); oude Engelse aliasen blijven werken.
  home: '/',
  menu: '/menukaart', kaart: '/menukaart', menukaart: '/menukaart',
  about: '/over-ons', story: '/over-ons', verhaal: '/over-ons', 'over-ons': '/over-ons', 'about-us': '/over-ons', 'wie-zijn-wij': '/over-ons',
  'over-ons-verhaal': '/over-ons/ons-verhaal', 'ons-verhaal': '/over-ons/ons-verhaal',
  locations: '/locaties', vestigingen: '/locaties', locaties: '/locaties',
  gelegenheid: '/locaties', occasion: '/locaties', 'speciale-gelegenheid': '/locaties', verjaardag: '/locaties', anniversary: '/locaties', romantisch: '/locaties', date: '/locaties', feest: '/locaties', 'iets-speciaals': '/locaties',
  hasselt: '/locaties/hasselt',
  borgloon: '/locaties/borgloon',
  'heusden-zolder': '/locaties/heusden-zolder',
  heusden: '/locaties/heusden-zolder', zolder: '/locaties/heusden-zolder',
  reserve: '/reserveren', reserveer: '/reserveren', reserveren: '/reserveren',
  reservation: '/reserveren', reservering: '/reserveren', booking: '/reserveren',
  takeaway: '/traiteur', afhalen: '/traiteur', traiteur: '/traiteur',
  'gift-cards': '/cadeaubonnen', giftcards: '/cadeaubonnen',
  cadeaubonnen: '/cadeaubonnen', cadeaubon: '/cadeaubonnen', cadeau: '/cadeaubonnen',
  contact: '/contact', contacteer: '/contact', contactformulier: '/contact',
  groups: '/groepen', groepen: '/groepen', groep: '/groepen', events: '/groepen',
  jobs: '/vacatures', vacatures: '/vacatures', vacature: '/vacatures',
  instagram: '/over-ons/instagram', social: '/over-ons/instagram',
  facebook: '/over-ons/instagram', fb: '/over-ons/instagram',
  filosofie: '/over-ons/onze-filosofie', 'onze-filosofie': '/over-ons/onze-filosofie', vlees: '/over-ons/onze-filosofie', meat: '/over-ons/onze-filosofie', 'vleesfilosofie': '/over-ons/onze-filosofie', 'meat-philosophy': '/over-ons/onze-filosofie',
  terms: '/voorwaarden', voorwaarden: '/voorwaarden',
  privacy: '/privacy', cookies: '/cookies',
  // Oude Engelse paden (raw, met slash) → rechtstreeks de Nederlandse route,
  // zodat de host ook zonder redirect-hop op de Nederlandse URL landt.
  '/menu': '/menukaart',
  '/about': '/over-ons', '/about/ons-verhaal': '/over-ons/ons-verhaal', '/about/onze-filosofie': '/over-ons/onze-filosofie', '/about/instagram': '/over-ons/instagram',
  '/locations': '/locaties', '/locations/hasselt': '/locaties/hasselt', '/locations/borgloon': '/locaties/borgloon', '/locations/heusden-zolder': '/locaties/heusden-zolder',
  '/reserve': '/reserveren',
  '/takeaway': '/traiteur',
  '/gift-cards': '/cadeaubonnen',
  '/groups': '/groepen',
  '/jobs': '/vacatures',
};

registerAction('navigate', async ({ target, options = {} }) => {
  if (!target) return { error: 'missing_target' };
  const key = String(target).toLowerCase().trim();
  const path = ROUTES[key] ?? (key.startsWith('/') ? key : null);
  if (!path) return { error: 'unknown_target', target };
  if (typeof navigateFn === 'function') {
    navigateFn(path, { replace: Boolean(options.replace) });
  } else {
    window.location.assign(path);
  }
  return { message: `Navigated to ${path}`, path };
});