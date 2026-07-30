import React, { useEffect, useRef } from 'react';
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
import { observeAndMakeDraggable } from '@/lib/makeDraggable';

export default function Layout() {
  const location = useLocation();
  const isPanel = isPanelPath(location.pathname);
  const isAssets = location.pathname === '/assets';
  const frozenScrollRef = useRef(0);

  // When a panel opens: save scroll position and lock the page in place
  // When panel closes: restore scroll position
  useEffect(() => {
    if (isPanel) {
      frozenScrollRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${frozenScrollRef.current}px`;
      document.body.style.width = '100%';
    } else {
      const savedScroll = frozenScrollRef.current;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, savedScroll);
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
    <div className="min-h-screen flex flex-col bg-background" style={{ overflow: 'visible' }}>
      <Navbar />

      {isPanel ? (
        <>
          {/* Real homepage frozen in background — exactly where the user left it */}
          <main className="flex-1 pointer-events-none select-none">
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

      {/* ElevenLabs Conversational AI Widget — hidden on the internal Beeldbank */}
      {!isAssets && <ElevenLabsAgent />}

      {/* Floating welcome video — hidden on the internal Beeldbank */}
      {!isAssets && <FloatingVideo />}

      {/* UI Action overlay renderer (Section 5) — gallery, reviews, maps, notifications */}
      <UIActionOverlay />
    </div>
  );
}