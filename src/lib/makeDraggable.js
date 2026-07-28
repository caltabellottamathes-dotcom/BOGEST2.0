/**
 * Makes third-party floating widgets (D-ID avatar, ElevenLabs convai) draggable
 * so they never permanently block the "Vraag het aan Bogèst" digital host.
 *
 * Strategy: a small drag threshold means quick clicks/taps still reach the
 * widget's own handlers. Only when the pointer moves beyond the threshold do
 * we take control (switch to fixed positioning + update left/top). After a
 * real drag, the synthetic click that fires on pointerup is swallowed so the
 * widget doesn't accidentally open.
 */

const DRAG_THRESHOLD = 5;

const WIDGET_SELECTORS = [
  '[data-name="did-agent"]',
  'elevenlabs-convai',
  'div[id*="did-agent"]',
  'div[class*="did-agent"]',
  'div[id*="elevenlabs"]',
  'div[class*="elevenlabs"]',
  'div[id*="convai"]',
  'div[class*="convai"]',
];

function makeDraggable(el) {
  if (el._bogestDraggable) return;
  el._bogestDraggable = true;

  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let initLeft = 0;
  let initTop = 0;
  let dragging = false;

  const onPointerDown = (e) => {
    // Don't hijack interactions with form elements / inputs inside the widget
    if (e.target.closest('input, textarea, button')) return;
    pointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    dragging = false;
  };

  const onPointerMove = (e) => {
    if (pointerId === null || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (!dragging && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      dragging = true;
      const rect = el.getBoundingClientRect();
      initLeft = rect.left;
      initTop = rect.top;
      el.style.setProperty('position', 'fixed', 'important');
      el.style.setProperty('left', `${initLeft}px`, 'important');
      el.style.setProperty('top', `${initTop}px`, 'important');
      el.style.setProperty('right', 'auto', 'important');
      el.style.setProperty('bottom', 'auto', 'important');
      el.style.setProperty('margin', '0', 'important');
      el.style.setProperty('touch-action', 'none', 'important');
    }
    if (dragging) {
      e.preventDefault();
      el.style.setProperty('left', `${initLeft + dx}px`, 'important');
      el.style.setProperty('top', `${initTop + dy}px`, 'important');
    }
  };

  const onPointerUp = (e) => {
    if (e.pointerId !== pointerId) return;
    if (dragging) {
      // Swallow the click that would otherwise fire right after a drag
      el.addEventListener(
        'click',
        function swallow(ev) {
          ev.stopPropagation();
          ev.preventDefault();
          el.removeEventListener('click', swallow, true);
        },
        true
      );
    }
    pointerId = null;
    dragging = false;
  };

  el.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  return () => {
    el.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };
}

/**
 * Observes the DOM for third-party widget elements and makes each one
 * draggable as soon as it appears. Returns a disconnect function.
 */
export function observeAndMakeDraggable() {
  const found = new Set();

  const scan = () => {
    for (const sel of WIDGET_SELECTORS) {
      document.querySelectorAll(sel).forEach((el) => {
        if (!found.has(el)) {
          found.add(el);
          makeDraggable(el);
        }
      });
    }
  };

  scan();
  const observer = new MutationObserver(() => scan());
  observer.observe(document.body, { childList: true, subtree: true });
  return () => {
    observer.disconnect();
  };
}