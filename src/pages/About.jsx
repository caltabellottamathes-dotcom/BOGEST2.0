import React from 'react';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import AboutQuote from '@/components/about/AboutQuote';
import AboutCardGrid from '@/components/about/AboutCardGrid';
import AboutClosing from '@/components/about/AboutClosing';
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
        <AboutQuote />
        <section className="w-full px-6 md:px-10 lg:px-16 pb-16 md:pb-24">
          <AboutCardGrid />
        </section>
        <AboutClosing />
      </PanelContent>
    </div>
  );
}