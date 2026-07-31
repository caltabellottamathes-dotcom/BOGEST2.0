import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Wine, Martini, Sparkles, ArrowDown } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

const PKG_IMG = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/b7bb6162b_generated_image.png';

/**
 * TakeawayGiftPackagesSection — interactieve showcase van de Bogèst-
 * cadeaupakketten op /takeaway. Selecteer een pakket (wijn / gin / op maat)
 * en de detailkaart wisselt. Geen link naar /gift-cards; de bestelling loopt
 * via dezelfde bestelknop hieronder (id="takeaway-order").
 */
export default function TakeawayGiftPackagesSection() {
  const { t } = useLang();
  const [active, setActive] = useState('wine');

  const packages = [
    { id: 'wine', icon: Wine, title: t('ta_gp_wine_t'), desc: t('ta_gp_wine_d') },
    { id: 'gin', icon: Martini, title: t('ta_gp_gin_t'), desc: t('ta_gp_gin_d') },
    { id: 'custom', icon: Sparkles, title: t('ta_gp_custom_t'), desc: t('ta_gp_custom_d') },
  ];
  const current = packages.find((p) => p.id === active) || packages[0];
  const CurrentIcon = current.icon;

  return (
    <section className="w-full px-6 md:px-10 lg:px-16 py-14 md:py-20 border-t border-border/40">
      <div className="max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Beeld */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-5"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-[4/5]">
            <img src={PKG_IMG} alt={t('ta_gp_label')} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.05) 55%)' }} />
            <div className="absolute left-5 right-5 bottom-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="font-body text-xs text-white">{t('ta_gp_pick')}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Inhoud */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-7"
        >
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-4 h-4 text-primary" />
            <span className="h-px w-8 bg-primary/40" />
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('ta_gp_label')}</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight text-foreground">
            {t('ta_gp_title')} <span className="italic text-primary">{t('ta_gp_accent')}</span><span className="text-primary">.</span>
          </h2>
          <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed mt-5 max-w-lg">{t('ta_gift_desc')}</p>

          {/* Pakket-pills */}
          <div className="flex flex-wrap gap-2 mt-7">
            {packages.map((p) => {
              const Icon = p.icon;
              const on = p.id === active;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(p.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-body text-xs tracking-[0.18em] uppercase transition-all duration-300 ${on ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'}`}
                >
                  <Icon className="w-3.5 h-3.5" />{p.title}
                </button>
              );
            })}
          </div>

          {/* Geselecteerd pakket — detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <CurrentIcon className="w-4 h-4 text-primary" />
                <h3 className="font-heading text-lg font-semibold text-foreground">{current.title}</h3>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{current.desc}</p>
            </motion.div>
          </AnimatePresence>

          {/* Notitie + naar bestelknop */}
          <p className="font-body text-xs text-muted-foreground mt-6">{t('ta_gp_note')}</p>
          <a href="#takeaway-order" className="group inline-flex items-center gap-2 mt-3 font-body text-[11px] tracking-[0.3em] uppercase text-primary hover:text-foreground transition-colors duration-300">
            {t('ta_gp_btn')}
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <ArrowDown className="w-4 h-4" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}