import { routeTopic } from '@/lib/websiteSyncRouter';

/**
 * Conversational Sync Engine — single source of truth.
 *
 * The ElevenLabs agent calls the "websiteAction" client tool (fire-and-forget,
 * expects_response: false) the instant it touches a topic. This module routes
 * that free-text target to a content entry and drives navigate / scroll /
 * highlight / close so the website stays in sync with the conversation.
 *
 * There is NO transcript listening — that path was unreliable on the embed
 * widget (it raced the tool call and misfired on mobile). The agent's own
 * tool call is the single, reliable trigger; proactivity comes from the
 * agent's system prompt.
 */
let lastTargetId = null;
let lastTargetAt = 0;
const DEDUP_MS = 3500;
const NAV_RENDER_MS = 450;

function resetDedupIfStale() {
  if (lastTargetId && Date.now() - lastTargetAt > DEDUP_MS) lastTargetId = null;
}

async function executeEntry(entry) {
  if (!entry) return { success: false, message: 'no_entry' };
  resetDedupIfStale();

  const dedupKey = entry.id;
  if (dedupKey === lastTargetId) {
    return { success: true, message: 'already_here', target: entry.id };
  }
  lastTargetId = dedupKey;
  lastTargetAt = Date.now();

  const here = window.location.pathname;
  const { action, target, page } = entry;

  if (action === 'navigate') {
    return await window.websiteAction({ action: 'navigate', target });
  }

  if (action === 'close') {
    return await window.websiteAction({ action: 'close', target: target || 'panel' });
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

/** Proactively sync the website to a topic (used by the text digital host). */
export async function syncToTopic(topic) {
  return routeAndExecute(String(topic || ''));
}

/**
 * Called when the ElevenLabs agent invokes the websiteAction client tool.
 * The target is free text and is routed through the multi-stage router —
 * the website decides the right page/section/dish from the index, so the
 * agent never has to know exact names. close / search / showBeeldbankPhoto
 * pass through unchanged.
 */
export async function handleWebsiteActionToolCall(params = {}) {
  const action = String(params.action || '').toLowerCase();

  // Beeldbank photo handoff — the voice agent can't render images, so it asks
  // the digital host (chat panel) to fetch real archive photos and show them.
  if (action === 'showbeeldbankphoto' || action === 'showphoto') {
    const data = params.data || {};
    window.dispatchEvent(new CustomEvent('bogest:show-beeldbank', {
      detail: {
        query: String(params.target || params.topic || ''),
        category: String(data.category || params.category || ''),
        location: String(data.location || params.location || ''),
      },
    }));
    return { success: true, message: "De digitale gastheer toont de foto's." };
  }

  if (action === 'close') return await window.websiteAction({ action: 'close', target: params.target });
  if (action === 'search') return await window.websiteAction({ action: 'search', target: params.target, data: params.data });

  // Page-agnostic in-page scroll shortcuts — always act on the CURRENT page,
  // never route to a different page. Includes the shared CTA / overlay ids
  // (reserveer, bestel, legal-content, ruimtes-overlay) that exist on many
  // pages and must scroll the banner on the page the visitor is already on.
  if (action === 'scroll') {
    const st = String(params.target || '').toLowerCase().trim();
    if (['top', 'bottom', 'footer', 'reserveer', 'bestel', 'legal-content', 'ruimtes-overlay'].includes(st)) {
      return await window.websiteAction({ action: 'scroll', target: st });
    }
  }

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
}

export function stopWebsiteSyncEngine() {
  lastTargetId = null;
}