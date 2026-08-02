import React from 'react';
import { Images, SlidersHorizontal, ArrowRight, Sparkles, Layers, Shield } from 'lucide-react';
import { ASSET_VIEWS } from '@/lib/assetViews';

export default function AssetIntro({ onView, onAdmin, count }) {
  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24 px-6 md:px-10 lg:px-16 flex items-center">
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-2.5 text-primary mb-8">
          <Images className="w-4 h-4" />
          <span className="font-body text-[10px] tracking-[0.3em] uppercase">Bogèst · Beeldbank</span>
        </div>

        <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.02] mb-8 tracking-tight">
          Het universeel<br />beeldarchief<span className="text-primary">.</span>
        </h1>

        <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-5">
          Een zelfstandig groeiend archief van alle Bogèst-beelden — verzameld op de eigen website,
          Tripadvisor, Facebook en Instagram, ontdubbeld via een perceptuele hash en door AI ingedeeld
          per categorie en locatie.
        </p>
        <p className="font-body text-sm text-muted-foreground/80 leading-relaxed max-w-2xl mb-12">
          U bepaalt wat relevant blijft: pas beschrijvingen aan, wijs beelden toe aan collecties voor
          gebruik op de website, of verwijder wat niet past.
        </p>

        <div className="flex flex-wrap gap-2.5 mb-12">
          {ASSET_VIEWS.filter((v) => v.key !== 'all').map((v) => (
            <span key={v.key} className="px-4 py-1.5 rounded-full border border-border text-xs font-body text-foreground/55 bg-card/20">
              {v.label}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onView}
            className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-primary text-primary-foreground font-body text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Bekijk het archief
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            {typeof count === 'number' && count > 0 && <span className="opacity-70 ml-1 text-xs">{count}</span>}
          </button>
          <button
            onClick={onAdmin}
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-border bg-card/40 hover:bg-muted transition-colors font-body text-sm text-foreground"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            Beheer &amp; vul aan
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 mt-16 text-muted-foreground/50">
          <span className="inline-flex items-center gap-2 font-body text-xs"><Sparkles className="w-3.5 h-3.5" /> AI-categorisering</span>
          <span className="inline-flex items-center gap-2 font-body text-xs"><Layers className="w-3.5 h-3.5" /> Dubbelingendetectie</span>
          <span className="inline-flex items-center gap-2 font-body text-xs"><Shield className="w-3.5 h-3.5" /> Alleen voor beheerders</span>
        </div>
      </div>
    </div>
  );
}