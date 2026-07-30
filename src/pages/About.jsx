import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Instagram as InstagramIcon, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import PanelHero from '@/components/PanelHero';

const IMG = 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577';
const LIVING = `${IMG}/1756906798133-O44CER8WRTZ0YVM5E8TK/living.jpeg`;
const VERANDA_BORGLOON = `${IMG}/5baf9326-de7f-4a23-9273-dd46941a1b15/veranda+borgloon.jpeg`;
const ATMOS = `${IMG}/32f05da0-47c0-41c3-8beb-befced66a749/5D626C0A-F4F5-4B45-895D-E1D622FB21E2.jpeg`;
const VERANDA_HASSELT = `${IMG}/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg`;
const ZOLDER = `${IMG}/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg`;
const CHICKEN = `${IMG}/1756906799922-SLXI4OSI7W3KWGKE3UFY/5a7c094c-9679-410a-bbc5-5f8c663d8a14.JPG`;
const BEEF = `${IMG}/1756906799913-Y5ZEKPI4I2XXUTYC8W3T/d2db3621-8f9b-45f1-95c8-498c24ed15c3-1.jpg`;
const FISH = `${IMG}/426ec0ed-f1b6-4eb0-90d5-ad7cea634e7c/7B0C379C-A65C-400B-83D7-C140E27E6ABF_1_201_a.jpeg`;

export default function About() {
  const { t } = useLang();
  const [ig, setIg] = useState({ posts: [], loading: true });

  useEffect(() => {
    base44.functions.invoke('getInstagramPosts', {})
      .then((res) => setIg({ posts: res.data?.posts || [], loading: false }))
      .catch(() => setIg({ posts: [], loading: false }));
  }, []);

  const story = [
    { num: '01', title: t('about_s1_title'), text: t('about_s1_text'), image: VERANDA_BORGLOON },
    { num: '02', title: t('about_s2_title'), text: t('about_s2_text'), image: ATMOS },
    { num: '03', title: t('about_s3_title'), text: t('about_s3_text'), image: VERANDA_HASSELT },
    { num: '04', title: t('about_s4_title'), text: t('about_s4_text'), image: ZOLDER },
  ];

  const pillars = [
    { num: '01', title: t('about_p1_title'), text: t('about_p1_text'), image: CHICKEN },
    { num: '02', title: t('about_p2_title'), text: t('about_p2_text'), image: BEEF },
    { num: '03', title: t('about_p3_title'), text: t('about_p3_text'), image: FISH },
  ];

  const locations = [
    { city: 'Hasselt', sub: 'Wimmertingen', slug: 'hasselt', img: VERANDA_HASSELT },
    { city: 'Borgloon', sub: 'Graethempoort', slug: 'borgloon', img: VERANDA_BORGLOON },
    { city: 'Heusden-Zolder', sub: 'Stationsstraat', slug: 'heusden-zolder', img: ZOLDER },
    { city: 'Lommel', sub: t('about_coming_soon'), slug: null, img: ZOLDER, soon: true },
  ];

  return (
    <div className="w-full">
      <PanelHero label={t('nav_about')} title={t('about_title_main')} titleAccent="Bogèst" bgImage={LIVING} />

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

      {/* Instagram — real posts, opens the full feed as a right-sliding panel */}
      <section className="w-full py-16 md:py-24 border-b border-border">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <SectionReveal className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">Social</span>
              <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Bogèst op Instagram.</h2>
              <p className="font-body text-sm text-muted-foreground mt-3 max-w-md leading-relaxed">
                Sfeerbeelden, gerechten en momenten vanuit onze vestigingen — live vanuit onze account.
              </p>
            </div>
            <Link to="/instagram"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border font-body text-xs tracking-widest uppercase text-foreground hover:border-primary/50 hover:text-primary transition-colors duration-300 w-fit">
              <InstagramIcon className="w-4 h-4" />
              Bekijk alles
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </SectionReveal>

          {!ig.loading && ig.posts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {ig.posts.slice(0, 6).map((post, i) => (
                <motion.a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 6) * 0.07 }}
                  className="group relative overflow-hidden rounded-xl aspect-square"
                >
                  <img src={post.media_url} alt={post.caption?.slice(0, 50) || 'Instagram'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center justify-between">
                      <InstagramIcon className="w-3.5 h-3.5 text-primary" />
                      <ExternalLink className="w-3 h-3 text-white/70" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-card animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Locations strip — each card opens its location panel */}
      <section className="w-full py-16 md:py-20 border-b border-border">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <SectionReveal className="mb-10">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3 block">{t('about_locations_label')}</span>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t('about_locations_title')}.</h2>
          </SectionReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {locations.map((loc, i) => {
              const inner = (
                <div className="relative overflow-hidden rounded-xl aspect-[3/4] group">
                  <img src={loc.img} alt={loc.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ filter: 'saturate(0.65) brightness(0.85)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  {loc.soon && <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary/80 font-body text-[9px] tracking-widest uppercase text-white">{t('about_coming_soon')}</div>}
                  {!loc.soon && <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="w-3 h-3 text-white" /></div>}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-heading text-base font-bold text-white">{loc.city}</p>
                    <p className="font-body text-xs text-white/55 mt-0.5">{loc.sub}</p>
                  </div>
                </div>
              );
              const wrapped = loc.soon ? inner : (
                <Link to={`/locations/${loc.slug}`} className="block">{inner}</Link>
              );
              return (
                <SectionReveal key={loc.city} delay={i * 0.08}>
                  {wrapped}
                </SectionReveal>
              );
            })}
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