/**
 * Central dispatcher for website actions initiated by voice agents
 * (ElevenLabs Conversational AI Client Tools, D-ID, or the Base44 agent).
 *
 * One universal entry point:
 *   websiteAction({ action, target, data })
 *
 * Actions are registered as handlers via `registerAction(actionName, handler)`.
 * Each handler is an async function: ({ action, target, data }) => result.
 *
 * To add a new action, create a module in websiteActions/ that calls
 * registerAction(...) and import it from websiteActions/index.js — no core
 * changes needed. The dispatcher stays tiny and stable.
 */

const handlers = new Map();

/** Register a handler for an action name. */
export function registerAction(action, handler) {
  if (typeof handler !== 'function') {
    throw new Error(`[websiteDispatcher] Handler for "${action}" must be a function`);
  }
  handlers.set(action, handler);
}

/** Remove a registered action (useful in tests / dynamic modules). */
export function unregisterAction(action) {
  handlers.delete(action);
}

/** List all currently registered action names (for introspection / agent help). */
export function listActions() {
  return Array.from(handlers.keys());
}

/** The single universal entry point. Returns { ok, action, target, result | error }. */
export async function websiteAction({ action, target, data = {} }) {
  if (!action) return { ok: false, error: 'missing_action' };
  const handler = handlers.get(action);
  if (!handler) {
    console.warn(`[websiteDispatcher] No handler registered for action: "${action}"`);
    return { ok: false, error: 'unknown_action', action };
  }
  try {
    const result = await handler({ action, target, data });
    return { ok: true, action, target, result };
  } catch (error) {
    console.error(`[websiteDispatcher] Action "${action}" failed:`, error);
    return { ok: false, error: error.message, action };
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