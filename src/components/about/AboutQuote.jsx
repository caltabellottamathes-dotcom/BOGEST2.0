import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

/**
 * AboutQuote — grote redactionele pull-quote als opener van /about.
 * Storytelling-moment vóór de drie verhaal-kaarten.
 */
export default function AboutQuote() {
  const { t } = useLang();
  return (
    <section className="w-full px-6 md:px-10 lg:px-16 pt-12 md:pt-16 pb-10 md:pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl"
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