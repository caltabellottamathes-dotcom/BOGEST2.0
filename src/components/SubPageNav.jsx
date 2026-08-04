import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

/**
 * Consistente subpagina-navigatie — gebruikt door /about én /locations.
 * Linkerpijl → backTo (terug naar het overzicht). Rechterpijl → nextTo
 * (volgende subpagina, of terug naar het overzicht voor de laatste).
 */
export default function SubPageNav({ backTo = '/about', backLabel, nextTo, nextLabel }) {
  const { t } = useLang();
  const back = backLabel || t('nav_about');
  return (
    <div className="w-full px-6 md:px-10 lg:px-16 pt-6 pb-2">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link
          to={backTo}
          className="group inline-flex items-center gap-2.5 font-body text-xs tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
        >
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/10">
            <ArrowLeft className="w-3.5 h-3.5" />
          </span>
          {back}
        </Link>
        {nextTo && nextLabel && (
          <Link
            to={nextTo}
            className="group inline-flex items-center gap-2.5 font-body text-xs tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            {nextLabel}
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/10">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}