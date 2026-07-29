import { useRef, useState } from 'react';

/**
 * Floating welcome video — replaces the D-ID visual agent widget.
 *
 * Sits as a square floating button on the right side (where the D-ID widget
 * was). The video is paused by default showing its first frame; clicking it
 * starts playback, and when it finishes it resets to the first frame and stops.
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
    <button
      type="button"
      onClick={toggle}
      aria-label="Welkom video afspelen"
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-[99999] grid place-items-center overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10 bg-black group cursor-pointer"
      style={{ width: 112, height: 112 }}
    >
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={handleEnded}
        className="h-full w-full object-cover"
      />
      {!playing && (
        <span className="absolute inset-0 grid place-items-center bg-black/30 transition-colors group-hover:bg-black/20">
          <span className="grid place-items-center h-9 w-9 rounded-full bg-white/90 text-black shadow-lg">
            <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px]" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      )}
    </button>
  );
}