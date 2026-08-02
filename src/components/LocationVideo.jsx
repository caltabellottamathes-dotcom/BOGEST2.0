import React, { useRef, useEffect, useState } from 'react';

const LOCATION_VIDEOS = {
  hasselt: 'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/aea67e9ce_Hasselt_Vid.mp4',
  borgloon: 'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/68b498a4a_Borgloon_Vid.mp4',
  'heusden-zolder': 'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/9ffcd4dc5_Heusden_Vid.mp4',
};

// Muted looping location video that plays automatically when its card scrolls
// into view and pauses when it leaves. The filename encodes the location.
export default function LocationVideo({ slug }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const src = LOCATION_VIDEOS[slug];

  useEffect(() => {
    if (!src || !ref.current) return;
    const v = ref.current;
    const target = v.parentElement || v;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setActive(true);
          v.play().catch(() => {});
        } else {
          setActive(false);
          try { v.pause(); } catch {}
        }
      });
    }, { threshold: 0.4 });
    io.observe(target);
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
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}