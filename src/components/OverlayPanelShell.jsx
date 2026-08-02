import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

/**
 * Shared shell for all overlay panels — a warm charcoal frosted-glass surface
 * with the gold hairline + ghostbull motif used across the site, so widget
 * panels feel like part of Bogèst rather than a cold external container.
 */
export default function OverlayPanelShell({ isOpen, onClose, children, header, maxWidth = 'min(90vw, 920px)', scrollable = true }) {
  const isMobile = useIsMobile();
  const navHeight = isMobile ? 64 : 80;

  // Toggle the panel-open body flag (pauses the hero video + slides the
  // ElevenLabs widget aside) while this widget overlay is open.
  useEffect(() => {
    if (isOpen) document.body.classList.add('bogest-panel-open');
    else document.body.classList.remove('bogest-panel-open');
    return () => document.body.classList.remove('bogest-panel-open');
  }, [isOpen]);

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
            style={{ background: 'transparent' }}
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
            className="relative pointer-events-auto flex flex-col w-full overflow-hidden"
            style={{
              height: `calc(100vh - ${navHeight}px)`,
              maxWidth: isMobile ? '100vw' : maxWidth,
              background: 'rgba(26,24,20,0.82)',
              backdropFilter: 'blur(40px) saturate(150%)',
              WebkitBackdropFilter: 'blur(40px) saturate(150%)',
              borderTop: '1px solid hsl(var(--primary) / 0.18)',
              borderLeft: '1px solid hsl(var(--primary) / 0.10)',
              borderRadius: '24px 0 0 0',
              boxShadow: '0 -24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          >
            {/* Warm gradient + ghostbull — recurring site motif */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(150deg, rgba(60,50,30,0.18) 0%, transparent 55%)' }} />
            <img src={BULL_MARK} alt="" aria-hidden draggable={false} className="absolute pointer-events-none select-none hidden md:block" style={{ height: '22rem', width: 'auto', bottom: '-4rem', right: '-6%', opacity: 0.07, filter: 'grayscale(1) brightness(2.4)' }} />

            {/* Close button — warm glass */}
            <button
              onClick={onClose}
              type="button"
              aria-label="Sluiten"
              className="absolute top-5 left-4 z-50 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid hsl(var(--primary) / 0.25)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <X className="w-4 h-4 text-foreground/80" />
            </button>

            {/* Header bar */}
            {header && (
              <div
                className="relative z-10 flex items-center gap-3 pr-6 md:pr-8 py-5 pl-16 flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                {header}
              </div>
            )}

            {/* Content */}
            <div className={`relative z-10 flex-1 min-h-0 bogest-scroll ${scrollable ? 'overflow-y-auto' : 'overflow-hidden flex flex-col'}`}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}