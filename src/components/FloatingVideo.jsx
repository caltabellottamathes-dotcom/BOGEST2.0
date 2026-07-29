import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Floating welcome video — replaces the D-ID visual agent widget.
 *
 * Sits as a square floating button on the right side, layered above the
 * ElevenLabs widget. Paused by default showing its first frame. A refined
 * gold-glass "Klik om af te spelen" hint sits OUTSIDE the video (to its left)
 * and contains no pictograms. Clicking starts playback and the video briefly
 * expands; when it finishes it resets to the first frame and shrinks back.
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
    <div
      className="fixed right-4 sm:right-5 z-[100001] flex flex-row items-center justify-end gap-2.5"
      style={{ bottom: 96, pointerEvents: 'none' }}
    >
      {/* Hint — outside the video, no pictograms; hidden while playing so it
          never overlaps the expanded video. */}
      <AnimatePresence>
        {!playing && (
          <motion.span
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: [0, 1, 0.6, 1], x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-full whitespace-nowrap pointer-events-none"
            style={{
              padding: '6px 12px',
              background: 'rgba(12,12,12,0.55)',
              backdropFilter: 'blur(10px) saturate(140%)',
              WebkitBackdropFilter: 'blur(10px) saturate(140%)',
              border: '1px solid hsl(47 73% 67% / 0.45)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.03)',
            }}
          >
            <span
              className="font-body text-[10px] tracking-[0.22em] uppercase"
              style={{ color: 'hsl(47 73% 85%)' }}
            >
              Klik om af te spelen
            </span>
          </motion.span>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={toggle}
        aria-label="Welkom video afspelen"
        animate={{ scale: playing ? 1.25 : 1 }}
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
          style={{ width: 140, height: 140 }}
        />
      </motion.button>
    </div>
  );
}