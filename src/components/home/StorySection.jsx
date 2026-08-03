import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import HomeTitle from '@/components/home/HomeTitle';

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

export default function StorySection() {
  const { t } = useLang();
  const { siteImg } = useSiteImages();
  return (
    <section id="verhaal" className="relative w-full py-14 md:py-20 overflow-hidden">
      {/* Layered warm gradient + ghosted bull — recurring panel motif */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(60,55,42,0.12) 0%, transparent 55%)' }} />
      <img src={BULL_MARK} alt="" aria-hidden loading="lazy" decoding="async" draggable={false} className="absolute pointer-events-none select-none hidden md:block" style={{ height: '40rem', width: 'auto', top: '-7rem', right: '-6%', opacity: 0.07, filter: 'grayscale(1) brightness(2.4)' }} />
      <div className="relative w-full px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <SectionReveal direction="left">
            <div className="relative">
              {/* Reduced height image */}
              <div className="group overflow-hidden rounded-xl aspect-[16/10]">
                <img
                  src={siteImg('story')}
                  data-bb-key="story"
                  data-bb-label="Ons verhaal — interieur"
                  alt="Bogèst"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                  style={{ filter: 'saturate(0.82) brightness(0.95)' }}
                />
              </div>

              {/* Formula card — stripped to the essentials: label + the three courses.
                  No icon, no numbered circles, no "included" footer, no drop shadow. */}
              <div className="relative -mt-12 mx-4 md:mx-0 md:absolute md:-bottom-8 md:right-6 md:mt-0 rounded-2xl p-6 max-w-[280px]"
                style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(24px) saturate(150%)', WebkitBackdropFilter: 'blur(24px) saturate(150%)', border: '1px solid rgba(255,255,255,0.14)' }}>
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold mb-4">{t('home_formula_label')}</p>
                <div className="space-y-2">
                  {[t('home_formula_starter'), t('home_formula_main'), t('home_formula_dessert')].map((item, i) => (
                    <p key={i} className="font-heading text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.95)' }}>{item}</p>
                  ))}
                </div>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal direction="right" delay={0.15}>
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-4 block">
              {t('section_our_story')}
            </span>
            <HomeTitle title={t('home_story_title')} accent={t('home_story_title_accent')} breakLine className="mb-7" />
            <p className="font-body text-base text-muted-foreground leading-relaxed mb-5">
              {t('home_story_body1')}
            </p>
            <p className="font-body text-base text-muted-foreground leading-relaxed mb-5">
              {t('home_story_body2')}
            </p>
            <p className="font-body text-base text-muted-foreground leading-relaxed mb-9">
              {t('home_story_body3')}
            </p>
            <Link to="/about"
              className="group inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-primary hover:text-foreground transition-colors duration-300">
              {t('btn_more')}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}