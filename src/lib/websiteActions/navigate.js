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
  // English
  home: '/',
  menu: '/menu', kaart: '/menu',
  about: '/about', story: '/about', verhaal: '/about',
  'ons-verhaal': '/about/ons-verhaal',
  locations: '/locations', vestigingen: '/locations', locaties: '/locations',
  hasselt: '/locations/hasselt',
  borgloon: '/locations/borgloon',
  'heusden-zolder': '/locations/heusden-zolder',
  heusden: '/locations/heusden-zolder', zolder: '/locations/heusden-zolder',
  reserve: '/reserve', reserveer: '/reserve', reserveren: '/reserve',
  reservation: '/reserve', reservering: '/reserve', booking: '/reserve',
  takeaway: '/takeaway', afhalen: '/takeaway',
  'gift-cards': '/gift-cards', giftcards: '/gift-cards',
  cadeaubonnen: '/gift-cards', cadeaubon: '/gift-cards', cadeau: '/gift-cards',
  contact: '/contact', contacteer: '/contact', contactformulier: '/contact',
  groups: '/groups', groepen: '/groups', groep: '/groups', events: '/groups',
  jobs: '/jobs', vacatures: '/jobs', vacature: '/jobs',
  instagram: '/instagram', social: '/instagram',
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