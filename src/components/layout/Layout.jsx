import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import GlassPanelWrapper, { isPanelPath } from '@/components/GlassPanel';
import Home from '@/pages/Home';
import DigitalHost from '@/components/DigitalHost';
import ElevenLabsAgent from '@/components/ElevenLabsAgent';
import DIdAgent from '@/components/DIdAgent';
import { observeAndMakeDraggable } from '@/lib/makeDraggable';

export default function Layout() {
  const location = useLocation();
  const isPanel = isPanelPath(location.pathname);
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

      {/* Digital Host — visible on all pages */}
      <DigitalHost />

      {/* ElevenLabs Conversational AI Widget — floating on the left */}
      <ElevenLabsAgent />

      {/* D-ID Visual AI Agent — floating widget on the right */}
      <DIdAgent />
    </div>
  );
}