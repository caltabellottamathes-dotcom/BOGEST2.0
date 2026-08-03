import { useEffect, useState } from 'react';

/**
 * Returns the horizontal shift (px) that the floating bottom-right UI
 * (digital host, ElevenLabs widget, video card, proactive bubbles) should
 * apply when a glass panel opens, so they slide out from behind the panel.
 *
 * Returns 0 when no panel is open, and a negative value matching the panel
 * width when one is — keeping the elements visible just to the left of the
 * panel on desktop, and off-screen on mobile (where the panel is full-width).
 *
 * Listens for the `bogest:panel-visibility` event dispatched by <Layout />.
 */
export function usePanelShift(wide = false) {
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      // On mobile the panel is full-screen — keep the floating UI in place
      // (visible above the panel) instead of sliding it off-screen, so the
      // host button stays reachable and the chat can reopen over the panel.
      if (w < 640) return 0;
      const panelWidth = Math.min(w * 0.82, 1200);
      // Slide the floating set to the left of the screen and let it float
      // over the panel — but never off-screen. Clamp so the widest element in
      // the group stays fully visible at ~left:16. `wide` covers the chat
      // panel + proactive bubble; the default covers the FAB, video card, orb.
      const elemSpan = wide ? 96 + 440 : 20 + 148;
      const toLeftEdge = -(w - elemSpan - 16);
      return Math.max(-panelWidth, toLeftEdge);
    };
    const handler = (e) => setShift(e.detail?.open ? compute() : 0);
    const onResize = () => setShift((s) => (s < 0 ? compute() : 0));
    window.addEventListener('bogest:panel-visibility', handler);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('bogest:panel-visibility', handler);
      window.removeEventListener('resize', onResize);
    };
  }, [wide]);

  return shift;
}