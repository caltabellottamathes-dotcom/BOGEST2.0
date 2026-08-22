import { registerAction, websiteAction } from '../websiteDispatcher';

/**
 * Open a modal/panel/overlay by logical name. Each target maps to either:
 *  - { type: 'navigate', path }  → a glass panel route (handled by navigate)
 *  - { type: 'event', event }     → a custom DOM event that a component listens for
 *
 * Extend OPEN_TARGETS to add new openable surfaces without touching core logic.
 */
const OPEN_TARGETS = {
  'reservation-modal': { type: 'navigate', path: '/reserveren' },
  'reservering-modal': { type: 'navigate', path: '/reserveren' },
  'reservation': { type: 'navigate', path: '/reserveren' },
  'reservering': { type: 'navigate', path: '/reserveren' },
  'giftcard-modal': { type: 'navigate', path: '/cadeaubonnen' },
  'cadeaubon-modal': { type: 'navigate', path: '/cadeaubonnen' },
  'gift-cards': { type: 'navigate', path: '/cadeaubonnen' },
  'cadeaubonnen': { type: 'navigate', path: '/cadeaubonnen' },
  'takeaway-modal': { type: 'navigate', path: '/traiteur' },
  'afhaal-modal': { type: 'navigate', path: '/traiteur' },
  'contact-form': { type: 'navigate', path: '/contact' },
  'groups-modal': { type: 'navigate', path: '/groepen' },
  'groepen-modal': { type: 'navigate', path: '/groepen' },
  'spaces': { type: 'event', event: 'bogest:open-spaces' },
  'restaurant-spaces': { type: 'event', event: 'bogest:open-spaces' },
  'host': { type: 'event', event: 'bogest:open-host' },
  'digital-host': { type: 'event', event: 'bogest:open-host' },
};

registerAction('open', async ({ target, options = {}, data = {} }) => {
  if (!target) return { error: 'missing_target' };
  const key = String(target).toLowerCase().trim();
  const def = OPEN_TARGETS[key];
  if (!def) return { error: 'unknown_target', target };
  if (def.type === 'navigate') {
    const res = await websiteAction({ action: 'navigate', target: def.path, options });
    return { message: res.success ? `Opened ${target}` : res.message, path: res.path, via: 'navigate' };
  }
  if (def.type === 'event') {
    window.dispatchEvent(new CustomEvent(def.event, { detail: { ...data, ...options } }));
    return { message: `Opened ${target}`, via: 'event' };
  }
  return { error: 'unknown_type' };
});