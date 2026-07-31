import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { getLocations } from '@/lib/data';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import HintBubble from '@/components/HintBubble';
import { hostQuestion } from '@/lib/hostHint';
import HomeTitle from '@/components/home/HomeTitle';

function ActiveCard({ loc, featured, lang, siteImg }) {
  return (
    <div className="group relative h-full">
      <Link
        to={`/locations/${loc.slug}`}
        className={`relative block overflow-hidden rounded-2xl border border-border/50 hover:border-primary/40 transition-colors duration-500 ${featured ? 'aspect-[4/3]' : 'aspect-[16/9]'}`}
      >
        <img
          src={siteImg('location.' + loc.slug) || loc.image}
          alt={loc.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ filter: 'saturate(0.85) brightness(0.9)' }}
          loading="lazy" decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-all duration-500 group-hover:from-black/90" />
        <span className={`absolute top-4 left-4 font-heading font-bold text-white/25 ${featured ? 'text-4xl' : 'text-2xl'}`}>
          {loc.number}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <MapPin className="w-3 h-3 text-primary" />
            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary/90">
              {loc.city}
            </span>
          </div>
          <h3 className={`font-heading font-bold text-white flex items-center gap-2 ${featured ? 'text-2xl md:text-3xl' : 'text-base sm:text-lg'}`}>
            {loc.name}
            <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
          </h3>
        </div>
      </Link>
      <HintBubble question={hostQuestion(lang, loc.name)} />
    </div>
  );
}

function ComingSoonCard({ loc, t, siteImg }) {
  return (
    <div className="relative block overflow-hidden rounded-2xl aspect-[16/9] border border-dashed border-border/70 bg-card/30 select-none">
      <img
        src={siteImg('location.' + loc.slug) || loc.image}
        alt={loc.name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'grayscale(1) brightness(0.55) opacity(0.45)' }}
        loading="lazy" decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-background/40" />
      <span className="absolute top-4 left-4 font-heading text-2xl font-bold text-muted-foreground/40">
        {loc.number}
      </span>
      <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30">
        <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" />
        <span className="font-body text-[9px] tracking-[0.2em] uppercase text-primary">{t('loc_coming_soon')}</span>
      </span>
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <MapPin className="w-3 h-3 text-muted-foreground" />
          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{loc.city}</span>
        </div>
        <h3 className="font-heading text-base sm:text-lg font-bold text-muted-foreground">{loc.name}</h3>
      </div>
    </div>
  );
}

// "Altijd een Bogèst dichtbij" — asymmetric collage: one large featured
// location, the rest stacked smaller beside it. Breaks the old 4-column grid.
export default function LocationsPreview() {
  const { t, lang } = useLang();
  const { siteImg } = useSiteImages();
  const LOCATIONS_DATA = getLocations(lang);
  const [featured, ...others] = LOCATIONS_DATA;

  return (
    <section id="vestigingen" className="w-full py-12 md:py-20">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <SectionReveal className="mb-8 md:mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-10 bg-primary" />
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">
              {t('home_locations_count').replace('{n}', LOCATIONS_DATA.length)}
            </span>
          </div>
          <HomeTitle title={t('section_locations')} accent={t('section_locations_accent')} />
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-5">
          <SectionReveal direction="up" className="lg:col-span-7">
            {featured.active === false
              ? <ComingSoonCard loc={featured} t={t} siteImg={siteImg} />
              : <ActiveCard loc={featured} featured lang={lang} siteImg={siteImg} />}
          </SectionReveal>

          <div className="lg:col-span-5 flex flex-col gap-3 md:gap-5">
            {others.map((loc, i) => (
              <SectionReveal key={loc.slug} delay={i * 0.08} direction="up">
                {loc.active === false
                  ? <ComingSoonCard loc={loc} t={t} siteImg={siteImg} />
                  : <ActiveCard loc={loc} lang={lang} siteImg={siteImg} />}
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}