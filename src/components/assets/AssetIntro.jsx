import React from 'react';
import { Images, SlidersHorizontal, ArrowRight, Sparkles, Layers, Shield } from 'lucide-react';

const CATEGORIES = [
  { key: 'interiors', label: 'Interieur' },
  { key: 'gastronomy', label: 'Gastronomie' },
  { key: 'atmosphere', label: 'Sfeer' },
  { key: 'architecture', label: 'Architectuur' },
  { key: 'branding', label: 'Branding' },
];

export default function AssetIntro({ onView, onAdmin, count }) {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 lg:px-12 flex items-center">
      <div className="max-w-3xl mx-auto w-full">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 text-primary mb-5">
          <Images className="w-4 h-4" />
          <span className="font-body text-[10px] tracking-[0.3em] uppercase">Bogèst · Beeldbank</span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground leading-[1.05] mb-6">
          Het universele<br />beeldarchief
        </h1>

        {/* Explanation */}
        <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-4">
          Een zelfstandig groeiend archief van alle Bogèst-beelden — interieur, gastronomie,
          sfeer, architectuur en branding. Beelden worden automatisch verzameld op het openbaar
          web, voorzien van een perceptuele hash om dubbelingen te herkennen, en door AI
          ingedeeld per categorie en locatie.
        </p>
        <p className="font-body text-sm text-muted-foreground/80 leading-relaxed max-w-2xl mb-10">
          U bepaalt wat relevant blijft: pas beschrijvingen aan, wijs beelden toe aan collecties
          voor gebruik op de website, of verwijder wat niet past. Alles wat hier staat, is klaar
          om elders op de site ingezet te worden.
        </p>

        {/* Category legend */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((c) => (
            <span
              key={c.key}
              className="px-3.5 py-1.5 rounded-full border border-border text-xs font-body text-foreground/60 bg-card/30"
            >
              {c.label}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onView}
            className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-body text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Bekijk het archief
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            {typeof count === 'number' && count > 0 && (
              <span className="opacity-70 ml-1 text-xs">{count}</span>
            )}
          </button>
          <button
            onClick={onAdmin}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card/50 hover:bg-muted transition-colors font-body text-sm text-foreground"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            Beheer &amp; vul aan
          </button>
        </div>

        {/* Quiet footer note */}
        <div className="flex items-center gap-5 mt-12 text-muted-foreground/50">
          <span className="inline-flex items-center gap-1.5 font-body text-xs">
            <Sparkles className="w-3.5 h-3.5" /> AI-categorisering
          </span>
          <span className="inline-flex items-center gap-1.5 font-body text-xs">
            <Layers className="w-3.5 h-3.5" /> Dubbelingendetectie
          </span>
          <span className="inline-flex items-center gap-1.5 font-body text-xs">
            <Shield className="w-3.5 h-3.5" /> Alleen voor beheerders
          </span>
        </div>
      </div>
    </div>
  );
}