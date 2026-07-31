import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/LangContext';

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

/**
 * AboutClosing — warme afsluithandtekening onderaan /about.
 * Gelaagd glas met de ghostbull die aan de rand wegbloedt — de "met
 * warme groeten"-boodschap als een editorial handtekeningkaart.
 */
export default function AboutClosing() {
  const { t } = useLang();
  return (
    <section className="w-full px-6 md:px-10 lg:px-16 py-16 md:py-24 border-t border-border/40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        {/* Ghostbull — wegbloedend aan de rechterrand */}
        <img src={BULL_MARK} alt="" aria-hidden draggable={false}
          className="absolute pointer-events-none select-none hidden md:block"
          style={{ height: '190%', width: 'auto', bottom: '-55%', right: '-10%', opacity: 0.10, filter: 'grayscale(1) brightness(2.4)' }} />
        {/* Zachte warme gradient-laag */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(60,55,42,0.20) 0%, transparent 60%)' }} />

        <div className="relative z-10 px-6 md:px-12 py-12 md:py-16 max-w-3xl">
          <span className="h-px w-10 bg-primary/50 block mb-6" />
          <p className="font-heading italic text-2xl md:text-4xl text-foreground leading-tight mb-5">{t('about_closing_greeting')}</p>
          <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">{t('about_closing_team')}</p>
        </div>
      </motion.div>
    </section>
  );
}