import React, { useEffect, useRef, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@/lib/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';

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
        boxShadow: '0 -30px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(231,205,112,0.10), inset 0 1px 0 rgba(255,255,255,0.10)',
      }}
    />
  );
}

// Pages that open as glass panels (not homepage)
const PANEL_PATHS = [
  '/menu', '/about', '/locations', '/reserve', '/takeaway',
  '/gift-cards', '/checkout', '/contact', '/groups', '/jobs',
  '/privacy', '/terms', '/admin', '/gift-package',
];

export function isPanelPath(pathname) {
  return PANEL_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));
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

  useEffect(() => {
    if (isPanel && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [location.pathname, isPanel]);

  return (
    <>
      {/* Backdrop — dims the site behind the panel; stays put across panel-to-panel nav */}
      <AnimatePresence>
        {isPanel && (
          <motion.div
            key="panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-30 pointer-events-auto"
            style={{ top: navHeight, background: isLight ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.52)' }}
            onClick={() => navigate('/')}
          />
        )}
      </AnimatePresence>

      {/* Page content when no panel */}
      {!isPanel && children}

      {/* Panel — a sleek layer that slides over the site. The previous panel
          closes before the next opens (mode="wait") so each layer reads as a
          distinct sheet opening and closing over the homepage beneath. */}
      <AnimatePresence mode="wait">
        {isPanel && (
          <motion.div
            key={location.pathname}
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              closed: { x: '100%', transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } },
              open: { x: 0, transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] } },
            }}
            className="fixed right-0 z-40"
            style={{
              top: navHeight,
              bottom: 0,
              width: '100vw',
              maxWidth: isMobile ? '100vw' : 'min(82vw, 1200px)',
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          >
            <GlassPanelSurface />

            {/* Close button — always visible above panel content */}
            <button
              onClick={() => navigate('/')}
              aria-label="Sluiten"
              className="absolute top-5 left-4 z-50 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
            >
              <X className="w-4 h-4 text-white/90" />
            </button>

            {/* Scrollable content */}
            <PanelScrollContext.Provider value={contentRef}>
              <div
                ref={contentRef}
                className="relative h-full overflow-y-auto overflow-x-hidden scroll-smooth overscroll-contain"
                style={{ WebkitOverflowScrolling: 'touch', willChange: 'scroll-position' }}
              >
                {children}
              </div>
            </PanelScrollContext.Provider>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}