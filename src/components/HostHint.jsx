import React from 'react';
import { ChevronRight } from 'lucide-react';
import { askHost } from '@/lib/hostHint';

// "Vraag het aan Bogèst" — een rustige uitnodiging in dezelfde tracked,
// all-caps body-type als de sectie-eyebrows.
//
// De inline-variant (menu-rijen) blijft ongewijzigd — wit, geen monogram,
// verschijnt enkel op hover.
// De glas-varianten (note + HintLine) zijn verfijnd: glasmorphism met een
// goud accent en een quiet chevron, geïnspireerd door de chip bij de
// Maandelijkse Suggesties — zonder alle hints identiek te maken.

const FULL = 'Vraag het aan Bogèst';

// Originele mark — enkel nog voor de inline (menu) variant.
function Mark({ label = FULL }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-body text-[10px] tracking-[0.3em] uppercase text-white/90">
      <span className="w-1 h-1 rounded-full bg-white/70 flex-shrink-0" />
      {label}
      <span className="text-white/50">→</span>
    </span>
  );
}

// Verfijnde glas-mark — goud puntje, tracked label, quiet chevron.
function GlassMark({ label = FULL }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap font-body text-[10px] tracking-[0.3em] uppercase text-white/90">
      <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
      {label}
      <ChevronRight className="w-3 h-3 text-white/55 transition-transform duration-300 group-hover/hint:translate-x-0.5" />
    </span>
  );
}

export default function HostHint({ question, label = FULL, className = '', variant = 'note' }) {
  const onClick = (e) => { e.preventDefault(); e.stopPropagation(); askHost(question); };

  if (variant === 'inline') {
    return (
      <button type="button" onClick={onClick}
        className="inline-flex items-center overflow-hidden max-w-0 group-hover:max-w-[260px] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out pointer-events-none group-hover:pointer-events-auto">
        <span className="inline-flex items-center whitespace-nowrap pl-2">
          <Mark label={label} />
        </span>
      </button>
    );
  }

  // note — verschijnt op hover bovenaan een kaart; glasmorphism-chip.
  return (
    <button type="button" onClick={onClick}
      className={`group/hint inline-flex items-center pointer-events-none group-hover:pointer-events-auto opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out ${className}`}>
      <span className="inline-flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/15 transition-colors duration-300 group-hover/hint:border-white/30 group-hover/hint:bg-black/45">
        <GlassMark label={label} />
      </span>
    </button>
  );
}

export function HintLine({ question, label = FULL, className = '' }) {
  return (
    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); askHost(question); }}
      className={`group/hint inline-flex items-center transition-transform duration-300 hover:-translate-y-0.5 ${className}`}>
      <span className="inline-flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/15 transition-colors duration-300 group-hover/hint:border-white/30 group-hover/hint:bg-black/45">
        <GlassMark label={label} />
      </span>
    </button>
  );
}