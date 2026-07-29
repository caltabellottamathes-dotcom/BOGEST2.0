import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { getLocations } from '@/lib/data';
import { useLang } from '@/lib/LangContext';

export default function LocationsPreview() {
  const { t, lang } = useLang();
  const LOCATIONS_DATA = getLocations(lang);
  return (
    <section id="vestigingen" className="w-full py-12 md:py-20">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <SectionReveal className="mb-8 md:mb-14">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">
            {t('home_locations_count').replace('{n}', LOCATIONS_DATA.length)}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {t('section_locations')}.
          </h2>
        </SectionReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {LOCATIONS_DATA.map((loc, i) => {
            const inactive = loc.active === false;
            return (
              <SectionReveal key={loc.slug} delay={i * 0.1}>
                {inactive ? (
                  <div className="relative block overflow-hidden rounded-2xl aspect-[3/4] sm:aspect-[4/5] border border-dashed border-border/70 bg-card/30 select-none">
                    <img
                      src={loc.image}
                      alt={loc.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ filter: 'grayscale(1) brightness(0.55) opacity(0.45)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-background/40" />
                    <span className="absolute top-4 left-4 font-heading text-2xl font-bold text-muted-foreground/40">
                      {loc.number}
                    </span>
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" />
                      <span className="font-body text-[9px] tracking-[0.2em] uppercase text-primary">
                        {t('loc_coming_soon')}
                      </span>
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                          {loc.city}
                        </span>
                      </div>
                      <h3 className="font-heading text-base sm:text-lg font-bold text-muted-foreground">
                        {loc.name}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={`/locations/${loc.slug}`}
                    className="group relative block overflow-hidden rounded-2xl aspect-[3/4] sm:aspect-[4/5] border border-border/50 hover:border-primary/40 transition-colors duration-500"
                  >
                    <img
                      src={loc.image}
                      alt={loc.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ filter: 'saturate(0.85) brightness(0.9)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-all duration-500 group-hover:from-black/90" />
                    <span className="absolute top-4 left-4 font-heading text-2xl font-bold text-white/25">
                      {loc.number}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary/90">
                          {loc.city}
                        </span>
                      </div>
                      <h3 className="font-heading text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        {loc.name}
                        <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                      </h3>
                    </div>
                  </Link>
                )}
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}