import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { getLocations } from '@/lib/data';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import { askHost, hostQuestion } from '@/lib/hostHint';
import HomeTitle from '@/components/home/HomeTitle';
import LocationVideo from '@/components/LocationVideo';

// Vestigingen — beeldkaarten in de stijl van de maandselectie: een brede foto
// met daarop een witte stadstitel, een ghosted cijfer en de "Vraag het aan
// Bogèst"-hint die bij hover uitklapt.
export default function LocationsPreview() {
  const { t, lang } = useLang();
  const { siteImg } = useSiteImages();
  const LOCATIONS_DATA = getLocations(lang).filter((l) => l.active !== false);
  const tag = lang === 'fr' ? 'Établissement' : lang === 'en' ? 'Location' : 'Vestiging';
  const cta = t('btn_more');

  const HintTag = ({ name }) => (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); askHost(hostQuestion(lang, name)); }}
      className="absolute top-4 left-4 md:top-5 md:left-5 z-30 flex flex-col items-start px-3 py-1 bg-black/35 backdrop-blur-md rounded-2xl border border-white/15 overflow-hidden transition-all duration-500 group-hover:bg-black/55"
    >
      <span className="font-body text-[10px] tracking-[0.2em] uppercase text-white whitespace-nowrap">{tag}</span>
      <span className="block max-h-0 opacity-0 group-hover:max-h-12 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
        <span className="block font-body text-[9px] tracking-[0.25em] uppercase text-white/80 whitespace-nowrap pt-1">Vraag het aan Bogèst ↘</span>
      </span>
    </button>
  );

  const renderInner = (loc, inactive) => {
    const img = siteImg('location.' + loc.slug) || loc.image;
    return (
      <>
        <img src={img} data-bb-key={`location.${loc.slug}`} data-bb-label={`Bogèst ${loc.city}`} alt={loc.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={inactive ? { filter: 'grayscale(1) brightness(0.55) opacity(0.5)' } : { filter: 'saturate(0.85) brightness(0.9)' }}
          loading="lazy" decoding="async" />
        {!inactive && <LocationVideo slug={loc.slug} />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        {/* ghosted numeral top-right */}
        {!inactive && (
          <span className="absolute top-5 right-5 font-heading font-bold leading-none text-6xl md:text-8xl text-white/[0.12] select-none">{loc.number}</span>
        )}
        {/* hint tag top-left — maandselectie-stijl */}
        <HintTag name={loc.name} />
        {/* coming-soon badge */}
        {inactive && (
          <span className="absolute top-5 right-5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 z-30">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" />
            <span className="font-body text-[9px] tracking-[0.2em] uppercase text-primary">{t('loc_coming_soon')}</span>
          </span>
        )}
        {/* title + address bottom-left, CTA bottom-right */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 flex items-end justify-between gap-4 z-20">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="h-px w-6 bg-primary/80" />
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">Bogèst</span>
            </div>
            <h3 className="font-heading text-3xl md:text-5xl font-bold text-white leading-[0.95]">{loc.city}<span className="text-primary">.</span></h3>
            {!inactive && <p className="font-body text-sm text-white/70 leading-tight mt-2 max-w-xs">{loc.address}</p>}
            {inactive && <p className="font-body text-sm text-white/60 leading-tight mt-2">{t('loc_coming_soon')}</p>}
          </div>
          {!inactive && (
            <span className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 font-body text-[11px] tracking-[0.25em] uppercase text-white whitespace-nowrap">
              {cta}
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </>
    );
  };

  return (
    <section id="vestigingen" className="w-full py-6 md:py-12">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <SectionReveal className="mb-6 md:mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-10 bg-primary" />
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">
              {t('home_locations_count').replace('{n}', LOCATIONS_DATA.length)}
            </span>
          </div>
          <HomeTitle title={t('section_locations')} accent={t('section_locations_accent')} />
        </SectionReveal>
      </div>

      <div className="w-full px-6 md:px-10 lg:px-16 space-y-5 md:space-y-6">
        {LOCATIONS_DATA.map((loc, i) => {
          const inactive = loc.active === false;
          return (
            <SectionReveal key={loc.slug} direction="up" delay={i * 0.05}>
              {inactive ? (
                <div className="group relative block overflow-hidden rounded-2xl w-full aspect-[4/3] md:aspect-[16/9] shadow-2xl">
                  {renderInner(loc, inactive)}
                </div>
              ) : (
                <Link to={`/locations/${loc.slug}`} className="group relative block overflow-hidden rounded-2xl w-full aspect-[4/3] md:aspect-[16/9] shadow-2xl">
                  {renderInner(loc, inactive)}
                </Link>
              )}
            </SectionReveal>
          );
        })}
      </div>
    </section>
  );
}