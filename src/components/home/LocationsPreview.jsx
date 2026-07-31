import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { getLocations } from '@/lib/data';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import HintBubble from '@/components/HintBubble';
import { hostQuestion } from '@/lib/hostHint';
import HomeTitle from '@/components/home/HomeTitle';

// "Altijd een Bogèst dichtbij" — alternating editorial rows (image 7 / text 5,
// flipping sides), separated by hairlines. No card grid; each location gets
// its own presence with the hairline + numeral + city motif.
export default function LocationsPreview() {
  const { t, lang } = useLang();
  const { siteImg } = useSiteImages();
  const LOCATIONS_DATA = getLocations(lang);

  return (
    <section id="vestigingen" className="w-full py-12 md:py-20">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <SectionReveal className="mb-10 md:mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-10 bg-primary" />
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">
              {t('home_locations_count').replace('{n}', LOCATIONS_DATA.length)}
            </span>
          </div>
          <HomeTitle title={t('section_locations')} accent={t('section_locations_accent')} />
        </SectionReveal>

        <div className="divide-y divide-border/40">
          {LOCATIONS_DATA.map((loc, i) => {
            const inactive = loc.active === false;
            const imageLeft = i % 2 === 0;
            const img = siteImg('location.' + loc.slug) || loc.image;
            return (
              <SectionReveal key={loc.slug} direction="up" className="py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
                  {/* Image */}
                  <div className={`md:col-span-7 ${imageLeft ? '' : 'md:order-2'}`}>
                    <div className="group relative overflow-hidden rounded-2xl aspect-[16/10]">
                      <img
                        src={img}
                        alt={loc.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={inactive ? { filter: 'grayscale(1) brightness(0.55) opacity(0.5)' } : { filter: 'saturate(0.85) brightness(0.9)' }}
                        loading="lazy" decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <span className={`absolute top-4 left-4 font-heading font-bold leading-none ${inactive ? 'text-white/20' : 'text-white/30'}`}>
                        {loc.number}
                      </span>
                      {inactive && (
                        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" />
                          <span className="font-body text-[9px] tracking-[0.2em] uppercase text-primary">{t('loc_coming_soon')}</span>
                        </span>
                      )}
                      {!inactive && <HintBubble question={hostQuestion(lang, loc.name)} />}
                    </div>
                  </div>

                  {/* Text */}
                  <div className={`md:col-span-5 ${imageLeft ? '' : 'md:order-1'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-heading text-xl font-bold text-primary/40">{loc.number}</span>
                      <span className="h-px w-8 bg-primary/40" />
                      <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">{loc.city}</span>
                    </div>
                    <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">{loc.name}</h3>
                    {inactive ? (
                      <p className="font-body text-sm text-muted-foreground max-w-xs leading-relaxed">
                        {loc.city}, {loc.region} — {t('loc_coming_soon')}.
                      </p>
                    ) : (
                      <>
                        <p className="font-body text-sm text-muted-foreground mb-5 max-w-xs leading-relaxed">{loc.address}</p>
                        <Link to={`/locations/${loc.slug}`} className="group/cta inline-flex items-center gap-3 font-body text-xs tracking-[0.3em] uppercase text-primary">
                          {t('btn_more')}
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-primary/40 text-primary group-hover/cta:bg-primary group-hover/cta:text-primary-foreground transition-all duration-300">
                            <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-0.5 transition-transform" />
                          </span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}