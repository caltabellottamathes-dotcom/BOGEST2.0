import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Smile, Star } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

const IMG = {
  stays: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906792564-LXWK1DRHFSE5N4CODE8U/cadeaubon.jpeg',
  paper: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1b9991fd-fc43-405b-acb6-a86317aaf9f1/5757bb8f-abdc-43e6-9219-e4e103f1a2e0.jpeg',
  locations: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg',
};

/**
 * GiftCardsHighlights — interactieve beeld-wisselaar voor de drie
 * cadeaubon-highlights op /gift-cards. Klik een pijler → tekst vouwt open
 * en de beeldkaart wisselt. Geen grote titel (die staat in de PanelHero).
 */
export default function GiftCardsHighlights() {
  const { t } = useLang();
  const [active, setActive] = useState(0);

  const items = [
    { icon: Gift, title: t('gc_h1_title'), body: t('gc_h1_body'), img: IMG.stays },
    { icon: Smile, title: t('gc_h2_title'), body: t('gc_h2_body'), img: IMG.paper },
    { icon: Star, title: t('gc_h3_title'), body: t('gc_h3_body'), img: IMG.locations },
  ];
  const current = items[active];

  return (
    <section className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-12 pb-16 md:pb-20">
      <div className="max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Pijlers + tekst */}
        <div className="md:col-span-7 order-2 md:order-1">
          <div className="flex items-center gap-3 mb-5">
            <Gift className="w-4 h-4 text-primary" />
            <span className="h-px w-8 bg-primary/40" />
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('gc_panel_label')}</span>
          </div>
          <div className="flex flex-col gap-2">
            {items.map((it, i) => {
              const Icon = it.icon;
              const on = i === active;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`group flex items-start gap-4 text-left rounded-2xl border p-4 transition-all duration-300 ${on ? 'border-primary bg-primary/5' : 'border-border bg-card/40 hover:border-primary/40'}`}
                >
                  <span className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-colors duration-300 ${on ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground group-hover:text-primary'}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-heading text-lg font-semibold text-foreground">{it.title}</span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="block"
                        >
                          <span className="block font-body text-sm text-muted-foreground leading-relaxed mt-1.5">{it.body}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Beeldkaart */}
        <div className="md:col-span-5 order-1 md:order-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-2xl shadow-xl aspect-[4/5]"
            >
              <img src={current.img} alt={current.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.05) 55%)' }} />
              <div className="absolute left-5 right-5 bottom-5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
                  <span className="font-body text-xs text-white">{current.title}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}