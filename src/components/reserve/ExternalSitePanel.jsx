import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ExternalLink, Loader2 } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { appParams } from '@/lib/app-params';

const NAV_HEIGHT = 80;

/**
 * Slide-out panel that loads an external website through a backend reverse-proxy.
 * Uses a direct GET iframe src to /functions/proxyExternalSite?path=...
 * All resources (CSS, JS, images, AJAX) route through the same proxy — same-origin.
 */
export default function ExternalSitePanel({ isOpen, onClose, url, title, subtitle, Icon = ShoppingBag }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [loaded, setLoaded] = useState(false);

  const proxySrc = useMemo(() => {
    const fnBase = `https://base44.app/api/apps/${appParams.appId}/functions/proxyExternalSite?path=`;
    try {
      const u = new URL(url);
      const path = u.pathname + (u.search || '');
      return fnBase + encodeURIComponent(path);
    } catch {
      return fnBase + encodeURIComponent('/');
    }
  }, [url]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      setLoaded(false);
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end pointer-events-none"
          style={{ top: NAV_HEIGHT }}
        >
          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-auto"
            style={{ background: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.40)' }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full sm:max-w-2xl md:max-w-3xl pointer-events-auto flex flex-col"
            style={{
              height: `calc(100vh - ${NAV_HEIGHT}px)`,
              background: isLight ? 'hsl(var(--background) / 0.30)' : 'rgba(0,0,0,0.38)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              borderTop: isLight ? '1px solid hsl(78 35% 28% / 0.25)' : '1px solid rgba(255,255,255,0.10)',
              borderLeft: isLight ? '1px solid hsl(78 35% 28% / 0.12)' : 'none',
              borderRadius: '24px 0 0 0',
              boxShadow: isLight ? '0 -24px 60px rgba(0,0,0,0.10)' : '0 -24px 80px rgba(0,0,0,0.50)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-6 md:px-8 py-5 flex-shrink-0"
              style={{
                borderBottom: isLight
                  ? '1px solid hsl(0 0% 40% / 0.12)'
                  : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
                style={{ background: 'hsl(var(--primary) / 0.12)' }}
              >
                <Icon className="text-primary" style={{ width: 18, height: 18 }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-base md:text-lg font-semibold text-foreground leading-tight">
                  {title}
                </p>
                {subtitle && (
                  <p className="font-body text-[11px] text-muted-foreground tracking-wide mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title="Openen in nieuw tabblad"
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                  background: isLight ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.10)',
                  border: isLight
                    ? '1px solid rgba(255,255,255,0.30)'
                    : '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <ExternalLink className="w-4 h-4 text-foreground" />
              </a>
              <button
                onClick={onClose}
                type="button"
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                  background: isLight ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.10)',
                  border: isLight
                    ? '1px solid rgba(255,255,255,0.30)'
                    : '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <X className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 flex flex-col p-4 md:p-6">
              <div
                className="relative w-full flex-1 min-h-0 overflow-hidden rounded-lg"
                style={{ background: 'white' }}
              >
                {!loaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    <p className="font-body text-xs tracking-wide text-muted-foreground">Laden…</p>
                  </div>
                )}

                <iframe
                  src={proxySrc}
                  title={title}
                  className="w-full h-full"
                  style={{ border: 'none', display: loaded ? 'block' : 'none' }}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                  allowFullScreen
                  onLoad={() => setLoaded(true)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}