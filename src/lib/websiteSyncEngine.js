import { routeTopic } from '@/lib/websiteSyncRouter';

/**
 * Conversational Sync Engine.
 *
 * The ElevenLabs agent just talks naturally. This engine listens to the agent's
 * speech (via the widget's onMessage transcript hook) and to its websiteAction
 * tool calls, maps what it's talking about to a website content entry through
 * the two-stage router, and drives the page (navigate / scroll / highlight) so
 * the website stays synchronized with the conversation automatically — the
 * visitor never has to ask.
 *
 * Dedup: the same target won't re-fire within a short window, so the page
 * doesn't jitter on every word.
 */

let lastTargetId = null;
let lastTargetAt = 0;
let debounceTimer = null;
const DEDUP_MS = 12000;
const DEBOUNCE_MS = 900;
const NAV_RENDER_MS = 650;

function resetDedupIfStale() {
  if (lastTargetId && Date.now() - lastTargetAt > DEDUP_MS) {
    lastTargetId = null;
  }
}

async function executeEntry(entry) {
  if (!entry) return { success: false, message: 'no_entry' };
  resetDedupIfStale();
  if (entry.id === lastTargetId) {
    return { success: true, message: 'already_here', target: entry.id };
  }
  lastTargetId = entry.id;
  lastTargetAt = Date.now();

  const here = window.location.pathname;
  const { action, target, page } = entry;

  if (action === 'navigate') {
    return await window.websiteAction({ action: 'navigate', target });
  }

  // scroll / highlight — make sure we're on the right page first
  const needNav = page && here !== page;
  if (needNav) {
    const navRes = await window.websiteAction({ action: 'navigate', target: page });
    if (!navRes?.success) return navRes;
    await new Promise((r) => setTimeout(r, NAV_RENDER_MS));
  }

  if (action === 'scroll') {
    if (target === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return { success: true, message: 'scrolled to top', target };
    }
    return await window.websiteAction({ action: 'scroll', target });
  }
  if (action === 'highlight') {
    return await window.websiteAction({ action: 'highlight', target });
  }
  return { success: false, message: 'unknown_action', action };
}

async function routeAndExecute(topic) {
  try {
    const entry = await routeTopic(topic);
    if (!entry) return { success: false, message: 'no_match', topic };
    return await executeEntry(entry);
  } catch (e) {
    return { success: false, message: String(e?.message || e) };
  }
}

/** Called for each new agent/user transcript message from the widget. */
export function onTranscriptMessage(msg) {
  if (!msg) return;
  // Only react to the agent's own speech — the website follows the host.
  const isAgent = msg.source === 'ai' || msg.role === 'agent' || msg.role === 'assistant';
  if (!isAgent) return;
  const text = msg.message || msg.text || '';
  if (!text || String(text).trim().length < 3) return;

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    routeAndExecute(text).catch(() => {});
  }, DEBOUNCE_MS);
}

/**
 * Called when the agent invokes the websiteAction client tool.
 *
 * For any content action (go/sync/navigate/scroll/highlight) the target is
 * treated as free text and routed through the two-stage router — the website
 * decides the right page/section/dish from the index, so the agent never has
 * to know exact names. close/search pass through unchanged, and an explicit
 * action+target is used as a direct fallback when the router finds no match.
 */
export async function handleWebsiteActionToolCall(params = {}) {
  const action = String(params.action || '').toLowerCase();
  if (action === 'close') return await window.websiteAction({ action: 'close', target: params.target });
  if (action === 'search') return await window.websiteAction({ action: 'search', target: params.target, data: params.data });

  const topic = params.topic || params.target || '';
  const entry = topic ? await routeTopic(topic) : null;
  if (entry) return await executeEntry(entry);

  // Fallback: direct explicit dispatch (action + already-resolved target)
  if (action && params.target) return await window.websiteAction({ action, target: params.target });
  return { success: false, message: 'no_match', topic };
}

export function startWebsiteSyncEngine() {
  lastTargetId = null;
  lastTargetAt = 0;
  clearTimeout(debounceTimer);
}

export function stopWebsiteSyncEngine() {
  clearTimeout(debounceTimer);
  lastTargetId = null;
}