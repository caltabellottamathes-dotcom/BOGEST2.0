import { useEffect, useRef } from 'react';

// A custom gold cursor — a small dot that tracks the pointer instantly and a
// thin ring that trails with easing, growing over interactive elements. Only
// active on fine-pointer (mouse) devices; touch keeps the native cursor.
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add('bogest-custom-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let visible = false;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    };
    const onLeave = () => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };
    const onDown = () => ring.classList.add('bogest-cursor--down');
    const onUp = () => ring.classList.remove('bogest-cursor--down');
    const onOver = (e) => {
      const t = e.target.closest?.('a,button,[role="button"],input,textarea,select,label,.cursor-target,elevenlabs-convai,[id*="elevenlabs"],[class*="elevenlabs"],[id*="convai"],[class*="convai"]');
      ring.classList.toggle('bogest-cursor--hover', !!t);
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.classList.remove('bogest-custom-cursor');
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="bogest-cursor-ring" aria-hidden style={{ opacity: 0 }} />
      <div ref={dotRef} className="bogest-cursor-dot" aria-hidden style={{ opacity: 0 }} />
    </>
  );
}