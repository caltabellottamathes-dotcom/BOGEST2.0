import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';

const FALLBACK_IMG = 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798149-17KHS8RDD2FJIZI179ZQ/EF6D9D08-F3ED-41E2-9392-96AB73DEF2E6.jpeg';

// Shared, layered reservation CTA for the bottom of panels — built in the same
// language as the entry pop-up: a faint photo with the signature gradient, a
// floating gold medallion overlapping the top edge, corner accents, an
// eyebrow, a hairline-and-dot divider, and a text + circle-arrow button.
export default function ReserveCtaSection({ positionKey = 'reserve' }) {
  const { t } = useLang();
  const { siteImg } = useSiteImages();
  const bg = siteImg(positionKey) || FALLBACK_IMG;
  return (
    <section className="w-full px-6 md:px-10 lg:px-16 pt-20 pb-24">
      <div className="relative max-w-3xl mx-auto rounded-[24px] overflow-hidden border border-border"
        style={{ boxShadow: '0 24px 70px rgba(0,0,0,0.30)' }}>
        <img src={bg} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/75 pointer-events-none" />

        {/* corner accents */}
        <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-primary/40 rounded-tl-lg pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r border-primary/40 rounded-br-lg pointer-events-none" />

        {/* floating medallion — overlaps the top edge */}
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-background border border-primary/40 flex items-center justify-center text-primary shadow-md">
          <CalendarDays style={{ width: 18, height: 18 }} />
        </span>

        <div className="relative z-10 text-center px-6 pt-16 pb-12">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-4 block">Bogèst · {t('section_reserve')}</span>
          <h2 className="font-heading text-2xl md:text-4xl font-bold text-white leading-tight">{t('res_title')}</h2>
          <div className="flex items-center justify-center gap-2 my-5">
            <div className="h-px w-10 bg-primary/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <div className="h-px w-10 bg-primary/60" />
          </div>
          <p className="font-body text-sm text-white/80 leading-relaxed max-w-md mx-auto">{t('res_subtitle')}</p>
          <Link to="/reserve" className="group inline-flex items-center gap-3 mt-8">
            <span className="font-body text-xs tracking-[0.3em] uppercase text-white group-hover:text-primary transition-colors duration-300">{t('btn_reserve')}</span>
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/40 text-primary group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}