import React from 'react';
import { askHost } from '@/lib/hostHint';

const FULL = 'Vraag het aan Bogèst';

// A speech-bubble hint that pops out below a `group` card on hover, sliding
// down underneath it — in the style of the digital-host text bubbles. Place it
// as a child of the `group` wrapper (sibling of the card) so it isn't clipped
// by the card's overflow-hidden.
export default function HintBubble({ question, label = FULL, className = '' }) {
  return (
    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 z-30 pointer-events-none group-hover:pointer-events-auto transition-all duration-500 ease-out translate-y-[-6px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${className}`}>
      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); askHost(question); }}
        className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/65 border border-white/15"
        style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/90 whitespace-nowrap">{label}</span>
        <span className="text-white/50">→</span>
        {/* caret pointing up toward the card */}
        <span className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-black/65 border-l border-t border-white/15" />
      </button>
    </div>
  );
}