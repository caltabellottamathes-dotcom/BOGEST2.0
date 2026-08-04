import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

// Ons verhaal — een horizontale compositie: de tekst links, het beeld rechts
// (breed, kort), met de tekst die op de vervaagde linkerrand van de foto leunt.
// Een compact zwevend glasformulekaartje drijft over de onderkant van de foto.
export default function StorySection() {
  const { t } = useLang();
  const { siteImg } = useSiteImages();
  const title = (t('home_story_title') || '').replace(/\.$/, '');
  const accent = (t('home_story_title_accent') || '').replace(/\.$/, '');
  return (
    <section id="verhaal" className="relative w-full py-12 md:py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(60,55,42,0.14) 0%, transparent 60%)' }} />
      <img src={BULL_MARK} alt="" aria-hidden loading="lazy" decoding="async" draggable={false} className="absolute pointer-events-none select-none hidden md:block" style={{ height: '34rem', width: 'auto', top: '-4rem', left: '-6%', opacity: 0.06, filter: 'grayscale(1) brightness(2.4)' }} />

      <div className="relative w-full px-6 md:px-10 lg:px-16">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center">

          {/* Tekst — links op desktop, eerst op mobiel; leunt op de vervaagde beeldrand */}
          <div className="lg:col-span-6 relative z-10">
            <SectionReveal direction="right">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-10 bg-primary" />
                <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('section_our_story')}</span>
              </div>
              <h2 className="font-heading font-bold text-foreground leading-[0.98] tracking-tight mb-6 text-[clamp(1.9rem,4.4vw,3.2rem)]">
                {title}<br />
                <span className="italic text-primary">{accent}</span><span className="not-italic text-primary">.</span>
              </h2>
              <p className="font-body text-base text-muted-foreground leading-relaxed max-w-xl mb-4">{t('home_story_body1')}</p>
              <p className="font-body text-base text-muted-foreground leading-relaxed max-w-xl mb-4">{t('home_story_body2')}</p>
              <p className="font-body text-base text-muted-foreground leading-relaxed max-w-xl mb-7">{t('home_story_body3')}</p>
              <Link to="/about" className="group inline-flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-primary hover:text-foreground transition-colors duration-300">
                {t('btn_more')}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </SectionReveal>
          </div>

          {/* Beeld — rechts op desktop; linkerrand vervaagt naar achtergrond */}
          <SectionReveal direction="left" className="lg:col-span-7 lg:col-start-6 relative z-0 mt-4 lg:mt-0">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-[4/3] lg:aspect-[16/9]">
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
              {/* linkerrand vervaagt naar achtergrondkleur (desktop) */}
              <div className="absolute inset-0 pointer-events-none hidden lg:block" style={{ background: 'linear-gradient(to left, transparent 58%, hsl(var(--background)) 100%)' }} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(26,24,20,0.55) 0%, rgba(26,24,20,0.05) 50%)' }} />
              {/* chip rechtsboven */}
              <div className="absolute top-4 right-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                  <span className="font-body text-xs text-white">{t('section_our_story')}</span>
                </div>
              </div>
            </div>

            {/* Compact zwevend glasformulekaartje — drijft over de onderkant van de foto */}
            <div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md rounded-2xl p-4 md:p-5"
              style={{
                background: 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(22px) saturate(150%)',
                WebkitBackdropFilter: 'blur(22px) saturate(150%)',
                border: '1px solid rgba(255,255,255,0.20)',
                boxShadow: '0 28px 60px -18px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
            >
              <div className="absolute left-6 right-6 top-0 h-px" style={{ background: 'linear-gradient(to right, transparent, hsl(var(--primary) / 0.65), transparent)' }} />
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold mb-3">{t('home_formula_label')}</p>
              <div className="grid grid-cols-3 gap-3">
                {[t('home_formula_starter'), t('home_formula_main'), t('home_formula_dessert')].map((item, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <span className="w-6 h-6 rounded-full font-body text-[10px] font-bold flex items-center justify-center bg-primary/20 text-primary border border-primary/40">
                      {i + 1}
                    </span>
                    <p className="font-heading text-xs md:text-sm font-semibold text-foreground leading-tight">{item}</p>
                  </div>
                ))}
              </div>
              <p className="font-body text-[11px] text-muted-foreground mt-3 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.14)' }}>{t('home_formula_included')}</p>
            </div>
          </SectionReveal>

        </div>
      </div>
    </section>
  );
}