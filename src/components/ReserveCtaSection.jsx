import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

// Shared, elegant reservation CTA used at the bottom of panels.
export default function ReserveCtaSection() {
  const { t } = useLang();
  return (
    <section className="w-full px-6 md:px-10 lg:px-16 pt-16 pb-24">
      <div className="border-t border-border pt-12 md:pt-16 text-center max-w-2xl mx-auto">
        <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4 block">{t('section_reserve')}</span>
        <h2 className="font-heading text-2xl md:text-4xl font-bold text-foreground leading-tight">{t('res_title')}</h2>
        <p className="font-body text-sm text-muted-foreground mt-4 leading-relaxed">{t('res_subtitle')}</p>
        <Link to="/reserve" className="group inline-flex items-center gap-3 mt-9 font-body text-xs tracking-[0.3em] uppercase text-foreground hover:text-primary transition-colors duration-300">
          {t('btn_reserve')}
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-border group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}