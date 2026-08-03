import React, { useRef, useEffect, useState } from 'react';

const LOCATION_VIDEOS = {
  hasselt: 'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/b32eef6cb_Hasselt_Vid_New.mp4',
  borgloon: 'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/68b498a4a_Borgloon_Vid.mp4',
  'heusden-zolder': 'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/193f4a2a7_Heusden_Vid_New.mp4',
};

// Muted looping location video that plays ONLY while the visitor hovers it
// (desktop) or taps it (mobile). It pauses the moment the pointer leaves or
// the card scrolls out of view, so the four location previews stay calm and
// silent until the guest shows interest.
export default function LocationVideo({ slug }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const src = LOCATION_VIDEOS[slug];

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;

    // Pause whenever the card scrolls out of view.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) {
          setActive(false);
          try { v.pause(); } catch {}
        }
      });
    }, { threshold: 0.4 });
    io.observe(v.parentElement || v);

    return () => io.disconnect();
  }, [src]);

  if (!src) return null;
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      onMouseEnter={(e) => { setActive(true); e.currentTarget.play().catch(() => {}); }}
      onMouseLeave={(e) => { setActive(false); try { e.currentTarget.pause(); } catch {} }}
      onTouchStart={(e) => { setActive(true); e.currentTarget.play().catch(() => {}); }}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}