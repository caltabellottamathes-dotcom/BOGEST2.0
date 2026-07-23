import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import PanelHero from '@/components/PanelHero';

export default function About() {
  const { t } = useLang();

  const story = [
    {
      num: '01',
      title: t('about_s1_title'),
      text: t('about_s1_text'),
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/5a329377-ea13-4e4f-88ef-962eb56f13ff/terras+vol+borgloon.jpeg',
    },
    {
      num: '02',
      title: t('about_s2_title'),
      text: t('about_s2_text'),
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906795532-RIXDIIHXCS7LTVKIKUB0/dentrecote-borgloon5.jpg',
    },
    {
      num: '03',
      title: t('about_s3_title'),
      text: t('about_s3_text'),
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg',
    },
    {
      num: '04',
      title: t('about_s4_title'),
      text: t('about_s4_text'),
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg',
    },
  ];

  const pillars = [
    {
      num: '01',
      title: t('about_p1_title'),
      text: t('about_p1_text'),
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799922-SLXI4OSI7W3KWGKE3UFY/5a7c094c-9679-410a-bbc5-5f8c663d8a14.JPG',
    },
    {
      num: '02',
      title: t('about_p2_title'),
      text: t('about_p2_text'),
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799913-Y5ZEKPI4I2XXUTYC8W3T/d2db3621-8f9b-45f1-95c8-498c24ed15c3-1.jpg',
    },
    {
      num: '03',
      title: t('about_p3_title'),
      text: t('about_p3_text'),
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/426ec0ed-f1b6-4eb0-90d5-ad7cea634e7c/7B0C379C-A65C-400B-83D7-C140E27E6ABF_1_201_a.jpeg',
    },
  ];

  return (
    <div className="w-full">
      <PanelHero label={t('nav_about')} title={t('about_title_main')} titleAccent="Bogèst" bgImage="https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/5a329377-ea13-4e4f-88ef-962eb56f13ff/terras+vol+borgloon.jpeg" />

      {/* Opening quote */}
      <section className="w-full py-20 md:py-28 border-b border-border">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <SectionReveal className="max-w-4xl">
            <Quote className="w-8 h-8 text-primary/30 mb-6" />
            <blockquote className="font-heading text-xl md:text-2xl lg:text-3xl italic text-foreground leading-relaxed mb-8">
              {t('about_quote')}
            </blockquote>
            <p className="font-body text-base text-muted-foreground leading-relaxed max-w-2xl">
              {t('about_quote_body')}
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* Our story */}
      <section className="w-full border-b border-border">
        <div className="w-full px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <SectionReveal className="mb-14">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">{t('about_story_label')}</span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{t('about_story_title')}.</h2>
          </SectionReveal>
        </div>

        {story.map((s, i) => (
          <div key={s.num} className="w-full px-6 md:px-10 lg:px-16 pb-20 md:pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <SectionReveal direction={i % 2 === 0 ? 'left' : 'right'} className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    style={{ filter: 'saturate(0.75) brightness(0.92)' }} />
                  <div className="absolute bottom-4 left-4">
                    <span className="font-heading text-6xl font-bold text-white/10 select-none">{s.num}</span>
                  </div>
                </div>
              </SectionReveal>
              <SectionReveal direction={i % 2 === 0 ? 'right' : 'left'} delay={0.15} className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-4 block">{s.num} / 04</span>
                <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-6">{s.title}.</h3>
                <p className="font-body text-base text-muted-foreground leading-relaxed">{s.text}</p>
              </SectionReveal>
            </div>
          </div>
        ))}
      </section>

      {/* What makes us unique */}
      <section className="w-full py-20 md:py-28 border-b border-border">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <SectionReveal className="mb-14">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">{t('about_philosophy_label')}</span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{t('about_philosophy_title')}.</h2>
          </SectionReveal>

          <div className="space-y-20">
            {pillars.map((s, i) => (
              <div key={s.num} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <SectionReveal direction={i % 2 === 1 ? 'right' : 'left'} className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="overflow-hidden rounded-xl aspect-[4/3]">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                </SectionReveal>
                <SectionReveal direction={i % 2 === 1 ? 'left' : 'right'} delay={0.15} className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <span className="font-body text-xs text-primary/60 mb-2 block">{s.num}</span>
                  <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mt-1 mb-6">{s.title}.</h3>
                  <p className="font-body text-base text-muted-foreground leading-relaxed">{s.text}</p>
                </SectionReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations strip */}
      <section className="w-full py-16 md:py-20 border-b border-border">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <SectionReveal className="mb-10">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">{t('about_locations_label')}</span>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t('about_locations_title')}.</h2>
          </SectionReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: 'Hasselt', sub: 'Wimmertingen', img: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg' },
              { city: 'Borgloon', sub: 'Graethempoort', img: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/ba4c98fb-2ded-4472-88d3-e42960e519bc/veranda+borgloon.jpeg' },
              { city: 'Heusden-Zolder', sub: 'Stationsstraat', img: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
              { city: 'Lommel', sub: t('about_coming_soon'), img: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg', soon: true },
            ].map((loc, i) => (
              <SectionReveal key={loc.city} delay={i * 0.08}>
                <div className="relative overflow-hidden rounded-xl aspect-[3/4] group">
                  <img src={loc.img} alt={loc.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ filter: 'saturate(0.65) brightness(0.85)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  {loc.soon && <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary/80 font-body text-[9px] tracking-widest uppercase text-white">{t('about_coming_soon')}</div>}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-heading text-base font-bold text-white">{loc.city}</p>
                    <p className="font-body text-xs text-white/55 mt-0.5">{loc.sub}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="w-full py-20 md:py-28 text-center">
        <div className="px-6 md:px-10 lg:px-16">
          <SectionReveal>
            <p className="font-heading text-lg italic text-foreground mb-2">{t('about_closing_greeting')}</p>
            <p className="font-body text-sm font-medium text-foreground mb-8">{t('about_closing_team')}</p>
            <Link to="/reserve"
              className="group inline-flex items-center gap-2 px-9 py-4 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-full hover:bg-primary/90 transition-all duration-500">
              {t('btn_reserve')}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}