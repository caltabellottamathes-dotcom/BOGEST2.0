import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, Check } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { getLocations } from '@/lib/data';
import ReservationPanel from '@/components/reserve/ReservationPanel';
import PanelHero from '@/components/PanelHero';

export default function Reserve() {
  const { t, lang } = useLang();
  const LOCATIONS_DATA = getLocations(lang);
  const [selected, setSelected] = useState(null);

  const selectedLoc = LOCATIONS_DATA.find(l => l.slug === selected);

  // Pre-select location from URL param (e.g. /reserve?loc=hasselt)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const locParam = urlParams.get('loc');
    if (locParam && LOCATIONS_DATA.find(l => l.slug === locParam && l.zenchefId)) {
      setSelected(locParam);
    }
  }, []);

  useEffect(() => {
    if (selected) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [selected]);

  return (
    <div className="w-full">
      <PanelHero label={t('res_label')} title={t('res_title')} titleAccent="uw tafel wacht" subtitle={t('res_subtitle')} positionKey="reserve.hero" />

      {/* Location picker */}
      <section className="w-full px-6 md:px-10 lg:px-16 pt-16 md:pt-20 pb-24">
        <div className="max-w-4xl">
          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {t('res_location')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
              {LOCATIONS_DATA.filter(l => l.zenchefId).map(loc => {
                const isActive = selected === loc.slug;
                return (
                  <button
                    key={loc.slug}
                    onClick={() => setSelected(loc.slug)}
                    className={`relative p-5 rounded-xl border-2 text-left transition-all duration-300 ${
                      isActive
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </span>
                    )}
                    <h4 className="font-heading text-base font-semibold text-foreground">
                      {loc.name}
                    </h4>
                    <p className="font-body text-xs text-muted-foreground mt-1">{loc.city}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!selectedLoc && (
              <motion.div
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-muted-foreground font-body text-sm py-8"
              >
                <ArrowRight className="w-4 h-4 text-primary" />
                {t('res_select_prompt')}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

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