import React from 'react';
import { motion } from 'framer-motion';

export default function PanelHero({ label, title, titleAccent, subtitle, children, bgImage }) {
  return (
    <section className="relative w-full pt-20 md:pt-36 pb-16 md:pb-24 px-6 md:px-10 lg:px-16 border-b border-border/40 overflow-hidden">
      {/* Background photo */}
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-background/80 pointer-events-none" />
        </div>
      )}
      {!bgImage && <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10"
      >
        <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-3 block">{label}</span>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.6)' }}>
          {title}
          {titleAccent && (
            <>
              <br />
              <span className="italic text-primary">{titleAccent}</span>
            </>
          )}
          <span className="not-italic text-white">.</span>
        </h1>
        {subtitle && <p className="font-body text-sm md:text-base text-white/80 mt-4 max-w-xl leading-relaxed" style={{ textShadow: '0 1px 12px rgba(0,0,0,0.5)' }}>{subtitle}</p>}
        {children}
      </motion.div>
    </section>
  );
}