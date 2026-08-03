import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronDown, MapPin, Phone } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import LocationVideo from '@/components/LocationVideo';

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

const COMING_DESC = {
  nl: 'Onze vierde vestiging is in voorbereiding. We houden u graag op de hoogte.',
  fr: "Notre quatrième établissement est en préparation. Nous vous tiendrons informés.",
  en: 'Our fourth location is in preparation. We will keep you posted.',
};

const CLOSED = ['Gesloten', 'Fermé', 'Closed'];

// One location row on the /locations panel — image beside a frosted glass
// card. Active cards spread their contact info + opening hours across the
// full card width (two columns), with a "+ meer" toggle that expands the
// full week of hours downward. Inactive (coming-soon) cards keep the ghosted
// bull mark and a quiet teaser.
export default function LocationCard({ loc, index }) {
  const { t, lang } = useLang();
  const { siteImg } = useSiteImages();
  const [expanded, setExpanded] = useState(false);
  const inactive = loc.active === false;
  const imageLeft = index % 2 === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
      {/* Image */}
      <div className={imageLeft ? '' : 'lg:order-2'}>
        <Link to={`/locations/${loc.slug}`} className="group relative block overflow-hidden rounded-2xl aspect-[16/10] shadow-xl">
          <img src={siteImg('location.' + loc.slug) || loc.image} alt={loc.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={inactive ? { filter: 'grayscale(1) brightness(0.55)' } : { filter: 'saturate(0.88) brightness(0.94)' } } />
          {!inactive && <LocationVideo slug={loc.slug} />}
          <span className="absolute top-5 left-5 font-heading text-7xl font-bold text-white/15 leading-none">{loc.number}</span>
          {inactive && <div className="absolute inset-0 bg-black/40" />}
        </Link>
      </div>

      {/* Glass card */}
      <div className={`relative z-10 ${imageLeft ? 'lg:-ml-12' : 'lg:order-1 lg:-mr-12'}`}>
        {inactive ? (
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/75 backdrop-blur-md p-6 md:p-8 shadow-2xl flex flex-col min-h-[280px] md:min-h-[320px]">
            <img src={BULL_MARK} alt="" aria-hidden draggable={false}
              className="absolute pointer-events-none select-none hidden md:block"
              style={{ height: '150%', width: 'auto', bottom: '-60%', right: '-12%', opacity: 0.08, filter: 'grayscale(1) brightness(2.4)' }} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-heading text-xl font-bold text-primary/40">{loc.number}</span>
                  <span className="h-px w-8 bg-primary/40" />
                  <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">{loc.city}</span>
                </div>
                <span className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground/60 hidden sm:block">Bogèst · {loc.city}</span>
              </div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4">{loc.name}<span className="text-primary">.</span></h3>
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary/30 bg-primary/5 w-fit mb-5">
                <span className="font-body text-xs tracking-wide text-primary font-medium">{t('loc_coming_soon')}</span>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm">{COMING_DESC[lang] || COMING_DESC.nl}</p>
              <div className="mt-auto pt-6">
                <span className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground/60 sm:hidden">Bogèst · {loc.city}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/50 bg-card/75 backdrop-blur-md p-6 md:p-8 shadow-2xl flex flex-col min-h-[280px] md:min-h-[320px]">
            {/* Header row — spread full width */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="font-heading text-xl font-bold text-primary/40">{loc.number}</span>
                <span className="h-px w-8 bg-primary/40" />
                <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">{loc.city}</span>
              </div>
              <span className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground/60 hidden sm:block">Bogèst · {loc.city}</span>
            </div>
            <Link to={`/locations/${loc.slug}`} className="group inline-flex items-center mb-6">
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">{loc.name}<span className="text-primary">.</span></h3>
            </Link>

            {/* Two-column — contact | hours, spread across the card width */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-6 flex-1">
              {/* Contact */}
              <div className="space-y-3">
                <h4 className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> {t('loc_address')}
                </h4>
                <p className="font-body text-sm text-foreground/85 leading-snug max-w-[15rem]">{loc.address}</p>
                {loc.phone && (
                  <p className="font-body text-sm text-foreground/85 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-primary/70" /> {loc.phone}
                  </p>
                )}
              </div>

              {/* Hours — first 3 always, rest expand on "+ meer" */}
              <div>
                <h4 className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-primary" /> {t('loc_hours')}
                </h4>
                <div className="space-y-1.5 font-body text-sm">
                  {loc.hours.slice(0, 3).map((h) => {
                    const closed = CLOSED.includes(h.time);
                    return (
                      <div key={h.day} className="flex justify-between gap-4">
                        <span className="text-muted-foreground">{h.day}</span>
                        <span className={closed ? 'text-muted-foreground' : 'text-foreground/85'}>{h.time}</span>
                      </div>
                    );
                  })}
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        key="extra-hours"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1.5 pt-1.5">
                          {loc.hours.slice(3).map((h) => {
                            const closed = CLOSED.includes(h.time);
                            return (
                              <div key={h.day} className="flex justify-between gap-4">
                                <span className="text-muted-foreground">{h.day}</span>
                                <span className={closed ? 'text-muted-foreground' : 'text-foreground/85'}>{h.time}</span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {loc.hours.length > 3 && (
                  <button
                    onClick={() => setExpanded((v) => !v)}
                    className="mt-3 inline-flex items-center gap-1 font-body text-xs tracking-[0.15em] uppercase text-primary hover:text-foreground transition-colors duration-200"
                  >
                    {expanded ? t('loc_less') : t('loc_more')}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            {/* CTAs */}
            {loc.zenchefId && (
              <div className="mt-auto flex flex-wrap gap-3">
                <Link to={`/reserve?loc=${loc.slug}`} className="inline-flex items-center px-6 py-2.5 bg-primary/15 text-primary border border-primary/40 backdrop-blur-md hover:bg-primary/25 hover:border-primary/60 font-body text-xs tracking-widest uppercase rounded-full transition-all duration-500">
                  {t('btn_reserve')}
                </Link>
                <Link to={`/locations/${loc.slug}`} className="inline-flex items-center gap-2 px-6 py-2.5 border border-border text-foreground font-body text-xs tracking-widest uppercase rounded-full hover:border-primary hover:text-primary transition-all duration-500">
                  {t('btn_more')}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}