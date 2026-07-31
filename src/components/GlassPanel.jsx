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
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px) saturate(150%)',
        WebkitBackdropFilter: 'blur(24px) saturate(150%)',
        borderTop: '1px solid rgba(255,255,255,0.14)',
        borderLeft: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 -30px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)',
      }}
    />
  );
}

// Pages that open as glass panels (not homepage)
const PANEL_PATHS = [
  '/menu', '/about', '/locations', '/reserve', '/takeaway',
  '/gift-cards', '/checkout', '/contact', '/groups', '/jobs',
  '/privacy', '/terms', '/admin', '/gift-package', '/instagram',
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
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 z-40"
            style={{
              top: navHeight,
              bottom: 0,
              width: '100vw',
              maxWidth: isMobile ? '100vw' : 'min(82vw, 1200px)',
            }}
          >
            <GlassPanelSurface />

            {/* Close button */}
            <button
              onClick={() => navigate('/')}
              className="absolute top-5 left-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 bg-white/[0.06] border border-white/12 hover:bg-white/12 hover:border-white/25"
              style={{ backdropFilter: 'blur(12px)' }}
            >
              <X className="w-3.5 h-3.5 text-foreground/50" />
            </button>

            {/* Scrollable content */}
            <PanelScrollContext.Provider value={contentRef}>
              <div
                ref={contentRef}
                className="relative h-full overflow-y-auto overflow-x-hidden scroll-smooth overscroll-contain pb-24 md:pb-0"
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