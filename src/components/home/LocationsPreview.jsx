import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { getLocations } from '@/lib/data';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import HintBubble from '@/components/HintBubble';
import { hostQuestion } from '@/lib/hostHint';
import HomeTitle from '@/components/home/HomeTitle';

// "Altijd een Bogèst dichtbij" — floating image cards that overlap each
// other slightly (rising z-index so each card floats over the previous),
// alternating left/right alignment for an asymmetric editorial rhythm.
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

        <div className="space-y-0">
          {LOCATIONS_DATA.map((loc, i) => {
            const inactive = loc.active === false;
            const alignLeft = i % 2 === 0;
            return (
              <SectionReveal
                key={loc.slug}
                direction="up"
                className={`relative ${i === 0 ? '' : '-mt-10 md:-mt-14'}`}
                style={{ zIndex: 10 + i }}
              >
                <div
                  className={`group relative rounded-3xl overflow-hidden h-[20rem] md:h-[24rem] w-full ${alignLeft ? 'md:mr-[10%]' : 'md:ml-[10%]'}`}
                  style={{ boxShadow: '0 26px 64px rgba(0,0,0,0.45)' }}
                >
                  <img
                    src={siteImg('location.' + loc.slug) || loc.image}
                    alt={loc.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={inactive ? { filter: 'grayscale(1) brightness(0.55) opacity(0.5)' } : { filter: 'saturate(0.88) brightness(0.92)' }}
                    loading="lazy" decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <span className={`absolute top-5 left-6 font-heading font-bold leading-none text-4xl ${inactive ? 'text-white/20' : 'text-white/30'}`}>
                    {loc.number}
                  </span>
                  {inactive && (
                    <span className="absolute top-5 right-6 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" />
                      <span className="font-body text-[9px] tracking-[0.2em] uppercase text-primary">{t('loc_coming_soon')}</span>
                    </span>
                  )}
                  {!inactive && <HintBubble question={hostQuestion(lang, loc.name)} />}

                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex items-end justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="h-px w-8 bg-primary/60" />
                        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">{loc.city}</span>
                      </div>
                      <h3 className="font-heading text-2xl md:text-3xl font-bold text-white">{loc.name}</h3>
                      {inactive ? (
                        <p className="font-body text-sm text-white/70 mt-1">{loc.city}, {loc.region} — {t('loc_coming_soon')}.</p>
                      ) : (
                        <p className="font-body text-sm text-white/75 mt-1 max-w-xs leading-relaxed">{loc.address}</p>
                      )}
                    </div>
                    {!inactive && (
                      <Link to={`/locations/${loc.slug}`} className="group/cta flex-shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/30 text-white hover:bg-primary hover:border-primary transition-all duration-300">
                        <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform duration-300" />
                      </Link>
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