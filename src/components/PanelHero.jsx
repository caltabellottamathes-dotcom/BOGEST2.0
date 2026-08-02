import React from 'react';
import { motion } from 'framer-motion';
import { useSiteImages } from '@/lib/SiteImageContext';

// Shared panel header — één consistente oplossing voor alle panelen:
//  · Altijd een achtergrond (foto via positionKey, of een zachte warme
//    gradient als fallback) zodat elk paneel identisch begint.
//  · De gekantelde margin-label in een vaste, gecentreerde linker rail —
//    leesbaar (hoger contrast + zachte schaduw), nooit overlappend.
//  · Zachtere gradients (warm, niet zwart-geel) — zacht geel naar grijs.
export default function PanelHero({ label, title, titleAccent, subtitle, children, bgImage, positionKey }) {
  const { siteImg } = useSiteImages();
  const bg = (positionKey ? siteImg(positionKey) : null) || bgImage;
  return (
    <section className="relative w-full pt-24 md:pt-36 pb-24 md:pb-32 px-6 md:px-12 lg:px-16 overflow-hidden">
      {bg ? (
        <div className="absolute inset-0 z-0">
          <img src={bg} data-bb-key={positionKey || undefined} data-bb-label={label} alt="" className="w-full h-full object-cover" loading="lazy" />
          {/* Zachte warme overlay — soft yellow → grey, niet zwart-geel */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,24,20,0.80) 0%, rgba(26,24,20,0.28) 45%, rgba(40,38,33,0.08) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,24,20,0.42) 0%, transparent 55%)' }} />
        </div>
      ) : (
        <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, rgba(60,55,42,0.50) 0%, rgba(44,42,36,0.26) 45%, rgba(30,29,26,0.08) 100%)' }} />
      )}

      {/* Gekantelde margin-label — vaste, gecentreerde linker rail */}
      <div aria-hidden className="hidden md:flex absolute left-4 lg:left-6 inset-y-0 z-10 items-center pointer-events-none">
        <span className="font-body text-[10px] tracking-[0.45em] uppercase text-white/85 select-none" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', textShadow: '0 1px 10px rgba(0,0,0,0.55)' }}>
          {label}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-6xl md:pl-10"
      >
        <span className="md:hidden font-body text-[10px] tracking-[0.35em] uppercase text-white/85 mb-4 block" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>{label}</span>
        <h1 className="font-heading font-bold text-white leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.40)' }}>
          {title}
          {titleAccent && (
            <>
              <br />
              <span className="italic text-primary">{titleAccent}</span>
            </>
          )}
          <span className="not-italic text-white">.</span>
        </h1>
        {subtitle && (
          <p className="font-body text-sm md:text-base text-white/80 mt-6 max-w-xl leading-relaxed" style={{ textShadow: '0 1px 12px rgba(0,0,0,0.40)' }}>
            {subtitle}
          </p>
        )}
        {children}
      </motion.div>
    </section>
  );
}