import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Phone, MapPin, Sparkles } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import { getLocations } from '@/lib/data';
import PanelHero from '@/components/PanelHero';

export default function Locations() {
  const { t, lang } = useLang();
  const { siteImg } = useSiteImages();
  const LOCATIONS_DATA = getLocations(lang);
  return (
    <div className="w-full">
      <PanelHero label={t('loc_four_locations')} title={t('loc_title_main')} titleAccent={t('loc_title_accent')} positionKey="locations.hero" />

      <div className="w-full px-6 md:px-10 lg:px-16 pt-16 md:pt-20 pb-24">
        {LOCATIONS_DATA.map((loc, i) => {
          const inactive = loc.active === false;
          return (
          <SectionReveal key={loc.slug} delay={i * 0.08}>
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-14 border-b border-border ${inactive ? 'opacity-70' : ''}`}>
              <Link to={`/locations/${loc.slug}`} className="group relative overflow-hidden rounded-xl aspect-[16/10]">
                <img src={siteImg('location.' + loc.slug) || loc.image} alt={loc.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={inactive ? { filter: 'grayscale(1) brightness(0.55)' } : undefined} />
                <span className="absolute top-5 right-5 font-heading text-6xl font-bold text-white/10">{loc.number}</span>
                {inactive && <div className="absolute inset-0 bg-black/40" />}
              </Link>
              <div className="flex flex-col justify-center">
                <Link to={`/locations/${loc.slug}`} className="group inline-flex items-center gap-2 mb-5">
                  <h3 className={`font-heading text-2xl md:text-3xl font-bold transition-colors duration-300 ${inactive ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary'}`}>
                    {loc.name}
                  </h3>
                  {!inactive && <ArrowUpRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300" />}
                </Link>
                {inactive ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 self-start mb-7">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="font-body text-xs tracking-wide text-primary font-medium">{t('loc_coming_soon')}</span>
                  </div>
                ) : (
                <div className="space-y-3 mb-7">
                  <p className="font-body text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />{loc.address}
                  </p>
                  {loc.phone && (
                    <p className="font-body text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />{loc.phone}
                    </p>
                  )}
                  <div className="font-body text-sm text-muted-foreground flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      {loc.hours.slice(0, 3).map(h => (
                        <div key={h.day}>{h.day}: {h.time}</div>
                      ))}
                      {loc.hours.length > 3 && <span className="text-muted-foreground/60 text-xs">{t('loc_more')}</span>}
                    </div>
                  </div>
                </div>
                )}
                {loc.zenchefId && (
                  <div className="flex gap-3">
                    <Link to={`/reserve?loc=${loc.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-full hover:bg-primary/90 transition-all duration-500">
                      {t('btn_reserve')} <ArrowUpRight className="w-3 h-3" />
                    </Link>
                    <Link to={`/locations/${loc.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 border border-border text-foreground font-body text-xs tracking-widest uppercase rounded-full hover:border-primary hover:text-primary transition-all duration-500">
                      {t('btn_more')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SectionReveal>
          );
        })}
      </div>
    </div>
  );
}