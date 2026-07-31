import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PanelSwitcher — hét referentiepatroon voor interactieve info-secties:
 * een beeldkaart aan één kant + selecteerbare pijlers met een wisselende
 * detailkaart. `mirror` plaatst het beeld rechts (inhoud links).
 * Gebruikt door TakeawayStorySection (gespiegeld), TakeawayGiftPackagesSection
 * en GiftCardsHighlights (gespiegeld) voor één consistente visuele taal.
 */
export default function PanelSwitcher({
  items,
  label,
  icon: SectionIcon,
  title,
  titleAccent,
  lead,
  mirror = false,
  footer,
  chipLabel,
  divider = false,
}) {
  const [active, setActive] = useState(0);
  const current = items[active];
  const CurrentIcon = current.icon;

  return (
    <section className={`w-full px-6 md:px-10 lg:px-16 py-14 md:py-16 ${divider ? 'border-t border-border/40' : ''}`}>
      <div className="max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Beeldkaart */}
        <div className={`md:col-span-5 order-1 ${mirror ? 'md:order-2' : ''}`}>
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
                  <span className="font-body text-xs text-white">{chipLabel || current.title}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Inhoud */}
        <div className={`md:col-span-7 order-2 ${mirror ? 'md:order-1' : ''}`}>
          {label && (
            <div className="flex items-center gap-3 mb-4">
              {SectionIcon && <SectionIcon className="w-4 h-4 text-primary" />}
              <span className="h-px w-8 bg-primary/40" />
              <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{label}</span>
            </div>
          )}
          {title && (
            <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight text-foreground">
              {title}{titleAccent && <span className="italic text-primary"> {titleAccent}</span>}<span className="text-primary">.</span>
            </h2>
          )}
          {lead && <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed mt-5 max-w-lg">{lead}</p>}

          {/* Pijlers */}
          <div className="flex flex-wrap gap-2 mt-7">
            {items.map((it, i) => {
              const Icon = it.icon;
              const on = i === active;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-body text-xs tracking-[0.18em] uppercase transition-all duration-300 ${on ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'}`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}{it.title}
                </button>
              );
            })}
          </div>

          {/* Detailkaart — wisselt mee */}
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
                {CurrentIcon && <CurrentIcon className="w-4 h-4 text-primary" />}
                <h3 className="font-heading text-lg font-semibold text-foreground">{current.title}</h3>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{current.body}</p>
            </motion.div>
          </AnimatePresence>

          {footer}
        </div>
      </div>
    </section>
  );
}