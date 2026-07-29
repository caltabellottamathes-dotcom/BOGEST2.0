import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { useTheme } from '@/lib/ThemeContext';


const HERO_IMAGE = 'https://media.base44.com/images/public/6a062d5a5c4241c6b2404e25/8696324df_Make_this_photo_look_more_202605150157.jpg';

export default function HeroSection() {
  const [offsetY, setOffsetY] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const { t } = useLang();
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
      setPastHero(window.scrollY > window.innerHeight * 0.3);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Expose pastHero to Layout/DigitalHost via a custom event
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('bogest:hero-scroll', { detail: { pastHero } }));
  }, [pastHero]);

  return (
    <section className="relative w-full h-[100svh] min-h-[500px] overflow-hidden" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* BG with parallax — desaturated */}
      <div
        className="absolute inset-0 w-full h-[115%]"
        style={{ transform: `translateY(${Math.min(offsetY * 0.25, window.innerHeight * 0.15)}px)` }}
      >
        <img
          src={HERO_IMAGE}
          alt="Bogèst"
          className="w-full h-full object-cover"
          fetchpriority="high"
          decoding="async"
          style={{
            filter: theme === 'light' ? 'saturate(0.80) brightness(0.88)' : 'saturate(0.55) brightness(0.85)',
            imageRendering: 'auto',
          }}
        />
      </div>

      {/* Overlays */}
      <div className={`absolute inset-0 ${theme === 'light' ? 'bg-gradient-to-b from-black/45 via-black/25 to-black/60' : 'bg-gradient-to-b from-black/60 via-black/20 to-black/75'}`} />
      <div className={`absolute inset-0 ${theme === 'light' ? 'bg-gradient-to-r from-black/40 via-black/20 to-transparent' : 'bg-gradient-to-r from-black/50 via-black/10 to-transparent'}`} />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end px-6 md:px-10 lg:px-16 pb-28 sm:pb-6 md:pb-10">
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
              className="flex items-baseline gap-3 md:gap-5 leading-none"
            >
              <span
                className="font-heading font-bold text-[14vw] sm:text-[11vw] md:text-[9vw] lg:text-[8vw] leading-[0.88] tracking-tight"
                style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.85)', color: 'transparent' }}
              >
                {t('hero_line1_outlined')}
              </span>
              <span className="font-heading font-bold text-[14vw] sm:text-[11vw] md:text-[9vw] lg:text-[8vw] leading-[0.88] tracking-tight text-white">
                {t('hero_line1_filled')}
              </span>
            </motion.div>

            {/* Line 2 — filled green + italic serif */}
            <motion.div
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-baseline gap-3 md:gap-5 leading-none mt-1"
            >
              <span className="font-heading font-bold italic text-[14vw] sm:text-[11vw] md:text-[9vw] lg:text-[8vw] leading-[0.88] tracking-tight text-primary">
                {theme === 'light' ? 'SMAAK' : t('hero_line2')}
              </span>
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-body font-semibold text-[11px] md:text-[13px] tracking-[0.32em] uppercase text-white/80 max-w-sm mb-8"
          >
            {t('hero_subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              to="/reserve"
              className="group inline-flex items-center gap-3 px-7 py-3.5 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-full hover:bg-primary/90 transition-all duration-500"
            >
              {t('hero_cta_reserve')}
            </Link>
            <Link
              to="/menu"
              className="inline-flex items-center gap-3 px-7 py-3.5 border border-white/25 text-white font-body text-xs tracking-widest uppercase rounded-full hover:border-white/50 hover:bg-white/5 transition-all duration-500"
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
          className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 cursor-pointer"
        >
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/30">{t('hero_scroll')}</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <ChevronDown className="w-4 h-4 text-white/30" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
}