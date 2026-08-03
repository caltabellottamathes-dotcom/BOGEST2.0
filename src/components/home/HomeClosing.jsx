import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/LangContext';

// Dark closing section — the last block on the home page. One single reveal
// for the whole group (was four staggered animations); the content is calm and
// still by default, consistent with the panel "einde" motif.
export default function HomeClosing() {
  const { t } = useLang();
  return (
    <section className="relative w-full overflow-hidden" style={{ background: 'hsl(25 6% 5%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center justify-center text-center py-16 md:py-24 px-6"
      >
        <span className="h-px w-10 mb-6" style={{ background: 'rgba(200,163,89,0.5)' }} />
        <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary/80 mb-4">Bogèst</span>
        <h2 className="font-heading text-2xl md:text-4xl font-bold leading-tight text-white/90">
          {t('hero_tagline')} {t('hero_tagline2')} {t('hero_tagline3')}
        </h2>
        <p className="font-body text-xs md:text-sm text-white/45 leading-relaxed mt-4 max-w-md">
          {t('intro_tagline')}
        </p>
      </motion.div>
    </section>
  );
}