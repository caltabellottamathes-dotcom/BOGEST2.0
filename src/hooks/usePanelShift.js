import { useEffect, useState } from 'react';

/**
 * Returns the horizontal shift (px) that the floating bottom-right UI
 * (digital host, ElevenLabs widget, video card, proactive bubbles) should
 * apply when ANY panel is open — a full route panel (glass panel: menu,
 * locations, ...) or a smaller slide-in overlay panel (dish photo, map,
 * reserve, gift card, ...) — so they slide out from behind it.
 *
 * Returns 0 when nothing is open, and a negative value matching the panel
 * width when one is — keeping the elements visible just to the left of the
 * panel on desktop, and off-screen on mobile (where panels are full-width).
 *
 * Listens for both `bogest:panel-visibility` (route panels, dispatched by
 * <Layout />) and `bogest:overlay-panel-visibility` (slide-in widget panels,
 * dispatched by <OverlayPanelShell />) so every panel type shifts the UI.
 */
export function usePanelShift(wide = false) {
  const [routeOpen, setRouteOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const onRoute = (e) => setRouteOpen(Boolean(e.detail?.open));
    const onOverlay = (e) => setOverlayOpen(Boolean(e.detail?.open));
    window.addEventListener('bogest:panel-visibility', onRoute);
    window.addEventListener('bogest:overlay-panel-visibility', onOverlay);
    return () => {
      window.removeEventListener('bogest:panel-visibility', onRoute);
      window.removeEventListener('bogest:overlay-panel-visibility', onOverlay);
    };
  }, []);

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
    const onResize = () => setShift((s) => (s < 0 ? compute() : 0));
    window.addEventListener('resize', onResize);
    setShift((routeOpen || overlayOpen) ? compute() : 0);
    return () => window.removeEventListener('resize', onResize);
  }, [routeOpen, overlayOpen, wide]);

  return shift;
}