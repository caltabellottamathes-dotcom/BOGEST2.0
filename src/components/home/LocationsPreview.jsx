import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { getLocations } from '@/lib/data';
import { useLang } from '@/lib/LangContext';

export default function LocationsPreview() {
  const { t, lang } = useLang();
  const LOCATIONS_DATA = getLocations(lang);
  return (
    <section className="w-full py-10 md:py-20">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <SectionReveal className="mb-8 md:mb-14">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">
            {t('home_locations_count').replace('{n}', LOCATIONS_DATA.length)}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {t('section_locations')}.
          </h2>
        </SectionReveal>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {LOCATIONS_DATA.map((loc, i) => (
            <SectionReveal key={loc.slug} delay={i * 0.1}>
              <Link to={`/locations/${loc.slug}`}
                className="group block relative overflow-hidden rounded-xl aspect-[4/3] sm:aspect-[3/4]">
                <img src={loc.image} alt={loc.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    style={{ filter: 'saturate(0.82) brightness(0.88)' }} />
                  {/* Bull logo watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-all duration-700 pointer-events-none">
                    <div className="text-white font-heading text-[140px] font-bold select-none" style={{ textShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>🐂</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent group-hover:from-black/85 transition-all duration-700" />
                <span className="absolute top-3 right-3 sm:top-4 sm:right-4 font-heading text-3xl sm:text-5xl font-bold text-white/10">{loc.number}</span>
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                  <h3 className="font-heading text-sm sm:text-base font-semibold text-white flex items-center gap-1.5">
                    {loc.name}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </h3>
                  <p className="font-body text-xs text-white/55 mt-1">{loc.city}</p>
                </div>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}