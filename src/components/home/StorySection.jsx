import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChefHat } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import HomeTitle from '@/components/home/HomeTitle';

export default function StorySection() {
  const { t } = useLang();
  const { siteImg } = useSiteImages();
  return (
    <section id="verhaal" className="w-full py-14 md:py-20">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <SectionReveal direction="left">
            <div className="relative">
              {/* Reduced height image */}
              <div className="group overflow-hidden rounded-xl aspect-[16/10]">
                <img
                  src={siteImg('story')}
                  alt="Bogèst"
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                  style={{ filter: 'saturate(0.82) brightness(0.95)' }}
                />
              </div>

              {/* Enlarged formula card */}
              <div className="relative mt-6 md:absolute md:-bottom-8 md:right-6 md:mt-0 rounded-2xl p-6 shadow-2xl max-w-[280px]"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(40px) saturate(160%)', WebkitBackdropFilter: 'blur(40px) saturate(160%)', border: '1px solid rgba(255,255,255,0.16)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(231,205,112,0.14)', border: '1px solid rgba(231,205,112,0.35)' }}>
                    <ChefHat className="w-4 h-4 text-primary" />
                  </div>
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">{t('home_formula_label')}</p>
                </div>
                <div className="space-y-2.5">
                  {[t('home_formula_starter'), t('home_formula_main'), t('home_formula_dessert')].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full font-body text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(20,14,0,0.78)', border: '1px solid rgba(231,205,112,0.35)', color: 'rgba(255,235,160,0.92)' }}>
                        {i + 1}
                      </span>
                      <p className="font-heading text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.95)' }}>{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                  <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.70)' }}>{t('home_formula_included')}</p>
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