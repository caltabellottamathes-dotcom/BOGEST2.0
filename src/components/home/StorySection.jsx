import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useLang } from '@/lib/LangContext';
import HomeTitle from '@/components/home/HomeTitle';

const BULL_MARK = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/76a540e68_Bogest_Logo_Goud.png';

// Ons verhaal — a text-only editorial frame. No photograph: just the story,
// a large ghosted bull mark behind it, and a single CTA. The bull is the only
// image, used as a quiet brand watermark rather than content.
export default function StorySection() {
  const { t } = useLang();
  return (
    <section id="verhaal" className="relative w-full py-20 md:py-32 overflow-hidden">
      {/* Warm layered gradient — recurring panel motif */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(60,55,42,0.12) 0%, transparent 55%)' }} />

      {/* The bull — large ghosted centrepiece watermark, the only image */}
      <img
        src={BULL_MARK}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ height: '34rem', width: 'auto', opacity: 0.06, filter: 'grayscale(1) brightness(2.4)' }}
      />

      <div className="relative w-full px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <SectionReveal direction="up">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-5 block">
              {t('section_our_story')}
            </span>
            <HomeTitle
              title={t('home_story_title')}
              accent={t('home_story_title_accent')}
              breakLine
              className="mb-8 text-center"
            />
            <div className="space-y-5 max-w-2xl mx-auto">
              <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
                {t('home_story_body1')}
              </p>
              <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
                {t('home_story_body2')}
              </p>
              <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
                {t('home_story_body3')}
              </p>
            </div>
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 mt-10 font-body text-xs tracking-widest uppercase text-primary hover:text-foreground transition-colors duration-300"
            >
              {t('btn_more')}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}