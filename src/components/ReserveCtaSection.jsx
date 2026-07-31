import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';

const FALLBACK_IMG = 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798149-17KHS8RDD2FJIZI179ZQ/EF6D9D08-F3ED-41E2-9392-96AB73DEF2E6.jpeg';

// Layered reservation CTA — an image with a glass card overlapping its edge,
// the same layering/depth as the Ons verhaal formula card. White type, a touch
// of gold only on the medallion and the button hover. No extra serif.
export default function ReserveCtaSection({ positionKey = 'reserve' }) {
  const { t } = useLang();
  const { siteImg } = useSiteImages();
  const bg = siteImg(positionKey) || FALLBACK_IMG;
  return (
    <section className="w-full px-6 md:px-10 lg:px-16 pt-20 pb-28">
      <div className="relative max-w-4xl mx-auto">
        <div className="overflow-hidden rounded-2xl aspect-[16/10] md:aspect-[21/9]">
          <img src={bg} alt="" aria-hidden="true" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10 pointer-events-none" />
        </div>

        {/* overlapping glass card — straddles the bottom-right edge (depth) */}
        <div className="relative mt-6 md:absolute md:-bottom-10 md:right-8 md:mt-0 md:max-w-sm rounded-2xl p-6 md:p-7"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(40px) saturate(160%)', WebkitBackdropFilter: 'blur(40px) saturate(160%)', border: '1px solid rgba(255,255,255,0.16)', boxShadow: '0 24px 60px rgba(0,0,0,0.45)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(231,205,112,0.14)', border: '1px solid rgba(231,205,112,0.35)' }}>
              <CalendarDays className="w-4 h-4 text-primary" />
            </div>
            <span className="font-body text-[10px] tracking-[0.25em] uppercase text-white/70">Bogèst</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-white leading-tight mb-3">{t('res_title')}</h2>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-10 bg-white/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
          </div>
          <p className="font-body text-sm text-white/70 leading-relaxed mb-6">{t('res_subtitle')}</p>
          <Link to="/reserve" className="group inline-flex items-center gap-3">
            <span className="font-body text-xs tracking-[0.3em] uppercase text-white group-hover:text-primary transition-colors duration-300">{t('btn_reserve')}</span>
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/40 text-white group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}