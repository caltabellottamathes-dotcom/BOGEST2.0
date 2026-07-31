import React from 'react';
import { motion } from 'framer-motion';
import { useSiteImages } from '@/lib/SiteImageContext';

// Shared panel header — oversized display title that bleeds, a vertical
// tracked margin-label on the left (the signature motif), and the pop-up's
// bottom shadow over the photo. Asymmetric, not a centered block.
export default function PanelHero({ label, title, titleAccent, subtitle, children, bgImage, positionKey }) {
  const { siteImg } = useSiteImages();
  const bg = (positionKey ? siteImg(positionKey) : null) || bgImage;
  return (
    <section className="relative w-full pt-24 md:pt-40 pb-20 md:pb-28 px-6 md:px-12 lg:px-16 border-b border-border/40 overflow-hidden">
      {bg && (
        <div className="absolute inset-0 z-0">
          <img src={bg} alt="" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
        </div>
      )}
      {!bg && <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />}

      {/* vertical margin-label — signature */}
      <span
        aria-hidden
        className="hidden md:block absolute left-4 lg:left-6 top-28 md:top-36 z-10 font-body text-[10px] tracking-[0.45em] uppercase text-white/55 select-none"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        {label}
      </span>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-6xl md:pl-10"
      >
        <span className="md:hidden font-body text-[10px] tracking-[0.35em] uppercase text-white/80 mb-4 block">{label}</span>
        <h1
          className="font-heading font-bold text-white leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl"
          style={{ textShadow: '0 2px 30px rgba(0,0,0,0.55)' }}
        >
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
          <p className="font-body text-sm md:text-base text-white/80 mt-6 max-w-xl leading-relaxed" style={{ textShadow: '0 1px 12px rgba(0,0,0,0.5)' }}>
            {subtitle}
          </p>
        )}
        {children}
      </motion.div>
    </section>
  );
}