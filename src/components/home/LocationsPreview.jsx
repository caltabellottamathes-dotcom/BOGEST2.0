import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { getLocations } from '@/lib/data';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import { askHost, hostQuestion, hostHintLabel } from '@/lib/hostHint';
import HomeTitle from '@/components/home/HomeTitle';
import LocationVideo from '@/components/LocationVideo';

// Vestigingen — een redactionele index, geen platte foto-grid. Elke rij krijgt
// een grote ghosted cijfer + hairline + glas-caption op de foto, zodat de
// locatie leest als een genummerd hoofdstuk, niet als een stapel beelden.
export default function LocationsPreview() {
  const { t, lang } = useLang();
  const { siteImg } = useSiteImages();
  const LOCATIONS_DATA = getLocations(lang).filter((l) => l.active !== false);

  return (
    <section id="vestigingen" className="w-full py-6 md:py-12">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <SectionReveal className="mb-6 md:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-10 bg-primary" />
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">
              {t('home_locations_count').replace('{n}', LOCATIONS_DATA.length)}
            </span>
          </div>
          <HomeTitle title={t('section_locations')} accent={t('section_locations_accent')} />
        </SectionReveal>

        <div className="space-y-2 md:space-y-0">
          {LOCATIONS_DATA.map((loc, i) => {
            const inactive = loc.active === false;
            const imageLeft = i % 2 === 0;
            const img = siteImg('location.' + loc.slug) || loc.image;
            return (
              <SectionReveal
                key={loc.slug}
                direction="up"
                className={`relative md:py-3 ${i === 0 ? '' : 'md:-mt-24'}`}
                style={{ zIndex: 10 + i }}
              >
                {/* ── Mobile: full-bleed image card ── */}
                {inactive ? (
                  <div className="md:hidden group relative block overflow-hidden rounded-2xl aspect-[4/3] shadow-2xl">
                    <img src={img} data-bb-key={`location.${loc.slug}`} data-bb-label={`Bogèst ${loc.city}`} alt={loc.name} className="absolute inset-0 w-full h-full object-cover"
                      style={{ filter: 'grayscale(1) brightness(0.55) opacity(0.5)' }}
                      loading="lazy" decoding="async" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 45%, transparent 72%)' }} />
                    <span className="absolute top-4 left-4 font-heading font-bold leading-none text-5xl text-white/20">{loc.number}</span>
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" />
                      <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary">{t('loc_coming_soon')}</span>
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="rounded-xl px-4 py-3"
                        style={{ background: 'rgba(12,11,9,0.42)', backdropFilter: 'blur(16px) saturate(140%)', WebkitBackdropFilter: 'blur(16px) saturate(140%)', border: '1px solid rgba(255,255,255,0.14)' }}>
                        <div className="flex items-center gap-2.5 mb-1">
                          <span className="h-px w-6 bg-primary/80" />
                          <span className="font-body text-[9px] tracking-[0.3em] uppercase text-primary">Bogèst</span>
                        </div>
                        <h3 className="font-heading text-2xl font-bold text-white leading-tight">{loc.city}<span className="text-primary">.</span></h3>
                        <p className="font-body text-xs text-white/65 leading-tight mt-1">{t('loc_coming_soon')}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link to={`/locations/${loc.slug}`} className="md:hidden group relative block overflow-hidden rounded-2xl aspect-[4/3] shadow-2xl">
                    <img src={img} data-bb-key={`location.${loc.slug}`} data-bb-label={`Bogèst ${loc.city}`} alt={loc.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ filter: 'saturate(0.88) brightness(0.92)' }}
                      loading="lazy" decoding="async" />
                    <LocationVideo slug={loc.slug} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 45%, transparent 72%)' }} />
                    <span className="absolute top-4 left-4 font-heading font-bold leading-none text-5xl text-white/20">{loc.number}</span>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="rounded-xl px-4 py-3"
                        style={{ background: 'rgba(12,11,9,0.42)', backdropFilter: 'blur(16px) saturate(140%)', WebkitBackdropFilter: 'blur(16px) saturate(140%)', border: '1px solid rgba(255,255,255,0.14)' }}>
                        <div className="flex items-center gap-2.5 mb-1">
                          <span className="h-px w-6 bg-primary/80" />
                          <span className="font-body text-[9px] tracking-[0.3em] uppercase text-primary">Bogèst</span>
                        </div>
                        <h3 className="font-heading text-2xl font-bold text-white leading-tight">{loc.city}<span className="text-primary">.</span></h3>
                        <p className="font-body text-xs text-white/70 leading-tight mt-1">{loc.address}</p>
                      </div>
                    </div>
                  </Link>
                )}

                {/* ── Desktop: alternating editorial row ── */}
                <div className="hidden md:grid md:grid-cols-12 gap-6 md:gap-10 items-center relative">
                  {/* Image */}
                  <div className={`md:col-span-7 ${imageLeft ? '' : 'md:order-2'}`}>
                    <div className="group relative overflow-hidden rounded-2xl aspect-[16/9] shadow-2xl">
                      <img src={img} data-bb-key={`location.${loc.slug}`} data-bb-label={`Bogèst ${loc.city}`} alt={loc.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={inactive ? { filter: 'grayscale(1) brightness(0.55) opacity(0.5)' } : { filter: 'saturate(0.85) brightness(0.9)' }}
                        loading="lazy" decoding="async" />
                      {!inactive && <LocationVideo slug={loc.slug} />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <span className={`absolute top-5 left-5 font-heading font-bold leading-none text-7xl ${inactive ? 'text-white/15' : 'text-white/20'}`}>{loc.number}</span>
                      {inactive && (
                        <span className="absolute top-5 right-5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" />
                          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary">{t('loc_coming_soon')}</span>
                        </span>
                      )}
                      {/* glass caption bottom-left — white, expands downward into the "Vraag het aan Bogèst" hint on hover (active locations) */}
                      {inactive ? (
                        <div className="absolute left-5 bottom-5">
                          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                            style={{ background: 'rgba(12,11,9,0.42)', backdropFilter: 'blur(16px) saturate(140%)', WebkitBackdropFilter: 'blur(16px) saturate(140%)', border: '1px solid rgba(255,255,255,0.16)' }}>
                            <span className="h-px w-6 bg-white/70" />
                            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white">Bogèst · {loc.city}</span>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); askHost(hostQuestion(lang, loc.name)); }}
                          className="absolute left-5 bottom-5 flex flex-col items-start px-3 py-1 bg-black/35 backdrop-blur-md rounded-2xl border border-white/15 overflow-hidden transition-all duration-500 group-hover:bg-black/55"
                        >
                          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-white whitespace-nowrap">Bogèst · {loc.city}</span>
                          <span className="block max-h-0 opacity-0 group-hover:max-h-12 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                            <span className="block font-body text-[10px] tracking-[0.25em] uppercase text-white/80 whitespace-nowrap pt-1 inline-flex items-center gap-1">{hostHintLabel(lang)} <ArrowRight className="w-3 h-3" /></span>
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Text — ghosted numeral + hairline + city */}
                  <div className={`relative md:col-span-5 ${imageLeft ? '' : 'md:order-1'}`}>
                    <div className="relative z-10">
                      <div className="flex items-baseline gap-3 mb-3">
                        <span className="font-heading text-5xl font-bold text-primary/25 leading-none">{loc.number}</span>
                        <span className="h-px w-10 bg-primary/40" />
                        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">Bogèst</span>
                      </div>
                      <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2">{loc.city}<span className="text-primary">.</span></h3>
                      {inactive ? (
                        <p className="font-body text-sm text-muted-foreground max-w-xs leading-relaxed">{loc.city}, {loc.region} — {t('loc_coming_soon')}.</p>
                      ) : (
                        <>
                          <p className="font-body text-sm text-muted-foreground mb-4 max-w-xs leading-relaxed">{loc.address}</p>
                          <Link to={`/locations/${loc.slug}`} className="group/cta inline-flex items-center gap-2 font-body text-xs tracking-[0.3em] uppercase text-primary">
                            {t('btn_more')}
                            <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </>
                      )}
                    </div>
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