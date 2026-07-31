import { registerAction } from '../websiteDispatcher';
import { waitForElement, scrollIntoContainerView } from '@/lib/waitForElement';

/**
 * Highlight an element: scroll it into the centre of its scroll container
 * (or the window) with a smooth, visible motion, and pulse a prominent ring
 * around it for a few seconds — the visible "agent takeover" effect. Shared
 * by the highlight action (dishes) and the scroll action (sections), so
 * scroll AND highlight always happen together, every time.
 *
 * Waits for the element to appear after a navigation / panel animation so the
 * highlight lands on the freshly-mounted target instead of failing instantly.
 */
const HIGHLIGHT_CLASS = 'website-highlight';
let styleInjected = false;

function ensureStyle() {
  if (styleInjected) return;
  styleInjected = true;
  const css = document.createElement('style');
  css.setAttribute('data-website-highlight', 'true');
  css.textContent = `
    .${HIGHLIGHT_CLASS} {
      animation: websiteHighlightPulse 1.2s ease-in-out 3;
      outline: 4px solid hsl(var(--primary) / 0.95) !important;
      outline-offset: 4px;
      border-radius: 12px;
      background-color: hsl(var(--primary) / 0.12);
      box-shadow: 0 0 0 1px hsl(var(--primary) / 0.55), 0 12px 36px hsl(var(--primary) / 0.30) !important;
      position: relative;
      z-index: 60;
      transition: background-color 0.3s ease, outline-offset 0.3s ease;
    }
    /* Larger, higher-contrast ring on small screens — a desktop highlight
       can be invisible on mobile, so scale it up. */
    @media (max-width: 640px) {
      .${HIGHLIGHT_CLASS} {
        outline-width: 5px;
        outline-offset: 3px;
        box-shadow: 0 0 0 2px hsl(var(--primary) / 0.6), 0 8px 28px hsl(var(--primary) / 0.35) !important;
      }
    }
    @keyframes websiteHighlightPulse {
      0%, 100% { outline-color: hsl(var(--primary) / 0.95); background-color: hsl(var(--primary) / 0.12); }
      50%      { outline-color: hsl(var(--primary) / 0.45); background-color: hsl(var(--primary) / 0.20); }
    }
    @media (prefers-reduced-motion: reduce) {
      .${HIGHLIGHT_CLASS} { animation: none !important; transition: none !important; }
    }
  `;
  document.head.appendChild(css);
}

/** Apply the visible highlight (smooth scroll-to-centre + pulsing ring). */
export function applyHighlight(el, duration = 6000) {
  if (!el) return;
  ensureStyle();
  el.classList.remove(HIGHLIGHT_CLASS);
  void el.offsetWidth; // restart animation
  el.classList.add(HIGHLIGHT_CLASS);
  scrollIntoContainerView(el, { behavior: 'smooth' });
  setTimeout(() => el.classList.remove(HIGHLIGHT_CLASS), duration);
}

function findTarget(target, key) {
  return (
    document.getElementById(target) ||
    document.querySelector(`[data-highlight="${CSS.escape(key)}"]`) ||
    document.querySelector(`[data-highlight*="${CSS.escape(key)}" i]`) ||
    document.querySelector(`[data-item-id="${CSS.escape(key)}"]`) ||
    document.querySelector(`[id*="${CSS.escape(key)}" i]`)
  );
}

registerAction('highlight', async ({ target, options = {}, data = {} }) => {
  if (!target) return { error: 'missing_target' };
  const key = String(target).toLowerCase().trim();
  const el = await waitForElement(() => findTarget(target, key), { timeout: 1400 });
  if (!el) return { error: 'not_found', target };
  const duration = Number.isFinite(options?.duration) ? options.duration
    : Number.isFinite(data?.duration) ? data.duration : 6000;
  applyHighlight(el, duration);
  return { message: `Highlighted ${target}`, element: target };
});