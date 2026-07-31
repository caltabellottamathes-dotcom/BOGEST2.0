import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

const CADEAUBON_IMG = 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906792564-LXWK1DRHFSE5N4CODE8U/cadeaubon.jpeg';

/**
 * CadeaubonSection — redactionele info over de cadeaubon op /takeaway,
 * met de echte cadeaubon-foto en een discrete link naar /gift-cards
 * (geen "Bestel nu"-knop — die staat enkel in de CTA-kaart).
 */
export default function CadeaubonSection() {
  const { t } = useLang();

  return (
    <section className="w-full px-6 md:px-10 lg:px-16 py-14 md:py-20 border-t border-border/40">
      <div className="max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-7 order-2 md:order-1"
        >
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-4 h-4 text-primary" />
            <span className="h-px w-8 bg-primary/40" />
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('nav_giftcards')}</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight text-foreground">
            {t('gc_subtitle')}<span className="text-primary">.</span>
          </h2>
          <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed mt-5 max-w-lg">{t('gc_h1_body')}</p>
          <Link to="/gift-cards" className="group inline-flex items-center gap-2 mt-7 font-body text-[11px] tracking-[0.3em] uppercase text-primary hover:text-foreground transition-colors duration-300">
            {t('btn_more')}
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-5 order-1 md:order-2"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-[4/5]">
            <img src={CADEAUBON_IMG} alt={t('nav_giftcards')} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}