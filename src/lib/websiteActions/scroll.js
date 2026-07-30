import { registerAction } from '../websiteDispatcher';
import { waitForElement } from '@/lib/waitForElement';

/**
 * Smooth-scroll to a section/element identified by id, data-section, or
 * data-scroll-target. Falls back to a fuzzy id match.
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
  const key = String(target).toLowerCase().trim();
  const el = await waitForElement(() => findTarget(key), { timeout: 1200 });
  if (!el) return { error: 'not_found', target };
  const offset = Number.isFinite(options?.offset) ? options.offset
    : Number.isFinite(data?.offset) ? data.offset : 88;
  const behavior = options?.behavior || 'smooth';

  // Scroll the nearest scrollable ancestor (e.g. an open glass panel's
  // content area) when the element lives inside one, otherwise the window.
  let node = el.parentElement;
  let scroller = null;
  while (node) {
    const cs = getComputedStyle(node);
    if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
      scroller = node;
      break;
    }
    node = node.parentElement;
  }
  if (scroller) {
    const top = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - offset;
    scroller.scrollTo({ top: Math.max(0, top), behavior });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior });
  }
  return { message: `Scrolled to ${target}`, section: target };
});