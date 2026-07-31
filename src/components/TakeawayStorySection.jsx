import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin, Clock, Info, ChefHat, ChevronDown } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

/**
 * TakeawayStorySection — rijk, interactief accordeon-verhaal over de
 * Bogèst-traiteur. Geen kaarten-grid, maar een genummerde, uitklapbare
 * lijst met voldoende uitleg. Het eerste item staat standaard open.
 */
export default function TakeawayStorySection() {
  const { t } = useLang();
  const [open, setOpen] = useState(0);

  const items = [
    { icon: ShoppingBag, title: t('ta_h1_title'), body: t('ta_h1_body') },
    { icon: MapPin, title: t('ta_h2_title'), body: t('ta_h2_body') },
    { icon: Clock, title: t('ta_h3_title'), body: t('ta_h3_body') },
    { icon: Info, title: t('ta_home_p2_title'), body: t('ta_home_p2') },
    { icon: ChefHat, title: t('ta_home_p3_title'), body: t('ta_home_p3') },
  ];

  return (
    <section className="w-full px-6 md:px-10 lg:px-16 pt-12 md:pt-16 pb-10">
      <div className="max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-5">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="h-px w-8 bg-primary/40" />
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('ta_panel_label')}</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[0.95] text-foreground max-w-2xl">
            {t('ta_home_tagline')}<span className="text-primary">.</span>
          </h2>
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mt-5 max-w-xl">{t('ta_home_p1')}</p>
        </motion.div>

        {/* Interactieve accordeon */}
        <div className="mt-10 md:mt-12 border-t border-border/40">
          {items.map((it, i) => {
            const Icon = it.icon;
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-border/40">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full grid grid-cols-12 gap-3 md:gap-6 items-center py-5 md:py-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="col-span-2 md:col-span-1 font-heading font-bold text-primary/25 text-3xl md:text-4xl leading-none">{String(i + 1).padStart(2, '0')}</span>
                  <span className="col-span-7 md:col-span-10 flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-heading text-base md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 truncate">{it.title}</span>
                  </span>
                  <span className="col-span-3 md:col-span-1 flex justify-end">
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border group-hover:border-primary/50 transition-colors">
                      <ChevronDown className="w-4 h-4 text-primary" />
                    </motion.span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-12 gap-3 md:gap-6 pb-6 md:pb-8">
                        <span className="col-span-2 md:col-span-1" />
                        <p className="col-span-10 md:col-span-10 font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">{it.body}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}