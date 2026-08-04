// Hero video preload — the homepage entrance waits on this so the hero video
// is ready to play the moment the site reveals (no black flash, no late load).
// Cached so repeated calls reuse the same in-flight preload.

export const HERO_VIDEO_URL =
  'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/2d4d5be6f_intro_hero.mp4';

let cached = null;

export function preloadHeroVideo(timeoutMs = 6000) {
  if (cached) return cached;
  cached = new Promise((resolve) => {
    const v = document.createElement('video');
    v.preload = 'auto';
    v.muted = true;
    v.playsInline = true;
    v.src = HERO_VIDEO_URL;
    let done = false;
    const finish = (ok) => { if (!done) { done = true; resolve(ok); } };
    v.addEventListener('loadeddata', () => finish(true), { once: true });
    v.addEventListener('canplay', () => finish(true), { once: true });
    v.addEventListener('canplaythrough', () => finish(true), { once: true });
    v.addEventListener('error', () => finish(false), { once: true });
    setTimeout(() => finish(false), timeoutMs);
    try { v.load(); } catch {}
  });
  return cached;
}