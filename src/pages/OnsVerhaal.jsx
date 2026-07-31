import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import PanelHero from '@/components/PanelHero';
import PanelContent from '@/components/PanelContent';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import { bogestImages } from '@/lib/bogestImages';

export default function OnsVerhaal() {
  const { t } = useLang();
  const { siteImg } = useSiteImages();

  const story = [
    { num: '01', title: t('about_s1_title'), text: t('about_s1_text'), image: siteImg('onsverhaal.story.0') },
    { num: '02', title: t('about_s2_title'), text: t('about_s2_text'), image: siteImg('onsverhaal.story.1') },
    { num: '03', title: t('about_s3_title'), text: t('about_s3_text'), image: siteImg('onsverhaal.story.2') },
    { num: '04', title: t('about_s4_title'), text: t('about_s4_text'), image: siteImg('onsverhaal.story.3') },
  ];

  const pillars = [
    { num: '01', title: t('about_p1_title'), text: t('about_p1_text'), image: siteImg('onsverhaal.pillar.0') },
    { num: '02', title: t('about_p2_title'), text: t('about_p2_text'), image: siteImg('onsverhaal.pillar.1') },
    { num: '03', title: t('about_p3_title'), text: t('about_p3_text'), image: siteImg('onsverhaal.pillar.2') },
  ];

  const locations = [
    { city: 'Hasselt', sub: 'Wimmertingen', slug: 'hasselt', img: siteImg('onsverhaal.loc.0') },
    { city: 'Borgloon', sub: 'Graethempoort', slug: 'borgloon', img: siteImg('onsverhaal.loc.1') },
    { city: 'Heusden-Zolder', sub: 'Stationsstraat', slug: 'heusden-zolder', img: siteImg('onsverhaal.loc.2') },
    { city: 'Lommel', sub: t('about_coming_soon'), slug: null, img: siteImg('onsverhaal.loc.3'), soon: true },
  ];

  return (
    <div className="w-full">
      <PanelHero label={t('about_story_label')} title="Ons verhaal" titleAccent="Bogèst" subtitle="Het verhaal achter Bogèst — van Beau Geste tot een gulhartig steakhouse in Limburg." positionKey="onsverhaal.hero" />

      <PanelContent>
      {/* Back to Over ons */}
      <div className="w-full px-6 md:px-10 lg:px-16 pt-6">
        <Link to="/about" className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors duration-300">
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('nav_about')}
        </Link>
      </div>

      {/* Story */}
      <section className="w-full border-b border-border">
        <div className="w-full px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">{t('about_story_label')}</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{t('about_story_title')}.</h2>
        </div>

        {story.map((s, i) => (
          <div key={s.num} className="w-full px-6 md:px-10 lg:px-16 pb-20 md:pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className={`relative ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] border border-border/40 shadow-2xl">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" style={{ filter: 'saturate(0.82) brightness(0.95)' }} />
                </div>
                <span className="absolute -top-6 left-2 font-heading text-8xl font-bold text-primary/12 leading-none select-none pointer-events-none">{s.num}</span>
              </div>
              <div className={`relative ${i % 2 === 1 ? 'lg:order-1 lg:-ml-8' : 'lg:-mr-8'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-10 bg-primary" />
                  <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{s.num} / 04</span>
                </div>
                <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-5">{s.title}<span className="text-primary">.</span></h3>
                <p className="font-body text-base text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Philosophy */}
      <section className="w-full py-20 md:py-28 border-b border-border">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">{t('about_philosophy_label')}</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-14">{t('about_philosophy_title')}.</h2>

          <div className="space-y-20">
            {pillars.map((s, i) => (
              <div key={s.num} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="overflow-hidden rounded-xl aspect-[4/3]">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <span className="font-body text-xs text-primary/60 mb-2 block">{s.num}</span>
                  <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mt-1 mb-6">{s.title}.</h3>
                  <p className="font-body text-base text-muted-foreground leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations strip */}
      <section className="w-full py-16 md:py-20 border-b border-border">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">{t('about_locations_label')}</span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-10">{t('about_locations_title')}.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {locations.map((loc) => {
              const inner = (
                <div className="relative overflow-hidden rounded-xl aspect-[3/4] group">
                  <img src={loc.img} alt={loc.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ filter: 'saturate(0.65) brightness(0.85)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  {loc.soon && <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary/80 font-body text-[9px] tracking-widest uppercase text-white">{t('about_coming_soon')}</div>}
                  {!loc.soon && <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="w-3 h-3 text-white" /></div>}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-heading text-base font-bold text-white">{loc.city}</p>
                    <p className="font-body text-xs text-white/55 mt-0.5">{loc.sub}</p>
                  </div>
                </div>
              );
              return loc.soon ? (
                <div key={loc.city}>{inner}</div>
              ) : (
                <Link key={loc.city} to={`/locations/${loc.slug}`} className="block">{inner}</Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="w-full py-20 md:py-28 text-center">
        <div className="px-6 md:px-10 lg:px-16">
          <p className="font-heading text-lg italic text-foreground mb-2">{t('about_closing_greeting')}</p>
          <p className="font-body text-sm font-medium text-foreground mb-8">{t('about_closing_team')}</p>
          <Link to="/reserve" className="group inline-flex items-center gap-2 px-9 py-4 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-full hover:bg-primary/90 transition-all duration-500">
            {t('btn_reserve')}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
      </PanelContent>
    </div>
  );
}