import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Floating welcome video — replaces the D-ID visual agent widget.
 *
 * Sits as a square floating element on the right side, layered above the
 * ElevenLabs widget. Paused by default showing its first frame. A refined
 * gold-glass "Klik om af te spelen" hint floats INSIDE the video, overlaid at
 * the bottom — no pictograms, no buttons. Clicking starts playback and the
 * video briefly expands; when it finishes it resets to the first frame and
 * shrinks back. A transparent click-catcher sits over the video so the
 * browser never draws its native play button.
 */
const VIDEO_SRC =
  'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/15f09a6c0_Host_Salvo_new.mp4';

export default function FloatingVideo() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
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

  return (
    <div className="fixed right-4 sm:right-5 z-[100001]" style={{ bottom: 96, pointerEvents: 'none' }}>
      <motion.div
        type="button"
        onClick={toggle}
        role="button"
        aria-label="Welkom video afspelen"
        animate={{ scale: playing ? 1.25 : 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'bottom right', pointerEvents: 'auto', cursor: 'pointer' }}
        className="relative grid place-items-center overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10 bg-black"
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={handleEnded}
          className="block h-full w-full object-cover pointer-events-none"
          style={{ width: 140, height: 140 }}
        />

        {/* Transparent click-catcher — sits above the video so the browser
            never paints a native play button on it. */}
        <div className="absolute inset-0" style={{ pointerEvents: 'auto' }} />

        {/* Hint — inside the video, overlaid at the bottom; text only, no
            pictograms. Hidden while playing so it never covers the video. */}
        <AnimatePresence>
          {!playing && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: [0, 1, 0.6, 1], y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full whitespace-nowrap pointer-events-none"
              style={{
                padding: '5px 11px',
                background: 'rgba(12,12,12,0.55)',
                backdropFilter: 'blur(10px) saturate(140%)',
                WebkitBackdropFilter: 'blur(10px) saturate(140%)',
                border: '1px solid hsl(47 73% 67% / 0.45)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.03)',
              }}
            >
              <span
                className="font-body text-[9px] tracking-[0.22em] uppercase"
                style={{ color: 'hsl(47 73% 85%)' }}
              >
                Klik om af te spelen
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}