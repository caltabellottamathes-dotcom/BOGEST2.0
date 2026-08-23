import React from 'react';
import { motion } from 'framer-motion';

// Vaste kop voor het admin-dashboard — groter, met achtergrondfoto + warme
// overlay, net als de PanelHero op de website. De kop staat buiten het
// scrollgebied zodat alleen de inhoud eronder schuift.
export default function AdminPanelHero({ label, title, image, action }) {
  return (
    <header className="relative shrink-0 h-44 md:h-56 overflow-hidden rounded-none lg:rounded-tl-3xl">
      <div className="absolute inset-0 z-0">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, rgba(60,55,42,0.50), rgba(30,29,26,0.10))' }} />
        )}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(26,24,20,0.88) 0%, rgba(26,24,20,0.40) 55%, rgba(26,24,20,0.12) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(26,24,20,0.45) 0%, transparent 60%)' }} />
      </div>

      {action && <div className="absolute top-4 left-4 z-20">{action}</div>}

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 h-full flex flex-col justify-end px-6 lg:px-10 pb-5"
      >
        <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-1.5 block">Beheer · {label}</span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight" style={{ textShadow: '0 2px 22px rgba(0,0,0,0.55)' }}>
          {title}<span className="text-primary">.</span>
        </h1>
      </motion.div>
    </header>
  );
}