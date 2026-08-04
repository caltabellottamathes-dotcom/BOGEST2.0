import React from 'react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import LocationCard from '@/components/LocationCard';
import { getLocations } from '@/lib/data';

export default function Locations() {
  const { t, lang } = useLang();
  const LOCATIONS_DATA = getLocations(lang);

  return (
    <div className="w-full">
      <PanelHero label={t('loc_four_locations')} title={t('loc_title_main')} titleAccent={t('loc_title_accent')} subtitle={t('loc_panel_subtitle')} positionKey="locations.hero" />

      <PanelContent>
        <div className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-12 pb-24">
          {LOCATIONS_DATA.map((loc, i) => (
            <SectionReveal key={loc.slug} id={`loc-card-${loc.slug}`} delay={i * 0.08} className="py-12 md:py-14">
              <LocationCard loc={loc} index={i} />
            </SectionReveal>
          ))}
        </div>
      </PanelContent>
    </div>
  );
}