import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/LangContext';

/**
 * AboutClosing — warme afsluithandtekening onderaan /about.
 */
export default function AboutClosing() {
  const { t } = useLang();
  return (
    <section className="w-full px-6 md:px-10 lg:px-16 py-12 md:py-16 border-t border-border/40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl"
      >
        <p className="font-heading italic text-xl md:text-2xl text-foreground mb-2">{t('about_closing_greeting')}</p>
        <p className="font-body text-sm md:text-base text-muted-foreground">{t('about_closing_team')}</p>
      </motion.div>
    </section>
  );
}