import { registerAction } from '../websiteDispatcher';
import { waitForElement } from '@/lib/waitForElement';
import { applyHighlight } from './highlight';

/**
 * Smooth-scroll to a section/element identified by id, data-section, or
 * data-scroll-target — AND highlight it. Scroll and highlight always happen
 * together (the visitor sees the page move AND the target light up, every
 * time, on desktop and mobile, on the homepage AND inside any open panel).
 *
 * When a glass panel is open, the panel's own scroll area is the ACTIVE
 * scroller — so "scroll to top / bottom / footer" and every section scroll
 * move the panel the visitor is looking at, not the page hidden behind it.
 *
 * Waits for the element to appear after a navigation / panel animation so the
 * scroll lands on the freshly-mounted target instead of failing instantly.
 */

/** The scroll container that is currently active: the open panel's content
 *  area when a glass panel is open, otherwise null (the window is the scroller). */
export function getActiveScroller() {
  const panel = document.querySelector('[data-panel-scroll]');
  if (panel) {
    const r = panel.getBoundingClientRect();
    // Only treat the panel as active while it is actually on screen — it
    // lingers in the DOM briefly during the exit animation.
    if (r.width > 0 && r.height > 0) return panel;
  }
  return null;
}

function findTarget(key) {
  const selector = key.replace(/[^a-z0-9-_]/g, '-');
  // Prefer a match inside the open panel so a panel section always wins over a
  // same-named section on the page behind it.
  const scope = getActiveScroller();
  if (scope) {
    const inScope =
      scope.querySelector(`#${CSS.escape(key)}`) ||
      scope.querySelector(`[data-section="${CSS.escape(key)}"]`) ||
      scope.querySelector(`[data-scroll-target="${CSS.escape(key)}"]`) ||
      scope.querySelector(`[data-section="${CSS.escape(selector)}" i]`);
    if (inScope) return inScope;
  }
  return (
    document.getElementById(key) ||
    document.querySelector(`[data-section="${CSS.escape(key)}"]`) ||
    document.querySelector(`[data-scroll-target="${CSS.escape(key)}"]`) ||
    document.querySelector(`[data-section="${CSS.escape(selector)}" i]`) ||
    document.querySelector(`[id*="${CSS.escape(key)}" i]`)
  );
}

registerAction('scroll', async ({ target, options = {}, data = {} }) => {
  if (!target) return { error: 'missing_target' };
  const t = String(target).toLowerCase().trim();
  const scroller = getActiveScroller();

  if (t === 'top') {
    if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
    return { message: 'Scrolled to top', section: 'top' };
  }
  if (t === 'bottom' || t === 'footer') {
    if (scroller) scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
    else window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    return { message: 'Scrolled to bottom', section: 'bottom' };
  }

  const key = t;
  const el = await waitForElement(() => findTarget(key), { timeout: 1200 });
  if (!el) return { error: 'not_found', target };
  const duration = Number.isFinite(options?.duration) ? options.duration
    : Number.isFinite(data?.duration) ? data.duration : 5000;
  // Centres (smooth, visible scroll) + pulses the ring — every time, in the
  // open panel or on the page behind it.
  applyHighlight(el, duration);
  return { message: `Scrolled to ${target}`, section: target };
});