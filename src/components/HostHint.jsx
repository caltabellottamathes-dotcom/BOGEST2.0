import React from 'react';
import { askHost } from '@/lib/hostHint';

// "De fluistering van de gastheer" — the host's whisper.
// A warm, editorial invitation to ask Bogèst, built from one shared vocabulary:
// a gold dot · a hairline · an italic serif phrase · a small arrow.
// It never floats over readable text and never carries an always-on blur, so
// nothing behind it is ever blurred or made unreadable.
//
// variant="inline" — a quiet margin note that slides out inline after a price
//                    (menu rows). Takes no space when idle, expands on hover.
// variant="seal"   — a small gold "B" monogram seal floating at an image corner
//                    (a quiet, always-there detail); on hover the whisper slides
//                    out beside it. Used on image cards (seasonal / signature /
//                    locations) where the seal sits over imagery, not text.
// variant="note"   — a small dark chip with the whisper, revealed on hover, for
//                    panels and cards over solid/glass surfaces.
//
// The parent must be `group relative` (inline sits inside a group row).

function Whisper({ label }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
      <span className="h-px w-3 bg-primary/40 flex-shrink-0" />
      <span className="font-heading italic text-xs text-primary leading-none">{label}</span>
      <span className="font-body text-[10px] text-primary/60 leading-none">↗</span>
    </span>
  );
}

export default function HostHint({ question, label = 'Vraag het aan Bogèst', className = '', variant = 'note' }) {
  const onClick = (e) => { e.preventDefault(); e.stopPropagation(); askHost(question); };

  if (variant === 'inline') {
    const short = label.replace(/[!.]?$/, '').split(' ').slice(0, 2).join(' ');
    return (
      <button type="button" onClick={onClick}
        className="inline-flex items-center overflow-hidden max-w-0 group-hover:max-w-[160px] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out pointer-events-none group-hover:pointer-events-auto">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap pl-2">
          <Whisper label={short} />
        </span>
      </button>
    );
  }

  if (variant === 'seal') {
    return (
      <button type="button" onClick={onClick} className={`flex items-center gap-2 ${className}`}>
        {/* whisper — slides out beside the seal on hover */}
        <span className="overflow-hidden max-w-0 group-hover:max-w-[240px] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <span className="inline-flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-full border border-primary/30 bg-black/55">
            <Whisper label={label} />
          </span>
        </span>
        {/* the seal — a quiet gold monogram, always present, brightens on hover */}
        <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-black/40 border border-primary/40 text-primary group-hover:bg-black/65 group-hover:border-primary transition-all duration-500"
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          <span className="font-heading italic text-sm leading-none">B</span>
        </span>
      </button>
    );
  }

  // note
  return (
    <button type="button" onClick={onClick}
      className={`inline-flex items-center pointer-events-none group-hover:pointer-events-auto opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out ${className}`}>
      <span className="inline-flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-full border border-primary/30 bg-black/55">
        <Whisper label={label} />
      </span>
    </button>
  );
}