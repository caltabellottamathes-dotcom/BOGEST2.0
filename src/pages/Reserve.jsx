import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { getLocations } from '@/lib/data';
import ReservationPanel from '@/components/reserve/ReservationPanel';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

export default function Reserve() {
  const { t, lang } = useLang();
  const LOCATIONS_DATA = getLocations(lang);
  const [selected, setSelected] = useState(null);

  const selectedLoc = LOCATIONS_DATA.find(l => l.slug === selected);
  const bookable = LOCATIONS_DATA.filter(l => l.zenchefId);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const locParam = urlParams.get('loc');
    if (locParam && LOCATIONS_DATA.find(l => l.slug === locParam && l.zenchefId)) {
      setSelected(locParam);
    }
  }, []);

  useEffect(() => {
    if (selected) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [selected]);

  return (
    <div className="w-full">
      <PanelHero label={t('res_label')} title={t('res_title')} titleAccent="uw tafel wacht" subtitle={t('res_subtitle')} positionKey="reserve.hero" />

      <PanelContent>
      <section className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-12 pb-24">
        {/* Gelaagd glas — warme gradient + ghostbull */}
        <div className="relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(60,55,42,0.20) 0%, rgba(44,42,36,0.06) 55%, transparent 100%)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05), transparent 55%)' }} />
          <img src={BULL_MARK} alt="" aria-hidden draggable={false} className="absolute pointer-events-none select-none hidden md:block" style={{ height: '30rem', width: 'auto', bottom: '-5rem', right: '-8%', opacity: 0.09, filter: 'grayscale(1) brightness(2.4)' }} />

          <div className="relative z-10 p-5 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-primary" />
              <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('res_location')}</span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold leading-[0.95] text-foreground mb-3">{t('res_title')}<span className="text-primary">.</span></h2>
            <p className="font-body text-sm text-muted-foreground mb-10 max-w-xl">{t('res_subtitle')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {bookable.map((loc) => {
                const isActive = selected === loc.slug;
                return (
                  <button
                    key={loc.slug}
                    onClick={() => setSelected(loc.slug)}
                    className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl text-left ${isActive ? 'border-primary ring-1 ring-primary/30' : 'border-border hover:border-primary/40'}`}
                  >
                    <div className="relative h-32 md:h-36 overflow-hidden">
                      <img src={loc.image} alt={loc.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,24,20,0.78) 0%, rgba(26,24,20,0.1) 60%)' }} />
                      <span className="absolute left-4 top-3 font-heading font-bold text-white/35 text-2xl leading-none select-none">{loc.number}</span>
                      <h4 className="absolute left-4 right-4 bottom-3 font-heading text-base md:text-lg font-bold text-white">{loc.name}<span className="text-primary">.</span></h4>
                      {isActive && (
                        <span className="absolute right-3 top-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-primary-foreground" />
                        </span>
                      )}
                    </div>
                    <div className="p-4 bg-white/[0.04] backdrop-blur-md">
                      <p className="font-body text-xs text-muted-foreground">{loc.city}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {!selectedLoc && (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-body text-sm text-muted-foreground py-8"
                >
                  {t('res_select_prompt')}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      </PanelContent>

      {/* Slide-out reservation panel */}
      <ReservationPanel
        isOpen={!!selectedLoc}
        onClose={() => setSelected(null)}
        zenchefId={selectedLoc?.zenchefId}
        locationName={selectedLoc?.name}
      />
    </div>
  );
}