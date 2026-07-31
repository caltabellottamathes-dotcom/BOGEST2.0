import React, { useEffect, useRef, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@/lib/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';

// Shared glass surface — the same frosted-glass look as the digital host's chat window
function GlassPanelSurface() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        borderRadius: '24px 0 0 0',
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        borderTop: '1px solid rgba(255,255,255,0.16)',
        borderLeft: '1px solid rgba(255,255,255,0.16)',
        boxShadow: '0 -24px 80px rgba(0,0,0,0.50)',
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
      {/* Backdrop — darkens the website behind the panel */}
      <AnimatePresence>
        {isPanel && (
          <motion.div
            key="panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-30 pointer-events-auto"
            style={{ top: navHeight, background: isLight ? 'rgba(0,0,0,0.30)' : 'rgba(0,0,0,0.55)' }}
            onClick={() => navigate('/')}
          />
        )}
      </AnimatePresence>

      {/* Page content when no panel */}
      {!isPanel && children}

      {/* Panel */}
      <AnimatePresence mode="wait">
        {isPanel && (
          <motion.div
            key={location.pathname}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 z-40"
            style={{
              top: navHeight,
              bottom: 0,
              width: '100vw',
              maxWidth: isMobile ? '100vw' : 'min(82vw, 1200px)',
            }}
          >
            {/* Glass panel — ultra transparent, blurry, theme-aware */}
            <GlassPanelSurface />

            {/* Close button */}
            <button
              onClick={() => navigate('/')}
              className="absolute top-5 left-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 bg-white/[0.07] border border-white/10 hover:bg-white/12"
              style={{ backdropFilter: 'blur(12px)' }}
            >
              <X className="w-3.5 h-3.5 text-foreground/50" />
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