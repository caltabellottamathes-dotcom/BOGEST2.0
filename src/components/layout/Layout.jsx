import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import GlassPanelWrapper, { isPanelPath } from '@/components/GlassPanel';
import Home from '@/pages/Home';
import DigitalHost from '@/components/DigitalHost';
import ElevenLabsAgent from '@/components/ElevenLabsAgent';
import FloatingVideo from '@/components/FloatingVideo';
import UIActionOverlay from '@/components/UIActionOverlay';
import WebsiteDispatcherBridge from '@/components/WebsiteDispatcherBridge';
import BeeldbankEditor from '@/components/BeeldbankEditor';
import { SiteImagesProvider } from '@/lib/SiteImageContext';
import { observeAndMakeDraggable } from '@/lib/makeDraggable';

export default function Layout() {
  const location = useLocation();
  const isPanel = isPanelPath(location.pathname);
  const isAssets = location.pathname === '/assets';
  const frozenScrollRef = useRef(0);
  const [deferred, setDeferred] = useState(false);

  // Defer heavy floating widgets (external ElevenLabs script + welcome video)
  // until after the first paint so the page never stalls on initial load.
  useEffect(() => {
    const ric = window.requestIdleCallback || ((fn) => setTimeout(fn, 500));
    const handle = ric(() => setDeferred(true), { timeout: 1200 });
    return () => { if (window.cancelIdleCallback && handle) window.cancelIdleCallback(handle); };
  }, []);

  // When a panel opens: save scroll position and lock the page in place
  // When panel closes: restore scroll position
  useEffect(() => {
    if (isPanel) {
      // Return the homepage to the Hero so the blurred backdrop behind the
      // panel is always the hero section, regardless of where the visitor was.
      frozenScrollRef.current = 0;
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = '0';
      document.body.style.width = '100%';
    } else {
      // On close, keep the homepage on the Hero.
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, 0);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isPanel]);

  // Tell floating UI (host, video card, ElevenLabs) to slide aside when a panel opens
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('bogest:panel-visibility', { detail: { open: isPanel } }));
    document.body.classList.toggle('bogest-panel-open', isPanel);
  }, [isPanel]);

  // Make third-party widgets (D-ID, ElevenLabs) draggable so they never block the digital host
  useEffect(() => {
    const disconnect = observeAndMakeDraggable();
    return () => disconnect();
  }, []);

  return (
    <SiteImagesProvider>
    <div className="min-h-screen flex flex-col bg-background" style={{ overflow: 'visible' }}>
      <Navbar />

      {isPanel ? (
        <>
          {/* Real homepage frozen in background — exactly where the user left it,
              gently blurred so the panel reads as the focal layer. */}
          <main className="flex-1 pointer-events-none select-none" style={{ filter: 'blur(6px)', transition: 'filter 0.4s cubic-bezier(0.22,1,0.36,1)', willChange: 'filter', transform: 'translateZ(0)' }}>
            <Home />
          </main>

          {/* Glass panel slides over the frozen homepage — no overlay */}
          <GlassPanelWrapper>
            <Outlet />
          </GlassPanelWrapper>
        </>
      ) : (
        <main className="flex-1" style={{ overflow: 'visible' }}>
          <Outlet />
        </main>
      )}

      {!isPanel && <Footer />}

      {/* Central website-action dispatcher bridge (wires router → actions) */}
      <WebsiteDispatcherBridge />

      {/* Digital Host — hidden on the internal Beeldbank */}
      {!isAssets && <DigitalHost />}

      {/* ElevenLabs Conversational AI Widget — deferred + hidden on Beeldbank */}
      {!isAssets && deferred && <ElevenLabsAgent />}

      {/* Floating welcome video — deferred + hidden on Beeldbank */}
      {!isAssets && deferred && <FloatingVideo />}

      {/* UI Action overlay renderer (Section 5) — gallery, reviews, maps, notifications */}
      <UIActionOverlay />

      {/* Beeldbank in-place editor — only renders when logged in as Beeldbank admin */}
      {!isAssets && <BeeldbankEditor />}
    </div>
    </SiteImagesProvider>
  );
}