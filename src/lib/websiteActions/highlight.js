import { registerAction } from '../websiteDispatcher';
import { waitForElement, scrollIntoContainerView } from '@/lib/waitForElement';

/**
 * Temporarily highlight an element (id / data-highlight / fuzzy id match),
 * scroll it into the center of its scroll container, and pulse a prominent
 * ring around it for a few seconds — the visible "agent takeover" effect.
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
    @keyframes websiteHighlightPulse {
      0%, 100% { outline-color: hsl(var(--primary) / 0.95); background-color: hsl(var(--primary) / 0.12); }
      50%      { outline-color: hsl(var(--primary) / 0.45); background-color: hsl(var(--primary) / 0.20); }
    }
    /* Mobile — a 4px outline reads as a hairline on a small screen. Beef it
       up so the "agent takeover" is unmistakable at phone scale. */
    @media (max-width: 767px) {
      .${HIGHLIGHT_CLASS} {
        outline-width: 7px !important;
        outline-offset: 6px !important;
        border-radius: 14px !important;
        background-color: hsl(var(--primary) / 0.22) !important;
        box-shadow: 0 0 0 2px hsl(var(--primary) / 0.7), 0 10px 44px hsl(var(--primary) / 0.45) !important;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .${HIGHLIGHT_CLASS} {
        animation: none !important;
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(css);
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
  ensureStyle();
  const key = String(target).toLowerCase().trim();
  const el = await waitForElement(() => findTarget(target, key), { timeout: 1400 });
  if (!el) return { error: 'not_found', target };
  const duration = Number.isFinite(options?.duration) ? options.duration
    : Number.isFinite(data?.duration) ? data.duration : 6000;
  // Scroll the element fully into view FIRST, then reveal the highlight once
  // it's actually visible — so the pulse never starts off-screen or cut off
  // by a fixed bar (the navbar / in-panel sticky tabs / the voice widget).
  scrollIntoContainerView(el, { behavior: 'smooth' });
  setTimeout(() => {
    if (!document.body.contains(el)) return;
    el.classList.remove(HIGHLIGHT_CLASS);
    void el.offsetWidth; // restart animation
    el.classList.add(HIGHLIGHT_CLASS);
    setTimeout(() => el.classList.remove(HIGHLIGHT_CLASS), duration);
  }, 240);
  return { message: `Highlighted ${target}`, element: target };
});