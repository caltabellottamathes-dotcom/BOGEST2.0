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