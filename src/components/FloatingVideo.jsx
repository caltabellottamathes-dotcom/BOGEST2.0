import { useRef } from 'react';

/**
 * Floating welcome video — replaces the D-ID visual agent widget.
 *
 * Sits as a square floating button on the right side, layered above the
 * ElevenLabs widget. The video is paused by default showing its first frame;
 * clicking it starts playback, and when it finishes it resets to the first
 * frame and stops. It gives a subtle wiggle once in a while to draw attention.
 */
const VIDEO_SRC =
  'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/629bc14ad_WelkomSalvo.mp4';

export default function FloatingVideo() {
  const videoRef = useRef(null);

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
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Welkom video afspelen"
      className="fixed right-4 sm:right-5 z-[100001] grid place-items-center overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10 bg-black cursor-pointer"
      style={{ width: 140, height: 140, bottom: 96, animation: 'bogest-wiggle 6s ease-in-out infinite' }}
    >
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        playsInline
        preload="metadata"
        onEnded={handleEnded}
        className="h-full w-full object-cover"
      />
    </button>
  );
}