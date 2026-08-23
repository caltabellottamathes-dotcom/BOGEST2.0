import React, { useEffect, useRef, useState, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@/lib/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { openPanel, closePanel } from '@/lib/panelOpenState';

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

// Refined frosted-glass surface for the sliding panels — the same transparent
// "layer" treatment used across the site (cards, footer). A touch more
// transparent, a sharper hairline edge and an inset top highlight so each
// panel reads as a distinct layer floating over the dimmed site.
function GlassPanelSurface() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        borderRadius: '24px 0 0 0',
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(40px) saturate(160%)',
        WebkitBackdropFilter: 'blur(40px) saturate(160%)',
        borderTop: '1px solid rgba(255,255,255,0.16)',
        borderLeft: '1px solid rgba(255,255,255,0.16)',
        boxShadow: '0 -30px 90px rgba(0,0,0,0.55), 0 0 0 1px hsl(var(--primary) / 0.10), inset 0 1px 0 rgba(255,255,255,0.10)'
      }} />);


}

// Pages that open as glass panels (not homepage)
// Nederlandse routes (primair) + oude Engelse paden (voor backwards-compat / redirects).
const PANEL_PATHS = [
  '/menukaart', '/menu',
  '/over-ons', '/about',
  '/locaties', '/locations',
  '/restaurantruimtes', '/restaurant-spaces',
  '/reserveren', '/reserve',
  '/traiteur', '/takeaway',
  '/cadeaubonnen', '/gift-cards',
  '/checkout', '/contact',
  '/groepen', '/groups',
  '/vacatures', '/jobs',
  '/privacy', '/voorwaarden', '/terms',
  '/cookies', '/ai-disclaimer',
  '/vraag-het-aan-bogest',
  '/admin', '/gift-package'];


export function isPanelPath(pathname) {
  return PANEL_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

// Navbar height to offset panel top
const NAV_HEIGHT = 80;

export const PanelScrollContext = React.createContext(null);

export default function GlassPanelWrapper({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const isMobile = useIsMobile();
  const navHeight = isMobile ? 64 : 80;
  const isPanel = isPanelPath(location.pathname);
  const contentRef = useRef(null);
  const [isCompact, setIsCompact] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (isPanel && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [location.pathname, isPanel]);

  // Toggle the panel-open body flag so the hero video pauses and the
  // ElevenLabs widget slides aside while a glass panel is open.
  useEffect(() => {
    if (!isPanel) return;
    openPanel();
    return () => closePanel();
  }, [isPanel]);

  return (
    <>
      {/* Backdrop — dims the site behind the panel; stays put across panel-to-panel nav */}
      <AnimatePresence>
        {isPanel &&
        <motion.div
          key="panel-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-30 pointer-events-auto opacity-100"
          style={{ top: navHeight, background: isLight ? 'rgba(0,0,0,0.16)' : 'rgba(0,0,0,0.38)' }}
          onClick={() => navigate('/')}>
          {/* Groot ghosted Bogèst-bull-logo op de achtergrond achter het paneel */}
          <img src={BULL_MARK} alt="" aria-hidden draggable={false}
            className="absolute pointer-events-none select-none hidden md:block"
            style={{ height: '80vh', width: 'auto', top: '50%', left: 'calc(100vw - min(82vw, 1200px) - 90px)', transform: 'translate(-50%, -50%)', opacity: isLight ? 0.09 : 0.14, filter: 'grayscale(1) brightness(2.4)' }} />
        </motion.div>

        }
      </AnimatePresence>

      {/* Page content when no panel */}
      {!isPanel && children}

      {/* Panel — a sleek layer that slides over the site. The previous panel
           closes before the next opens (mode="wait") so each layer reads as a
           distinct sheet opening and closing over the homepage beneath. */}
      <AnimatePresence>
        {isPanel &&
        <motion.div
          key={location.pathname}
          initial={{ x: '100%' }}
          animate={{ x: 0, transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ x: '100%', transition: { duration: 1.7, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed right-0 z-40"
          style={{
            top: navHeight,
            bottom: 0,
            width: '100vw',
            maxWidth: isCompact ? '100vw' : 'min(82vw, 1200px)',
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}>
          
            <GlassPanelSurface />

            {/* Close button — always visible above panel content */}
            <button
            onClick={() => navigate('/')}
            aria-label="Sluiten"
            className="absolute top-5 left-4 z-50 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
            
              <X className="w-4 h-4 text-white/90" />
            </button>

            {/* Scrollable content */}
            <PanelScrollContext.Provider value={contentRef}>
              <div
              ref={contentRef}
              data-panel-scroll
              className="relative h-full overflow-y-auto overflow-x-hidden scroll-smooth overscroll-contain bogest-scroll"
              style={{ WebkitOverflowScrolling: 'touch', willChange: 'scroll-position' }}>
              
                {children}
              </div>
            </PanelScrollContext.Provider>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}