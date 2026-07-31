import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram as InstagramIcon } from 'lucide-react';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import { bogestImages } from '@/lib/bogestImages';

export default function About() {
  const { t } = useLang();
  const { siteImg } = useSiteImages();

  const cards = [
    {
      to: '/about/ons-verhaal',
      num: '01',
      title: 'Ons verhaal',
      desc: 'Ontdek de mensen, de sfeer en de filosofie achter Bogèst.',
      image: siteImg('about.card1'),
      cta: 'Lees verder',
    },
    {
      to: '/about/instagram',
      num: '02',
      title: 'Achter de schermen',
      desc: 'Sfeerbeelden en momenten vanuit onze vestigingen — live op Instagram.',
      image: siteImg('about.card2'),
      cta: 'Bekijk',
    },
  ];

  return (
    <div className="w-full">
      <PanelHero label={t('nav_about')} title={t('about_title_main')} titleAccent="Bogèst" subtitle="De mensen, de sfeer en de filosofie achter Bogèst." positionKey="about.hero" />

      <PanelContent>
        <section className="w-full px-6 md:px-10 lg:px-16 pt-10 md:pt-12 pb-24">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-12 gap-5 md:gap-8">
            {cards.map((c, i) => (
              <Link key={c.to} to={c.to} className={`group block ${i === 0 ? 'md:col-span-5 md:col-start-2' : 'md:col-span-4 md:mt-16'}`}>
                <div className="relative overflow-hidden rounded-2xl border border-border/50 aspect-[3/4] mb-4 shadow-xl">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: 'saturate(0.9) brightness(0.96)' }} />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-px w-6 bg-primary/60" />
                  <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{c.num}</span>
                </div>
                <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-1 leading-tight">{c.title}<span className="text-primary">.</span></h2>
                <p className="font-body text-xs text-muted-foreground leading-relaxed max-w-[16rem] mb-3">{c.desc}</p>
                <span className="inline-flex items-center gap-1.5 font-body text-[10px] tracking-[0.3em] uppercase text-primary transition-all duration-300 group-hover:gap-2.5">
                  {c.to === '/about/instagram' && <InstagramIcon className="w-3 h-3" />}
                  {c.cta}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </PanelContent>
    </div>
  );
}