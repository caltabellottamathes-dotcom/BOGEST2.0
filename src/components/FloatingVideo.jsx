import { useRef, useState, useEffect } from 'react';
import { usePanelShift } from '@/hooks/usePanelShift';

/**
 * Floating welcome video — a pure video card on the right side.
 *
 * When idle (not active), a muted looping "idle" video plays in the card.
 * Clicking the card activates the main welcome video: it expands and plays
 * with sound. When the main video ends, the card shrinks back and the idle
 * loop resumes.
 */
const VIDEO_SRC =
  'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/53f5d005a_Host_Salvo_VideoCard.mp4';
const IDLE_VIDEO_SRC =
  'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/12d74964e_Hostinactive.mp4';

export default function FloatingVideo() {
  const mainRef = useRef(null);
  const idleRef = useRef(null);
  const [active, setActive] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hidden, setHidden] = useState(false);
  const shift = usePanelShift();

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

  if (hidden) return null;

  const handleClick = () => {
    const v = mainRef.current;
    if (!v) return;
    if (!active) {
      setActive(true);
      v.muted = false;
      v.currentTime = 0;
      void v.play();
    } else if (v.paused) {
      void v.play();
    } else {
      v.pause();
    }
  };

  const handleEnded = () => {
    const v = mainRef.current;
    if (v) v.currentTime = 0;
    setActive(false);
    setPlaying(false);
  };

  const base = isDesktop ? 172 : 132;
  const scale = active ? (isDesktop ? 1.34 : 1.18) : 1;

  return (
    <div
      className="fixed right-4 sm:right-5 z-[100001]"
      style={{
        bottom: 96,
        pointerEvents: 'none',
        transform: `translateX(${shift}px)`,
        transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div
        onClick={handleClick}
        className="relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
        style={{
          width: base,
          height: base,
          transformOrigin: 'bottom right',
          transform: `scale(${scale})`,
          transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          pointerEvents: 'auto',
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