import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';
import HostHint from '@/components/HostHint';

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

// Ons verhaal — één horizontale, gelaagde compositie: tekst links, beeld rechts,
// en een brede glasformule-strook die onderaan over beide heen drijft en zo tekst
// en beeld verbindt. Kort en krachtig, niet hoog.
export default function StorySection() {
  const { t, lang } = useLang();
  const { siteImg } = useSiteImages();
  const title = (t('home_story_title') || '').replace(/\.$/, '');
  const accent = (t('home_story_title_accent') || '').replace(/\.$/, '');
  return (
    <section id="verhaal" className="relative w-full py-12 md:py-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(60,55,42,0.12) 0%, transparent 60%)' }} />
      <img src={BULL_MARK} alt="" aria-hidden loading="lazy" decoding="async" draggable={false} className="absolute pointer-events-none select-none hidden md:block" style={{ height: '20rem', width: 'auto', top: '-3rem', right: '-4%', opacity: 0.05, filter: 'grayscale(1) brightness(2.4)' }} />

      <div className="relative w-full px-6 md:px-10 lg:px-16">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pb-14 lg:pb-16">

          {/* Tekst — links */}
          <div className="lg:col-span-6 relative z-20">
            <SectionReveal direction="right">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-10 bg-primary" />
                <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">{t('section_our_story')}</span>
              </div>
              <h2 className="font-heading font-bold text-foreground leading-[1.02] tracking-tight mb-4 text-[clamp(1.85rem,3.8vw,2.6rem)]">
                {title}<br />
                <span className="italic text-primary">{accent}</span><span className="not-italic text-primary">.</span>
              </h2>
              <p className="font-body text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-lg mb-3">{t('home_story_body1')}</p>
              <p className="font-body text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-lg mb-4">{t('home_story_body2')}</p>
              <Link to="/about" className="group inline-flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-primary hover:text-foreground transition-colors duration-300">
                {t('btn_more')}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </SectionReveal>
          </div>

          {/* Beeld — rechts, met de glasformule-strook die links ervan overheen drijft */}
          <div className="lg:col-span-6 lg:col-start-7 relative z-0">
            <div className="group relative overflow-hidden rounded-2xl shadow-2xl aspect-[16/10]">
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
              {/* rechterrand vervaagt naar achtergrondkleur (desktop) */}
              <div className="absolute inset-0 pointer-events-none hidden lg:block" style={{ background: 'linear-gradient(to right, transparent 70%, hsl(var(--background)) 100%)' }} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(26,24,20,0.55) 0%, transparent 55%)' }} />
              {/* Host hint rechtsboven — opent de digitale gastheer met een vraag over het verhaal */}
              <div className="absolute top-4 right-4 z-20">
                <HostHint question={lang === 'fr' ? "Pouvez-vous m'en dire plus sur le Bogèst-verhaal ?" : lang === 'en' ? "Can you tell me more about the Bogèst story?" : "Kan u me meer vertellen over het Bogèst-verhaal?"} />
              </div>
            </div>

            {/* Glasformule-strook — horizontaal, drijft over de onderkant en steekt
                op desktop links uit zodat tekst en beeld één gelaagde compositie vormen */}
            <div
              className="absolute -bottom-6 left-3 right-3 lg:left-[-10%] lg:right-[16%] rounded-2xl p-4 md:p-5 z-30"
              style={{
                background: 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(22px) saturate(150%)',
                WebkitBackdropFilter: 'blur(22px) saturate(150%)',
                border: '1px solid rgba(255,255,255,0.20)',
                boxShadow: '0 24px 50px -18px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
            >
              <div className="absolute left-6 right-6 top-0 h-px" style={{ background: 'linear-gradient(to right, transparent, hsl(var(--primary) / 0.65), transparent)' }} />
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
                <div className="flex items-center gap-3 md:pr-5 md:border-r md:border-white/15">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-body text-[10px] font-bold">✦</span>
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold whitespace-nowrap">{t('home_formula_label')}</p>
                </div>
                <div className="flex items-center gap-4 md:gap-5 flex-1 flex-wrap">
                  {[t('home_formula_starter'), t('home_formula_main'), t('home_formula_dessert')].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full font-body text-[10px] font-bold flex items-center justify-center bg-primary/20 text-primary border border-primary/40">
                        {i + 1}
                      </span>
                      <p className="font-heading text-sm font-semibold text-foreground leading-tight">{item}</p>
                    </div>
                  ))}
                </div>
                {/* included-tekst verwijderd per verzoek */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}