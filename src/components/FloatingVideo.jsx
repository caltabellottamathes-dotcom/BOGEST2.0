import { useRef, useState, useEffect } from 'react';

/**
 * Floating welcome video — a pure video card on the right side, layered
 * above the ElevenLabs widget. Shows just the video (first frame) with no
 * buttons, icons, rings or overlays. Clicking the video expands it and
 * starts playback with sound; when it finishes it shrinks back to the
 * first frame.
 */
const VIDEO_SRC =
  'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/53f5d005a_Host_Salvo_VideoCard.mp4';

export default function FloatingVideo() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
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

  const handleClick = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = false;
      v.currentTime = 0;
      void v.play();
    } else {
      v.pause();
    }
  };

  const handleEnded = () => {
    const v = videoRef.current;
    if (v) v.currentTime = 0;
    setPlaying(false);
  };

  const base = isDesktop ? 172 : 132;
  const scale = playing ? (isDesktop ? 1.34 : 1.18) : 1;

  return (
    <div className="fixed right-4 sm:right-5 z-[100001]" style={{ bottom: 96, pointerEvents: 'none' }}>
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
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={handleEnded}
          className="block h-full w-full object-cover"
        />
      </div>
    </div>
  );
}