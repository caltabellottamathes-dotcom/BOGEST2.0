import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { useSiteImages } from '@/lib/SiteImageContext';

const FALLBACK_IMG = 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906798149-17KHS8RDD2FJIZI179ZQ/EF6D9D08-F3ED-41E2-9392-96AB73DEF2E6.jpeg';

// Compact, wide reservation CTA — aligned with the menu width above, short,
// with the floating glass card overlapping the edge (Ons-verhaal layering).
export default function ReserveCtaSection({ positionKey = 'reserve' }) {
  const { t } = useLang();
  const { siteImg } = useSiteImages();
  const bg = siteImg(positionKey) || FALLBACK_IMG;
  return (
    <section className="w-full px-6 md:px-10 lg:px-16 pt-14 pb-16">
      <div className="relative">
        <div className="overflow-hidden rounded-2xl h-[200px] md:h-[260px]">
          <img src={bg} alt="" aria-hidden="true" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
        </div>

        <div className="relative mx-4 -mt-12 md:absolute md:-bottom-8 md:right-10 lg:right-14 md:mx-0 md:mt-0 md:max-w-sm rounded-2xl p-5 md:p-6"
          style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(24px) saturate(150%)', WebkitBackdropFilter: 'blur(24px) saturate(150%)', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(231,205,112,0.14)', border: '1px solid rgba(231,205,112,0.35)' }}>
              <CalendarDays className="w-4 h-4 text-primary" />
            </div>
            <span className="font-body text-[10px] tracking-[0.25em] uppercase text-white/70">Bogèst</span>
          </div>
          <h2 className="font-heading text-xl md:text-2xl font-bold text-white leading-tight mb-2">{t('res_title')}</h2>
          <p className="font-body text-sm text-white/70 leading-relaxed mb-5">{t('res_subtitle')}</p>
          <Link to="/reserve" className="group inline-flex items-center gap-3">
            <span className="font-body text-xs tracking-[0.3em] uppercase text-white group-hover:text-primary transition-colors duration-300">{t('btn_reserve')}</span>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/40 text-white group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}