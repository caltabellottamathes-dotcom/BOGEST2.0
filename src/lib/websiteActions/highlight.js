import { registerAction } from '../websiteDispatcher';

/**
 * Temporarily highlight an element (id / data-highlight / fuzzy id match),
 * scroll it into view, and pulse a ring around it for a few seconds.
 * Great for "show me the dry-aged ribeye".
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
      animation: websiteHighlightPulse 1.4s ease-out 2;
      outline: 3px solid hsl(80 35% 33% / 0.9) !important;
      outline-offset: 6px;
      box-shadow: 0 0 0 8px hsl(80 35% 33% / 0.18), 0 8px 30px hsl(80 35% 33% / 0.25) !important;
      border-radius: 10px;
      position: relative;
      z-index: 60;
      transition: outline-offset 0.3s ease;
    }
    @keyframes websiteHighlightPulse {
      0%, 100% { outline-color: hsl(80 35% 33% / 0.95); box-shadow: 0 0 0 8px hsl(80 35% 33% / 0.18); }
      50%      { outline-color: hsl(80 35% 33% / 0.40); box-shadow: 0 0 0 14px hsl(80 35% 33% / 0.10); }
    }
  `;
  document.head.appendChild(css);
}

registerAction('highlight', async ({ target, options = {}, data = {} }) => {
  if (!target) return { error: 'missing_target' };
  ensureStyle();
  const key = String(target).toLowerCase().trim();
  const el =
    document.getElementById(target) ||
    document.querySelector(`[data-highlight="${CSS.escape(key)}"]`) ||
    document.querySelector(`[data-highlight*="${CSS.escape(key)}" i]`) ||
    document.querySelector(`[data-item-id="${CSS.escape(key)}"]`) ||
    document.querySelector(`[id*="${CSS.escape(key)}" i]`);
  if (!el) return { error: 'not_found', target };
  el.classList.remove(HIGHLIGHT_CLASS);
  void el.offsetWidth; // restart animation
  el.classList.add(HIGHLIGHT_CLASS);
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const duration = Number.isFinite(options?.duration) ? options.duration
    : Number.isFinite(data?.duration) ? data.duration : 5000;
  setTimeout(() => el.classList.remove(HIGHLIGHT_CLASS), duration);
  return { message: `Highlighted ${target}`, element: target };
});