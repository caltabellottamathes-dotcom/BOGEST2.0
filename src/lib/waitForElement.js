/**
 * Poll for a DOM element to appear (after a route change / panel animation),
 * resolving with it or null after `timeout` ms. Lets scroll/highlight wait for
 * the target to mount instead of failing instantly with "not_found".
 */
export function waitForElement(find, { timeout = 1200, interval = 80 } = {}) {
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      let el = null;
      try { el = typeof find === 'function' ? find() : null; } catch { el = null; }
      if (el) return resolve(el);
      if (Date.now() - start >= timeout) return resolve(null);
      setTimeout(tick, interval);
    };
    tick();
  });
}

/**
 * Scroll an element into view, centered within its nearest scrollable
 * ancestor (e.g. an open glass panel's content area) — or the window when
 * there is none. Works on mobile (full-screen panel) and desktop alike.
 */
export function scrollIntoContainerView(el, { behavior = 'smooth' } = {}) {
  if (!el) return;
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) behavior = 'auto';
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
    const top = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
    const target = top - scroller.clientHeight / 2 + el.offsetHeight / 2;
    scroller.scrollTo({ top: Math.max(0, target), behavior });
  } else {
    const t = el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + el.offsetHeight / 2;
    window.scrollTo({ top: Math.max(0, t), behavior });
  }
}