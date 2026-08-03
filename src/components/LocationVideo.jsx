import React, { useRef, useEffect, useState } from 'react';

const LOCATION_VIDEOS = {
  hasselt: 'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/b32eef6cb_Hasselt_Vid_New.mp4',
  borgloon: 'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/68b498a4a_Borgloon_Vid.mp4',
  'heusden-zolder': 'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/193f4a2a7_Heusden_Vid_New.mp4',
};

// Muted looping location video that plays ONLY while the visitor hovers the
// location card (desktop) or taps it (mobile). The hover listeners are bound
// to the CARD (the video's parent) rather than the <video> itself, because a
// gradient/text overlay sits on top of the video and would swallow pointer
// events aimed at the element. The video pauses on pointer-leave and when the
// card scrolls out of view.
export default function LocationVideo({ slug }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const src = LOCATION_VIDEOS[slug];

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    const card = v.parentElement;
    if (!card) return;

    const play = () => { setActive(true); v.play().catch(() => {}); };
    const pause = () => { setActive(false); try { v.pause(); } catch {} };

    card.addEventListener('mouseenter', play);
    card.addEventListener('mouseleave', pause);
    card.addEventListener('touchstart', play, { passive: true });

    // Pause whenever the card scrolls out of view.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (!e.isIntersecting) pause(); });
    }, { threshold: 0.4 });
    io.observe(card);

    return () => {
      card.removeEventListener('mouseenter', play);
      card.removeEventListener('mouseleave', pause);
      card.removeEventListener('touchstart', play);
      io.disconnect();
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
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}