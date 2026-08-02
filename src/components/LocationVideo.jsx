import React, { useRef, useEffect } from 'react';

const LOCATION_VIDEOS = {
  hasselt: 'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/aea67e9ce_Hasselt_Vid.mp4',
  borgloon: 'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/68b498a4a_Borgloon_Vid.mp4',
  'heusden-zolder': 'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/9ffcd4dc5_Heusden_Vid.mp4',
};

// Muted looping location video that fades in and plays on hover (desktop).
// The filename encodes the location (Hasselt / Borgloon / Heusden). Attaches
// play/pause to the closest card (the parent .group) so decorative overlays
// on top of the video don't block the hover.
export default function LocationVideo({ slug }) {
  const ref = useRef(null);
  const src = LOCATION_VIDEOS[slug];

  useEffect(() => {
    if (!src || !ref.current) return;
    const v = ref.current;
    const card = v.parentElement;
    if (!card) return;
    const enter = () => { try { v.currentTime = 0; v.play().catch(() => {}); } catch {} };
    const leave = () => { try { v.pause(); } catch {} };
    card.addEventListener('mouseenter', enter);
    card.addEventListener('mouseleave', leave);
    return () => {
      card.removeEventListener('mouseenter', enter);
      card.removeEventListener('mouseleave', leave);
    };
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
      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
    />
  );
}