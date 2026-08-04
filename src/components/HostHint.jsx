import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/LangContext';
import { askHost, hostHintLabel } from '@/lib/hostHint';

// "Vraag het aan Bogèst" / "Demandez à Bogèst" / "Ask Bogèst" — een rustige
// uitnodiging in dezelfde tracked, all-caps body-type als de sectie-eyebrows.
// Het label wordt gelokaliseerd op basis van de taal van de bezoeker.
//
// De inline-variant (menu-rijen) blijft ongewijzigd — wit, geen monogram,
// verschijnt enkel op hover.
// De glas-varianten (note + HintLine) zijn verfijnd: glasmorphism met een
// goud accent en een quiet chevron.

function Mark({ label }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-body text-[10px] tracking-[0.3em] uppercase text-white/90">
      <span className="w-1 h-1 rounded-full bg-white/70 flex-shrink-0" />
      {label}
      <ArrowRight className="w-3 h-3 text-white/50 flex-shrink-0" />
    </span>
  );
}

function GlassMark({ label }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap font-body text-[10px] tracking-[0.3em] uppercase text-white/90">
      <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
      {label}
      <ArrowRight className="w-3.5 h-3.5 text-white/55 transition-transform duration-300 group-hover/hint:translate-x-0.5" />
    </span>
  );
}

export default function HostHint({ question, label, className = '', variant = 'note' }) {
  const { lang } = useLang();
  const displayLabel = label || hostHintLabel(lang);
  const onClick = (e) => { e.preventDefault(); e.stopPropagation(); askHost(question); };

  if (variant === 'inline') {
    return (
      <button type="button" onClick={onClick}
        className="inline-flex items-center overflow-hidden max-w-0 group-hover:max-w-[260px] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out pointer-events-none group-hover:pointer-events-auto">
        <span className="inline-flex items-center whitespace-nowrap pl-2">
          <Mark label={displayLabel} />
        </span>
      </button>
    );
  }

  // note — verschijnt op hover bovenaan een kaart; glasmorphism-chip.
  return (
    <button type="button" onClick={onClick}
      className={`group/hint inline-flex items-center pointer-events-none group-hover:pointer-events-auto opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out ${className}`}>
      <span className="inline-flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/15 transition-colors duration-300 group-hover/hint:border-white/30 group-hover/hint:bg-black/45">
        <GlassMark label={displayLabel} />
      </span>
    </button>
  );
}

export function HintLine({ question, label, className = '' }) {
  const { lang } = useLang();
  const displayLabel = label || hostHintLabel(lang);
  return (
    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); askHost(question); }}
      className={`group/hint inline-flex items-center transition-transform duration-300 hover:-translate-y-0.5 ${className}`}>
      <span className="inline-flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/15 transition-colors duration-300 group-hover/hint:border-white/30 group-hover/hint:bg-black/45">
        <GlassMark label={displayLabel} />
      </span>
    </button>
  );
}