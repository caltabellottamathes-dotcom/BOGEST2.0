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
export function usePanelShift() {
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      const isMobile = w < 640;
      const panelWidth = isMobile ? w : Math.min(w * 0.82, 1200);
      return -panelWidth;
    };
    const handler = (e) => setShift(e.detail?.open ? compute() : 0);
    const onResize = () => setShift((s) => (s < 0 ? compute() : 0));
    window.addEventListener('bogest:panel-visibility', handler);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('bogest:panel-visibility', handler);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return shift;
}