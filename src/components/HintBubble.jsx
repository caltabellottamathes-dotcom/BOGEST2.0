import React from 'react';
import { ChevronRight } from 'lucide-react';
import { askHost } from '@/lib/hostHint';

const FULL = 'Vraag het aan Bogèst';

// A speech-bubble hint that pops out below a `group` card on hover, sliding
// down underneath it — in the style of the digital-host text bubbles. Place it
// as a child of the `group` wrapper (sibling of the card) so it isn't clipped
// by the card's overflow-hidden.
//
// Refreshed look: warm charcoal-gold glass (matching the site panels) with a
// gold dot, tracked label and a chevron that nudges on hover.
export default function HintBubble({ question, label = FULL, className = '' }) {
  return (
    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 z-30 pointer-events-none group-hover:pointer-events-auto transition-all duration-500 ease-out translate-y-[-6px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${className}`}>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); askHost(question); }}
        className="group/hint relative inline-flex items-center gap-2 pl-3.5 pr-4 py-2 rounded-full"
        style={{
          background: 'rgba(26,24,20,0.62)',
          border: '1px solid rgba(231,205,112,0.30)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: '0 8px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/90 whitespace-nowrap">{label}</span>
        <ChevronRight className="w-3 h-3 text-primary/80 transition-transform duration-300 group-hover/hint:translate-x-0.5" />
        {/* caret pointing up toward the card */}
        <span
          className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
          style={{ background: 'rgba(26,24,20,0.62)', borderLeft: '1px solid rgba(231,205,112,0.30)', borderTop: '1px solid rgba(231,205,112,0.30)' }}
        />
      </button>
    </div>
  );
}