import { useState, useEffect } from 'react';

/**
 * Floating welcome video — a pure video card on the right side, layered
 * above the ElevenLabs widget. Plays silently on loop as an ambient visual;
 * no buttons, dots, rings or overlays — just the video itself.
 */
const VIDEO_SRC =
  'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/53f5d005a_Host_Salvo_VideoCard.mp4';

export default function FloatingVideo() {
  const [isDesktop, setIsDesktop] = useState(false);

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

  const size = isDesktop ? 172 : 132;

  return (
    <div className="fixed right-4 sm:right-5 z-[100001]" style={{ bottom: 96, pointerEvents: 'none' }}>
      <div className="overflow-hidden rounded-2xl shadow-2xl" style={{ width: size, height: size }}>
        <video
          src={VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="block h-full w-full object-cover"
        />
      </div>
    </div>
  );
}