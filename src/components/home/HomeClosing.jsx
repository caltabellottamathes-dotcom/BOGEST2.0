import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/LangContext';

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

// Dark closing section — the last block on the home page. Gives the footer a
// cinematic dark backdrop to float over (the tail of "Alles binnen handbereik"),
// consistent with the panel "einde" motif.
export default function HomeClosing() {
  const { t } = useLang();
  return (
    <section className="relative w-full overflow-hidden" style={{ background: 'hsl(25 6% 5%)' }}>
      <img
        src={BULL_MARK}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{ height: '30rem', width: 'auto', top: '-3rem', opacity: 0.06, filter: 'grayscale(1) brightness(2.8)' }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center text-center py-24 md:py-36 px-6">
        <motion.span
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="h-px w-10 mb-7" style={{ background: 'rgba(231,205,112,0.5)' }}
        />
        <motion.p
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="font-body text-[10px] tracking-[0.4em] uppercase text-primary/80 mb-5"
        >
          Bogèst
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-3xl md:text-5xl font-bold leading-tight text-white/90"
        >
          {t('hero_tagline')} {t('hero_tagline2')} {t('hero_tagline3')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="font-body text-xs md:text-sm text-white/45 leading-relaxed mt-5 max-w-md"
        >
          {t('intro_tagline')}
        </motion.p>
      </div>
    </section>
  );
}