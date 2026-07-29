import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Floating welcome video — replaces the D-ID visual agent widget.
 *
 * Sits as a square floating button on the right side, layered above the
 * ElevenLabs widget. Paused by default showing its first frame. A subtle
 * "Klik om af te spelen" hint hovers at the LEFT edge of the video — half
 * overlapping the video card, half floating outside it — with no pictograms.
 * Clicking starts playback and the video briefly expands; when it finishes it
 * resets to the first frame and shrinks back.
 */
const VIDEO_SRC =
  'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/aaab263c2_Host_Salvo_new_Kl.mp4';

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
      className="fixed right-4 sm:right-5 z-[100001]"
      style={{ bottom: 96, pointerEvents: 'none' }}
    >
      <div className="relative inline-block">
        {/* Hint — hovers at the video's left edge: half over the card, half
            outside. Subtle, no pictograms; hidden while playing. */}
        <AnimatePresence>
          {!playing && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.45, 0.75, 0.45] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full pointer-events-none z-10"
              style={{
                padding: '5px 11px',
                background: 'rgba(12,12,12,0.42)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              }}
            >
              <span
                className="font-body text-[8px] tracking-[0.22em] uppercase"
                style={{ color: 'rgba(255,255,255,0.7)' }}
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
    </div>
  );
}