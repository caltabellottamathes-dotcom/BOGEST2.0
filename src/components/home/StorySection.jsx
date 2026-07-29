import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChefHat } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';

export default function StorySection() {
  const { t } = useLang();
  return (
    <section id="verhaal" className="w-full py-14 md:py-20">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <SectionReveal direction="left">
            <div className="relative">
              {/* Reduced height image */}
              <div className="group overflow-hidden rounded-xl aspect-[16/10]">
                <img
                  src="https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906799922-SLXI4OSI7W3KWGKE3UFY/5a7c094c-9679-410a-bbc5-5f8c663d8a14.JPG"
                  alt="Bogèst"
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                  style={{ filter: 'saturate(0.82) brightness(0.95)' }}
                />
              </div>

              {/* Enlarged formula card */}
              <div className="relative mt-6 md:absolute md:-bottom-8 md:right-6 md:mt-0 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-2xl max-w-[280px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <ChefHat className="w-4 h-4 text-primary" />
                  </div>
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">{t('home_formula_label')}</p>
                </div>
                <div className="space-y-2.5">
                  {[t('home_formula_starter'), t('home_formula_main'), t('home_formula_dessert')].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-body text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="font-heading text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="font-body text-xs text-muted-foreground">{t('home_formula_included')}</p>
                </div>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal direction="right" delay={0.15}>
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-4 block">
              {t('section_our_story')}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-7">
              {t('home_story_title')}.
            </h2>
            <p className="font-body text-base text-muted-foreground leading-relaxed mb-5">
              {t('home_story_body1')}
            </p>
            <p className="font-body text-base text-muted-foreground leading-relaxed mb-9">
              {t('home_story_body2')}
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