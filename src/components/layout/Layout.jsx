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
import MapPanel from '@/components/MapPanel';
import DishPhotoPanel from '@/components/DishPhotoPanel';
import WebsiteDispatcherBridge from '@/components/WebsiteDispatcherBridge';
import BeeldbankEditor from '@/components/BeeldbankEditor';
import CookieBanner from '@/components/CookieBanner';
import CustomCursor from '@/components/CustomCursor';
import { SiteImagesProvider } from '@/lib/SiteImageContext';
import { observeAndMakeDraggable } from '@/lib/makeDraggable';

export default function Layout() {
  const location = useLocation();
  const isPanel = isPanelPath(location.pathname);
  const isHome = location.pathname === '/';
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

      {/* The homepage stays mounted across home↔panel transitions so the hero
          video never remounts (which would flash black while it reloads). The
          video is blurred + paused via CSS / body flag when a panel is open. */}
      <main
        className={isPanel ? 'flex-1 pointer-events-none select-none' : 'flex-1'}
        style={{ overflow: 'visible' }}
      >
        {isPanel || isHome ? <Home /> : <Outlet />}
      </main>

      {/* Glass panel slides over the homepage */}
      {isPanel && (
        <GlassPanelWrapper>
          <Outlet />
        </GlassPanelWrapper>
      )}

      {!isPanel && <Footer />}

      {/* Central website-action dispatcher bridge (wires router → actions) */}
      <WebsiteDispatcherBridge />

      {/* Digital Host — hidden on the internal Beeldbank */}
      {!isAssets && <DigitalHost />}

      {/* ElevenLabs Conversational AI Widget — deferred + hidden on Beeldbank.
          The voice orb is always visible; actual microphone use is gated by
          the Digital Host entry on the "Spraakfunctie" consent. */}
      {!isAssets && deferred && <ElevenLabsAgent />}

      {/* Floating welcome video — deferred + hidden on Beeldbank */}
      {!isAssets && deferred && <FloatingVideo />}

      {/* UI Action overlay renderer (Section 5) — gallery, reviews, maps, notifications */}
      <UIActionOverlay />

      {/* Slide-in map panel (route / location on the map) */}
      <MapPanel />

      {/* Slide-in dish photo panel (agent shows a dish photo) */}
      <DishPhotoPanel />

      {/* Custom gold cursor — dot + trailing ring (mouse only) */}
      <CustomCursor />

      {/* Beeldbank in-place editor — only renders when logged in as Beeldbank admin */}
      {!isAssets && <BeeldbankEditor />}

      {/* Cookie / consent banner + preferences (AVG/ePrivacy) */}
      <CookieBanner />
    </div>
    </SiteImagesProvider>
  );
}