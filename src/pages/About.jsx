import React from 'react';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import AboutCardGrid from '@/components/about/AboutCardGrid';
import { useLang } from '@/lib/LangContext';

export default function About() {
  const { t } = useLang();

  return (
    <div className="w-full">
      <PanelHero
        label={t('nav_about')}
        title={t('about_title_main')}
        titleAccent="Bogèst"
        subtitle="De mensen, de sfeer en de filosofie achter Bogèst."
        positionKey="about.hero"
      />

      <PanelContent>
        <section className="w-full px-6 md:px-10 lg:px-16 pt-12 md:pt-16 pb-24 md:pb-32">
          <AboutCardGrid />
        </section>
      </PanelContent>
    </div>
  );
}