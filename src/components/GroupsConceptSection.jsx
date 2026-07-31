import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Star } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import { GROUP_LOCATIONS } from '@/lib/groupsData';

/**
 * GroupsConceptSection — interactieve vestigingswisselaar die per locatie
 * de groepsruimtes met capaciteit toont. Geen genummerde opsomming, maar
 * een beeldvaste wisselaar: featured foto + formule-chip links, geraffineerde
 * ruimterijen met capaciteitsbalk rechts.
 */
export default function GroupsConceptSection() {
  const { t, lang } = useLang();
  const { siteImg } = useSiteImages();
  const locs = GROUP_LOCATIONS[lang] || GROUP_LOCATIONS.nl;
  const [active, setActive] = useState(locs[0].id);
  const loc = locs.find((l) => l.id === active) || locs[0];
  const maxCap = useMemo(() => Math.max(...loc.spaces.map((s) => s.capacity), 1), [loc]);

  return (
    <section className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-12 pb-16">
      {/* Concept intro */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-4 h-4 text-primary" />
          <span className="h-px w-8 bg-primary/40" />
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('grp_concept_label')}</span>
        </div>
        <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[0.95] text-foreground max-w-2xl">
          {t('grp_concept_title')} <span className="italic text-primary">{t('grp_concept_accent')}</span><span className="text-primary">.</span>
        </h2>
        <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mt-5 max-w-xl">{t('grp_concept_lead')}</p>
      </motion.div>

      {/* Vestigingswisselaar */}
      <div className="flex flex-wrap gap-2 mt-9 md:mt-10">
        {locs.map((l) => {
          const on = l.id === active;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setActive(l.id)}
              className={`inline-flex items-baseline gap-2 px-4 py-2 rounded-full border font-body text-xs tracking-[0.18em] uppercase transition-all duration-300 ${on ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'}`}
            >
              <span>{l.city}</span>
              <span className={`text-[10px] tracking-normal ${on ? 'text-primary/60' : 'text-muted-foreground/50'}`}>{l.spaces.length}</span>
            </button>
          );
        })}
      </div>

      {/* Geselecteerde vestiging: foto + ruimtes */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8"
        >
          {/* Featured foto + formule */}
          <div className="md:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl min-h-[300px] md:h-full">
              <img src={siteImg('location.' + loc.id) || loc.image} alt={loc.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)' }} />
              <div className="absolute left-5 right-5 bottom-5">
                <h3 className="font-heading text-2xl font-bold text-white leading-tight mb-2">{loc.name}<span className="text-primary">.</span></h3>
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-white/70 mb-3">{loc.tagline}</p>
                {loc.formula && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
                    <Star className="w-3 h-3 text-primary flex-shrink-0" />
                    <span className="font-body text-xs text-white">{loc.formula}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ruimtes met capaciteit */}
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-primary/40" />
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">{t('loc_spaces')}</span>
            </div>
            <div className="border-t border-border/40">
              {loc.spaces.map((s, i) => {
                const pct = Math.round((s.capacity / maxCap) * 100);
                return (
                  <div key={s.name} className="group/space flex items-center gap-4 py-4 border-b border-border/40 last:border-0">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={siteImg('space.' + loc.id + '.' + i) || s.image} alt={s.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/space:scale-110" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3 mb-1">
                        <h4 className="font-heading text-base font-semibold text-foreground group-hover/space:text-primary transition-colors duration-300">{s.name}</h4>
                        <span className="inline-flex items-center gap-1 font-body text-xs text-primary whitespace-nowrap">
                          <Users className="w-3 h-3" />{t('grp_max')} {s.capacity}
                        </span>
                      </div>
                      <p className="font-body text-xs text-muted-foreground leading-relaxed mb-2">{s.desc}</p>
                      <div className="h-0.5 rounded-full bg-border/60 overflow-hidden">
                        <div className="h-full bg-primary/55 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}