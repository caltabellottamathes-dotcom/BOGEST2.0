import { registerAction } from '../websiteDispatcher';
import { waitForElement } from '@/lib/waitForElement';
import { applyHighlight } from './highlight';

/**
 * Smooth-scroll to a section/element identified by id, data-section, or
 * data-scroll-target — AND highlight it. Scroll and highlight always happen
 * together (the user must visibly see the page move AND the target light up,
 * every time, on both desktop and mobile).
 *
 * Waits for the element to appear after a navigation / panel animation so the
 * scroll lands on the freshly-mounted target instead of failing instantly.
 */
function findTarget(key) {
  const selector = key.replace(/[^a-z0-9-_]/g, '-');
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
  if (String(target).toLowerCase().trim() === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return { message: 'Scrolled to top', section: 'top' };
  }
  const key = String(target).toLowerCase().trim();
  const el = await waitForElement(() => findTarget(key), { timeout: 1200 });
  if (!el) return { error: 'not_found', target };
  const duration = Number.isFinite(options?.duration) ? options.duration
    : Number.isFinite(data?.duration) ? data.duration : 5000;
  // Centres (smooth, visible scroll) + pulses the ring — every time.
  applyHighlight(el, duration);
  return { message: `Scrolled to ${target}`, section: target };
});