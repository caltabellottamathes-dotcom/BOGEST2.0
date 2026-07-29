/**
 * Helpers to control the ElevenLabs Conversational AI web component.
 *
 * The widget is a custom element with an OPEN shadow root. It toggles between
 * an expanded sheet and a compact floating orb via an internal button whose
 * aria-label is "Collapse widget" (when expanded) / "Expand widget" (when
 * compact). We minimize by clicking that button from the outside.
 */

const COLLAPSE_SELECTOR = 'button[aria-label="Collapse widget"]';

function getWidget() {
  return document.querySelector('elevenlabs-convai');
}

function findCollapseButton() {
  const widget = getWidget();
  const root = widget?.shadowRoot;
  if (!root) return null;
  // Some builds render the button inside the shadow tree directly.
  return root.querySelector(COLLAPSE_SELECTOR);
}

/**
 * Minimize the ElevenLabs widget to its compact floating state.
 * Retries briefly because the collapse button only exists while the widget is
 * expanded, which may happen a moment after the action completes.
 *
 * @returns {Promise<boolean>} true if the widget was minimized, false otherwise.
 */
export function minimizeElevenLabsWidget({ retries = 10, interval = 120 } = {}) {
  return new Promise((resolve) => {
    if (!getWidget()) return resolve(false);
    let attempt = 0;
    const tryClick = () => {
      const btn = findCollapseButton();
      if (btn) {
        btn.click();
        resolve(true);
        return;
      }
      attempt += 1;
      if (attempt >= retries) return resolve(false);
      setTimeout(tryClick, interval);
    };
    tryClick();
  });
}

/** Whether the widget is currently in its expanded (non-compact) state. */
export function isElevenLabsExpanded() {
  return Boolean(findCollapseButton());
}

/**
 * Start a live (voice) conversation with the ElevenLabs agent.
 *
 * Uses the widget element's public `startConversation()` method. Falls back
 * to clicking the orb / expand button inside the widget's open shadow root
 * if the method is unavailable on this build.
 *
 * @returns {boolean} true if a conversation could be started.
 */
export function startElevenLabsConversation() {
  const widget = getWidget();
  if (!widget) return false;
  try {
    if (typeof widget.startConversation === 'function') {
      widget.startConversation();
      return true;
    }
  } catch { /* fall through to click fallback */ }
  try {
    const root = widget.shadowRoot;
    if (root) {
      const btn =
        root.querySelector('button[aria-label="Expand widget"]') ||
        root.querySelector('button[aria-label="Start call"]') ||
        root.querySelector('button');
      if (btn) { btn.click(); return true; }
    }
  } catch { /* ignore */ }
  return false;
}