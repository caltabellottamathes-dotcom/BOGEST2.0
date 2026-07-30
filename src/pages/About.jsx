import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram as InstagramIcon } from 'lucide-react';
import PanelHero from '@/components/PanelHero';
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
      to: '/instagram',
      num: '02',
      title: 'Achter de schermen',
      desc: 'Sfeerbeelden en momenten vanuit onze vestigingen — live op Instagram.',
      image: siteImg('about.card2'),
      cta: 'Bekijk',
    },
  ];

  return (
    <div className="w-full">
      <PanelHero label={t('nav_about')} title={t('about_title_main')} titleAccent="Bogèst" positionKey="about.hero" />

      <section className="w-full px-6 md:px-10 lg:px-16 pt-16 md:pt-20 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {cards.map((c) => (
            <Link key={c.to} to={c.to} className="group relative overflow-hidden rounded-2xl aspect-[4/5] block">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: 'saturate(0.7) brightness(0.85)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <span className="font-body text-[10px] tracking-[0.35em] uppercase text-white/70 mb-2 block">{c.num}</span>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">{c.title}</h2>
                  <p className="font-body text-sm text-white/70 max-w-xs leading-relaxed mb-4">{c.desc}</p>
                  <span className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-white group-hover:text-primary transition-colors duration-300">
                    {c.to === '/instagram' && <InstagramIcon className="w-3.5 h-3.5" />}
                    {c.cta}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </Link>
          ))}
        </div>
      </section>
    </div>
  );
}