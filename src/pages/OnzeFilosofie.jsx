import React from 'react';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import AboutSubNav from '@/components/about/AboutSubNav';
import StoryChapter from '@/components/about/StoryChapter';
import ReserveCtaSection from '@/components/ReserveCtaSection';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import { PILLARS_DATA, LABELS } from '@/components/home/PhilosophySection';

const HERO_FALLBACK = 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg';

export default function OnzeFilosofie() {
  const { lang, t } = useLang();
  const { siteImg } = useSiteImages();
  const pillars = PILLARS_DATA[lang] || PILLARS_DATA.nl;
  const labels = LABELS[lang] || LABELS.nl;
  const total = String(pillars.length).padStart(2, '0');

  return (
    <div className="w-full">
      <PanelHero
        label={t('about_philosophy_label')}
        title="Onze filosofie"
        titleAccent="Bogèst"
        subtitle="De pijlers achter Bogèst — formule, ambacht, wijnen en sfeer, uitgeschreven."
        positionKey="philosophy.hero"
        bgImage={HERO_FALLBACK}
      />

      <PanelContent>
        <AboutSubNav nextTo="/about/instagram" nextLabel="Achter de schermen" />

        {/* Header */}
        <section className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-12 pb-6">
          <div className="max-w-5xl mx-auto">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">{t('about_philosophy_label')}</span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {labels.title.replace(/\.$/, '')}<span className="text-primary">.</span>
            </h2>
          </div>
        </section>

        {/* Pijlers */}
        <section className="w-full pb-10">
          {pillars.map((p, i) => (
            <StoryChapter
              key={p.num}
              num={p.num}
              total={total}
              title={p.title}
              subtitle={p.subtitle}
              body={p.body}
              image={siteImg(`philosophy.${i}`) || p.image}
              index={i}
            />
          ))}
        </section>

        {/* Reserve — zelfde systeem als /menu */}
        <ReserveCtaSection positionKey="philosophy.reserve" />
      </PanelContent>
    </div>
  );
}