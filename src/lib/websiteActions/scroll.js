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

// Height of fixed/sticky elements covering the top of the scroll context so
// the target isn't hidden behind the navbar (window) or an in-panel sticky bar
// (e.g. the menu's category tabs). Mobile-aware — the site navbar is shorter
// on phones, and the voice widget sits bottom-right (never blocks the top).
function topObstructionHeight(scroller) {
  const isMobile = typeof window !== 'undefined' && window.matchMedia?.('(max-width: 767px)').matches;
  if (!scroller) {
    const nav = document.querySelector('header, [data-navbar], nav');
    if (nav) return Math.round(nav.getBoundingClientRect().height);
    return isMobile ? 64 : 80;
  }
  // Panel scroller already begins below the navbar — only in-panel sticky
  // bars (menu tabs, etc.) can cover the top of its content.
  let extra = 0;
  scroller.querySelectorAll('[class*="sticky"], [data-sticky]').forEach((s) => {
    const cs = getComputedStyle(s);
    if (cs.position === 'sticky' && parseFloat(cs.top || '0') === 0) {
      extra += Math.round(s.getBoundingClientRect().height);
    }
  });
  return extra;
}

function scrollToOffset(scroller, el, offset, behavior) {
  if (scroller) {
    const top = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - offset;
    scroller.scrollTo({ top: Math.max(0, top), behavior });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior });
  }
}

registerAction('scroll', async ({ target, options = {}, data = {} }) => {
  if (!target) return { error: 'missing_target' };
  const key = String(target).toLowerCase().trim();
  const el = await waitForElement(() => findTarget(key), { timeout: 1200 });
  if (!el) return { error: 'not_found', target };
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const behavior = reduceMotion ? 'auto' : (options?.behavior || 'smooth');

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

  const userOffset = Number.isFinite(options?.offset) ? options.offset
    : (Number.isFinite(data?.offset) ? data.offset : null);
  const buffer = 18;
  const offset = userOffset != null ? userOffset : (topObstructionHeight(scroller) + buffer);

  scrollToOffset(scroller, el, offset, behavior);

  // Re-align once the layout / panel slide animation has settled so mobile
  // viewport/offset issues don't leave the target hidden behind a fixed bar
  // or just past the fold. This is the fix for "silently failing at mobile
  // widths" — the first scroll lands during the 450ms panel animation; the
  // second pass lands on the final, settled geometry.
  setTimeout(() => {
    if (!document.body.contains(el)) return;
    const rect = el.getBoundingClientRect();
    const ctxTop = scroller ? scroller.getBoundingClientRect().top : 0;
    const minTop = ctxTop + offset;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < minTop - 6 || rect.top > vh - 24) {
      scrollToOffset(scroller, el, offset, behavior);
    }
  }, 480);

  return { message: `Scrolled to ${target}`, section: target };
});