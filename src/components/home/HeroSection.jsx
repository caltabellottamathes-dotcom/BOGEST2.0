import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { useTheme } from '@/lib/ThemeContext';
import { HERO_VIDEO_URL } from '@/lib/heroVideo';


const HERO_IMAGE = 'https://media.base44.com/images/public/6a062d5a5c4241c6b2404e25/8696324df_Make_this_photo_look_more_202605150157.jpg';

export default function HeroSection() {
  const [pastHero, setPastHero] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const { t } = useLang();
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.3);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Expose pastHero to Layout/DigitalHost via a custom event
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('bogest:hero-scroll', { detail: { pastHero } }));
  }, [pastHero]);

  // Pause the hero video while a glass panel is open; resume when it closes.
  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // React doesn't reliably set the `muted` DOM property from the JSX
    // attribute, which silently breaks autoplay. Set it imperatively so the
    // muted background loop always autoplays.
    v.muted = true;
    v.defaultMuted = true;
    const sync = () => {
      if (document.body.classList.contains('bogest-panel-open')) {
        v.pause();
      } else {
        v.play().catch(() => {});
      }
    };
    sync();
    const onCanPlay = () => { if (!document.body.classList.contains('bogest-panel-open')) v.play().catch(() => {}); };
    v.addEventListener('canplay', onCanPlay);
    if (v.readyState >= 2) setVideoReady(true);
    const onReady = () => setVideoReady(true);
    v.addEventListener('loadeddata', onReady);
    const obs = new MutationObserver(sync);
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => { obs.disconnect(); v.removeEventListener('loadeddata', onReady); v.removeEventListener('canplay', onCanPlay); };
  }, []);

  return (
    <>
      {/* Fixed background — the hero video stays pinned to the viewport while
          the rest of the homepage slides up over it. The video keeps its
          Beeldbank data-bb-key so admins can still swap it. */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-black" aria-hidden>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover hero-video"
          src={HERO_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={(e) => { if (!document.body.classList.contains('bogest-panel-open')) e.currentTarget.play().catch(() => {}); }}
          style={{ opacity: 1 }}
        />
      </div>

      {/* Hero content — sits above the fixed video and scrolls normally.
          pointer-events-none on the shell lets clicks reach the fixed video
          (for Beeldbank); interactive elements re-enable pointer events. */}
      <section className="relative z-20 w-full h-[100svh] min-h-[500px] pointer-events-none hero-content" style={{ overflowX: 'hidden' }}>
        <div className="relative h-full flex flex-col justify-end px-6 md:px-10 lg:px-16 pb-20 sm:pb-6 md:pb-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo — the Bogèst bull & knife mark, rendered white over the hero */}
          <div className="mb-6">
            <img
              src="https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png"
              alt="Bogèst"
              draggable={false}
              className="h-28 md:h-40 lg:h-52 w-auto opacity-90 select-none"
              style={{ filter: 'grayscale(1) brightness(2.2)', mixBlendMode: 'screen' }}
            />
          </div>

          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-body font-semibold text-[10px] tracking-[0.4em] uppercase text-white/80">
              {t('hero_eyebrow')}
            </span>
          </div>

          {/* Editorial typographic headline */}
          <div className="mb-8 overflow-hidden">
            {/* Line 1 — large outlined */}
            <motion.div
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-baseline gap-3 md:gap-5 leading-none"
            >
              <span
                className="font-heading font-bold text-[14vw] sm:text-[11vw] md:text-[9vw] lg:text-[8vw] leading-[0.88] tracking-tight"
                style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.85)', color: 'transparent' }}
              >
                {t('hero_line1_outlined')}
              </span>
              <span className="font-heading font-bold text-[14vw] sm:text-[11vw] md:text-[9vw] lg:text-[8vw] leading-[0.88] tracking-tight text-white" style={{ textShadow: '0 2px 26px rgba(0,0,0,0.45)' }}>
                {t('hero_line1_filled')}
              </span>
            </motion.div>

            {/* Line 2 — filled green + italic serif */}
            <motion.div
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-baseline gap-3 md:gap-5 leading-none mt-1"
            >
              <span className="font-heading font-bold italic text-[14vw] sm:text-[11vw] md:text-[9vw] lg:text-[8vw] leading-[0.88] tracking-tight text-primary" style={{ textShadow: '0 2px 22px rgba(0,0,0,0.45)' }}>
                {theme === 'light' ? 'SMAAK' : t('hero_line2')}
              </span>
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-body font-semibold text-[10px] md:text-xs tracking-[0.32em] uppercase text-white/80 max-w-sm mb-8"
          >
            {t('hero_subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <Link
              to="/reserve"
              className="group inline-flex items-center gap-2 px-5 py-2.5 sm:gap-3 sm:px-7 sm:py-3.5 bg-primary text-primary-foreground font-body text-[10px] sm:text-xs tracking-widest uppercase rounded-full hover:bg-primary/90 transition-all duration-500 pointer-events-auto"
            >
              {t('hero_cta_reserve')}
            </Link>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:gap-3 sm:px-7 sm:py-3.5 border border-white/25 text-white font-body text-[10px] sm:text-xs tracking-widest uppercase rounded-full hover:border-white/50 hover:bg-white/5 transition-all duration-500 pointer-events-auto"
            >
              {t('hero_cta_menu')}
            </Link>

          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="flex absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 cursor-pointer pointer-events-auto"
        >
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/30">{t('hero_scroll')}</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <ChevronDown className="w-4 h-4 text-white/30" />
          </motion.div>
        </motion.button>
        </div>
      </section>
    </>
  );
}