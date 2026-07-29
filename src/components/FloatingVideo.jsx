import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Floating welcome video — replaces the D-ID visual agent widget.
 *
 * Sits as a square floating button on the right side, layered above the
 * ElevenLabs widget. Paused by default showing its first frame. A subtle
 * fading "Klik om af te spelen" hint invites a click. Clicking starts playback
 * and the video briefly expands; when it finishes it resets to the first
 * frame and shrinks back to its original size.
 */
const VIDEO_SRC =
  'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/629bc14ad_WelkomSalvo.mp4';

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
    <div className="fixed right-4 sm:right-5 z-[100001]" style={{ bottom: 96 }}>
      <motion.button
        type="button"
        onClick={toggle}
        aria-label="Welkom video afspelen"
        animate={{ scale: playing ? 1.25 : 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'bottom right' }}
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

        {/* Subtle click hint — only while paused */}
        <AnimatePresence>
          {!playing && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/55 text-white text-[9px] font-body tracking-wide whitespace-nowrap pointer-events-none"
            >
              Klik om af te spelen
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}