import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChefHat } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import HomeTitle from '@/components/home/HomeTitle';

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

// Ons verhaal — beeldkaart links met een breder, zwevend glasformulekaartje
// dat over de foto drijft (meer karakter), + inhoud rechts met dezelfde
// typografie als "Onze belofte en filosofie".
export default function StorySection() {
  const { t } = useLang();
  const { siteImg } = useSiteImages();
  return (
    <section id="verhaal" className="relative w-full py-14 md:py-20 overflow-hidden">
      {/* Layered warm gradient + ghosted bull — recurring panel motif */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(60,55,42,0.12) 0%, transparent 60%)' }} />
      <img src={BULL_MARK} alt="" aria-hidden loading="lazy" decoding="async" draggable={false} className="absolute pointer-events-none select-none hidden md:block" style={{ height: '40rem', width: 'auto', top: '-7rem', right: '-6%', opacity: 0.07, filter: 'grayscale(1) brightness(2.4)' }} />

      <div className="relative w-full px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Beeldkaart — rounded card met chip + breder zwevend formulekaartje */}
          <SectionReveal direction="left">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-[4/5]">
                <img
                  src={siteImg('story')}
                  data-bb-key="story"
                  data-bb-label="Ons verhaal — interieur"
                  alt="Bogèst"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.82) brightness(0.95)' }}
                />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(26,24,20,0.62) 0%, rgba(26,24,20,0.05) 55%)' }} />
                <div className="absolute left-5 right-5 top-5 pointer-events-none">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                    <span className="font-body text-xs text-white">{t('section_our_story')}</span>
                  </div>
                </div>
              </div>

              {/* Zwevend glasformulekaartje — breder, drijft over de foto */}
              <div
                className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-[90%] max-w-sm rounded-2xl p-6"
                style={{
                  background: 'rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(22px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(22px) saturate(150%)',
                  border: '1px solid rgba(255,255,255,0.20)',
                  boxShadow: '0 28px 60px -18px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
                }}
              >
                {/* Goud accentlijn bovenaan — een subtiel luxe detail */}
                <div className="absolute left-6 right-6 top-0 h-px" style={{ background: 'linear-gradient(to right, transparent, hsl(var(--primary) / 0.65), transparent)' }} />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(200,163,89,0.16)', border: '1px solid rgba(200,163,89,0.38)' }}>
                    <ChefHat className="w-4 h-4 text-primary" />
                  </div>
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">{t('home_formula_label')}</p>
                </div>
                <div className="space-y-2.5">
                  {[t('home_formula_starter'), t('home_formula_main'), t('home_formula_dessert')].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full font-body text-[10px] font-bold flex items-center justify-center flex-shrink-0 bg-primary/20 text-primary border border-primary/40">
                        {i + 1}
                      </span>
                      <p className="font-heading text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.14)' }}>
                  <p className="font-body text-xs text-muted-foreground">{t('home_formula_included')}</p>
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* Inhoud — zelfde typografie als "Onze belofte en filosofie" */}
          <SectionReveal direction="right" delay={0.15}>
            <div className="flex items-center gap-3 mb-7">
              <span className="h-px w-10 bg-primary" />
              <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('section_our_story')}</span>
            </div>
            <HomeTitle title={t('home_story_title')} accent={t('home_story_title_accent')} breakLine className="mb-7 max-w-[16ch]" />
            <p className="font-body text-base text-muted-foreground leading-relaxed max-w-2xl mb-5">{t('home_story_body1')}</p>
            <p className="font-body text-base text-muted-foreground leading-relaxed max-w-2xl mb-5">{t('home_story_body2')}</p>
            <p className="font-body text-base text-muted-foreground leading-relaxed max-w-2xl mb-7">{t('home_story_body3')}</p>

            <Link to="/about" className="group inline-flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-primary hover:text-foreground transition-colors duration-300">
              {t('btn_more')}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}