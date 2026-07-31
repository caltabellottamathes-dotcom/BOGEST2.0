import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';

const FALLBACK_IMG = 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798149-17KHS8RDD2FJIZI179ZQ/EF6D9D08-F3ED-41E2-9392-96AB73DEF2E6.jpeg';
const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

/**
 * TwoOfferingsSection — visuele tegenstelling van de twee aanbiedingen op
 * /takeaway: Traiteur & Take Away (foto) en Cadeaupakketten (gebrandmerkt
 * glazen kaart). Geen opsommende lijst, geen knoppen — alleen de enkele
 * "Bestel nu"-knop in de CTA-kaart hieronder geldt voor beide.
 */
export default function TwoOfferingsSection() {
  const { t } = useLang();
  const { siteImg } = useSiteImages();
  const traiteurImg = siteImg('takeaway.traiteur') || FALLBACK_IMG;

  return (
    <section className="w-full px-6 md:px-10 lg:px-16 pt-12 md:pt-16 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {/* 01 — Traiteur & Take Away */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl h-[300px] md:h-[440px] shadow-xl"
        >
          <img src={traiteurImg} alt="Traiteur & Take Away" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.20) 55%, transparent 100%)' }} />
          <span className="absolute top-5 left-5 font-heading text-6xl md:text-7xl font-bold text-white/15 leading-none">01</span>
          <div className="absolute left-6 right-6 bottom-6 text-white">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-2 block">{t('ta_panel_label')}</span>
            <h3 className="font-heading text-2xl md:text-3xl font-bold leading-tight">{t('ta_h1_title')}<span className="text-primary">.</span></h3>
            <p className="font-body text-sm text-white/75 leading-relaxed mt-2 max-w-xs">{t('ta_home_tagline')}</p>
          </div>
        </motion.div>

        {/* 02 — Cadeaupakketten (gebrandmerkt, asymmetrisch naar beneden) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl h-[300px] md:h-[440px] md:mt-10 shadow-xl"
          style={{ background: 'linear-gradient(150deg, hsl(var(--primary) / 0.18) 0%, hsl(var(--card)) 100%)', border: '1px solid hsl(var(--border) / 0.6)' }}
        >
          <img src={BULL_MARK} alt="" aria-hidden draggable={false} className="absolute pointer-events-none select-none" style={{ height: '120%', width: 'auto', right: '-12%', top: '-10%', opacity: 0.10, filter: 'grayscale(1) brightness(2.4)' }} />
          <span className="absolute top-5 left-5 font-heading text-6xl md:text-7xl font-bold text-primary/15 leading-none">02</span>
          <div className="absolute left-6 right-6 bottom-6">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-2 block">{t('ta_gift_title')}</span>
            <h3 className="font-heading text-2xl md:text-3xl font-bold leading-tight text-foreground">
              {t('gp_panel_title')} <span className="italic text-primary">{t('gp_panel_accent')}</span><span className="text-primary">.</span>
            </h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mt-2 max-w-xs">{t('gp_panel_subtitle')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}