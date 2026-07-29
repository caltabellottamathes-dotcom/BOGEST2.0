import { registerAction } from '../websiteDispatcher';

/**
 * Close modals/panels/overlays. The glass panel system is closed by navigating
 * home; other surfaces can listen for the 'bogest:close-panel' event.
 */
registerAction('close', async ({ target, options = {} } = {}) => {
  const key = String(target || 'panel').toLowerCase().trim();
  if (key === 'panel' || key === 'modal' || key === 'overlay' || key === 'all') {
    window.dispatchEvent(new CustomEvent('bogest:close-panel', { detail: options }));
    return { message: `Closed ${key}`, closed: key };
  }
  // Specific named target — let any listener handle it
  window.dispatchEvent(new CustomEvent('bogest:close', { detail: { target: key, ...options } }));
  return { message: `Closed ${key}`, closed: key };
});