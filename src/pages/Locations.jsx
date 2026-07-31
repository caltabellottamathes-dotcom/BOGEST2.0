import React from 'react';
import { Link } from 'react-router-dom';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import { getLocations } from '@/lib/data';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

export default function Locations() {
  const { t, lang } = useLang();
  const { siteImg } = useSiteImages();
  const LOCATIONS_DATA = getLocations(lang);

  return (
    <div className="w-full">
      <PanelHero label={t('loc_four_locations')} title={t('loc_title_main')} titleAccent={t('loc_title_accent')} subtitle="Vier vestigingen in Limburg — elk met zijn eigen karakter." positionKey="locations.hero" />

      <PanelContent>
        <div className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-12 pb-24">
          {LOCATIONS_DATA.map((loc, i) => {
            const inactive = loc.active === false;
            const imageLeft = i % 2 === 0;
            return (
              <SectionReveal key={loc.slug} delay={i * 0.08} className="py-12 md:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
                  {/* Image */}
                  <div className={imageLeft ? '' : 'lg:order-2'}>
                    <Link to={`/locations/${loc.slug}`} className="group relative block overflow-hidden rounded-2xl aspect-[16/10] shadow-xl">
                      <img src={siteImg('location.' + loc.slug) || loc.image} alt={loc.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={inactive ? { filter: 'grayscale(1) brightness(0.55)' } : { filter: 'saturate(0.88) brightness(0.94)' } } />
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
                          <div className="flex items-center gap-3 mb-4">
                            <span className="font-heading text-xl font-bold text-primary/40">{loc.number}</span>
                            <span className="h-px w-8 bg-primary/40" />
                            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">{loc.city}</span>
                          </div>
                          <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4">{loc.name}<span className="text-primary">.</span></h3>
                          <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary/30 bg-primary/5 w-fit mb-5">
                            <span className="font-body text-xs tracking-wide text-primary font-medium">{t('loc_coming_soon')}</span>
                          </div>
                          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm">{lang === 'fr' ? "Notre quatrième établissement est en préparation. Nous vous tiendrons informés." : lang === 'en' ? 'Our fourth location is in preparation. We will keep you posted.' : 'Onze vierde vestiging is in voorbereiding. We houden u graag op de hoogte.'}</p>
                          <div className="mt-auto pt-6">
                            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground/60">Bogèst · {loc.city}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-border/50 bg-card/75 backdrop-blur-md p-6 md:p-8 shadow-2xl flex flex-col min-h-[280px] md:min-h-[320px]">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="font-heading text-xl font-bold text-primary/40">{loc.number}</span>
                          <span className="h-px w-8 bg-primary/40" />
                          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">{loc.city}</span>
                        </div>
                        <Link to={`/locations/${loc.slug}`} className="group inline-flex items-center mb-5">
                          <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">{loc.name}<span className="text-primary">.</span></h3>
                        </Link>
                        <div className="space-y-3 mb-6">
                          <p className="font-body text-sm text-foreground/85 leading-snug">{loc.address}</p>
                          {loc.phone && (
                            <p className="font-body text-sm text-foreground/85">{loc.phone}</p>
                          )}
                          <div className="pt-3 mt-1 border-t border-border/50 space-y-1.5 font-body text-sm">
                            {loc.hours.slice(0, 3).map((h) => (
                              <div key={h.day} className="flex justify-between gap-4 max-w-[16rem]">
                                <span className="text-muted-foreground">{h.day}</span>
                                <span className={h.time === 'Gesloten' || h.time === 'Fermé' || h.time === 'Closed' ? 'text-muted-foreground' : 'text-foreground/85'}>{h.time}</span>
                              </div>
                            ))}
                            {loc.hours.length > 3 && <span className="text-muted-foreground/60 text-xs">{t('loc_more')}</span>}
                          </div>
                        </div>
                        {loc.zenchefId && (
                          <div className="mt-auto flex flex-wrap gap-3">
                            <Link to={`/reserve?loc=${loc.slug}`} className="inline-flex items-center px-6 py-2.5 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-full hover:bg-primary/90 transition-all duration-500">
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
              </SectionReveal>
            );
          })}
        </div>
      </PanelContent>
    </div>
  );
}