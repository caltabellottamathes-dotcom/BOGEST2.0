import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

/**
 * AboutQuote — grote redactionele pull-quote als opener van /about.
 * Storytelling-moment vóór de drie verhaal-kaarten.
 */
export default function AboutQuote() {
  const { t } = useLang();
  return (
    <section id="about-quote" className="relative overflow-hidden w-full px-6 md:px-10 lg:px-16 pt-12 md:pt-16 pb-10 md:pb-12">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(60,55,42,0.14) 0%, transparent 60%)' }} />
      <img src={BULL_MARK} alt="" aria-hidden draggable={false} className="absolute pointer-events-none select-none hidden md:block" style={{ height: '24rem', width: 'auto', bottom: '-3rem', right: '-8%', opacity: 0.07, filter: 'grayscale(1) brightness(2.4)' }} />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-4xl"
      >
        <Quote className="w-8 h-8 text-primary/40 mb-4" />
        <blockquote className="font-heading italic text-2xl md:text-4xl leading-snug text-foreground">
          {t('about_quote')}
        </blockquote>
        <div className="flex items-center gap-3 mt-6 mb-4">
          <span className="h-px w-10 bg-primary" />
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('about_title_main')}</span>
        </div>
        <p className="font-body text-base text-muted-foreground leading-relaxed max-w-2xl">{t('about_quote_body')}</p>
      </motion.div>
    </section>
  );
}