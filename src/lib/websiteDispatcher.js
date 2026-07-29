/**
 * Central dispatcher for website actions initiated by voice agents
 * (ElevenLabs Conversational AI Client Tools, D-ID, or the Base44 agent).
 *
 * One universal entry point:
 *   websiteAction({ action, target, options, data })
 *
 * - `action`    : the verb (navigate | scroll | open | highlight | close | search | ...)
 * - `target`    : what to act on (page / section / modal / element name)
 * - `options`  : optional behaviour flags for the action (e.g. { replace: true })
 * - `data`     : optional payload specific to the action
 *
 * Actions register via registerAction(name, handler). Each handler is an async
 * function ({ action, target, options, data }) => result object. To add a new
 * action: create a module in websiteActions/ that calls registerAction(...) and
 * import it from websiteActions/index.js — no core changes needed.
 *
 * Every call returns a normalized envelope so the agent always knows the outcome:
 *   { success: boolean, message: string, action, target, currentPage, ...details }
 */

const handlers = new Map();

export function registerAction(action, handler) {
  if (typeof handler !== 'function') {
    throw new Error(`[websiteDispatcher] Handler for "${action}" must be a function`);
  }
  handlers.set(action, handler);
}

export function unregisterAction(action) {
  handlers.delete(action);
}

export function listActions() {
  return Array.from(handlers.keys());
}

function currentPage() {
  return typeof window !== 'undefined' ? window.location.pathname : null;
}

/** The single universal entry point. Returns a normalized result envelope. */
export async function websiteAction({ action, target, options = {}, data = {} }) {
  if (!action) {
    return { success: false, message: 'Missing action', currentPage: currentPage() };
  }
  const handler = handlers.get(action);
  if (!handler) {
    console.warn(`[websiteDispatcher] No handler registered for action: "${action}"`);
    return { success: false, message: `Unknown action: ${action}`, action, currentPage: currentPage() };
  }
  try {
    const result = await handler({ action, target, options, data }) || {};
    const failed = Boolean(result.error);
    const message = result.message || (failed
      ? `${action} failed: ${result.error}`
      : `${action} succeeded`);
    // Strip internal `error`/`message` keys, keep everything else as details.
    const { error: _e, message: _m, ...details } = result;
    return {
      success: !failed,
      message,
      action,
      target,
      currentPage: currentPage(),
      ...details,
    };
  } catch (error) {
    console.error(`[websiteDispatcher] Action "${action}" failed:`, error);
    return {
      success: false,
      message: error.message,
      action,
      target,
      currentPage: currentPage(),
    };
  }
}

/**
 * Global escape hatch so any third-party widget script (ElevenLabs / D-ID)
 * or the Base44 agent can invoke the dispatcher without an import.
 */
if (typeof window !== 'undefined') {
  window.websiteAction = websiteAction;
  window.__websiteDispatcher = { registerAction, unregisterAction, listActions };
}