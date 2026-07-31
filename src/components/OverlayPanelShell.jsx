import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';

const NAV_HEIGHT = 80;

/**
 * Shared shell for all overlay panels.
 * - Transparent glassmorphism surface (same as GlassPanel)
 * - Close button always top-left
 * - Consistent width, animation, backdrop
 */
export default function OverlayPanelShell({ isOpen, onClose, children, header, maxWidth = 'min(90vw, 920px)', scrollable = true }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const isMobile = useIsMobile();
  const navHeight = isMobile ? 64 : 80;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end pointer-events-none" style={{ top: navHeight }}>
          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 pointer-events-auto"
            style={{ background: isLight ? 'rgba(0,0,0,0.30)' : 'rgba(0,0,0,0.55)' }}
          />

          {/* Panel */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              closed: { x: '100%', transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
              open: { x: 0, transition: { duration: 0.42, ease: [0.32, 0.72, 0, 1] } },
            }}
            className="relative pointer-events-auto flex flex-col w-full"
            style={{
              height: `calc(100vh - ${navHeight}px)`,
              maxWidth: isMobile ? '100vw' : maxWidth,
              background: isLight ? 'hsl(var(--background) / 0.30)' : 'rgba(0,0,0,0.38)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              borderTop: isLight ? '1px solid hsl(78 35% 28% / 0.25)' : '1px solid rgba(255,255,255,0.10)',
              borderLeft: isLight ? '1px solid hsl(78 35% 28% / 0.12)' : 'none',
              borderRadius: '24px 0 0 0',
              boxShadow: isLight ? '0 -24px 60px rgba(0,0,0,0.10)' : '0 -24px 80px rgba(0,0,0,0.50)',
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          >
            {/* Close button — always top-left, above content */}
            <button
              onClick={onClose}
              type="button"
              aria-label="Sluiten"
              className="absolute top-5 left-4 z-50 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: isLight ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.14)',
                border: isLight ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <X className="w-4 h-4 text-foreground/70" />
            </button>

            {/* Optional header bar */}
            {header && (
              <div
                className="flex items-center gap-3 pr-6 md:pr-8 py-5 pl-16 flex-shrink-0"
                style={{ borderBottom: isLight ? '1px solid hsl(0 0% 40% / 0.12)' : '1px solid rgba(255,255,255,0.08)' }}
              >
                {header}
              </div>
            )}

            {/* Content */}
            <div className={`flex-1 min-h-0 ${scrollable ? 'overflow-y-auto' : 'overflow-hidden flex flex-col'}`}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}