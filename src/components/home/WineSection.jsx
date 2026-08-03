import React from 'react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';

const WINES = {
  nl: [
    { name: 'Malbec', origin: 'Argentinië', note: 'Rijk, fruitig, volle body' },
    { name: 'Primitivo', origin: 'Italië', note: 'Droog, krachtig, diep rood' },
    { name: 'Godina', origin: 'België', note: 'Licht, elegant, verfijnd' },
  ],
  fr: [
    { name: 'Malbec', origin: 'Argentine', note: 'Riche, fruité, corps plein' },
    { name: 'Primitivo', origin: 'Italie', note: 'Sec, puissant, rouge profond' },
    { name: 'Godina', origin: 'Belgique', note: 'Léger, élégant, raffiné' },
  ],
  en: [
    { name: 'Malbec', origin: 'Argentina', note: 'Rich, fruity, full body' },
    { name: 'Primitivo', origin: 'Italy', note: 'Dry, powerful, deep red' },
    { name: 'Godina', origin: 'Belgium', note: 'Light, elegant, refined' },
  ],
};

const COPY = {
  nl: {
    heading: 'Eigen label, uitgelezen keuze.',
    body: 'In samenwerking met onze wijnleveranciers werden wijnen speciaal samengesteld om perfect te matchen met onze vleesgerechten — exclusief onder ons eigen label.',
    alt: 'Wijn',
  },
  fr: {
    heading: 'Label maison, choix d’exception.',
    body: "En collaboration avec nos fournisseurs, des vins ont été spécialement composés pour accompagner parfaitement nos plats de viande — exclusivement sous notre propre label.",
    alt: 'Vin',
  },
  en: {
    heading: 'House label, hand-picked.',
    body: 'In collaboration with our suppliers, wines have been specially composed to pair perfectly with our meat dishes — exclusively under our own label.',
    alt: 'Wine',
  },
};

export default function WineSection() {
  const { t, lang } = useLang();
  const { siteImg } = useSiteImages();
  const wines = WINES[lang] || WINES.nl;
  const c = COPY[lang] || COPY.nl;
  return (
    <section className="w-full py-24 md:py-32">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <SectionReveal direction="left">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-4 block">
              {t('section_wine')}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-7">
              {c.heading}
            </h2>
            <p className="font-body text-base text-muted-foreground leading-relaxed mb-10">
              {c.body}
            </p>
            <div className="space-y-3">
              {wines.map(w => (
                <div key={w.name} className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors duration-300">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-heading text-sm font-bold text-primary">{w.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading text-sm font-semibold text-foreground">{w.name}</h4>
                    <p className="font-body text-xs text-muted-foreground">{w.origin} — {w.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal direction="right" delay={0.15}>
            <div className="overflow-hidden rounded-xl aspect-[4/5]">
              <img
                src={siteImg('wine')}
                alt={c.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                style={{ filter: 'saturate(0.82) brightness(0.95)' }}
              />
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}