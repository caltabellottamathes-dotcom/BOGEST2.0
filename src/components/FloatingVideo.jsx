import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Floating welcome video — replaces the D-ID visual agent widget.
 *
 * Sits as a square floating button on the right side, layered above the
 * ElevenLabs widget. Paused by default showing its first frame — pure video,
 * no icons or overlays. A small yellow "online" dot hovers over the video
 * card's top-right edge (half outside, half inside), matching the digital
 * host FAB. Clicking starts playback and the video expands (larger on
 * desktop); when it finishes it resets to the first frame and shrinks back.
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

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.currentTime = 0; void v.play(); }
    else v.pause();
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
      <div className="relative inline-block">
        {/* Yellow online dot — hovers over the video card edge (top-right corner) */}
        <span
          className="absolute rounded-full bg-primary pointer-events-none"
          style={{
            width: 12,
            height: 12,
            top: 0,
            right: 0,
            transform: 'translate(50%, -50%)',
            border: '2px solid rgba(8,8,8,0.92)',
            boxShadow: '0 0 8px rgba(231,205,112,0.55)',
            zIndex: 10,
          }}
        />

        <motion.button
          type="button"
          onClick={toggle}
          aria-label="Welkom video afspelen"
          animate={{ scale }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'bottom right', pointerEvents: 'auto' }}
          className="relative grid place-items-center overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10 bg-black cursor-pointer"
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
            style={{ width: base, height: base }}
          />
        </motion.button>
      </div>
    </div>
  );
}