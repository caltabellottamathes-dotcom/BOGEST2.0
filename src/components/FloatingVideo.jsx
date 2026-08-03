import { useRef, useState, useEffect } from 'react';
import { usePanelShift } from '@/hooks/usePanelShift';

/**
 * Floating welcome video — a pure video card on the right side.
 *
 * When idle (not active), a muted looping "idle" video plays in the card.
 * Clicking the card activates the main welcome video: it expands and plays
 * with sound. When the main video ends, the card shrinks back and the idle
 * loop resumes.
 *
 * The card can be swiped away (drag it past a small threshold). It reappears
 * after a page reload, or once a glass panel has opened and closed again.
 * The previous yellow blink pulse was removed — the card stays quietly
 * styled at all times.
 */
const VIDEO_SRC =
  'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/53f5d005a_Host_Salvo_VideoCard.mp4';
const IDLE_VIDEO_SRC =
  'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/a94c6bef7_Hostinactive_new.mp4';

export default function FloatingVideo() {
  const mainRef = useRef(null);
  const idleRef = useRef(null);
  const [active, setActive] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [kbOpen, setKbOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const shift = usePanelShift();
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, moved: false });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    try { mq.addEventListener('change', update); }
    catch { mq.addListener(update); }
    return () => {
      try { mq.removeEventListener('change', update); }
      catch { mq.removeListener(update); }
    };
  }, []);

  useEffect(() => {
    const handler = (e) => setHidden(e.detail?.open === true);
    window.addEventListener('bogest:popup-visibility', handler);
    return () => window.removeEventListener('bogest:popup-visibility', handler);
  }, []);

  // Slide the video card out of frame while the mobile chat keyboard is open.
  useEffect(() => {
    const handler = (e) => setKbOpen(e.detail?.open === true);
    window.addEventListener('bogest:keyboard-visibility', handler);
    return () => window.removeEventListener('bogest:keyboard-visibility', handler);
  }, []);

  // Slide the video card out of frame while the mobile chat panel is open.
  useEffect(() => {
    const handler = (e) => setChatOpen(e.detail?.open === true);
    window.addEventListener('bogest:chat-visibility', handler);
    return () => window.removeEventListener('bogest:chat-visibility', handler);
  }, []);

  // Slide the video card off-screen on mobile while a widget overlay panel
  // (reserve / giftcard) is open; it returns when the panel closes — and a
  // closing overlay also clears a manual swipe-dismiss so the card reappears.
  useEffect(() => {
    const handler = (e) => {
      setOverlayOpen(e.detail?.open === true);
      if (e.detail?.open === false) setDismissed(false);
    };
    window.addEventListener('bogest:overlay-panel-visibility', handler);
    return () => window.removeEventListener('bogest:overlay-panel-visibility', handler);
  }, []);

  // Reappear after a glass panel has opened and then closed — the card comes
  // back, even if it was swiped away. (A page reload resets it too, naturally.)
  useEffect(() => {
    let wasOpen = document.body.classList.contains('bogest-panel-open');
    const obs = new MutationObserver(() => {
      const isOpen = document.body.classList.contains('bogest-panel-open');
      if (wasOpen && !isOpen) setDismissed(false);
      wasOpen = isOpen;
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // Fade/scale the card in smoothly once it's allowed to show.
  useEffect(() => {
    if (hidden || dismissed) { setRevealed(false); return; }
    const t = setTimeout(() => setRevealed(true), 20);
    return () => clearTimeout(t);
  }, [hidden, dismissed]);

  if (hidden) return null;

  const handleClick = () => {
    if (dragStart.current.moved) return; // it was a swipe, not a tap
    const v = mainRef.current;
    if (!v) return;
    if (!active) {
      setActive(true);
      v.muted = false;
      v.currentTime = 0;
      void v.play();
    } else {
      v.pause();
      v.currentTime = 0;
      setActive(false);
      setPlaying(false);
    }
  };

  const handleEnded = () => {
    const v = mainRef.current;
    if (v) v.currentTime = 0;
    setActive(false);
    setPlaying(false);
  };

  const onPointerDown = (e) => {
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, moved: false };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.hypot(dx, dy) > 6) dragStart.current.moved = true;
    setDrag({ x: dx, y: dy });
  };
  const onPointerUp = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setDrag({ x: 0, y: 0 });
    if (Math.hypot(dx, dy) > 60) setDismissed(true);
  };

  const base = isDesktop ? 148 : 112;
  const scale = active ? (isDesktop ? 2.6 : 1.9) : 1;
  const offX = (kbOpen || chatOpen ? 600 : 0) + (!isDesktop && overlayOpen ? 700 : 0);
  const dismissX = dismissed ? 540 : 0;
  const dismissY = dismissed ? 540 : 0;
  const totalX = shift + offX + drag.x + dismissX;
  const totalY = drag.y + dismissY;

  return (
    <div
      className="fixed right-4 sm:right-5 z-[100001]"
      style={{
        bottom: 84,
        pointerEvents: 'none',
        transform: `translate(${totalX}px, ${totalY}px)`,
        transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div
        onClick={handleClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
        style={{
          width: base,
          height: base,
          transformOrigin: 'bottom right',
          transform: `scale(${scale})`,
          transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease, opacity 0.45s ease',
          opacity: revealed ? 1 : 0,
          pointerEvents: 'auto',
          touchAction: 'none',
          border: '1.5px solid rgba(255,255,255,0.10)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        }}
      >
        {/* Idle looping video — visible only when the card is not active */}
        <video
          ref={idleRef}
          src={IDLE_VIDEO_SRC}
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: active ? 0 : 1, transition: 'opacity 0.4s ease' }}
        />
        {/* Main welcome video — shown when active */}
        <video
          ref={mainRef}
          src={VIDEO_SRC}
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={handleEnded}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: active ? 1 : 0, transition: 'opacity 0.4s ease' }}
        />
      </div>
    </div>
  );
}